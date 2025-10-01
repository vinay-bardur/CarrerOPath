import requests
import json

# Test the backend directly
test_payload = {
    "user": {
        "name": "Vijay",
        "age": 25,
        "gender": "Male", 
        "google_sub": "test123"
    },
    "answers": {
        "1": 2, "2": 1, "3": 3, "4": 2, "5": 3,
        "6": 1, "7": 2, "8": 3, "9": 2, "10": 1
    }
}

response = requests.post("http://localhost:8000/submit-quiz", json=test_payload)
print("Status Code:", response.status_code)
print("Response:", response.text)