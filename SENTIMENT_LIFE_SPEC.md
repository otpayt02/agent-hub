# Sentiment Life — Cinematic Website Specification

**Version:** 0.2 (Cinematic Narrative Layer)  
**Created:** 2026-08-19  
**Author:** Oliver Payton  
**Canonical Repo:** `github.com/otpayt02/sentiment-life`  
**Live URL:** `https://otpayt02.github.io/sentiment-life/`

---

## Purpose

Sentiment Life is a **living memory map** — a cinematic, scroll-driven narrative landscape built from the recoverable trail of ChatGPT conversations. It transforms conversation history into an interactive spatial journey through time, identity, evidence, and reflection.

**Not a dashboard. Not a SaaS template. Not a card stack.**  
A continuous cinematic memory landscape.

---

## Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Smooth/inertial movement** | Scroll-position-driven animation with velocity interpolation (0.105 easing) |
| **Boundless continuity** | Single visual canvas (`.cinema-stage`) — no hard section boundaries |
| **Sleeping-to-rising transitions** | Cards/phases emerge from depth (translateZ + rotateX + scale) as viewport approaches |
| **Negative space** | Generous breathing room; one idea per viewport |
| **Scale contrast** | Hero type up to 13rem; structural numbers 6.5rem; body text ~1rem |
| **Grid discipline** | 12-column CSS grid; strict alignment; no arbitrary spacing |
| **Cursor interactions** | Magnetic buttons, custom orbit/core cursor, hover reveal gradients |
| **Scroll storytelling** | Chapter rail, progress bar, word-by-word type unmask |
| **Performance** | Hardware-accelerated transforms only; `will-change` scoped; reduced-motion respected |
| **AI implementation rules** | No external deps; self-contained; localStorage persistence; JSON import/export |

---

## Visual Language

### Color Palette (CSS Custom Properties)
```css
:root {
  --ink:           #080808;        /* Near-black base */
  --warm:          #f0a54a;        /* Primary amber/gold */
  --cream:         #f4efe6;        /* Primary typography */
  --ghost:         rgba(244,239,230,.055);  /* Structural watermark */
  --muted:         #aaa49b;        /* Secondary text */
  --line:          rgba(255,255,255,.10);  /* Hairlines */
  --panel:         rgba(255,255,255,.032);  /* Card base */
  --panel-hover:   rgba(255,255,255,.055);  /* Hover state */
}
```

### Typography
- **Display:** Clamp 5rem → 16vw → 13rem, line-height 0.72, letter-spacing -0.085em
- **Structural numbers:** Clamp 3.2rem → 7vw → 6.5rem, weight 900
- **Body:** Inter / system UI, 1.55 line-height, cream on ink
- **Micro:** 0.67rem uppercase, 0.22em tracking (eyebrows, labels)

### Atmosphere
- Fixed radial glows (18% / 85%) at z-index -8
- Subtle 8vw grid with fade mask (z-index -7)
- Vertical "thread" line with gradient (z-index -7)
- Film grain overlay, soft-light blend, 12% opacity
- `isolation: isolate` on body for blend containment

---

## Architecture

### Single HTML File (Self-Contained)
- **index.html** — Canonical live version (626 lines, ~5.6MB with bundled audio)
- **index.pre-cinematic.html** — v0.1 backup (pre-cinematic layer)

### Section Map (in scroll order)

| ID | Chapter | Purpose | Cinematic Treatment |
|----|---------|---------|---------------------|
| `hero` | — | Identity + entry | Camera scene: title recedes, scales, blurs, orb rotates |
| `scope` | 01 | Coverage rules | Standard section with masked h2 |
| `narrative` | 02 | Life arc (5 phases) | Phase cards: lateral slide + rise from depth |
| `categories` | 03 | Recurring themes | Horizontal bar chart, magnetic cards |
| `atlas` | 04 | Chat Atlas (76 nodes) | Sticky controls, virtualized timeline |
| `communication` | 05 | AI communication fingerprint | Quote + pattern cards |
| `deductions` | 06 | Personality deductions | Confidence-labeled cards (high/medium) |
| `forecast` | 07 | Five-year scenarios | Forecast cards with accent border |
| `advice` | 08 | Recommendations | Numbered lessons + executable prompt template |
| `mementos` | 09 | Vault + Deduction Ledger | Dual ledgers, forms, JSON import/export |

