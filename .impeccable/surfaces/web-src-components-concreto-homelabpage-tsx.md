---
version: 1
slug: "web-src-components-concreto-homelabpage-tsx"
primary_target: "web/src/components/concreto/HomelabPage.tsx"
related_targets: []
---

## Scope

Route `/project/homelab-pessoal` only (HireMatch keeps the old template for now). Visitor mode: Read. World: Concreto (DESIGN.md), unchanged.

## Audience and job

Engineers and tech leads first here, recruiters skimming. Job: understand how the homelab is actually built (segmentation, ingress, admin path, observability, limits) from a diagram and precise facts. Source of truth: github.com/Netreck/myHomeLab README + homelab_flow_PT_10-09-2026.drawio (snapshot 17/09/2026). Constraints: EN/PT parity; no public VPS IP; CT113 is in VPNADMIN at 10.10.50.1 (user-confirmed); no outdated screenshots (old Proxmox list, Grafana "No data").

## Direction contract

THESIS: A runbook, not a brochure: the page is organized as the questions an operator would ask, and one architecture diagram, drawn in SVG from data, lights up the answer to each. Refuses the category default of a hero, a screenshot of a diagram, and a card grid of "tech used".

OWN-WORLD: Concreto: paper/ink/cobalt/yellow flat planes, zero radius, 2px rules, Jost sentence case, yellow square = lit. Zones are flat planes on the diagram (DMZ cobalt, EDGE cobalt-tint, MGMT ink, SERVERS and VPNADMIN outlined paper), pfSense is the ink spine, the active path is yellow over an ink casing with numbered yellow hop squares that match the numbered hop lists.

STORY: The visitor reads what the lab is (host, zones, workloads) in one header, picks or scrolls the questions: how a request gets in, how it is administered, what is isolated from what, how health is watched, what it runs on, what breaks and what is next. Leaves able to redraw the architecture and link to the repo.

FIRST VIEWPORT: Header band: title at display size, one-line thesis, fact row (Proxmox host, pfSense VM107, 5 zones, 1 VM + 9 LXC, snapshot date), GitHub link. Below: left 3/12 sticky question index (active question lit yellow); right 9/12 starts Question 1 with the full diagram, public path lit hop by hop.

FORM: Operator questions (runbook), position 6 of 7 on the grounded structure list, surface seed key 99ad74a5 (world seed 49789c11). Signature: the same data-drawn diagram reappears per question in a different light state (public path, admin path, zones); the index tracks scroll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- HireMatch case study still on the old template.
- RAG docs Homelab.txt / Homelab_EN.txt describe the old architecture.
