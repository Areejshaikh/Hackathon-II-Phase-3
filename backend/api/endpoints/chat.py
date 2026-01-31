from fastapi import APIRouter, Depends, HTTPException, Path, Request
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import Session, select

# Models & Services
from services.cohere_service import cohere_service
from services.user_service import user_service
from models.conversation import Conversation
from models.message import Message
from src.database.session import get_session # Sahi async dependency
from src.models.task import Task, TaskStatus

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
    request_data: ChatRequest, # Parameter name changed to avoid conflict with 'request'
    request: Request, # Accessing request.state from Middleware
    user_id: str = Path(..., description="The ID of the user"),
    db_session: Session = Depends(get_session) # Proper Dependency Injection
):
    # 1. Validation (Middleware se user_id confirm karein)
    current_user_id = getattr(request.state, "user_id", None)
    
    if not current_user_id or user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch or not authenticated")

    try:
        # 2. Get or Create Conversation
        conversation = None
        if request_data.conversation_id:
            conversation = db_session.get(Conversation, request_data.conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = Conversation(
                user_id=user_id, 
                title=request_data.message[:50] if request_data.message else "New Chat"
            )
            db_session.add(conversation)
            db_session.commit()
            db_session.refresh(conversation)

        # 3. Handle Personalized Greeting (New Chat only)
        if not request_data.conversation_id:
            greeting = user_service.get_personalized_greeting(user_id, db_session)
            db_session.add(Message(
                conversation_id=conversation.id,
                role="assistant",
                content=greeting
            ))

        # 4. Save User Message
        db_session.add(Message(
            conversation_id=conversation.id,
            role="user",
            content=request_data.message
        ))
        db_session.commit()

        # 5. Cohere Action Processing
        action_result = cohere_service.process_natural_language_command(request_data.message, user_id)
        response_text = ""
        tool_results = []

        # -- Action Logic --
        action = action_result.get("action")
        params = action_result.get("parameters", {})

        if action == "add_task":
            new_task = Task(
                title=params.get("title", "Untitled Task"),
                description=params.get("description", ""),
                user_id=user_id
            )
            db_session.add(new_task)
            db_session.commit()
            db_session.refresh(new_task)
            response_text = f"Task '{new_task.title}' add ho gaya hai!"
            tool_results.append({"action": "add_task", "id": new_task.id})

        elif action == "list_tasks":
            tasks = db_session.exec(select(Task).where(Task.user_id == user_id)).all()
            response_text = "Aapki tasks ye rahi:\n" + "\n".join([f"- {t.title}" for t in tasks]) if tasks else "Koi tasks nahi mili."
            tool_results.append({"action": "list", "count": len(tasks)})

        elif action == "complete_task":
            task_id = params.get("task_id")
            task = db_session.get(Task, task_id) if task_id else None
            if task and task.user_id == user_id:
                task.status = TaskStatus.COMPLETED
                db_session.add(task)
                response_text = f"Task '{task.title}' complete ho gaya!"
            else:
                response_text = "Task nahi mila."

        else:
            # Simple AI Response if no tool matches
            response_text = cohere_service.generate_response(request_data.message)

        # 6. Save Assistant Response & Update Conversation
        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            # tool_response=tool_results[0] if tool_results else None # Agar model support kare
        )
        db_session.add(assistant_msg)
        
        conversation.updated_at = datetime.now()
        db_session.add(conversation)
        db_session.commit()

        # 7. Final Response Formatting
        messages_stmt = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.id.desc()).limit(10)
        recent_msgs = db_session.exec(messages_stmt).all()

        return ChatResponse(
            response=response_text,
            conversation_id=conversation.id,
            messages=[{"role": m.role, "content": m.content} for m in reversed(recent_msgs)],
            tool_results=tool_results
        )

    except Exception as e:
        db_session.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")