FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HOME=/home/app

WORKDIR /app

RUN addgroup --system --gid 10001 app \
    && adduser --system --uid 10001 --ingroup app --home /home/app app

COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip \
    && pip install --no-compile --prefer-binary -r requirements.txt

COPY rag ./rag

RUN mkdir -p /app/rag/data/uploads /app/rag/data/vector_db \
    && chown -R app:app /app /home/app

USER app

EXPOSE 8000

CMD ["uvicorn", "rag.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
