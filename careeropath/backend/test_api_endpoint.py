#!/usr/bin/env python3

import requests
import json

def test_api_endpoint():
    print("=== API ENDPOINT TEST ===")
    
    # Test with a real user ID from the database
    user_id = "1afb5903-ecfa-41a2-b4a1-4f747daa7c95"  # This user has multiple results
    
    try:
        response = requests.get(f"http://localhost:8000/user/{user_id}/results")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success')}")
            if data.get('success'):
                print(f"Data found: {json.dumps(data.get('data'), indent=2)}")
        
    except Exception as e:
        print(f"[ERROR] API test failed: {e}")

if __name__ == "__main__":
    test_api_endpoint()