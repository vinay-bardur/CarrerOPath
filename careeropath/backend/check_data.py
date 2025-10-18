#!/usr/bin/env python3

from utils.db import supabase

def check_database_data():
    print("=== DATABASE DATA CHECK ===")
    
    try:
        # Check users table
        users_result = supabase.table('users').select('*').execute()
        print(f"Users table: {len(users_result.data)} records")
        for user in users_result.data:
            print(f"  - User: {user.get('name', 'N/A')} (auth_id: {user.get('auth_id', 'N/A')})")
        
        # Check quiz_results table
        results = supabase.table('quiz_results').select('*').execute()
        print(f"Quiz results table: {len(results.data)} records")
        for result in results.data:
            print(f"  - Result ID: {result.get('id')} (user_id: {result.get('user_id', 'N/A')})")
            
    except Exception as e:
        print(f"[ERROR] Database check failed: {e}")

if __name__ == "__main__":
    check_database_data()