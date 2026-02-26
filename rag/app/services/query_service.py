import os
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Literal

from fastapi import HTTPException
from langchain_openai import ChatOpenAI

from rag.app.core.paths import UPLOADS_DIR
from rag.app.core.settings import get_settings
from rag.app.services.ingestion_service import IngestionService
from rag.app.services.vector_store import get_vector_store


def _openai_api_key() -> str:
    settings = get_settings()
    key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    if not key or key == "YOUR_OPENAI_API_KEY" or key.startswith("YOUR_"):
        raise HTTPException(
            status_code=400,
            detail="OPENAI_API_KEY not configured or still using placeholder value.",
        )
    return key


class QueryService:
    @staticmethod
    def _detect_query_language(query: str) -> Literal["pt", "en"]:
        q = query.lower()
        tokens = re.findall(r"[a-zA-ZÀ-ÿ']+", q)

        pt_markers = {
            "qual",
            "quais",
            "como",
            "quem",
            "onde",
            "quando",
            "porque",
            "por",
            "que",
            "voce",
            "você",
            "sobre",
            "projeto",
            "projetos",
            "experiencia",
            "experiência",
            "habilidades",
            "curriculo",
            "currículo",
            "trabalho",
            "construiu",
            "seu",
            "sua",
        }
        en_markers = {
            "what",
            "which",
            "how",
            "who",
            "where",
            "when",
            "why",
            "about",
            "project",
            "projects",
            "experience",
            "skills",
            "resume",
            "work",
            "built",
            "your",
            "you",
            "can",
            "tell",
            "list",
        }

        pt_score = sum(1 for token in tokens if token in pt_markers)
        en_score = sum(1 for token in tokens if token in en_markers)

        if re.search(r"[ãõçáéíóúâêôà]", q):
            pt_score += 2

        if en_score > pt_score:
            return "en"
        if pt_score > en_score:
            return "pt"
        return "en"

    @staticmethod
    def _language_name(response_language: Literal["pt", "en"]) -> str:
        return "Portuguese" if response_language == "pt" else "English"

    @staticmethod
    def _missing_info_message(response_language: Literal["pt", "en"]) -> str:
        if response_language == "pt":
            return "Nao encontrei essa informacao nos documentos carregados."
        return "I could not find this information in the uploaded documents."

    @staticmethod
    def _is_embedding_dimension_mismatch_error(error: Exception) -> bool:
        message = str(error).lower()
        return (
            "expecting embedding with dimension" in message
            and "got" in message
        )

    def _search_with_auto_reindex(self, query: str, k: int) -> list[tuple[Any, float]]:
        vector_store = get_vector_store()
        try:
            return vector_store.similarity_search_with_score(query, k=k)
        except Exception as exc:
            if not self._is_embedding_dimension_mismatch_error(exc):
                raise

            try:
                IngestionService().ingest_uploads_to_vector_db(reset_collection=True)
            except Exception as rebuild_exc:
                raise HTTPException(
                    status_code=500,
                    detail=(
                        "Embedding dimension mismatch detected and automatic reindex failed. "
                        "Clear vector DB and ingest again."
                    ),
                ) from rebuild_exc

            vector_store = get_vector_store()
            return vector_store.similarity_search_with_score(query, k=k)

    @staticmethod
    def _extract_requested_count(query: str) -> int | None:
        q = query.lower()
        number_words = {
            "um": 1,
            "uma": 1,
            "one": 1,
            "dois": 2,
            "duas": 2,
            "two": 2,
            "tres": 3,
            "três": 3,
            "three": 3,
            "quatro": 4,
            "four": 4,
            "cinco": 5,
            "five": 5,
            "seis": 6,
            "six": 6,
            "sete": 7,
            "seven": 7,
            "oito": 8,
            "eight": 8,
            "nove": 9,
            "nine": 9,
            "dez": 10,
            "ten": 10,
        }
        for word, value in number_words.items():
            if re.search(rf"\b{re.escape(word)}\b", q):
                return value

        for match in re.findall(r"\b(\d{1,2})\b", q):
            value = int(match)
            if 1 <= value <= 20:
                return value
        return None

    @staticmethod
    def _is_list_query(query: str) -> bool:
        q = query.lower()
        list_markers = (
            "liste",
            "list",
            "quais sao",
            "quais são",
            "cite",
            "enumere",
            "mostre",
            "me diga",
            "top ",
        )
        return any(marker in q for marker in list_markers)

    @staticmethod
    def _count_markdown_list_items(text: str) -> int:
        if not text:
            return 0
        return len(re.findall(r"(?m)^\s*(?:\d+\.\s+|[-*]\s+)", text))

    @staticmethod
    def _is_project_source(source_name: str) -> bool:
        name = source_name.lower()
        project_markers = ("readme", "project", "projects", "portfolio", "case", "repo", "github")
        return any(marker in name for marker in project_markers)

    @staticmethod
    def _is_project_query(query: str) -> bool:
        q = query.lower()
        keywords = (
            "projeto",
            "projetos",
            "project",
            "projects",
            "portfolio",
            "github",
            "repositorio",
            "app",
            "aplicacao",
            "sistema",
            "o que voce construiu",
            "o que você construiu",
            "built",
            "build",
        )
        return any(keyword in q for keyword in keywords)

    @staticmethod
    def _read_text_file(file_path: Path) -> str:
        raw = file_path.read_bytes()
        for encoding in ("utf-8", "latin-1"):
            try:
                return raw.decode(encoding)
            except UnicodeDecodeError:
                continue
        return raw.decode("utf-8", errors="ignore")

    @staticmethod
    def _normalize_text(raw_text: str) -> str:
        text = raw_text.replace("\ufeff", "")
        text = re.sub(r"([A-Za-zÀ-ÿ])\s+([\u0300-\u036f])", r"\1\2", text)
        text = unicodedata.normalize("NFKC", text)
        text = re.sub(r"\r\n?", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def _load_fixed_resume_context(self) -> str:
        settings = get_settings()
        resume_path = UPLOADS_DIR / settings.fixed_resume_filename
        if not resume_path.exists() or not resume_path.is_file():
            return ""

        text = self._normalize_text(self._read_text_file(resume_path))
        if not text:
            return ""
        return text[: settings.fixed_resume_max_chars].strip()

    @staticmethod
    def _normalize_for_similarity(text: str) -> str:
        normalized = re.sub(r"\s+", " ", text.lower()).strip()
        return re.sub(r"[^\w\s]", "", normalized)

    def _max_similarity_with_context(self, answer: str, contexts: list[str]) -> float:
        if not answer or not contexts:
            return 0.0

        answer_normalized = self._normalize_for_similarity(answer)
        if not answer_normalized:
            return 0.0

        best = 0.0
        for context in contexts:
            context_normalized = self._normalize_for_similarity(context)
            if not context_normalized:
                continue
            score = SequenceMatcher(None, answer_normalized, context_normalized).ratio()
            best = max(best, score)
        return best

    def _rewrite_to_paraphrase(
        self,
        llm: ChatOpenAI,
        answer: str,
        contexts: list[str],
        response_language: Literal["pt", "en"],
    ) -> str:
        context_block = "\n\n".join(contexts)
        language_name = self._language_name(response_language)
        rewrite_prompt = (
            f"Rewrite the answer below in {language_name}, preserving the same facts. "
            "Mandatory rules: "
            "1) Do not copy literal sentences from context. "
            "2) Do not use more than 6 consecutive words equal to context. "
            "3) Do not add new facts. "
            "4) Short and objective markdown response.\n\n"
            f"Original answer:\n{answer}\n\n"
            "Reference context:\n"
            f"{context_block}"
        )
        rewritten = llm.invoke(rewrite_prompt)
        return rewritten.content if isinstance(rewritten.content, str) else str(rewritten.content)

    def _rewrite_to_list(
        self,
        llm: ChatOpenAI,
        answer: str,
        query: str,
        contexts: list[str],
        requested_count: int | None,
        response_language: Literal["pt", "en"],
    ) -> str:
        context_block = "\n\n".join(contexts)
        language_name = self._language_name(response_language)
        count_instruction = (
            f"Deliver exactly {requested_count} numbered items (1., 2., 3...). "
            if requested_count
            else "Deliver an objective numbered list with the most relevant items. "
        )
        rewrite_prompt = (
            f"Restructure the answer below into a markdown list in {language_name}. "
            "Mandatory rules: "
            "1) Do not invent items. "
            "2) Use only the context. "
            "3) If there is not enough information for the requested count, "
            "explain it in one short sentence and list only supported items. "
            "4) Avoid literal copies from context.\n\n"
            f"{count_instruction}\n"
            f"Question:\n{query}\n\n"
            f"Current answer:\n{answer}\n\n"
            "Context:\n"
            f"{context_block}"
        )
        rewritten = llm.invoke(rewrite_prompt)
        return rewritten.content if isinstance(rewritten.content, str) else str(rewritten.content)

    def _fallback_answer(self, has_context: bool, response_language: Literal["pt", "en"]) -> str:
        if not has_context:
            if response_language == "pt":
                return "Nao encontrei informacao confiavel nos documentos carregados para responder."
            return "I could not find reliable information in the uploaded documents to answer."
        if response_language == "pt":
            return (
                "Nao foi possivel gerar resposta com o modelo agora. "
                "Verifique `OPENAI_API_KEY` na `.env` e tente novamente."
            )
        return (
            "I could not generate an answer with the model right now. "
            "Check `OPENAI_API_KEY` in `.env` and try again."
        )

    def _build_llm(self) -> ChatOpenAI:
        settings = get_settings()
        return ChatOpenAI(
            model=settings.openai_chat_model,
            api_key=_openai_api_key(),
            temperature=0.2,
        )

    def query(self, message: str, top_k: int = 4) -> dict[str, Any]:
        settings = get_settings()
        query = message.strip()
        if not query:
            raise HTTPException(status_code=400, detail="message cannot be empty")
        response_language = self._detect_query_language(query)
        language_name = self._language_name(response_language)
        missing_info_message = self._missing_info_message(response_language)
        is_project_query = self._is_project_query(query)
        is_list_query = self._is_list_query(query)
        requested_count = self._extract_requested_count(query)

        search_k = max(top_k * 3, top_k)
        raw_results = self._search_with_auto_reindex(query=query, k=search_k)
        if not raw_results:
            try:
                ingested = IngestionService().ingest_uploads_to_vector_db(reset_collection=False)
                if ingested.get("chunks", 0) > 0:
                    raw_results = self._search_with_auto_reindex(query=query, k=search_k)
            except Exception:
                # If bootstrap ingestion fails, keep graceful no-context fallback below.
                pass

        filtered_results: list[tuple[Any, float]] = []
        for doc, distance in raw_results:
            score = 1 / (1 + float(distance))
            if score >= settings.retrieval_min_score:
                filtered_results.append((doc, float(distance)))

        if is_project_query:
            filtered_results.sort(
                key=lambda item: (
                    0
                    if self._is_project_source(str(item[0].metadata.get("source_name", "")))
                    else 1,
                    item[1],
                )
            )
        results = filtered_results[:top_k]
        context_parts: list[str] = []
        raw_contexts: list[str] = []
        sources: list[dict[str, Any]] = []
        fixed_resume_context = self._load_fixed_resume_context()

        for idx, (doc, distance) in enumerate(results, start=1):
            score = round(1 / (1 + float(distance)), 4)
            source_name = str(doc.metadata.get("source_name", "unknown"))
            excerpt = doc.page_content[:320].strip()
            if len(doc.page_content) > 320:
                excerpt += "..."

            sources.append(
                {
                    "source_name": source_name,
                    "score": score,
                    "excerpt": excerpt,
                }
            )
            raw_contexts.append(doc.page_content)
            context_parts.append(f"[{idx}] ({source_name})\n{doc.page_content}")

        if fixed_resume_context:
            # Keep resume always available as requested, but after retrieved chunks to avoid overshadowing.
            context_parts.append(f"[CV_FIXO] ({settings.fixed_resume_filename})\n{fixed_resume_context}")
            raw_contexts.append(fixed_resume_context)
            sources.append(
                {
                    "source_name": settings.fixed_resume_filename,
                    "score": 1.0,
                    "excerpt": f"{fixed_resume_context[:320]}{'...' if len(fixed_resume_context) > 320 else ''}",
                }
            )

        if not raw_contexts:
            if response_language == "pt":
                no_context_answer = (
                    "Nao encontrei informacao confiavel o suficiente para responder com precisao. "
                    "Adicione conteudo em `rag/data/uploads/Curriculo.txt` e rode a ingestao novamente."
                )
            else:
                no_context_answer = (
                    "I could not find enough reliable information to answer precisely. "
                    "Add content to `rag/data/uploads/Curriculo.txt` and run ingestion again."
                )
            return {
                "answer": no_context_answer,
                "sources": [],
            }

        context_block = "\n\n".join(context_parts)
        prompt = (
            "Answer as a job candidate in first person, with professional and direct tone. "
            "Use ONLY facts present in retrieved context. "
            f"Response language: {language_name}. Always respond in {language_name}, even if sources contain mixed languages. "
            f"Question type: {'projects' if is_project_query else 'general/career'}. "
            f"Response format: {'markdown list' if is_list_query else 'short markdown text'}. "
            "Mandatory rules: "
            "1) Do not invent information. "
            "2) Do not guess dates, companies, or technologies. "
            "3) If something is unclear in context, reply exactly: "
            f"\"{missing_info_message}\" "
            "4) Do not copy context sentences literally; always paraphrase. "
            "5) Do not use more than 6 consecutive words equal to context. "
            "6) For project questions, prioritize project files and use resume as support only. "
            "7) For general career questions, use resume as primary base. "
            "8) Structure as an answer to a job interviewer. "
            "9) If question asks for a list, respond with numbered items. "
            f"10) If question asks for a quantity, try to deliver exactly that count: {requested_count if requested_count else 'not specified'}. "
            "11) Keep the answer short and objective in markdown.\n\n"
            f"User question:\n{query}\n\n"
            "Context:\n"
            f"{context_block}"
        )

        try:
            llm = self._build_llm()
            llm_response = llm.invoke(prompt)
            answer = (
                llm_response.content
                if isinstance(llm_response.content, str)
                else str(llm_response.content)
            )

            similarity = self._max_similarity_with_context(answer=answer, contexts=raw_contexts)
            if similarity > 0.82:
                answer = self._rewrite_to_paraphrase(
                    llm=llm,
                    answer=answer,
                    contexts=raw_contexts,
                    response_language=response_language,
                )

            if is_list_query:
                current_items = self._count_markdown_list_items(answer)
                needs_rewrite = current_items == 0
                if requested_count:
                    needs_rewrite = needs_rewrite or current_items != requested_count
                if needs_rewrite:
                    answer = self._rewrite_to_list(
                        llm=llm,
                        answer=answer,
                        query=query,
                        contexts=raw_contexts,
                        requested_count=requested_count,
                        response_language=response_language,
                    )
        except Exception:
            answer = self._fallback_answer(
                has_context=bool(sources),
                response_language=response_language,
            )

        return {"answer": answer, "sources": sources if settings.show_sources else []}
