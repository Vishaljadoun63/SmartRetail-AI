from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from database.mongo import connect_to_mongo, close_mongo_connection
from api import auth, ml_services, dashboard

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(ml_services.router, prefix=f"{settings.API_V1_STR}/ml", tags=["ml"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Backend is running"
    }