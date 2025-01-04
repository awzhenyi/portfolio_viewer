from typing import Optional
from supabase import Client
from ..models import User

class UserService:
    def __init__(self, supabase: Client):
        self._supabase = supabase
        self._table = 'users'

    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        try:
            response = self._supabase.table(self._table)\
                .select("user_id, email, name, created_at")\
                .eq('user_id', user_id)\
                .limit(1)\
                .execute()
            
            if not response.data:
                return None
            
            # Convert to User model and then to dict
            user_data = response.data[0]
            user = User(
                user_id=user_data['user_id'],
                email=user_data['email'],
                name=user_data['name'],
                password="",  # Don't return the actual password
                created_at=user_data['created_at']
            )
            return user.model_dump()
            
        except Exception as e:
            print(f"Error fetching user by ID: {str(e)}")
            return None

    async def get_user_by_email(self, email: str) -> Optional[dict]:
        try:
            response = self._supabase.table(self._table)\
                .select("*")\
                .eq('email', email)\
                .limit(1)\
                .execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching user by email: {str(e)}")
            return None

    async def create_user(self, email: str, name: str, password: str) -> Optional[dict]:
        try:
            response = self._supabase.table(self._table)\
                .insert({
                    'email': email,
                    'name': name,
                    'password': password  # Note: Password should be hashed before storage
                })\
                .execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return None

    async def update_user(self, user_id: str, data: dict) -> Optional[dict]:
        try:
            response = self._supabase.table(self._table)\
                .update(data)\
                .eq('user_id', user_id)\
                .execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            return None

    async def delete_user(self, user_id: str) -> bool:
        try:
            response = self._supabase.table(self._table)\
                .delete()\
                .eq('user_id', user_id)\
                .execute()
            return bool(response.data)
        except Exception as e:
            print(f"Error deleting user: {str(e)}")
            return False 