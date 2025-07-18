from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig, Runner
import os
from schema import summarySchema
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import LocalSession
from dotenv import load_dotenv
from model import ChatLog, SaveSummaryData
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


provider = AsyncOpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai"
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=provider
)

config = RunConfig(
    model=model,
    model_provider=provider,
    tracing_disabled=True
)

chat_memory = []

InterviewAgent = Agent(
    name="InterviewAgent",
    instructions="""
You are a human-like, professional technical interviewer AI. Follow the steps strictly and ask real-world, tough technical questions.

🎯 Interview Flow:
If user greets you or says hello, politely reply and ask:

"Hi! Nice to meet you. Could you please tell me — which role are you applying for? Frontend, Backend, or Full Stack?"

After user responds (e.g., "Frontend"), ask:

"Great! Which framework or stack are you most confident with? (e.g., React, Next.js, Angular, etc.)"

Once they reply with the framework:

Start the technical interview.

Ask at least 3 real-world, advanced-level questions related to that field.

Only one question at a time. Wait for user's answer before continuing.

Ask questions like a real human interviewer, not like an AI.

Questions must be tough, open-ended, and related to real-world problem solving.

If user gives weak or incorrect answers, politely ask follow-ups or dig deeper like a real interviewer would.
"""
)


from pydantic import BaseModel

class MessageSchema(BaseModel):
    userMessage: str

class chatSchema(BaseModel):
    userMessage: str
    sender:str
    timestamp:str
    secret_key:str
    email:str

def getdb():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()

@app.post("/chatbot/")
async def chattingBot(msg: MessageSchema):
    chat_memory.append({"role": "user", "content": msg.userMessage})
    response = await Runner.run(InterviewAgent, chat_memory, run_config=config)
    chat_memory.append({"role": "assistant", "content": response.final_output})
    return {"response": response.final_output}

@app.post("/saveChat/")
def saveChat(message:chatSchema, db:Session = Depends(getdb)):
    data = ChatLog(**message.model_dump())
    db.add(data)
    db.commit()
    return "Succesfully!"

@app.get("/saveChat/")
def getChat(db:Session = Depends(getdb)):
    return db.query(ChatLog).all()

@app.post("/saveSummary/")
def saveSummary(summary:summarySchema, db:Session = Depends(getdb)):
    data = SaveSummaryData(**summary.model_dump())
    db.add(data)
    db.commit()
    return "Succesfully!"

@app.get("/saveSummary/")
def summaryData(db:Session = Depends(getdb)):
    return db.query(SaveSummaryData).all()
