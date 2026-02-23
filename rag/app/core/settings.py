from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class RAGSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    embeddings_provider: Literal["openai", "sentence_transformers"] = "sentence_transformers"
    show_sources: bool = False
    retrieval_min_score: float = 0.22
    min_document_chars: int = 120
    fixed_resume_filename: str = "Curriculo.txt"
    fixed_resume_max_chars: int = 1600
    sentence_transformers_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"
    openai_api_key: str | None = None


@lru_cache
def get_settings() -> RAGSettings:
    return RAGSettings()
