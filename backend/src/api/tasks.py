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
            "tasks": tasks,
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset,
                "has_more": (offset + len(tasks)) < total  # Accurate logic
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

    return {
        "success": True,
        "message": "Task created successfully",
        "data": db_task
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
    
    return {
        "success": True,
        "data": db_task
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
    
    return {
        "success": True,
        "message": "Task updated successfully",
        "data": updated_task
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
    
    return {
        "success": True,
        "message": "Task status updated successfully",
        "data": {
            "id": updated_task.id,
            "status": updated_task.status,
            "updated_at": updated_task.updated_at
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