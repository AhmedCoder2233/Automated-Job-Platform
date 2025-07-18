from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel, function_tool, RunConfig, Runner
import requests
import os
import smtplib
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI
from email.message import EmailMessage
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

@function_tool
def emailSend(to: str, body: str, subject: str):
    """Send email to the specified recipient"""
    message = EmailMessage()
    message["to"] = to
    message.set_content(body)
    message["subject"] = subject
    message["from"] = "ahmedmemon3344@gmail.com"
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login("ahmedmemon3344@gmail.com",  os.getenv("APP_PASSWORD"))
        server.send_message(message)
    
    return f"Email sent successfully to {to}"

@function_tool
def getSummary():
    """Fetch summary data from the API to get email information"""
    response = requests.get("http://127.0.0.1:8080/saveSummary/")
    if response.status_code != 200:
        return "Failed to Fetch Data"
    return response.json()

messageSenderAgent = Agent(
    name="messageSenderAgent",
    instructions="""
    You are a professional email notification agent for handling job applications and interview scheduling.
    
    MANDATORY WORKFLOW:
    1. ALWAYS call getSummary() tool first to fetch the current applicant data
    2. Extract the email address from the user's message
    3. Verify if this email exists in the summary data
    4. If email exists, process and format the message professionally
    5. Send the formatted email with proper subject and body
    6. If email doesn't exist, return error message
    
    EMAIL PROCESSING RULES:
    - NEVER send the raw user input as email content
    - ALWAYS format the message professionally 
    - Extract key information: interview date, time, location, email address
    - Create proper subject line and email body
    - Use formal business email format
    
    MESSAGE FORMATTING:
    When user says: "Congrats you have been selected for interview on 12 July 10pm onwards on Gulshan-e-Iqbal block 10 and sent him offer letter also email is ahmedmemon3344@gmail.com"
    
    You should format it as:
    Subject: Interview Invitation - Congratulations on Your Selection
    
    Body:
    Dear Candidate,
    
    Congratulations! We are pleased to inform you that you have been selected for an interview.
    
    Interview Details:
    - Date: 12 July 2024
    - Time: 10:00 PM onwards
    - Location: Gulshan-e-Iqbal, Block 10
    
    Please find the offer letter attached to this email.
    
    We look forward to meeting you.
    
    Best regards,
    HR Team
    
    STRICT VALIDATION:
    - Extract email from user message
    - Check if email exists in getSummary() data
    - Only send if email verification passes
    - Always format content professionally
    - Never send raw user input
    
    ERROR HANDLING:
    - If email not found in database: "Error: Email address not found in our records"
    - If email sending fails: "Error: Failed to send email"
    - If no email in message: "Error: No email address provided"
    
    RESPONSE FORMAT:
    1. "Checking summary data..."
    2. "Email verification: [FOUND/NOT FOUND]"
    3. "Processing message content..."
    4. "Email sent successfully to [email]" or error message
    """,
    tools=[getSummary, emailSend]
)

class NotificationRequest(BaseModel):
    userMessage: str

@app.post("/sendnotification")
async def sendingNotification(request: NotificationRequest):
    try:
        result = await Runner.run(
            messageSenderAgent,
            request.userMessage,
            run_config=config
        )
        
        return {
            "status": "success",
            "message": "Notification processed successfully",
            "agent_response": result.final_output
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to process notification: {str(e)}"
        }