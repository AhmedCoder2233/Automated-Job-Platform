from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel, function_tool, RunConfig, Runner
import requests
import os
import time
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

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
def getChat():
    """Fetch chat messages from FastAPI"""
    try:
        print("🔄 Fetching chat data from FastAPI...")
        response = requests.get("http://127.0.0.1:8080/saveChat/", timeout=20)
        print(f"📡 Status Code: {response.status_code}")

        if response.status_code != 200:
            return f"❌ Failed with status code: {response.status_code}"

        data = response.json()
        print(f"✅ Total Records: {len(data) if isinstance(data, list) else 'unknown'}")
        if isinstance(data, list) and data:
            print("🧾 First Message Sample:", data[0])
        return data

    except requests.exceptions.RequestException as e:
        print(f"💥 Error during fetch: {str(e)}")
        return f"Request failed: {str(e)}"

@function_tool
def saveSummary(summary: str, secret_key: str, email: str):
    """Save summary to FastAPI"""
    try:
        data = {
            "summary": summary,
            "secret_key": secret_key,
            "email": email
        }
        
        print(f"📤 Sending summary for {email} with key {secret_key}")
        print(f"📝 Summary: {summary[:100]}...")
        
        response = requests.post("http://127.0.0.1:8080/saveSummary/", json=data, timeout=10)
        
        if response.status_code == 200:
            print(f"✅ Summary saved successfully for {email}")
            return f"Summary saved successfully for {email}"
        else:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return f"API Error: {response.status_code}"
            
    except Exception as e:
        print(f"❌ Error saving summary: {str(e)}")
        return f"Error saving summary: {str(e)}"

@function_tool
def getSummary():
    """Get existing summaries from FastAPI"""
    try:
        response = requests.get("http://127.0.0.1:8080/saveSummary/")
        data = response.json()
        print(f"📚 Found {len(data) if isinstance(data, list) else 'unknown'} existing summaries")
        return data
    except Exception as e:
        print(f"❌ Error getting summaries: {str(e)}")
        return []

SummaryAgent = Agent(
    name="SummaryAgent",
    instructions="""
🚨 CRITICAL: You are a chat summary agent with STRICT score requirements!

MANDATORY STEPS (NO EXCEPTIONS):

STEP 1: Call getChat() to get all chat messages
STEP 2: Call getSummary() to get existing summaries  
STEP 3: Process the data following these EXACT rules:

PROCESSING RULES:
1. Group all messages by their email + secret_key combination
2. For each unique email + secret_key group:
   - Check if messages start with greeting (hello, hi, hey, salam, etc.)
   - Check if messages end with farewell (thanks, bye, thank you, etc.)
   - Only process COMPLETE chats (have both greeting and farewell)

3. For each complete chat:
   - Check if summary already exists for this email + secret_key
   - If summary EXISTS → SKIP this chat
   - If summary DOES NOT exist → Create summary and save it

4. When creating summary:
   - Make it detailed (3-5 lines) including user performance analysis
   - Include what user asked and how well it was resolved
   - Add performance score in summary itself like: "Score: 8/10"
   - Mention user engagement, question quality, and resolution success
   - Example: "User asked about weather forecast for Karachi. Provided accurate 5-day forecast with temperature details. Good engagement and clear questions. Score: 8/10"
   - Call saveSummary() with summary, secret_key, and email

🚨 CRITICAL REQUIREMENTS:
- Create detailed summaries with user performance analysis
- Always include "Score: X/10" in the summary text itself
- Analyze user engagement, question clarity, and problem resolution
- Never mix messages from different email + secret_key combinations
- Always check existing summaries before creating new ones
- Only summarize complete chats (greeting to farewell)

EXAMPLE VALID SUMMARIES:
"User asked about login issues with their account. Helped troubleshoot password reset and email verification. User followed instructions well and problem was resolved successfully. Good communication throughout. Score: 8/10"

"User inquired about weather conditions in Karachi for weekend plans. Provided detailed forecast with temperature and rain predictions. User appreciated the detailed response. Excellent interaction. Score: 9/10"

OUTPUT FORMAT:
Report what you found and what actions you took:
- "Found X complete chats"
- "Y already have summaries - skipped"
- "Z new summaries created with scores: [list of scores]"
""",
    tools=[getChat, getSummary, saveSummary],
)

def run_summary_check():
    print("\n" + "=" * 60)
    print("🔍 Running Chat Summary Checker")
    print("=" * 60)

    try:
        response = Runner.run_sync(
            SummaryAgent,
            "Call getChat, then getSummary, then process chats. Create detailed summaries with user performance analysis and include 'Score: X/10' in the summary text. Focus on user engagement and problem resolution quality.",
            run_config=config,
        )

        print("\n🤖 Summary Agent Response:")
        print("-" * 40)
        print(response.final_output)
        print("-" * 40)

    except Exception as e:
        print(f"❌ Error while running summary check: {str(e)}")

if __name__ == "__main__":
    while True:
        run_summary_check()
        time.sleep(20)