from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import HTTPException
from fastapi.templating import Jinja2Templates
from dotenv import dotenv_values, load_dotenv
import os

config = dotenv_values()

load_dotenv()

# Import Routes
from routes.authRoutes import router as authRouter
from routes.userRoutes import router as userRouter
from routes.activityLogRoutes import router as activityLogRouter
from routes.analyticsRoutes import router as analyticsRouter
from routes.datasetsRoutes import router as datasetsRouter
from routes.pointRoutes import router as pointRouter
from routes.miscRoutes import router as miscRouter

# Initialize FastAPI app
app = FastAPI()

# Initialize FastAPI app for api routes
api_app = FastAPI()

# origins = os.getenv("CORS_ORIGINS").split(",")

cors_origins = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
print("Allowed origins:", origins)


# Setup middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Routes
api_app.include_router(router=authRouter, tags=["Auth"], prefix="/auth")
api_app.include_router(router=userRouter, tags=["Users"], prefix="/users")
api_app.include_router(
    router=activityLogRouter, tags=["Activity Logs"], prefix="/activity-logs"
)
api_app.include_router(router=datasetsRouter, tags=["Datasets"], prefix="/datasets")
api_app.include_router(router=pointRouter, tags=["Points"], prefix="/points")
api_app.include_router(router=analyticsRouter, tags=["Analytics"])
api_app.include_router(router=miscRouter, tags=["Misc"])

app.mount("/api", api_app, name="api")

# Serve build files from client / frontend
app.mount("/", StaticFiles(directory="../build", html=True), name="build")

templates = Jinja2Templates(directory="../build")

# Handle 404 error
@app.exception_handler(404)
async def catch_all(request: Request, exc: HTTPException):
    return templates.TemplateResponse("index.html", {"request": request})
