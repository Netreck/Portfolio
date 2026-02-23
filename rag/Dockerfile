FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY rag ./rag

EXPOSE 8000

CMD ["uvicorn", "rag.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
