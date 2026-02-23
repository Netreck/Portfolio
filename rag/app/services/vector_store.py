import os
from typing import Any

from fastapi import HTTPException
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings

from rag.app.core.paths import VECTOR_DB_DIR, ensure_rag_dirs
from rag.app.core.settings import get_settings


def _openai_api_key() -> str:
    settings = get_settings()
    key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY not configured. Set it in .env or environment.",
        )
    return key


def build_embeddings() -> Any:
    settings = get_settings()
    if settings.embeddings_provider == "sentence_transformers":
        return HuggingFaceEmbeddings(model_name=settings.sentence_transformers_model)

    return OpenAIEmbeddings(
        model=settings.openai_embedding_model,
        api_key=_openai_api_key(),
    )


def get_vector_store() -> Chroma:
    ensure_rag_dirs()
    return Chroma(
        collection_name="portfolio_rag",
        persist_directory=str(VECTOR_DB_DIR),
        embedding_function=build_embeddings(),
    )
