import os
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

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

    def _rewrite_to_paraphrase(self, llm: ChatOpenAI, answer: str, contexts: list[str]) -> str:
        rewrite_prompt = (
            "Reescreva a resposta abaixo em portugues, mantendo os mesmos fatos. "
            "Regras obrigatorias: "
            "1) Nao copiar frases literais do contexto. "
            "2) Nao usar mais de 6 palavras consecutivas iguais ao contexto. "
            "3) Nao adicionar fatos novos. "
            "4) Resposta curta e objetiva em markdown.\n\n"
            f"Resposta original:\n{answer}\n\n"
            "Contexto de referencia:\n"
            f"{'\n\n'.join(contexts)}"
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
    ) -> str:
        count_instruction = (
            f"Entregue exatamente {requested_count} itens numerados (1., 2., 3...). "
            if requested_count
            else "Entregue uma lista numerada objetiva com os principais itens. "
        )
        rewrite_prompt = (
            "Reestruture a resposta abaixo para formato de lista em markdown. "
            "Regras obrigatorias: "
            "1) Nao invente itens. "
            "2) Baseie-se somente no contexto. "
            "3) Em caso de informacao insuficiente para a quantidade pedida, "
            "explique em uma frase curta e liste apenas os itens suportados. "
            "4) Evite copia literal do contexto.\n\n"
            f"{count_instruction}\n"
            f"Pergunta:\n{query}\n\n"
            f"Resposta atual:\n{answer}\n\n"
            "Contexto:\n"
            f"{'\n\n'.join(contexts)}"
        )
        rewritten = llm.invoke(rewrite_prompt)
        return rewritten.content if isinstance(rewritten.content, str) else str(rewritten.content)

    def _fallback_answer(self, has_context: bool) -> str:
        if not has_context:
            return "Nao encontrei informacao confiavel nos documentos carregados para responder."
        return (
            "Nao foi possivel gerar resposta com o modelo agora. "
            "Verifique `OPENAI_API_KEY` na `.env` e tente novamente."
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
            return {
                "answer": (
                    "Nao encontrei informacao confiavel o suficiente para responder com precisao. "
                    "Adicione conteudo em `rag/data/uploads/Curriculo.txt` e rode a ingestao novamente."
                ),
                "sources": [],
            }

        prompt = (
            "Voce deve responder como candidato em uma entrevista de emprego, sempre em primeira pessoa "
            "(eu/meu/minha), com tom profissional e direto. "
            "Use APENAS os fatos presentes no contexto recuperado. "
            f"Tipo da pergunta: {'projetos' if is_project_query else 'geral/carreira'}. "
            f"Formato de resposta: {'lista em markdown' if is_list_query else 'texto curto em markdown'}. "
            "Regras obrigatorias: "
            "1) Nao invente informacoes. "
            "2) Nao chute datas, empresas ou tecnologias. "
            "3) Se algo nao estiver claro no contexto, responda exatamente: "
            "\"Nao encontrei essa informacao nos documentos carregados.\" "
            "4) Nao copie frases do contexto literalmente; sempre parafraseie. "
            "5) Nao usar mais de 6 palavras consecutivas iguais ao contexto. "
            "6) Em perguntas sobre projetos, priorize os arquivos de projetos e use o curriculo apenas como apoio. "
            "7) Em perguntas de carreira geral, use o curriculo como base principal. "
            "8) Estruture como resposta para entrevistador de emprego. "
            "9) Se a pergunta pedir lista, responda em itens numerados. "
            f"10) Se a pergunta pedir uma quantidade, tente entregar exatamente essa quantidade: {requested_count if requested_count else 'nao especificada'}. "
            "11) Resposta curta e objetiva em markdown.\n\n"
            f"Pergunta do usuario:\n{query}\n\n"
            "Contexto:\n"
            f"{'\n\n'.join(context_parts)}"
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
                answer = self._rewrite_to_paraphrase(llm=llm, answer=answer, contexts=raw_contexts)

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
                    )
        except Exception:
            answer = self._fallback_answer(has_context=bool(sources))

        return {"answer": answer, "sources": sources if settings.show_sources else []}
