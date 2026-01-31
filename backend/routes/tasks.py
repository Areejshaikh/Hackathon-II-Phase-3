import logging
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional

from models.task import Task, TaskCreate, TaskRead, TaskUpdate
from backend.models.users import User
from utils.auth import get_current_user_from_better_auth
from db import get_session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("/", response_model=List[TaskRead])
async def get_tasks(
    completed: Optional[bool] = Query(None, description="Filter tasks by completion status"),
    current_user: User = Depends(get_current_user_from_better_auth),
    session: AsyncSession = Depends(get_session)
):
    """Get all tasks for the authenticated user."""
    logger.info(f"Fetching tasks for user: {current_user.id}")

    # Query tasks for the current user only
    statement = select(Task).where(Task.user_id == current_user.id)

    # Apply completed filter if provided
    if completed is not None:
        statement = statement.where(Task.completed == completed)

    result = await session.execute(statement)
    tasks = result.scalars().all()

    logger.info(f"Returning {len(tasks)} tasks for user: {current_user.id}")
    return tasks


@router.post("/", response_model=TaskRead)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user_from_better_auth),
    session: AsyncSession = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    logger.info(f"Creating task for user: {current_user.id}")

    # Create task with the current user's ID
    db_task = Task.model_validate(task, update={"user_id": current_user.id})
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)

    logger.info(f"Task created successfully: {db_task.id} for user: {current_user.id}")
    return db_task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user_from_better_auth),
    session: AsyncSession = Depends(get_session)
):
    """Update a task for the authenticated user."""
    logger.info(f"Updating task: {task_id} for user: {current_user.id}")

    # Get the task and ensure it belongs to the current user
    db_task = await session.get(Task, task_id)

    if not db_task:
        logger.warning(f"Task not found: {task_id} for user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user.id:
        logger.warning(f"Unauthorized access attempt to task: {task_id} by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Update the task with provided values
    for field, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)

    logger.info(f"Task updated successfully: {db_task.id}")
    return db_task


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user_from_better_auth),
    session: AsyncSession = Depends(get_session)
):
    """Delete a task for the authenticated user."""
    logger.info(f"Deleting task: {task_id} for user: {current_user.id}")

    # Get the task and ensure it belongs to the current user
    db_task = await session.get(Task, task_id)

    if not db_task:
        logger.warning(f"Task not found: {task_id} for user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user.id:
        logger.warning(f"Unauthorized access attempt to task: {task_id} by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    await session.delete(db_task)
    await session.commit()

    logger.info(f"Task deleted successfully: {task_id}")
    return {"message": "Task deleted successfully"}