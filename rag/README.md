# RAG Backend

This folder contains a minimal Retrieval-Augmented Generation backend.

Dependency policy:
- Use the root `requirements.txt` as the single Python dependency file.
- Do not create `rag/requirements.txt`.

Run locally:
- Create/activate your virtual environment at project root.
- Install deps with `pip install -r requirements.txt`.
- Configure `OPENAI_API_KEY` in env or `.env`.
- Start API with `uvicorn rag.app.main:app --reload`.

Run with Docker (web + rag):
- From project root, run `docker compose up --build`.
- Frontend: `http://localhost:8080`
- RAG API (direct): `http://localhost:8000`
- The web container proxies `/rag/*` to the RAG container.

API endpoint (frontend):
- `POST /rag/chat`
- Send `language: "pt"` or `language: "en"` to follow the frontend language selector. Requests without it still detect the question's language.

Services split:
- Ingestion: `rag/app/services/ingestion_service.py`
- Query: `rag/app/services/query_service.py`
- Vector store setup: `rag/app/services/vector_store.py`

Current stack:
- Vector DB: Chroma (`rag/data/vector_db/`)
- Chunking: LangChain `RecursiveCharacterTextSplitter`
- Embeddings: OpenAI (`text-embedding-3-small`) by default
- LLM answer generation: OpenAI (`gpt-5.6-luna`, medium reasoning)
- Optional local embeddings: `EMBEDDINGS_PROVIDER=sentence_transformers` (requires the optional dependencies in `requirements.txt`)

Ingestion flow:
- Put your files inside `rag/data/uploads/`.
- Run `python -c "from rag.app.main import build_vector_db_from_uploads; print(build_vector_db_from_uploads(run_now=True))"` from the project root.
- This transforms uploads into vector embeddings in `rag/data/vector_db/`.
- Rebuild after editing documents to replace old chunks. Both Dev and Prod CI/CD already copy the uploads and rebuild the collection during deployment.
- `Curriculo.txt` (Portuguese) and `Resume.txt` (English) contain the updated career history based on `web/src/Assets/Main/resume.txt`. The matching resume is also included in full as fixed context (up to 12,000 characters by default).
- `FIXED_RESUME_FILENAME`, `FIXED_RESUME_EN_FILENAME` and `FIXED_RESUME_MAX_CHARS` override those defaults. Remove any old `FIXED_RESUME_MAX_CHARS=1600` override to avoid cutting off career history and education.

Regression checks:
- `python -m unittest discover -s rag/tests -v` (no external API calls).

Environment variables:
- `OPENAI_API_KEY=<your-key>`
- `EMBEDDINGS_PROVIDER=openai` (default) or `sentence_transformers`
- `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`
- `OPENAI_CHAT_MODEL=gpt-5.6-luna`
- `OPENAI_REASONING_EFFORT=medium`
- `SENTENCE_TRANSFORMERS_MODEL=sentence-transformers/all-MiniLM-L6-v2`

Data directories:
- Uploaded files: `rag/data/uploads/`
- Vector index DB: `rag/data/vector_db/`
