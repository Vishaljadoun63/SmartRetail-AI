import pytest
from httpx import AsyncClient
from main import app
from database.mongo import db_instance
from motor.motor_asyncio import AsyncIOMotorClient

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(autouse=True)
async def setup_db():
    # Setup mock DB for tests
    db_instance.client = AsyncIOMotorClient("mongodb://localhost:27017")
    db_instance.db = db_instance.client["test_smart_retail_db"]
    yield
    # Teardown
    await db_instance.client.drop_database("test_smart_retail_db")
    db_instance.client.close()

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def admin_token(client):
    # Register an admin
    await client.post(
        "/api/v1/auth/register-admin",
        json={"email": "test@admin.com", "full_name": "Test Admin", "password": "password123"}
    )
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        data={"username": "test@admin.com", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    return response.json()["access_token"]
