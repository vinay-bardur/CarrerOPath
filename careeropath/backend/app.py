from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import traceback
import json
import pandas as pd
from sklearn.cluster import KMeans
import google.generativeai as genai
from utils.db import supabase

load_dotenv('.env')
print("=== ENVIRONMENT DEBUG ===")
print("Current directory:", os.getcwd())
print("GEMINI_API_KEY exists:", "GEMINI_API_KEY" in os.environ)
print("GEMINI_API_KEY length:", len(os.getenv("GEMINI_API_KEY", "")))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("[OK] Gemini configured successfully with stable SDK")
else:
    print("[ERROR] GEMINI_API_KEY not found - using mock data")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_QUIZ = [
    {
        "id": 1,
        "q": "When a problem feels complex, what is your first step?",
        "options": [
            "Draw a simple sketch showing how a user would use it",
            "Write a step-by-step checklist to solve the problem",
            "Collect a few example numbers or records to understand it",
            "Think about where something could go wrong or be misused",
            "Talk with classmates to clarify the goal"
        ]
    },
    {
        "id": 2,
        "q": "Which task would you most enjoy doing daily?",
        "options": [
            "Polishing interface details and micro-interactions",
            "Designing database schemas and server logic",
            "Exploring datasets and building models",
            "Running security checks and hardening systems",
            "Writing specifications and prioritising features"
        ]
    },
    {
        "id": 3,
        "q": "What do you focus on when evaluating a technical solution?",
        "options": [
            "How intuitive the experience will feel for users",
            "Reliability, scalability and maintainability",
            "Predictive power and data quality",
            "Risk exposure and mitigation strategies",
            "Business impact and user value"
        ]
    },
    {
        "id": 4,
        "q": "Given a new product idea, where would you start?",
        "options": [
            "Create a simple clickable mock-up to test with users",
            "Build a small, well-tested prototype backend",
            "Gather sample data and run a quick analysis",
            "Assess the critical attack surface and privacy needs",
            "Draft a one-page plan outlining goals and metrics"
        ]
    },
    {
        "id": 5,
        "q": "Which tools or activities sound fun to use often?",
        "options": [
            "Build web pages and adjust visual details (HTML/CSS/JS)",
            "Use a code editor and work with data saved in files or tables",
            "Work with spreadsheets and small scripts to explore data",
            "Learn simple security steps (passwords, account safety, checks)",
            "Plan tasks, track progress and read basic app reports"
        ]
    },
    {
        "id": 6,
        "q": "When learning something new, how do you practise it?",
        "options": [
            "Make a small user interface and tweak the look",
            "Build a tiny feature from start to finish on my laptop",
            "Try examples with spreadsheets or small datasets",
            "Follow a short, guided security tutorial in a safe environment",
            "Read a short example case and write what you would do"
        ]
    },
    {
        "id": 7,
        "q": "During a demo, a small bug appears — what do you do first?",
        "options": [
            "Explain what happened, continue the demo, and note it down",
            "Try a quick fix (reload or change an input) to keep the demo going",
            "Check if the numbers or outputs shown are correct",
            "Ensure no sensitive information is visible and continue",
            "Tell the team and suggest the next step after the demo"
        ]
    },
    {
        "id": 8,
        "q": "Which area of technology excites you most?",
        "options": [
            "Web and app design",
            "Servers and APIs",
            "Data and AI",
            "Cyber safety and privacy",
            "Planning products and features"
        ]
    },
    {
        "id": 9,
        "q": "What role do you naturally take in a team project?",
        "options": [
            "Make the project look polished and user-friendly",
            "Write most of the logic and fix bugs",
            "Handle data and make sense of results",
            "Point out risks and double-check the work",
            "Organize people and keep track of progress"
        ]
    },
    {
        "id": 10,
        "q": "What kind of company would you like to work in?",
        "options": [
            "A startup where design and speed matter",
            "A company that builds large and reliable systems",
            "A research or data-driven company",
            "An organization focused on safety and trust",
            "A company that values planning and structure"
        ]
    },
    {
        "id": 11,
        "q": "How do you usually act when the deadline is close?",
        "options": [
            "Make sure the user interface works smoothly",
            "Write clean, efficient code to finish",
            "Double-check the data is correct",
            "Focus on safety and stability",
            "Communicate with the team to meet the deadline"
        ]
    },
    {
        "id": 12,
        "q": "If you could earn a certificate, which one would you pick?",
        "options": [
            "UI/UX and design related",
            "Cloud or backend systems",
            "Data and analytics",
            "Cybersecurity basics",
            "Project management"
        ]
    },
    {
        "id": 13,
        "q": "How do you prefer to work day-to-day?",
        "options": [
            "Flexible and remote",
            "With a team in the office",
            "Hybrid: quiet time plus teamwork",
            "In a secure, controlled setting",
            "With clients and people interaction"
        ]
    },
    {
        "id": 14,
        "q": "Which industry sounds most interesting to you?",
        "options": [
            "Finance and digital payments",
            "Healthcare technology",
            "Online shopping and e-commerce",
            "Education technology",
            "Entertainment and gaming"
        ]
    },
    {
        "id": 15,
        "q": "Where do you see yourself in 5 years?",
        "options": [
            "Specialist in design and user experience",
            "Backend or systems expert",
            "Data scientist or AI engineer",
            "Cybersecurity professional",
            "Team lead or manager"
        ]
    }
]

