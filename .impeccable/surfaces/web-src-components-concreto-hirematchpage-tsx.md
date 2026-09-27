---
version: 1
slug: "web-src-components-concreto-hirematchpage-tsx"
primary_target: "web/src/components/concreto/HireMatchPage.tsx"
related_targets: []
---

## Scope

Route `/project/hirematch-ai` plus the Online/Offline status badge on the landing project planes. Visitor mode: Read. World: Concreto (DESIGN.md). Extends the case-study pattern established by the homelab page (header + fact row, sticky question index, question sections); no new structure roll.

## Audience and job

Engineers and recruiters checking ML depth. Job: understand which ML technique powers each feature and exactly how the resume score is computed. Source of truth: github.com/Netreck/HireMatch-AI (src/api/services/*.py, support/*.json, data/, notebook). User-confirmed facts: project is offline/archived; the job dataset is no longer refreshed; only the custom-job flow works; runs 100% on GCP Cloud Run, scaled to zero until a request arrives; built for the NLP course at UFABC; no future plans. Do not name teammates. Link to the live app with a cold-start note.

## Direction contract

THESIS: The score is the product: the page opens on the exact resume score formula, drawn as 10×10 square grids, then answers one question per feature with the ML technique behind it. Refuses the category default of screenshots plus a list of "AI-powered" claims.

OWN-WORLD: Concreto: paper/ink/cobalt/yellow flat planes, zero radius, 2px rules, Jost sentence case, yellow square = current/active (Online). Score grids: 100 squares per score, segments in cobalt, ink and cobalt-tint. Pipelines as numbered square steps joined by cobalt bars. Offline status is an outlined square; an archived notice sits on an ink plane.

STORY: The visitor learns what HireMatch did, that it is archived with one working flow, how a resume score is computed in each mode, which model/technique powers matching, custom scoring, feedback and resume adaptation, and where it runs. Leaves with the repo and a working link.

FIRST VIEWPORT: Header: back link, title, one-line thesis, fact row (status Offline, runtime Cloud Run scale-to-zero, dataset 347 jobs frozen, course), repo + app buttons. Below: ink archived notice band. Then index (3/12) + Question 1 "How is a resume scored?" with both score grids.

FORM: Operator questions (case-study pattern from the homelab surface, seed 99ad74a5), extended; world seed 49789c11.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- RAG docs Hirematch.txt / Hirematch_EN.txt may describe the old state.
