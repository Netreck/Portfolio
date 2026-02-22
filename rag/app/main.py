from fastapi import FastAPI

from rag.app.api.health import router as health_router

app = FastAPI(title="Portfolio RAG API", version="0.1.0")
app.include_router(health_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "RAG API is running"}
