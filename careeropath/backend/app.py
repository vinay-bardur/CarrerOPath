# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# import os
# import traceback
# import json
# import pandas as pd
# from sklearn.cluster import KMeans
# from google import genai as google_genai

# # Load env
# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# if not GEMINI_API_KEY:
#     raise RuntimeError("GEMINI_API_KEY not configured in .env")

# # Configure Google Generative AI SDK
# client = google_genai.Client(api_key=GEMINI_API_KEY)

# app = FastAPI()

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Static quiz questions
# STATIC_QUIZ = [
#     {"id": 1, "q": "Do you enjoy working with numbers and data?", "options": ["Not at all", "Somewhat", "Yes", "Love it"]},
#     {"id": 2, "q": "Do you prefer creative work (design, copy, media)?", "options": ["Not at all", "Sometimes", "Often", "Always"]},
#     {"id": 3, "q": "Do you like building apps/websites?", "options": ["No", "Little", "Yes", "Very much"]},
#     {"id": 4, "q": "How comfortable are you with command-line and tooling?", "options": ["Never", "Beginner", "Comfortable", "Proficient"]},
#     {"id": 5, "q": "Do you enjoy solving algorithmic problems?", "options": ["No", "Sometimes", "Often", "Always"]},
#     {"id": 6, "q": "Are you interested in business/product roles?", "options": ["No", "Somewhat", "Yes", "Very Interested"]},
#     {"id": 7, "q": "Would you like to manage teams/projects?", "options": ["No", "Maybe", "Yes", "Definitely"]},
#     {"id": 8, "q": "Do you prefer remote or office work?", "options": ["Office", "Hybrid", "Remote", "No Preference"]},
#     {"id": 9, "q": "How important is salary to you vs learning?", "options": ["Salary", "Balance", "Learning", "Learning > Salary"]},
#     {"id": 10, "q": "Would you relocate for a better job?", "options": ["Never", "Maybe", "Yes", "Any day"]},
# ]

# # Pydantic models
# class UserInfo(BaseModel):
#     name: str
#     age: int
#     gender: str
#     google_sub: str

# class QuizSubmit(BaseModel):
#     user: UserInfo
#     answers: dict

# # In-memory storage
# USER_STORE = {}
# QUIZ_RESULTS = {}

# @app.get("/")
# def read_root():
#     return {"message": "CareerPath API is running!"}

# @app.get("/quiz")
# def get_quiz():
#     return {"quiz": STATIC_QUIZ}

# @app.post("/submit-quiz")
# def submit_quiz(payload: QuizSubmit):
#     try:
#         # Store user data
#         uid = payload.user.google_sub
#         USER_STORE[uid] = {
#             "name": payload.user.name, 
#             "age": payload.user.age, 
#             "gender": payload.user.gender
#         }
        
#         # Build vector from answers
#         vec = []
#         for i in range(1, 11):
#             ans = payload.answers.get(str(i)) or payload.answers.get(i) or 0
#             vec.append(int(ans))
        
#         # Create synthetic data for clustering
#         synthetic = [vec]
#         synthetic += [[0,0,0,0,0,0,0,0,0,0], [3,3,3,3,3,3,3,3,3,3], [2,1,2,1,2,1,2,1,2,1]]
#         df = pd.DataFrame(synthetic)
#         kmeans = KMeans(n_clusters=3, random_state=42).fit(df)
#         cluster = int(kmeans.predict([vec])[0])

#         # Build Q&A for Gemini prompt
#         q_and_a_lines = []
#         for i in range(1, 11):
#             opt = payload.answers.get(str(i)) or payload.answers.get(i) or 0
#             q = STATIC_QUIZ[i-1]["q"]
#             chosen_text = STATIC_QUIZ[i-1]["options"][int(opt)]
#             q_and_a_lines.append(f"{i}. Q: {q} -- A: {chosen_text}")

#         # Gemini prompt
#         system_instruction = "You are an expert career advisor for India. Return ONLY valid JSON."
#         user_prompt = f"""
# Return a JSON object with keys: roles (array of strings), rationale (string), salary_range (string), companies (array of strings), skills (array of strings).

# User:
# - Name: {payload.user.name}
# - Age: {payload.user.age}
# - Gender: {payload.user.gender}
# - Cluster: {cluster}

# Quiz answers:
# {chr(10).join(q_and_a_lines)}
# """

#         # Call Gemini
#         response = client.models.generate_content(
#             model="gemini-1.5-flash",
#             contents=[
#                 {"role": "user", "parts": [{"text": system_instruction}]},
#                 {"role": "user", "parts": [{"text": user_prompt}]},
#             ],
#         )

#         # Extract response text
#         text = getattr(response, "text", None)
#         if not text and hasattr(response, "candidates") and response.candidates:
#             for cand in response.candidates:
#                 if getattr(cand, "content", None) and getattr(cand.content, "parts", None):
#                     for part in cand.content.parts:
#                         if getattr(part, "text", None):
#                             text = part.text
#                             break
#                 if text:
#                     break
        
