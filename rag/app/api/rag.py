from fastapi import APIRouter

from rag.app.models.rag import ChatRequest, ChatResponse
from rag.app.services.query_service import QueryService

router = APIRouter(prefix="/rag", tags=["rag"])
query_service = QueryService()


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    result = query_service.query(message=payload.message, top_k=payload.top_k)
    return ChatResponse(**result)
