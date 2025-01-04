from os import getenv
from dotenv import load_dotenv
from supabase import create_client, Client
from functools import lru_cache

# Load environment variables
load_dotenv()

@lru_cache()
def get_supabase() -> Client:
    # Get Supabase credentials from environment variables
    SUPABASE_URL = getenv("SUPABASE_URL")
    SUPABASE_KEY = getenv("SUPABASE_KEY")

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials in environment variables")

    # Create Supabase client
    return create_client(SUPABASE_URL, SUPABASE_KEY) 