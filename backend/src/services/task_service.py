from sqlmodel import select, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func
from src.models.task import Task, TaskCreate, TaskUpdate, TaskStatus, TaskCategory


class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_task(self, task_create: TaskCreate, user_id: str) -> Task:
        # Set default values if not provided
        status = task_create.status if task_create.status is not None else TaskStatus.PENDING
        category = task_create.category if task_create.category is not None else TaskCategory.PERSONAL
        priority = task_create.priority if task_create.priority is not None else 3

        # Create the task object with the authenticated user's ID
        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            status=status,
            category=category,
            due_date=task_create.due_date,
            priority=priority,
            user_id=user_id
        )

        self.session.add(db_task)
        await self.session.commit()
        await self.session.refresh(db_task)
        return db_task

    async def get_task_by_id(self, task_id: str, user_id: str) -> Optional[Task]:
        if not user_id:
            return None
        statement = select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_tasks_by_user(
        self,
        user_id: str,
        limit: int = 20,
        offset: int = 0,
        status: Optional[TaskStatus] = None,
        category: Optional[TaskCategory] = None,
        search: Optional[str] = None
    ) -> List[Task]:
        if not user_id:
            return []
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters if provided
        if status:
            statement = statement.where(Task.status == status)
        if category:
            statement = statement.where(Task.category == category)
        if search:
            statement = statement.where(Task.title.contains(search) | Task.description.contains(search))

        # Apply pagination
        statement = statement.offset(offset).limit(limit)

        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_tasks_count_by_user(
        self,
        user_id: str,
        status: Optional[TaskStatus] = None,
        category: Optional[TaskCategory] = None,
        search: Optional[str] = None
    ) -> int:
        """Get the total count of tasks for a user with optional filters"""
        if not user_id:
            return 0
        statement = select(func.count(Task.id)).where(Task.user_id == user_id)

        # Apply filters if provided
        if status:
            statement = statement.where(Task.status == status)
        if category:
            statement = statement.where(Task.category == category)
        if search:
            statement = statement.where(Task.title.contains(search) | Task.description.contains(search))

        result = await self.session.execute(statement)
        return result.scalar_one()

    async def update_task(self, task_id: str, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
        if not user_id:
            return None

        statement = select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
        result = await self.session.execute(statement)
        db_task = result.scalar_one_or_none()

        if not db_task:
            return None

        # Update fields if provided
        if task_update.title is not None:
            db_task.title = task_update.title
        if task_update.description is not None:
            db_task.description = task_update.description
        if task_update.status is not None:
            db_task.status = task_update.status
        if task_update.category is not None:
            db_task.category = task_update.category
        if task_update.due_date is not None:
            db_task.due_date = task_update.due_date
        if task_update.priority is not None:
            db_task.priority = task_update.priority

        db_task.updated_at = datetime.utcnow()

        self.session.add(db_task)
        await self.session.commit()
        await self.session.refresh(db_task)
        return db_task

    async def delete_task(self, task_id: str, user_id: str) -> bool:
        if not user_id:
            return False

        statement = select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
        result = await self.session.execute(statement)
        db_task = result.scalar_one_or_none()

        if not db_task:
            return False

        await self.session.delete(db_task)
        await self.session.commit()
        return True

    async def get_task_stats(self, user_id: str) -> dict:
        # Get all tasks for the user
        all_tasks = await self.get_tasks_by_user(user_id)

        # Count by status
        total_tasks = len(all_tasks)
        pending_tasks = len([task for task in all_tasks if task.status == TaskStatus.PENDING])
        in_progress_tasks = len([task for task in all_tasks if task.status == TaskStatus.IN_PROGRESS])
        completed_tasks = len([task for task in all_tasks if task.status == TaskStatus.COMPLETED])

        # Calculate overdue tasks
        now = datetime.utcnow()
        overdue_tasks = len([task for task in all_tasks if task.due_date and task.due_date < now and task.status != TaskStatus.COMPLETED])

        return {
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completed_tasks": completed_tasks,
            "overdue_tasks": overdue_tasks
        }