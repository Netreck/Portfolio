# RAG Backend

This folder contains the Retrieval-Augmented Generation code.

Dependency policy:
- Use the root `requirements.txt` as the single Python dependency file.
- Do not create `rag/requirements.txt`.

Run locally:
- Create/activate your virtual environment at project root.
- Install deps with `pip install -r requirements.txt`.
- Start API with `uvicorn rag.app.main:app --reload`.