#         if not text:
#             raise ValueError("Empty response from Gemini")

#         # Parse JSON response
#         parsed = None
#         try:
#             parsed = json.loads(text)
#         except Exception:
#             if '```json' in text:
#                 try:
#                     inner = text.split('```json')[1].split('```')[0].strip()
#                     parsed = json.loads(inner)
#                 except Exception:
#                     pass
#             if not parsed and '```' in text:
#                 try:
#                     inner = text.split('```')[1].split('```')[0].strip()
#                     parsed = json.loads(inner)
#                 except Exception:
#                     pass
        
#         if not parsed:
#             raise ValueError("Gemini did not return valid JSON")

#         # Prepare result
#         result = {
#             "roles": parsed.get("roles", []),
#             "rationale": parsed.get("rationale", ""),
#             "salary_range": parsed.get("salary_range", ""),
#             "companies": parsed.get("companies", []),
#             "skills": parsed.get("skills", []),
#         }

#         # Store and return
#         QUIZ_RESULTS[uid] = {
#             "answers": payload.answers, 
#             "cluster": cluster, 
#             "ai": result
#         }
        
#         return result
        
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


















from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import traceback
import json
import pandas as pd
from sklearn.cluster import KMeans
from google import genai as google_genai

# Load env with explicit path
load_dotenv('.env')  # Explicitly load from current directory

# Debug environment variables
print("=== ENVIRONMENT DEBUG ===")
print("Current directory:", os.getcwd())
print("Files in directory:", os.listdir('.'))
print("GEMINI_API_KEY exists:", "GEMINI_API_KEY" in os.environ)
print("GEMINI_API_KEY length:", len(os.getenv("GEMINI_API_KEY", "")))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found!")
    # Don't crash immediately, let's see if the frontend works
    # raise RuntimeError("GEMINI_API_KEY not configured in .env")
else:
    print("✅ GEMINI_API_KEY loaded successfully")
    client = google_genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_QUIZ = [
    {"id": 1, "q": "Do you enjoy working with numbers and data?", "options": ["Not at all", "Somewhat", "Yes", "Love it"]},
    {"id": 2, "q": "Do you prefer creative work (design, copy, media)?", "options": ["Not at all", "Sometimes", "Often", "Always"]},
    {"id": 3, "q": "Do you like building apps/websites?", "options": ["No", "Little", "Yes", "Very much"]},
    {"id": 4, "q": "How comfortable are you with command-line and tooling?", "options": ["Never", "Beginner", "Comfortable", "Proficient"]},
    {"id": 5, "q": "Do you enjoy solving algorithmic problems?", "options": ["No", "Sometimes", "Often", "Always"]},
    {"id": 6, "q": "Are you interested in business/product roles?", "options": ["No", "Somewhat", "Yes", "Very Interested"]},
    {"id": 7, "q": "Would you like to manage teams/projects?", "options": ["No", "Maybe", "Yes", "Definitely"]},
    {"id": 8, "q": "Do you prefer remote or office work?", "options": ["Office", "Hybrid", "Remote", "No Preference"]},
    {"id": 9, "q": "How important is salary to you vs learning?", "options": ["Salary", "Balance", "Learning", "Learning > Salary"]},
    {"id": 10, "q": "Would you relocate for a better job?", "options": ["Never", "Maybe", "Yes", "Any day"]},
]

class UserInfo(BaseModel):
    name: str
    age: int
    gender: str
    google_sub: str

class QuizSubmit(BaseModel):
    user: UserInfo
    answers: dict

USER_STORE = {}
QUIZ_RESULTS = {}

@app.get("/")
def read_root():
    return {"message": "CareerPath API is running!", "status": "active"}

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