---

## Cinematic Layer (v0.2) — Technical Spec

### Continuous Visual Field (`.cinema-stage`)
```css
.cinema-stage { position: fixed; inset: -12vh -8vw; z-index: -7; }
.cinema-glow.a { width: 52vw; height: 52vw; left: -12vw; top: 4vh; }
.cinema-glow.b { width: 44vw; height: 44vw; right: -10vw; top: 44vh; }
.cinema-grid   { background-size: 8vw 8vw; mask: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent); }
.cinema-thread { width: 1px; height: 160vh; left: 50%; }
.film-grain    { background-size: 6px 6px; mix-blend-mode: soft-light; opacity: .12; }
```

### Scroll-Driven Animation Loop (requestAnimationFrame)
```js
// Inertial camera
visualY += (raw - visualY) * 0.105;
velocity += ((raw - lastY) - velocity) * 0.18;

// Hero camera move (lines 589-595)
heroShell.style.transform = `translate3d(0, ${-hp*13}vh, 0) scale(${1-hp*.12})`;
heroShell.style.opacity = 1 - hp * 0.78;
heroShell.style.filter = `blur(${hp*3.5}px)`;
heroOrb.style.transform = `translate3d(${hp*10}vw, ${hp*12}vh, 0) scale(${1+hp*.22}) rotate(${hp*18}deg)`;

// Card sleeping-to-rising (lines 597-603)
card.style.transform = `perspective(1200px) translate3d(0, ${sleeping*66}px, 0) rotateX(${sleeping*12}deg) rotateZ(${twist}deg) scale(${.94+p*.06})`;
card.style.opacity = 0.3 + p * 0.7;

// Phase lateral rise (lines 604-607)
row.style.transform = `translate3d(${(1-p)*(i%2?28:-28)}px, ${(1-p)*34}px, 0)`;
row.style.opacity = 0.25 + p * 0.75;
```

### Masked Display Type (Word-by-Word Reveal)
```js
// Split h2 into .word > .word-inner spans
// .word-inner { transform: translate3d(0, 112%, 0) rotate(2deg); transition: transform .9s cubic-bezier(.16,1,.3,1); }
// .section.type-live .word-inner { transform: translate3d(0,0,0) rotate(0); }
```

### Magnetic Cursor (Pointer-fine only)
```js
// Custom cursor orbit (34px) + core (4px), mix-blend-mode: difference
// .btn/.event/.card get data-magnetic="1"
// pointermove: transform = translate3d(x*.10, y*.16) on magnetic targets
// hover: card glow follows cursor (--px, --py CSS vars)
```

### Chapter Rail Navigation
- Fixed right rail, 9 dots (one per section)
- Active dot expands (5px→48px), shows label on hover
- Click → smooth scroll to section

---

## Data Layer (Preserved from ChatGPT)

### Conversation Nodes (76 entries)
```js
const chats = [
  { date: '2024-02-07', title: '...', category: 'Vehicles & Repair', summary: '...' },
  // ... 75 more spanning 2024-02 → 2026-08
];
```
Categories: `Vehicles & Repair`, `Money & Admin`, `Karen Community & Language`, `AI & Software`, `Business & Work`, `School & Career`, `Life & Health`, `Content & Media`, `Sports & Community`, `Legal & Admin`, `Music & Creative`, `Reflection & Planning`, `Engineering & Making`, `Money & Markets`, `Computers & Setup`, `Web & Design`

### Mementos (Evidence) — Schema
```js
{
  id: 'mem-<timestamp>',
  title: string,
  type: 'file'|'artifact'|'photo'|'link'|'note'|'chat-export',
  date: 'YYYY-MM-DD',
  source: string,          // path / URL / connector reference
  summary: string,         // why this matters
  tags: string[]
}
```
**Seed mementos:** 4 (resume, Karen music, codex prompt, Malibu repair)

