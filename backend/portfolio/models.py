from pydantic import BaseModel, EmailStr
from typing import Dict, List, Optional
from datetime import datetime

class Position(BaseModel):
    quantity: float  # Changed to float to accommodate crypto fractional quantities
    price: float

class BrokerAssets(BaseModel):
    assets: Dict[str, Position]  # Generic assets (can be stocks or crypto)

class PortfolioStocks(BaseModel):
    stocks: List[Dict[str, Dict[str, Position]]]  # broker -> stock -> position

class PortfolioCrypto(BaseModel):
    crypto: List[Dict[str, Dict[str, Position]]]  # exchange -> crypto -> position

class BankCash(BaseModel):
    value: float

class PortfolioCash(BaseModel):
    cash: Dict[str, BankCash]  # bank -> cash value

class PortfolioValue(BaseModel):
    stocks: Dict[str, float]
    crypto: Dict[str, float]
    cash: Dict[str, float]
    total: float 

class User(BaseModel):
    user_id: Optional[str] = None
    email: EmailStr
    name: str
    password: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True 