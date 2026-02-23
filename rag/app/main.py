from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rag.app.api.rag import router as rag_router
from rag.app.services.ingestion_service import IngestionService

app = FastAPI(title="Portfolio RAG API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router)

ingestion_service = IngestionService()

def build_vector_db_from_uploads(run_now: bool = False) -> dict[str, int] | None:
    """Optional bootstrap for indexing files in rag/data/uploads into vector DB."""
    if not run_now:
        return None
    return ingestion_service.ingest_uploads_to_vector_db(reset_collection=True)
