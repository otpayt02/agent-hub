# Oliver Payton — Agent Context Hub

**Last Updated:** 2026-09-04  
**Purpose:** Central reference for any AI agent working with/for Oliver Payton.  
**Canonical Location:** `https://github.com/otpayt02/agent-hub` (this repo)  
**Local Path:** `~/agent-hub/` (symlinked to this repo)

---

## Quick Identity

| Field | Value |
|-------|-------|
| **Name** | Oliver Payton |
| **GitHub** | `@otpayt02` |
| **Primary Focus** | AI implementation, workflow automation, Karen language/community tech, vehicle diagnostics, creative systems |
| **Location** | Louisville, KY / Thai-Burma border (seasonal) |
| **Contact** | GitHub issues / PRs preferred |

---

## Core Projects (Active)

### 1. Sentiment Life — Cinematic Memory Website
- **Repo:** `github.com/otpayt02/sentiment-life`
- **Spec:** `SPEC.md` (this repo, copied)
- **Live:** `https://otpayt02.github.io/sentiment-life/`
- **Stack:** Single HTML file, vanilla CSS/JS, self-contained
- **Data:** 76 ChatGPT conversations (2024-2026), mementos, deductions
- **Key Feature:** Cinematic Narrative Layer v0.2 (inertial scroll, masked type, magnetic cursor)
- **Agent Protocol:** Read SPEC.md → parse `chats[]`/`seedMementos[]`/`seedDeductions[]` → add via localStorage/forms → export bundle

### 2. Karen Organization of America (KOA) — Nonprofit Website
- **Repo:** `github.com/otpayt02/koa-website` (or similar)
- **Stack:** Framer Motion / cinematic scroll
- **Features:** Bilingual dictionary, AI Karen agent, donation flow, community review loops
- **Status:** Iterating on cinematic landing + dictionary + agent data loop

### 3. Karen Music Chord Chart Web App
- **Artifact:** `mem-karen-music` (in Sentiment Life)
- **Stack:** SQLite/Flask or static JS, Karen keyboard, transposition, OCR upload
- **Status:** Functional prototype, needs deployment

### 4. S'gaw Karen OCR Pipeline
- **Artifact:** `mem-codex-import` (in Sentiment Life)
- **Stack:** Tesseract + Windows, annotation tooling, training automation
- **Status:** Diacritic recognition debugged; correction UI specified

### 5. AI News Scraper / Registry-Driven Collector
- **Artifacts:** Multiple chats (2026-07 to 2026-08)
- **Stack:** Python, Playwright, RSS, SQLite, dashboard, NVIDIA API integration
- **Status:** Registry-driven collector scoped; "what do I do tonight" plan exists

### 6. Prompt Refinery / Cognitive Load Decomposer
- **Artifacts:** Chats 2026-07-14, 2026-07-23
- **Stack:** Observability dashboard, 9-dimension cognitive load, spec-driven prompts
- **Status:** Architecture designed; implementation pending

---

## Recurring Themes (Agent Should Know)

1. **AI as Operating Layer** — Not Q&A; live co-pilot for car repair, Windows installs, admin, coding
2. **System Conversion** — One-off problems → reusable workflows, dashboards, agents, datasets
3. **Karen Community + AI** — Strongest differentiator: language preservation + implementation skill
4. **Breadth vs. Closure** — Many parallel prototypes; completion discipline is the lever
5. **Evidence > Inference** — Mementos = evidence; Deductions = labeled interpretations
6. **Execution Mode** — Prefers structured prompts: MODE/GOAL/STATE/CONSTRAINTS/DONE/EVIDENCE/OUTPUT/CHECKPOINT

---

## Communication Style (For Agents)

- **Thinks out loud** — fragments, corrections, "no I mean..." are process, not noise
- **High iteration, low ceremony** — Fast corrections > perfect first prompt
- **Delegates execution, retains authorship** — Specifies architecture, UI, filenames, acceptance criteria
- **Voice-first capable** — Can speak messy; expects normalization to structured prompt
- **Demands evidence when stakes rise** — School, legal, medical, money, vehicle safety

---

## Standard Prompt Template (Use This)

```
MODE: Execute
GOAL: [one outcome]
CURRENT STATE: [what is already true]
CONSTRAINTS: [money / time / tools / platform]
DEFINITION OF DONE: [observable result]
DO NOT EXPAND SCOPE: Put new ideas in "Later."
EVIDENCE: Distinguish facts, assumptions, and guesses.
OUTPUT: Give me the next 3 actions first, then detail.
CHECKPOINT: End with what changed and what remains.
```

For voice: speak freely, end with → *"Normalize what I just said into this structure before acting."*

