import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from rag.app.core.settings import RAGSettings
from rag.app.main import app
from rag.app.services.query_service import QueryService


class ResumeContextTests(unittest.TestCase):
    def setUp(self):
        self.settings = RAGSettings(_env_file=None, fixed_resume_max_chars=12000)
        self.settings_patch = patch(
            "rag.app.services.query_service.get_settings", return_value=self.settings
        )
        self.settings_patch.start()
        self.addCleanup(self.settings_patch.stop)
        self.service = QueryService()

    def test_complete_resume_in_both_languages(self):
        for language, current_role, old_role, graduation in (
            ("en", "Software Engineer I", "Jul 2025 — Jun 2026", "Expected Jun 2027"),
            ("pt", "Engenheiro de Software I", "Jul 2025 — Jun 2026", "Conclusão prevista: jun 2027"),
        ):
            with self.subTest(language=language):
                context = self.service._load_fixed_resume_context(language)
                self.assertIn(current_role, context)
                self.assertIn(old_role, context)
                self.assertIn(graduation, context)
                self.assertIn("Jan 2024", context)
                self.assertIn("Brazil AI Lead", context)
                self.assertIn("MCP", context)

    def test_selected_language_controls_prompt_and_resume(self):
        doc = SimpleNamespace(page_content="Project context", metadata={"source_name": "Homelab.txt"})
        for language, question, expected_language, filename in (
            ("pt", "Tell me about your experience", "Portuguese", "Curriculo.txt"),
            ("en", "Qual sua experiência?", "English", "Resume.txt"),
            (None, "Qual sua experiência?", "Portuguese", "Curriculo.txt"),
            (None, "What is your experience?", "English", "Resume.txt"),
        ):
            with self.subTest(language=language, question=question):
                with patch.object(self.service, "_search_with_auto_reindex", return_value=[(doc, 0.1)]), patch.object(self.service, "_build_llm") as build_llm:
                    build_llm.return_value.invoke.return_value = SimpleNamespace(content="Test answer")
                    self.service.query(question, language=language)
                    prompt = build_llm.return_value.invoke.call_args.args[0]
                    self.assertIn(f"Response language: {expected_language}", prompt)
                    self.assertIn(f"[CV_FIXO] ({filename})", prompt)
                    self.assertIn("Brazil AI Lead", prompt)

    def test_api_forwards_language_and_accepts_legacy_requests(self):
        client = TestClient(app)
        with patch("rag.app.api.rag.query_service.query", return_value={"answer": "ok", "sources": []}) as query:
            for language in ("pt", "en", None):
                payload = {"message": "Career?"}
                if language:
                    payload["language"] = language
                response = client.post("/rag/chat", json=payload)
                self.assertEqual(response.status_code, 200)
                query.assert_called_with(message="Career?", top_k=4, language=language)
            self.assertEqual(client.post("/rag/chat", json={"message": "Career?", "language": "invalid"}).status_code, 422)


if __name__ == "__main__":
    unittest.main()
