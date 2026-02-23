from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    top_k: int = Field(default=4, ge=1, le=10)


class ChatSource(BaseModel):
    source_name: str
    score: float
    excerpt: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
