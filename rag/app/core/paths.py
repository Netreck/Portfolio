from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]
RAG_DIR = PROJECT_ROOT / "rag"
DATA_DIR = RAG_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
VECTOR_DB_DIR = DATA_DIR / "vector_db"
VECTOR_INDEX_PATH = VECTOR_DB_DIR / "index.json"


def ensure_rag_dirs() -> None:
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)
