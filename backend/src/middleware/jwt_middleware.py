import json
from typing import Dict, Optional
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError
import os
import time


class JWTMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        # Load environment variables from .env file if available
        from dotenv import load_dotenv
        load_dotenv()  # This will load the .env file

        # Use the same secret as the auth service for consistency
        self.secret = os.getenv("SECRET_KEY", "uG4GOZ-kL2sN6ULOMSIZV_NKHx3KAW1LFffSSy5IjrY")
        # For development purposes, provide a default secret if none is set
        # In production, this should always be set via environment variable
        if not self.secret:
            import warnings
            warnings.warn("SECRET_KEY not set, using default development secret. This is insecure for production!")
            self.secret = "uG4GOZ-kL2sN6ULOMSIZV_NKHx3KAW1LFffSSy5IjrY"

    async def dispatch(self, request: Request, call_next):
        # Skip OPTIONS requests for CORS preflight (must bypass authentication)
        if request.method == "OPTIONS":
            return await call_next(request)

        # Skip authentication for public routes and static assets
        path = request.url.path

        # Check if this is a public route that should bypass authentication
        is_public_route = (
            path == "/" or
            path == "/health" or
            path.startswith("/docs") or  # Handles /docs, /docs/, and /docs/swagger-ui-bundle.js, etc.
            path.startswith("/redoc") or  # Handles /redoc, /redoc/, and /redoc/redoc.standalone.js, etc.
            path == "/openapi.json" or
            path.endswith("/favicon.ico") or
            path.startswith("/.well-known/")
        )

        if is_public_route:
            return await call_next(request)

        # Check if this is an auth-related route that shouldn't require token
        if request.url.path.startswith("/api/auth"):
            # Allow auth routes to pass through (except for protected ones)
            if request.method == "POST" and ("/api/auth/login" in request.url.path or request.url.path.endswith("/login")):
                return await call_next(request)
            elif request.method == "POST" and ("/api/auth/register" in request.url.path or request.url.path.endswith("/register")):
                return await call_next(request)
            elif request.method == "POST" and ("/api/auth/logout" in request.url.path or request.url.path.endswith("/logout")):
                return await call_next(request)
            # For other auth routes like /api/auth/me, /api/auth/profile, we need authentication
            # So we don't return here, we continue to check for JWT

        # If no secret is configured, authentication cannot work
        if not self.secret:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Authentication system not properly configured: BETTER_AUTH_SECRET is missing"}
            )

        # Extract Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing or invalid Authorization header"}
            )

        token = auth_header.split(" ")[1]

        try:
            # Decode the JWT token from Better Auth
            payload = jwt.decode(token, self.secret, algorithms=["HS256"])

            # Extract user_id from token (Better Auth typically stores user info in 'payload')
            user_id = payload.get("sub") or payload.get("id")
            if not user_id:
                # Try to get user ID from different possible fields in Better Auth tokens
                user_id = payload.get("user", {}).get("id")

            if not user_id:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid token: missing user ID"}
                )

            # Add user_id to request state for use in route handlers
            request.state.user_id = user_id

        except JWTError as e:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": f"Invalid token: {str(e)}"}
            )
        except Exception as e:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": f"Authentication error: {str(e)}"}
            )

        response = await call_next(request)
        return response