from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional, Dict, Any
from src.database.session import get_async_session
from src.models.task import Task, TaskCreate, TaskUpdate, TaskRead, TaskStatus, TaskCategory
from src.services.task_service import TaskService
from src.api.deps import get_current_user
from src.models.base import PaginatedResponse

router = APIRouter()


@router.get("/", response_model=Dict[str, Any])
async def get_tasks(
    request: Request,  # Need to access user_id from JWT middleware
    session: AsyncSession = Depends(get_async_session),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0),
    status_param: Optional[TaskStatus] = Query(None),
    category: Optional[TaskCategory] = Query(None),
    search: Optional[str] = Query(None)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Get tasks for the current user
    tasks = await task_service.get_tasks_by_user(
        user_id=user_id,
        limit=limit,
        offset=offset,
        status=status_param,
        category=category,
        search=search
    )

    # Normalize tasks to ensure consistent field structure for frontend
    normalized_tasks = []
    for task in tasks:
        # Convert SQLModel object to dict and ensure all expected fields are present
        task_dict = {
            "id": str(task.id) if task.id else None,
            "title": task.title or "",
            "description": task.description or "",
            "status": task.status.value if hasattr(task.status, 'value') else str(task.status),
            "category": task.category.value if hasattr(task.category, 'value') else str(task.category),
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority or 3,
            "user_id": task.user_id or user_id,
            "created_at": task.created_at.isoformat() if task.created_at else None,
            "updated_at": task.updated_at.isoformat() if task.updated_at else None,
        }
        normalized_tasks.append(task_dict)

    # Get total count for pagination
    total = await task_service.get_tasks_count_by_user(
        user_id=user_id,
        status=status_param,
        category=category,
        search=search
    )

    return {
        "success": True,
        "data": {
            "tasks": normalized_tasks,
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset,
                "has_more": (offset + len(normalized_tasks)) < total  # Accurate logic
            }
        }
    }


@router.post("/", response_model=Dict[str, Any])
async def create_task(
    request: Request,
    task: TaskCreate,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Create the task with the authenticated user's ID
    db_task = await task_service.create_task(task, user_id)

    # Normalize the created task to ensure consistent field structure for frontend
    normalized_task = {
        "id": str(db_task.id) if db_task.id else None,
        "title": db_task.title or "",
        "description": db_task.description or "",
        "status": db_task.status.value if hasattr(db_task.status, 'value') else str(db_task.status),
        "category": db_task.category.value if hasattr(db_task.category, 'value') else str(db_task.category),
        "due_date": db_task.due_date.isoformat() if db_task.due_date else None,
        "priority": db_task.priority or 3,
        "user_id": db_task.user_id or user_id,
        "created_at": db_task.created_at.isoformat() if db_task.created_at else None,
        "updated_at": db_task.updated_at.isoformat() if db_task.updated_at else None,
    }

    return {
        "success": True,
        "message": "Task created successfully",
        "data": normalized_task
    }


@router.get("/{task_id}", response_model=Dict[str, Any])
async def get_task(
    request: Request,
    task_id: str,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Get the task for the current user
    db_task = await task_service.get_task_by_id(task_id, user_id)

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Normalize the single task to ensure consistent field structure for frontend
    normalized_task = {
        "id": str(db_task.id) if db_task.id else None,
        "title": db_task.title or "",
        "description": db_task.description or "",
        "status": db_task.status.value if hasattr(db_task.status, 'value') else str(db_task.status),
        "category": db_task.category.value if hasattr(db_task.category, 'value') else str(db_task.category),
        "due_date": db_task.due_date.isoformat() if db_task.due_date else None,
        "priority": db_task.priority or 3,
        "user_id": db_task.user_id or user_id,
        "created_at": db_task.created_at.isoformat() if db_task.created_at else None,
        "updated_at": db_task.updated_at.isoformat() if db_task.updated_at else None,
    }

    return {
        "success": True,
        "data": normalized_task
    }


@router.put("/{task_id}", response_model=Dict[str, Any])
async def update_task(
    request: Request,
    task_id: str,
    task_update: TaskUpdate,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Update the task
    updated_task = await task_service.update_task(task_id, user_id, task_update)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Normalize the updated task to ensure consistent field structure for frontend
    normalized_task = {
        "id": str(updated_task.id) if updated_task.id else None,
        "title": updated_task.title or "",
        "description": updated_task.description or "",
        "status": updated_task.status.value if hasattr(updated_task.status, 'value') else str(updated_task.status),
        "category": updated_task.category.value if hasattr(updated_task.category, 'value') else str(updated_task.category),
        "due_date": updated_task.due_date.isoformat() if updated_task.due_date else None,
        "priority": updated_task.priority or 3,
        "user_id": updated_task.user_id or user_id,
        "created_at": updated_task.created_at.isoformat() if updated_task.created_at else None,
        "updated_at": updated_task.updated_at.isoformat() if updated_task.updated_at else None,
    }

    return {
        "success": True,
        "message": "Task updated successfully",
        "data": normalized_task
    }


@router.delete("/{task_id}")
async def delete_task(
    request: Request,
    task_id: str,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Delete the task
    deleted = await task_service.delete_task(task_id, user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return {
        "success": True,
        "message": "Task deleted successfully"
    }


@router.patch("/{task_id}/status", response_model=Dict[str, Any])
async def update_task_status(
    request: Request,
    task_id: str,
    status_update: Dict[str, TaskStatus],
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Create a TaskUpdate object with just the status
    task_update = TaskUpdate(status=status_update.get("status"))

    # Update the task
    updated_task = await task_service.update_task(task_id, user_id, task_update)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Return normalized status update response
    return {
        "success": True,
        "message": "Task status updated successfully",
        "data": {
            "id": str(updated_task.id) if updated_task.id else None,
            "status": updated_task.status.value if hasattr(updated_task.status, 'value') else str(updated_task.status),
            "updated_at": updated_task.updated_at.isoformat() if updated_task.updated_at else None
        }
    }


@router.get("/categories", response_model=Dict[str, Any])
async def get_categories(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Get all tasks for the user
    all_tasks = await task_service.get_tasks_by_user(user_id)
    
    # Count tasks by category
    categories_count = {}
    for category in TaskCategory:
        categories_count[category.value] = len([
            task for task in all_tasks if task.category == category
        ])
    
    categories_list = [
        {"name": name, "count": count} 
        for name, count in categories_count.items()
    ]
    
    return {
        "success": True,
        "data": {
            "categories": categories_list
        }
    }


@router.get("/stats", response_model=Dict[str, Any])
async def get_task_stats(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    task_service = TaskService(session)

    # Get task stats
    stats = await task_service.get_task_stats(user_id)
    
    return {
        "success": True,
        "data": stats
    }