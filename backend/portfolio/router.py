from fastapi import APIRouter, HTTPException
from .models import (
    PortfolioValue, 
    PortfolioStocks, 
    PortfolioCrypto, 
    PortfolioCash,
    User
)
from .database import get_supabase
from .service.user import UserService

router = APIRouter(prefix="/portfolio")
supabase_client = get_supabase()
user_service = UserService(supabase_client)

@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.get("/users/{user_id}/portfolio", response_model=PortfolioValue)
async def get_portfolio_value(user_id: str):
    response = supabase_client.table('user_mediums')\
        .select("*")\
        .eq('user_id', user_id)\
        .execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    stocks_value = sum(item['value'] for item in response.data 
                      if item['type'] == 'STOCK')
    crypto_value = sum(item['value'] for item in response.data 
                      if item['type'] == 'CRYPTO')
    cash_value = sum(item['value'] for item in response.data 
                    if item['type'] == 'BANK')
    
    return {
        "stocks": {"value": stocks_value},
        "crypto": {"value": crypto_value},
        "cash": {"value": cash_value},
        "total": stocks_value + crypto_value + cash_value
    }

@router.get("/users/{user_id}/stocks", response_model=PortfolioStocks)
async def get_stocks(user_id: str):
    # Get user's stock brokers
    brokers = supabase_client.table('user_mediums')\
        .select("*, asset_mediums!inner(*)")\
        .eq('user_id', user_id)\
        .eq('asset_mediums.type', 'STOCK')\
        .execute()

    # Get positions for each broker
    result = {"stocks": []}
    for broker in brokers.data:
        positions = supabase.table('user_assets')\
            .select("*")\
            .eq('user_medium_id', broker['user_medium_id'])\
            .eq('type', 'STOCK')\
            .execute()
        
        if positions.data:
            broker_positions = {
                broker['asset_mediums']['name']: {
                    position['symbol']: {
                        "quantity": position['quantity'],
                        "price": position['average_price']
                    } for position in positions.data
                }
            }
            result["stocks"].append(broker_positions)

    return result

@router.get("/users/{user_id}/crypto", response_model=PortfolioCrypto)
async def get_crypto(user_id: str):
    # Get user's crypto exchanges
    exchanges = supabase.table('user_mediums')\
        .select("*, asset_mediums!inner(*)")\
        .eq('user_id', user_id)\
        .eq('asset_mediums.type', 'CRYPTO')\
        .execute()

    # Get positions for each exchange
    result = {"crypto": []}
    for exchange in exchanges.data:
        positions = supabase.table('user_assets')\
            .select("*")\
            .eq('user_medium_id', exchange['user_medium_id'])\
            .eq('type', 'CRYPTO')\
            .execute()
        
        if positions.data:
            exchange_positions = {
                exchange['asset_mediums']['name']: {
                    position['symbol']: {
                        "quantity": position['quantity'],
                        "price": position['average_price']
                    } for position in positions.data
                }
            }
            result["crypto"].append(exchange_positions)

    return result

@router.get("/users/{user_id}/cash", response_model=PortfolioCash)
async def get_cash(user_id: str):
    # Get user's bank accounts
    banks = supabase.table('user_mediums')\
        .select("*, asset_mediums!inner(*)")\
        .eq('user_id', user_id)\
        .eq('asset_mediums.type', 'BANK')\
        .execute()

    result = {
        "cash": {
            bank['asset_mediums']['name']: {"value": bank['value']}
            for bank in banks.data
        }
    }
    
    return result 

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 