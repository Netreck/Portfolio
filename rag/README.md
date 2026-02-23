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

Services split:
- Ingestion: `rag/app/services/ingestion_service.py`
- Query: `rag/app/services/query_service.py`
- Vector store setup: `rag/app/services/vector_store.py`

Current stack:
- Vector DB: Chroma (`rag/data/vector_db/`)
- Chunking: LangChain `RecursiveCharacterTextSplitter`
- Embeddings: sentence-transformers (`all-MiniLM-L6-v2`) by default
- LLM answer generation: OpenAI (`gpt-4o-mini`)
- Optional OpenAI embeddings: `EMBEDDINGS_PROVIDER=openai`

Ingestion flow:
- Put your files inside `rag/data/uploads/`.
- Call `build_vector_db_from_uploads(run_now=True)` from `rag/app/main.py`.
- This transforms uploads into vector embeddings in `rag/data/vector_db/`.

Environment variables:
- `OPENAI_API_KEY=<your-key>`
- `EMBEDDINGS_PROVIDER=sentence_transformers` (default) or `openai`
- `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`
- `OPENAI_CHAT_MODEL=gpt-4o-mini`
- `SENTENCE_TRANSFORMERS_MODEL=sentence-transformers/all-MiniLM-L6-v2`

Data directories:
- Uploaded files: `rag/data/uploads/`
- Vector index DB: `rag/data/vector_db/`
