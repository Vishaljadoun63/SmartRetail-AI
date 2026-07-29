from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_instance.db = db_instance.client[settings.DATABASE_NAME]
    logger.info("Connected to MongoDB.")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_instance.client:
        db_instance.client.close()
    logger.info("Closed MongoDB connection.")

def get_db():
    """Returns the database instance"""
    return db_instance.db

def get_collection(collection_name: str):
    """Returns a specific collection from the database"""
    if db_instance.db is None:
        raise Exception("Database is not connected. Ensure connect_to_mongo() is called on startup.")
    return db_instance.db[collection_name]
