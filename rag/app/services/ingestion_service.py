import re
import unicodedata
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from rag.app.core.paths import UPLOADS_DIR
from rag.app.core.settings import get_settings
from rag.app.services.vector_store import get_vector_store


def _read_text_file(file_path: Path) -> str:
    raw = file_path.read_bytes()
    for encoding in ("utf-8", "latin-1"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="ignore")


def _normalize_text(raw_text: str) -> str:
    text = raw_text.replace("\ufeff", "")
    # Fixes patterns like "Estagi ́ario" where combining accents are split by spaces.
    text = re.sub(r"([A-Za-zÀ-ÿ])\s+([\u0300-\u036f])", r"\1\2", text)
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


class IngestionService:
    def ingest_uploads_to_vector_db(
        self,
        chunk_size: int = 900,
        chunk_overlap: int = 180,
        reset_collection: bool = True,
    ) -> dict[str, int]:
        settings = get_settings()
        if chunk_overlap >= chunk_size:
            raise HTTPException(status_code=400, detail="chunk_overlap must be smaller than chunk_size")

        upload_files = [
            path
            for path in sorted(UPLOADS_DIR.glob("*"))
            if path.is_file() and path.name != ".gitkeep"
        ]
        if not upload_files:
            return {"documents": 0, "chunks": 0}

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

        documents: list[Document] = []
        skipped_too_small = 0
        for file_path in upload_files:
            text = _normalize_text(_read_text_file(file_path))
            if not text:
                continue
            if len(text) < settings.min_document_chars:
                skipped_too_small += 1
                continue
            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "document_id": uuid4().hex,
                        "source_name": file_path.name,
                        "source_path": str(file_path),
                    },
                )
            )

        if not documents:
            return {"documents": 0, "chunks": 0, "skipped_too_small": skipped_too_small}

        chunks = splitter.split_documents(documents)
        if not chunks:
            return {"documents": len(documents), "chunks": 0, "skipped_too_small": skipped_too_small}

        vector_store = get_vector_store()
        if reset_collection:
            vector_store.delete_collection()
            vector_store = get_vector_store()

        ids = [uuid4().hex for _ in chunks]
        for idx, chunk in enumerate(chunks):
            chunk.metadata["chunk_id"] = ids[idx]

        vector_store.add_documents(chunks, ids=ids)
        return {"documents": len(documents), "chunks": len(chunks), "skipped_too_small": skipped_too_small}