---

## Tech Stack Preferences

| Layer | Preference |
|-------|------------|
| **Language** | Python (scripts, scrapers, backends), TypeScript/JS (web, dashboards) |
| **AI/ML** | Local first (llama.cpp, GGUF), free cloud GPUs (NVIDIA API, Colab), uncensored models |
| **Web** | Vanilla JS + CSS (cinematic, no framework bloat), Framer Motion for KOA |
| **Data** | SQLite (local), JSON (bundles), CSV/Parquet (exports) |
| **Automation** | Playwright, requests/BeautifulSoup, cron, GitHub Actions |
| **Deployment** | GitHub Pages (static), Railway/Render (services), self-hosted where needed |
| **Version Control** | Git + GitHub, conventional commits, PRs for everything |

---

## Key Files Agents Should Read

| File | Location | Purpose |
|------|----------|---------|
| `SPEC.md` | `sentiment-life/SPEC.md` | Cinematic website contract |
| `index.html` | `sentiment-life/index.html` | Live artifact + data |
| `AGENTS.md` | This file | You are here |
| `AGENT_CONTEXT.md` | `agent-skill-context/AGENT_CONTEXT.md` | Master cross-agent skill routing and sync boundaries |
| `HANDOFF_PROPS.md` | `agent-skill-context/HANDOFF_PROPS.md` | Harness props and prompt contract for skill sync |
| `SKILLS_INDEX.md` | `agent-skill-context/SKILLS_INDEX.md` | Generated index of local Codex, Hermes, Qoder, and project agent skills |
| `MEMORY_BUNDLE.json` | `sentiment-life/` (exported) | Full portable state |
| `CLAUDE.md` / `AGENTS.md` | Repo roots | Per-project instructions |

---

## How Agents Extend Sentiment Life

1. **Clone** `github.com/otpayt02/sentiment-life`
2. **Read** `SPEC.md` + `index.html` (parse `chats[]`, `seedMementos[]`, `seedDeductions[]`)
3. **Open** `index.html` in browser → use "Read Aloud" to hear full context
4. **Add mementos** via form or `localStorage.setItem('sentimentLifeMementos', JSON.stringify([...]))`
5. **Add deductions** with `evidence[]` pointing to memento IDs, `contradicts` for disagreements
6. **Export** bundle via "Export memory bundle" button or `copyContext`
7. **Commit** updated `MEMORY_BUNDLE.json` to repo (or pass to next agent)

---

## Red Lines (Do Not Cross)

- ❌ Don't rewrite history — add deductions that *contradict* instead
- ❌ Don't invent conversations — mark as coverage gaps
- ❌ Don't remove cinematic layer for "simpler" dashboard layout
- ❌ Don't add external dependencies (CDN, frameworks, tracking)
- ❌ Don't assume completion — verify `DEFINITION OF DONE` explicitly

---

## GitHub Repos to Watch / Contribute

```
otpayt02/
├── sentiment-life/          # Canonical memory website (THIS SPEC)
├── agent-hub/               # This file lives here
├── koa-website/             # Nonprofit cinematic site
├── karen-music/             # Chord chart app
├── sgaw-ocr/                # OCR pipeline
├── ai-news-collector/       # Registry-driven scraper
├── prompt-refinery/         # Cognitive load + spec system
└── cinematic-spec-template/ # Reusable SPEC.md template (below)
```

---

## Cinematic Website SPEC Template (Reusable)

**Location:** `cinematic-spec-template/SPEC_TEMPLATE.md`  
**Use when:** Building any new cinematic scroll-driven narrative site.

```markdown
# [Project Name] — Cinematic Website Specification

## Purpose
[One sentence: what is the *experience*, not the features]

## Core Design Principles
[Copy from Sentiment Life SPEC.md Table 1, adapt]

## Visual Language
[Colors, typography, atmosphere — copy/adapt]

## Architecture
[Single HTML? Multi-page? Framework?]

## Section Map
[Scroll order, cinematic treatment per section]

## Cinematic Layer Technical Spec
[Copy relevant sections from Sentiment Life SPEC.md]

## Data Layer
[Schema definitions, seed data]

## Features to Preserve
[Checklist]

## Agent-Extensibility Protocol
[How future agents extend this specific project]

## Migration Notes
[History, version lineage]

## Future Work
[Next level vision]
```

---

## Changelog

| Date | Change | Agent/Session |
|------|--------|---------------|
| 2026-08-19 | Created agent hub, SPEC.md, pushed sentiment-life repo | Hermes (this session) |

---

*This file is the entry point. Any agent starting a session for Oliver should read this first, then navigate to project-specific specs.*
