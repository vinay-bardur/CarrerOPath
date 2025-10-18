#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

def test_supabase_connection():
    print("=== SUPABASE CONNECTION TEST ===")
    
    # Check environment variables
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    print(f"SUPABASE_URL: {url}")
    print(f"SUPABASE_KEY: {key[:20]}..." if key else "SUPABASE_KEY: None")
    
    if not url or not key:
        print("[ERROR] Missing environment variables")
        return False
    
    try:
        # Create client
        supabase = create_client(url, key)
        print("[OK] Supabase client created")
        
        # Test connection by querying users table
        result = supabase.table('users').select('*').limit(1).execute()
        print(f"[OK] Users table accessible: {len(result.data)} records")
        
        
        # Test quiz_results table
        result = supabase.table('quiz_results').select('*').limit(1).execute()
        print(f"[OK] Quiz_results table accessible: {len(result.data)} records")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_supabase_connection()