@app.post("/submit-quiz")
def submit_quiz(payload: QuizSubmit):
    try:
        print(f"📥 Received quiz submission from: {payload.user.name}")
        
        # If Gemini API key is not configured, return mock data
        if not GEMINI_API_KEY:
            print("⚠️ Using mock data (GEMINI_API_KEY not configured)")
            mock_result = {
                "roles": ["Software Engineer", "Data Analyst", "Product Manager"],
                "rationale": "Based on your balanced technical and problem-solving skills, these roles align well with your strengths in both technical and interpersonal areas.",
                "salary_range": "₹6-15 LPA for entry-level, ₹15-30 LPA with experience",
                "companies": ["TCS", "Infosys", "Wipro", "Amazon", "Microsoft"],
                "skills": ["Python", "SQL", "Problem Solving", "Communication"]
            }
            
            uid = payload.user.google_sub
            QUIZ_RESULTS[uid] = {
                "answers": payload.answers, 
                "cluster": 1, 
                "ai": mock_result
            }
            return mock_result
        
        # Store user data
        uid = payload.user.google_sub
        USER_STORE[uid] = {
            "name": payload.user.name, 
            "age": payload.user.age, 
            "gender": payload.user.gender
        }
        
        # Build vector from answers
        vec = []
        for i in range(1, 11):
            ans = payload.answers.get(str(i)) or payload.answers.get(i) or 0
            vec.append(int(ans))
        
        print(f"📊 User response vector: {vec}")
        
        # Create synthetic data for clustering
        synthetic = [vec]
        synthetic += [[0,0,0,0,0,0,0,0,0,0], [3,3,3,3,3,3,3,3,3,3], [2,1,2,1,2,1,2,1,2,1]]
        df = pd.DataFrame(synthetic)
        kmeans = KMeans(n_clusters=3, random_state=42).fit(df)
        cluster = int(kmeans.predict([vec])[0])
        print(f"🎯 User cluster: {cluster}")

        # Build Q&A for Gemini prompt
        q_and_a_lines = []
        for i in range(1, 11):
            opt = payload.answers.get(str(i)) or payload.answers.get(i) or 0
            q = STATIC_QUIZ[i-1]["q"]
            chosen_text = STATIC_QUIZ[i-1]["options"][int(opt)]
            q_and_a_lines.append(f"{i}. Q: {q} -- A: {chosen_text}")

        # Gemini prompt
        system_instruction = "You are an expert career advisor for India. Return ONLY valid JSON with these exact keys: roles, rationale, salary_range, companies, skills. Do not include any other text or markdown."
        
        user_prompt = f"""
Analyze this user's career preferences and provide specific recommendations for the Indian job market.

User Profile:
- Name: {payload.user.name}
- Age: {payload.user.age}
- Gender: {payload.user.gender}

Quiz Responses:
{chr(10).join(q_and_a_lines)}

Provide recommendations in this exact JSON format:
{{
  "roles": ["role1", "role2", "role3"],
  "rationale": "explanation here", 
  "salary_range": "salary range for Indian market",
  "companies": ["company1", "company2", "company3"],
  "skills": ["skill1", "skill2", "skill3"]
}}
"""

        print("🤖 Calling Gemini API...")
        
        # Call Gemini with better error handling
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[{"parts": [{"text": system_instruction + user_prompt}]}],
        )

        # Extract response text
        text = getattr(response, "text", "")
        print(f"📨 Gemini raw response: {text[:200]}...")  # Log first 200 chars

        if not text:
            if hasattr(response, "candidates") and response.candidates:
                for cand in response.candidates:
                    if hasattr(cand, "content") and cand.content:
                        for part in getattr(cand.content, "parts", []):
                            if hasattr(part, "text") and part.text:
                                text = part.text
                                break
                    if text:
                        break

        if not text:
            raise ValueError("Empty response from Gemini")

        # Parse JSON response with better error handling
        parsed = None
        clean_text = text.strip()
        
        # Remove markdown code blocks if present
        if clean_text.startswith('```json'):
            clean_text = clean_text[7:]
        if clean_text.endswith('```'):
            clean_text = clean_text[:-3]
        clean_text = clean_text.strip()
        
        try:
            parsed = json.loads(clean_text)
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            print(f"📄 Response text: {clean_text}")
            # Try to extract JSON from text
            import re
            json_match = re.search(r'\{.*\}', clean_text, re.DOTALL)
            if json_match:
                try:
                    parsed = json.loads(json_match.group())
                    print("✅ Extracted JSON from text")
                except:
                    pass
        
        if not parsed:
            # Fallback to mock data if parsing fails
            print("⚠️ Using fallback data due to JSON parse failure")
            parsed = {
                "roles": ["Full Stack Developer", "Data Scientist", "DevOps Engineer"],
                "rationale": "Your technical aptitude and problem-solving skills make you well-suited for roles in software development and data analysis.",
                "salary_range": "₹8-20 LPA based on experience and location",
                "companies": ["Tech Mahindra", "HCL", "Accenture", "Google India", "Flipkart"],
                "skills": ["JavaScript", "Python", "Cloud Computing", "Machine Learning"]
            }

        # Ensure all required keys exist
        result = {
            "roles": parsed.get("roles", ["Software Engineer", "Data Analyst"]),
            "rationale": parsed.get("rationale", "Based on your quiz responses, these roles align with your strengths."),
            "salary_range": parsed.get("salary_range", "₹6-15 LPA"),
            "companies": parsed.get("companies", ["TCS", "Infosys", "Wipro"]),
            "skills": parsed.get("skills", ["Programming", "Problem Solving"]),
        }

        print(f"✅ Final result: {result}")

        # Store and return
        QUIZ_RESULTS[uid] = {
            "answers": payload.answers, 
            "cluster": cluster, 
            "ai": result
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Error in submit_quiz: {str(e)}")
        traceback.print_exc()
        
        # Return meaningful error to frontend
        error_detail = f"Backend error: {str(e)}"
        if "API key" in str(e):
            error_detail = "Gemini API key not configured properly. Please check your .env file."
        
        raise HTTPException(status_code=500, detail=error_detail)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
    