class UserInfo(BaseModel):
    name: str
    age: int
    gender: str
    google_sub: str = "demo_user"

class QuizSubmit(BaseModel):
    user: UserInfo
    answers: dict

class UserCreate(BaseModel):
    auth_id: str
    email: str
    name: str
    age: int
    gender: str

@app.get("/")
def read_root():
    return {"message": "CareerPath API - Stable Version", "status": "active"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "gemini_configured": bool(GEMINI_API_KEY),
        "api_key_length": len(GEMINI_API_KEY) if GEMINI_API_KEY else 0
    }

@app.get("/quiz")
def get_quiz():
    return {"quiz": STATIC_QUIZ}

@app.get("/user/{user_id}/results")
def get_user_results(user_id: str):
    try:
        print(f"[INFO] Fetching results for user: {user_id}")
        result = supabase.table('quiz_results').select('*').eq('user_id', user_id).order('completed_at', desc=True).limit(1).execute()
        print(f"[INFO] Database query result: {len(result.data) if result.data else 0} records found")
        
        if result.data and len(result.data) > 0:
            print(f"[OK] Found previous results for user {user_id}")
            return {"success": True, "data": result.data[0]}
        else:
            print(f"[INFO] No previous results found for user {user_id}")
            return {"success": False, "message": "No results found"}
    except Exception as e:
        print(f"[ERROR] Error fetching user results: {str(e)}")
        traceback.print_exc()
        return {"success": False, "message": str(e)}

@app.post("/user")
def create_user(user_data: UserCreate):
    try:
        result = supabase.table('users').upsert({
            'auth_id': user_data.auth_id,
            'email': user_data.email,
            'name': user_data.name,
            'age': user_data.age,
            'gender': user_data.gender
        }).execute()
        
        return {"success": True, "data": result.data}
    except Exception as e:
        print(f"[ERROR] Error creating user: {str(e)}")
        return {"success": False, "message": str(e)}

