import hashlib
import os
import re
from typing import Any

from fastapi import HTTPException
from langchain_chroma import Chroma
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
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
        except ImportError as exc:
            raise HTTPException(
                status_code=500,
                detail=(
                    "sentence_transformers provider requires optional dependencies. "
                    "Install langchain-huggingface + sentence-transformers or set "
                    "EMBEDDINGS_PROVIDER=openai."
                ),
            ) from exc
        return HuggingFaceEmbeddings(model_name=settings.sentence_transformers_model)

    return OpenAIEmbeddings(
        model=settings.openai_embedding_model,
        api_key=_openai_api_key(),
    )


def _slug(value: str, max_len: int = 32) -> str:
    token = re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")
    return (token or "default")[:max_len]


def _build_collection_name() -> str:
    settings = get_settings()
    if settings.embeddings_provider == "sentence_transformers":
        model_id = settings.sentence_transformers_model
    else:
        model_id = settings.openai_embedding_model

    raw_profile = f"{settings.embeddings_provider}:{model_id}"
    profile_hash = hashlib.sha1(raw_profile.encode("utf-8")).hexdigest()[:8]
    profile_slug = _slug(raw_profile, max_len=32)
    # Keeps each embedding profile in its own collection to avoid dimension mismatch.
    return f"portfolio_rag_{profile_slug}_{profile_hash}"


def get_vector_store() -> Chroma:
    ensure_rag_dirs()
    return Chroma(
        collection_name=_build_collection_name(),
        persist_directory=str(VECTOR_DB_DIR),
        embedding_function=build_embeddings(),
    )
