---
version: 1
slug: "web-src-app-tsx"
primary_target: "web/src/App.tsx"
related_targets: []
---

## Scope

Landing route `/` (hero, experience, projects, close). Visitor mode: Persuade. Project case-study routes stay in the previous world for now (follow-up).

## Audience and action

Recruiter first, engineer second. Primary action: ask the RAG chatbot a question. Proof: the grounded answer itself, the real roles and dates, two real case studies, and the fact that the site runs on the homelab. Constraints: EN/PT parity, grounded bot, static Vite build.

## Direction contract

THESIS: The career set as a concrete poem on a strict square grid; the visitor's question is the largest type on the page and recomposes it. Refuses the category default of a dark neon dev portfolio with a chat card beside a hero.

OWN-WORLD: Paper white #f4f4f0, ink #111111, cobalt #1d3bd1, cadmium yellow #f2c200. Flat silkscreen planes, hard edges, zero radius, no shadow, blur, glow, or gradient. Jost (Futura lineage) lowercase for display and nav, sentence case for facts. Yellow square = lit / active / current everywhere. Unasked questions are outlined ghost words; lit ones fill yellow.

STORY: In one screen the recruiter reads who (name, role, employer, school, photo), sees the huge question field, and asks; the answer stays in the cobalt plane. Scrolling, the year ruler lays out roles as flat bars in time, then projects as full-width planes, then a close with contact and the fact that this site runs on the homelab.

FIRST VIEWPORT: Desktop: left 5/12 on paper: square photo, name at ~4.5rem lowercase ink, role/employer/school literal, summary, socials. Right 7/12: full-height cobalt plane; question textarea at ~5.5rem white (bigger than the name) with yellow placeholder, yellow send square, ghost suggestion words, grounding note. A yellow square straddles the seam. Mobile: identity compact, cobalt plane below, field visible above the fold.

FORM: Concreto (Brazilian concrete poetry + Ruptura/Wollner identity programs), position 5 of 7 on the grounded list, seed key 49789c11. No answer-driven highlighting elsewhere on the page (removed at the user's request, 2026-09-27); motion moves only in whole grid steps (stepped easing), reduced-motion respected.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Bring `/project/<slug>` pages into the Concreto world.