def get_gemini_recommendation(user_info, answers):
    try:
        if not GEMINI_API_KEY:
            print("[ERROR] No API key found - using fallback")
            return get_fallback_recommendation()
        
        print("[INFO] Starting Gemini API call...")
        
        prompt = f"""
        You are an experienced tech career mentor in India who has helped hundreds of students land their first tech jobs. 
        You're having a friendly conversation with {user_info.name}, a {user_info.age}-year-old student.
        
        Based on {user_info.name}'s quiz responses, give personalized career advice like you're their older sibling in tech.
        
        Student: {user_info.name}, {user_info.age} years old, {user_info.gender}
        
        Quiz Responses:
        """
        
        for i in range(1, 16):
            ans_index = answers.get(str(i), 0)
            question = STATIC_QUIZ[i-1]["q"]
            answer_text = STATIC_QUIZ[i-1]["options"][ans_index]
            prompt += f"\n{i}. {question}\n   Answer: {answer_text}"
        
        prompt += f"""
        
        Respond as a caring mentor would - personal, encouraging, and specific to {user_info.name}. 
        
        JSON format:
        {{
            "roles": ["Role1", "Role2", "Role3"],
            "companies": ["Company1", "Company2", "Company3"],
            "salary_range": "₹X-Y LPA for freshers",
            "skills": ["Skill1", "Skill2", "Skill3"],
            "rationale": "Write like you're talking to {user_info.name} personally - warm, encouraging, specific advice (2-3 lines max)"
        }}
        
        For rationale: Sound like a mentor, not a bot. Use phrases like:
        - "Hey {user_info.name}, based on what I see..."
        - "You've got the mindset for..."
        - "I'd recommend starting with..."
        - "Your interest in X really shows..."
        - "Perfect fit for someone like you who..."
        
        Keep it conversational, specific, and encouraging. No generic corporate speak!
        Focus on Indian market reality. Companies: TCS, Infosys, Wipro, HCL, Accenture, Cognizant.
        """
        
        print(f"[INFO] Prompt length: {len(prompt)} characters")
        
        try:
            model = genai.GenerativeModel('gemma-3-27b-it')
            print("[INFO] Using model: gemma-3-27b-it (FREE open model)")
        except:
            model = genai.GenerativeModel('gemini-2.0-flash-lite')
            print("[INFO] Using model: gemini-2.0-flash-lite (cheapest paid model)")
        
        response = model.generate_content(prompt)
        print("[OK] Got response from Gemini")
        
        response_text = response.text.strip()
        print(f"[INFO] Raw response length: {len(response_text)} characters")
        print(f"[INFO] First 200 chars: {response_text[:200]}...")
        
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        print(f"[INFO] Cleaned response length: {len(response_text)} characters")
        
        result = json.loads(response_text)
        print("[OK] Successfully parsed JSON response")
        return result
        
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON Parse Error: {e}")
        print(f"[INFO] Response text: {response_text[:500]}...")
        return get_fallback_recommendation()
    except Exception as e:
        print(f"[ERROR] Gemini API Error: {str(e)}")
        print(f"[ERROR] Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return get_fallback_recommendation()

def get_fallback_recommendation():
    return {
        "roles": ["Software Engineer", "Data Analyst", "Full Stack Developer"],
        "companies": ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra"],
        "salary_range": "₹6-10 LPA for freshers",
        "skills": ["Python", "JavaScript", "SQL", "Problem Solving"],
        "rationale": "Hey, you've got solid problem-solving instincts! I'd say start with Python and SQL - these roles are perfect for building a strong tech foundation."
    }

@app.post("/submit-quiz")
def submit_quiz(payload: QuizSubmit):
    try:
        print(f"[INFO] Received quiz submission from: {payload.user.name}")
        
        recommendations = get_gemini_recommendation(payload.user, payload.answers)
        
        # Save to Supabase (use auth_id from frontend)
        try:
            result = supabase.table('quiz_results').insert({
                'user_id': payload.user.google_sub,  # This should be the auth.users.id
                'answers': payload.answers,
                'recommendations': recommendations
            }).execute()
            print(f"[OK] Saved to database: {result}")
        except Exception as db_error:
            print(f"[WARNING] Database save failed: {db_error}")
        
        print(f"[OK] Successfully generated recommendations")
        return recommendations
        
    except Exception as e:
        print(f"[ERROR] Error in submit_quiz: {str(e)}")
        traceback.print_exc()
        
        return get_fallback_recommendation()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)