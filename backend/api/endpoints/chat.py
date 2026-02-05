from fastapi import APIRouter, Depends, HTTPException, Path, Request
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

# Models & Services
from src.models.task import Task, TaskStatus, TaskCategory
from models.conversation import Conversation
from models.message import Message
from services.cohere_service import cohere_service
from services.user_service import user_service
from src.database.session import get_async_session


router = APIRouter(prefix="/chat", tags=["chat"])

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    messages: List[Dict[str, Any]]
    tool_results: Optional[List[Any]] = None

# --- Endpoint ---
@router.post("/{user_id}", response_model=ChatResponse)
async def chat_endpoint(
    request_data: ChatRequest, 
    request: Request, 
    user_id: str = Path(..., description="The ID of the user"),
    db_session: AsyncSession = Depends(get_async_session)
):
    # 1. Validation
    current_user_id = getattr(request.state, "user_id", None)
    
    if not current_user_id or user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch or not authenticated")

    try:
        # 2. Get or Create Conversation
        conversation = None
        if request_data.conversation_id:
            # FIX: .execute() aur .scalar_one_or_none() for AsyncSession
            result = await db_session.execute(
                select(Conversation).where(Conversation.id == request_data.conversation_id)
            )
            conversation = result.scalar_one_or_none()
            
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = Conversation(
                user_id=user_id,
                title=request_data.message[:50] if request_data.message else "New Chat"
            )
            db_session.add(conversation)
            await db_session.commit()
            await db_session.refresh(conversation)

        # 3. Handle Personalized Greeting (New Chat only)
        if not request_data.conversation_id:
            greeting = await user_service.get_personalized_greeting(user_id, db_session)
            greeting_message = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=greeting
            )
            db_session.add(greeting_message)
            await db_session.commit()

        # 4. Save User Message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request_data.message
        )
        db_session.add(user_message)
        await db_session.commit()

        # 5. Cohere Action Processing
        action_result = cohere_service.process_natural_language_command(request_data.message, user_id)
        response_text = ""
        tool_results = []

        action = action_result.get("action")
        params = action_result.get("parameters", {})

        if action == "add_task":
            # Extract task title and description from parameters
            title = params.get("title", "").strip()
            description = params.get("description", "").strip()

            if not title:
                # Try to extract title from the original message if not provided in params
                title = request_data.message.replace("add", "").replace("Add", "").strip()
                if title.startswith("task:") or title.startswith("Task:"):
                    title = title[5:].strip()

            if not title:
                response_text = "Unable to process your request ❌"
            else:
                # Check if task with same title already exists for this user to prevent duplicates
                existing_task_result = await db_session.execute(
                    select(Task).where(Task.title == title, Task.user_id == user_id)
                )
                existing_task = existing_task_result.scalar_one_or_none()

                if existing_task:
                    response_text = "Task already exists ❌"
                else:
                    new_task = Task(
                        title=title,
                        description=description,
                        user_id=user_id,
                        status=TaskStatus.PENDING,
                        category=TaskCategory.PERSONAL,
                        priority=3
                    )
                    db_session.add(new_task)
                    await db_session.commit()
                    await db_session.refresh(new_task)
                    response_text = "Task added successfully ✅"
                    tool_results.append({
                        "action": "add_task",
                        "result": {"id": new_task.id, "title": new_task.title, "status": new_task.status.value}
                    })

        elif action == "list_tasks":
            # FIX: .execute() aur .scalars().all()
            result = await db_session.execute(select(Task).where(Task.user_id == user_id))
            tasks = result.scalars().all()

            if tasks:
                task_list = []
                for task in tasks:
                    task_list.append({
                        "id": task.id,
                        "title": task.title,
                        "status": task.status.value,
                        "created_at": task.created_at.isoformat() if task.created_at else None
                    })

                response_text = f"You have {len(tasks)} task(s):\n" + "\n".join([f"- {t['title']} (Status: {t['status']})" for t in task_list])
                tool_results.append({"action": "list_tasks", "result": {"tasks": task_list}})
            else:
                response_text = "No tasks found."
                tool_results.append({"action": "list_tasks", "result": {"tasks": []}})

        elif action == "complete_task":
            # Try to find task by title if provided in parameters
            task_title = params.get("title", "").strip()
            task_id = params.get("task_id")

            task = None
            if task_id:
                result = await db_session.execute(select(Task).where(Task.id == task_id))
                task = result.scalar_one_or_none()
            elif task_title:
                # Find task by title for the current user
                result = await db_session.execute(
                    select(Task).where(Task.title.ilike(f"%{task_title}%"), Task.user_id == user_id)
                )
                task = result.scalar_one_or_none()

            if task and task.user_id == user_id:
                task.status = TaskStatus.COMPLETED
                await db_session.commit()
                response_text = f"Task updated to completed successfully ✅"
                tool_results.append({
                    "action": "complete_task",
                    "result": {"id": task.id, "title": task.title, "status": task.status.value}
                })
            else:
                response_text = "Task not found ❌"

        elif action == "update_task_status":
            # Handle updating task to in-progress or other statuses
            task_title = params.get("title", "").strip()
            new_status = params.get("status", "").upper()

            if not task_title or not new_status:
                response_text = "Unable to process your request ❌"
            else:
                # Map status strings to enum values
                status_map = {
                    "IN PROGRESS": TaskStatus.IN_PROGRESS,
                    "IN-PROGRESS": TaskStatus.IN_PROGRESS,
                    "IN_PROGRESS": TaskStatus.IN_PROGRESS,
                    "PENDING": TaskStatus.PENDING,
                    "COMPLETED": TaskStatus.COMPLETED
                }

                target_status = status_map.get(new_status)
                if not target_status:
                    response_text = "Invalid status provided ❌"
                else:
                    # Find task by title for the current user
                    result = await db_session.execute(
                        select(Task).where(Task.title.ilike(f"%{task_title}%"), Task.user_id == user_id)
                    )
                    task = result.scalar_one_or_none()

                    if task and task.user_id == user_id:
                        task.status = target_status
                        await db_session.commit()
                        response_text = f"Task updated to {target_status.value} successfully ✅"
                        tool_results.append({
                            "action": "update_task",
                            "result": {"id": task.id, "title": task.title, "status": task.status.value}
                        })
                    else:
                        response_text = "Task not found ❌"

        else:
            # AI General Response
            response_text = cohere_service.generate_response(request_data.message)

        # 6. Save Assistant Response
        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text
        )
        db_session.add(assistant_msg)
        conversation.updated_at = datetime.now()
        db_session.add(conversation)
        await db_session.commit()

        # 7. Final Response Formatting
        messages_stmt = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.id.desc()).limit(10)
        # FIX: .execute() aur .scalars().all()
        messages_result = await db_session.execute(messages_stmt)
        recent_msgs = messages_result.scalars().all()

        return ChatResponse(
            response=response_text,
            conversation_id=conversation.id,
            messages=[{"role": m.role, "content": m.content} for m in reversed(recent_msgs)],
            tool_results=tool_results
        )

    except Exception as e:
        await db_session.rollback()
        print(f"Backend Chat Error: {str(e)}") # For HF logs
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")   