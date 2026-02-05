import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.api import auth, tasks
from api.endpoints.chat import router as chat_router
from src.middleware.jwt_middleware import JWTMiddleware
from init_db import create_db_and_tables

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(
    title="Todo Backend API",
    lifespan=lifespan
)

# --- 1. CORS MIDDLEWARE (MUST BE ADDED FIRST) ---
# This ensures that preflight (OPTIONS) requests are handled before anything else.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# --- 2. CUSTOM MIDDLEWARES WITH OPTIONS BYPASS ---

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # OPTIONS requests ko bypass karna zaroori hai CORS ke liye
        if request.method == "OPTIONS":
            return await call_next(request)
        try:
            response = await call_next(request)
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            return response
        except Exception as e:
            from anyio import EndOfStream
            if isinstance(e, EndOfStream):
                return Response(status_code=499)
            raise

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, auth_requests_per_minute=30, non_auth_requests_per_minute=100):
        super().__init__(app)
        self.auth_requests_per_minute = auth_requests_per_minute
        self.non_auth_requests_per_minute = non_auth_requests_per_minute
        self.requests = {}

    async def dispatch(self, request, call_next):
        # Preflight requests should never be rate limited
        if request.method == "OPTIONS":
            return await call_next(request)

        client_ip = request.client.host
        path = request.url.path
        now = time.time()
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Cleanup old timestamps
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < 60]
        
        is_auth = path.startswith('/api/auth/')
        limit = self.auth_requests_per_minute if is_auth else self.non_auth_requests_per_minute
        
        if len(self.requests[client_ip]) >= limit:
            return JSONResponse(status_code=429, content={"detail": "Too many requests"})
            
        self.requests[client_ip].append(now)
        return await call_next(request)

# Order of addition matters: Last added = First to run for request
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(JWTMiddleware)

# --- 3. ROUTERS ---
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(chat_router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"status": "online"}

@app.get("/health")
def health_check():
    """Health check endpoint for container orchestration"""
    return {
        "status": "healthy",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)