### Deductions (Interpretations) — Schema
```js
{
  id: 'ded-<timestamp>',
  agent: string,           // Agent name / model
  conclusion: string,
  confidence: 'low'|'medium'|'high',
  reasoning: string,       // Short explanation; do not hide evidence
  evidence: string[],      // Evidence IDs (memento IDs)
  contradicts?: string     // Optional: deduction ID this contradicts
}
```
**Seed deductions:** 3 (AI as operating layer, Karen+AI differentiator, closure discipline)

### Memory Bundle Export (v0.1 schema)
```js
{
  schema: 'sentiment-life/v0.1',
  exportedAt: 'ISO8601',
  subject: { name: 'Oliver Payton' },
  coverage: { note: 'Seeded from recoverable ChatGPT context...' },
  chats: [...],
  mementos: [...],
  deductions: [...]
}
```

---

## Features to Preserve (All Functional)

### Chat Atlas (`#atlas`)
- Search input (debounced, matches title/category/summary)
- Category filter select (all 16 categories)
- Virtualized timeline (max-height 68vh, overscroll contain)
- Reverse-chronological sort

### Read Aloud System
- **Bundled MP3 audio** (base64 → blob URLs) for offline/narrated sections
- **Read Page** → plays full page (all section audio sequentially)
- **Listen to Section** → per-section button injected into `.section-head`
- **Selection reading** → SpeechSynthesis fallback for highlighted text
- Controls: Play/Pause, Stop, Speed (0.75× → 2×), Close dock
- Progress bar (dock + per-section outline)
- Persists speed preference in localStorage
- iOS / in-app browser compatible (audio-first, not TTS-first)

### Memento Vault (`#mementos`)
- Add memento form (title, type, date, source, summary, tags)
- Add deduction form (agent, conclusion, confidence, reasoning, evidence IDs, contradicts)
- Dual ledger display (localStorage + seed data)
- Import JSON memory bundle (merges, deduplicates by ID)
- Export full bundle (download .json)
- Copy agent context (clipboard)
- Reset local additions (keeps seed)

### Accessibility
- `prefers-reduced-motion`: disables all animation, transitions, scroll-behavior
- `pointer:coarse`: hides custom cursor, magnetic effects
- Semantic HTML, ARIA labels, focus-visible states
- Scroll-behavior: auto on reduced motion

---

## Agent-Extensibility Protocol

Future agents can extend Sentiment Life by:

1. **Reading** `index.html` → parsing `chats[]`, `seedMementos[]`, `seedDeductions[]`
2. **Importing** a memory bundle JSON → merging into localStorage
3. **Adding mementos** via the form or direct localStorage write
4. **Adding deductions** with `evidence[]` pointing to memento IDs
5. **Contradicting** prior deductions via `contradicts` field
6. **Exporting** updated bundle for next agent

**Strict separation:** Mementos = immutable evidence. Deductions = mutable interpretations.

---

## Migration Notes (From ChatGPT Collaboration)

This specification was reverse-engineered from the collaborative ChatGPT session:
- Original prompt: "Build Sentiment Life as one continuous cinematic memory landscape"
- v0.1: Functional memory website (Chat Atlas, narrative, mementos, Read Aloud)
- v0.2: Cinematic Narrative Layer added (inertial scroll, masked type, magnetic cursor, continuous field)
- v0.2 enhancements: Bundled audio, timeline visual refinement, Read Aloud fixes

The attached `index.html` is the **complete v0.2 artifact** — all CSS, JS, data, and audio self-contained.

---

## Future Work (Next Level)

Per the ChatGPT conversation, the next evolutionary step:

> "The next level for this would be making the **timeline itself an actual spatial journey through your years** — 2024 → 2025 → 2026 — where individual mementos physically enter the scene and old periods disappear into depth rather than presenting the life history primarily as text."

This SPEC.md serves as the contract for that future work.

---

## License / Usage

Personal memory artifact. Not for commercial distribution.  
Agent-readable. Human-experienceable. Future-proof.