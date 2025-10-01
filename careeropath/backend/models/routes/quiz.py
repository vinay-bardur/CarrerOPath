from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from backend.services.recommender import recommend # This import might also cause an error. We'll fix it next.

router = APIRouter()

# Let's start with just 2 questions for testing
# Let's start with just 3 questions for testing. We'll add more later.
QUESTIONS = [
    {
        "id": "q1",
        "text": "When you’re stuck waiting (bus, queue, boring lecture), what do you usually do in your head?",
        "type": "mcq",
        "options": [
            "Imagine app or design ideas.",
            "Think about how things work behind the scenes.",
            "Notice patterns in people, numbers, or trends.",
            "Plan out random future goals or to-do lists."
        ]
    },
    {
        "id": "q2",
        "text": "If someone secretly recorded you working, what part would they see you enjoying most?",
        "type": "mcq",
        "options": [
            "Sketching, arranging, or making things look good.",
            "Debugging or solving puzzles with deep focus.",
            "Organizing notes, data, or figuring out insights.",
            "Talking through ideas and motivating others."
        ]
    },
    {
        "id": "q3",
        "text": "Which type of compliment secretly feels the best to you?",
        "type": "mcq",
        "options": [
            "“That looks amazing!”",
            "“Wow, how did you solve that problem?”",
            "“I never thought of it that way, you’re sharp!”",
            "“We couldn’t have done it without you leading us.”"
        ]
    },
    {
        "id": "q4",
        "text": "You open YouTube late at night. Which video are you most likely to click?",
        "type": "mcq",
        "options": [
            "A design or animation tutorial.",
            "A coding/building challenge video.",
            "A documentary about data, finance, or trends.",
            "A founder/leader sharing their story."
        ]
    },
    {
        "id": "q5",
        "text": "Imagine you’re forced to spend one full weekend on a project. What would feel least like ‘work’?",
        "type": "mcq",
        "options": [
            "Designing an app interface or logo mockup.",
            "Building a small tool or coding experiment.",
            "Analyzing a dataset and showing insights.",
            "Organizing a mini-event or leading a team task."
        ]
    },
    {
        "id": "q6",
        "text": "Which situation drains you the fastest?",
        "type": "mcq",
        "options": [
            "Looking at plain code with no visuals for hours.",
            "Endless design changes with no clear logic.",
            "Messy data with no clear conclusion.",
            "No one taking responsibility in a team."
        ]
    },
    {
        "id": "q7",
        "text": "If college banned marks and grades, how would you spend your study hours?",
        "type": "mcq",
        "options": [
            "Experimenting with visuals, tools, or creativity.",
            "Practicing coding challenges or side projects.",
            "Reading, researching, or learning from case studies.",
            "Networking, pitching ideas, or leading groups."
        ]
    },
    {
        "id": "q8",
        "text": "When a teacher explains a new topic, what’s your natural reaction?",
        "type": "mcq",
        "options": [
            "Visualize it in diagrams or mind-maps.",
            "Break it into steps like an algorithm.",
            "Connect it with real-world data or examples.",
            "Think of how to explain it to others simply."
        ]
    },
    {
        "id": "q9",
        "text": "If a friend asks you to join their side project, what would excite you most?",
        "type": "mcq",
        "options": [
            "Making the app/website look beautiful.",
            "Writing the code that powers it.",
            "Turning results into charts or insights.",
            "Pitching it to people or managing the team."
        ]
    },
    {
        "id": "q10",
        "text": "What kind of challenge secretly feels like play, not work?",
        "type": "mcq",
        "options": [
            "Designing something eye-catching from scratch.",
            "Solving a tricky logic error or system issue.",
            "Finding a hidden story in numbers/data.",
            "Convincing people to back an idea."
        ]
    }
]



@router.get("/questions")
def get_questions():
    # For now, we return the questions without a name.
    # The frontend will personalize them once the user enters their name.
    return {"questions": QUESTIONS}


class QuizSubmission(BaseModel):
    user: Dict[str, Any]   # {name: "Vinay", age: 21}
    answers: Dict[str, Any]  # {"q1": 4, "q2": "Team"}

@router.post("/submit")
def submit_quiz(payload: QuizSubmission):
    # For now, let's just echo the payload to test if the endpoint works.
    # We will add the recommendation logic later.
    print(f"Received submission from {payload.user.get('name')}")
    print(f"Answers: {payload.answers}")
    result = recommend(payload.user, payload.answers)
    return result