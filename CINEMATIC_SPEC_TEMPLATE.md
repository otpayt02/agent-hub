# [PROJECT NAME] — Cinematic Website Specification

**Version:** 0.1  
**Created:** [DATE]  
**Author:** [AUTHOR]  
**Canonical Repo:** `github.com/[USER]/[REPO]`  
**Live URL:** `[URL]`

---

## Purpose

[One sentence: what is the *experience*, not the features.  
Example: "A cinematic scroll-driven journey through [subject]'s [domain], where each scroll moment reveals a memory, decision, or artifact in spatial continuity rather than as a stack of cards."]

---

## Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Smooth/inertial movement** | Scroll-position-driven animation with velocity interpolation (easing ~0.1) |
| **Boundless continuity** | Single visual canvas — no hard section boundaries; background persists |
| **Sleeping-to-rising transitions** | Elements emerge from depth (translateZ + rotateX + scale) as viewport approaches |
| **Negative space** | Generous breathing room; one idea per viewport |
| **Scale contrast** | Hero type clamp(Xrem, Yvw, Zrem); structural numbers large; body text readable |
| **Grid discipline** | N-column CSS grid; strict alignment; no arbitrary spacing |
| **Cursor interactions** | Magnetic targets, custom cursor, hover reveal — pointer-fine only |
| **Scroll storytelling** | Chapter rail, progress bar, masked type reveal, spatial navigation |
| **Performance** | Hardware-accelerated transforms only; `will-change` scoped; reduced-motion respected |
| **AI implementation rules** | Self-contained; localStorage/JSON persistence; no external deps |

---

## Visual Language

### Color Palette (CSS Custom Properties)
```css
:root {
  --ink:           #[HEX];        /* Near-black base */
  --warm:          #[HEX];        /* Primary accent */
  --cream:         #[HEX];        /* Primary typography */
  --ghost:         rgba([RGB], .055);  /* Structural watermark */
  --muted:         #[HEX];        /* Secondary text */
  --line:          rgba(255,255,255,.10);  /* Hairlines */
  --panel:         rgba(255,255,255,.032);  /* Card base */
  --panel-hover:   rgba(255,255,255,.055);  /* Hover state */
}
```

### Typography
- **Display:** `font-size: clamp([MIN]rem, [VW]vw, [MAX]rem); line-height: [0.7-0.85]; letter-spacing: -[0.07-0.09]em;`
- **Structural numbers:** `font-size: clamp([MIN]rem, [VW]vw, [MAX]rem); font-weight: 900;`
- **Body:** System UI stack, line-height ~1.55, cream on ink
- **Micro:** 0.67rem uppercase, 0.22em tracking (eyebrows, labels)

### Atmosphere (Adapt/Select)
- [ ] Fixed radial glows at z-index -8
- [ ] Subtle grid with fade mask at z-index -7
- [ ] Vertical/horizontal thread lines with gradients
- [ ] Film grain overlay, soft-light blend, ~12% opacity
- [ ] `isolation: isolate` on body for blend containment
- [ ] Parallax background layers at different scroll rates
- [ ] Other: _______________

---

## Architecture

### Delivery Model
- [ ] Single self-contained HTML file (recommended for cinematic sites)
- [ ] Multi-page with shared cinematic layout
- [ ] Framework (specify): _______________

### Section Map (in scroll order)

| ID | Chapter | Purpose | Cinematic Treatment |
|----|---------|---------|---------------------|
| `hero` | — | Identity + entry | [Camera move, scale, blur, rotation, absorption] |
| `[section-1]` | 01 | [Purpose] | [Treatment] |
| `[section-2]` | 02 | [Purpose] | [Treatment] |
| `[section-3]` | 03 | [Purpose] | [Treatment] |
| ... | ... | ... | ... |

---

## Cinematic Layer Technical Spec

### Continuous Visual Field
```css
.cinema-stage { position: fixed; inset: [VH] [VW]; z-index: -7; }
.cinema-glow.a { width: [VW]; height: [VW]; left: [VW]; top: [VH]; background: radial-gradient(circle, rgba([WARM], .24), transparent 67%); }
.cinema-glow.b { width: [VW]; height: [VW]; right: [VW]; top: [VH]; background: radial-gradient(circle, rgba([WARM2], .19), transparent 68%); }
.cinema-grid   { background-size: [VW] [VW]; mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent); }
.cinema-thread { width: 1px; height: [VH]; left: 50%; background: linear-gradient(transparent, rgba([WARM], .32) 25%, rgba(255,255,255,.08) 74%, transparent); }
.film-grain    { background-size: 6px 6px; mix-blend-mode: soft-light; opacity: .12; }
```

### Scroll-Driven Animation Loop (requestAnimationFrame)
```js
// Inertial camera
visualY += (raw - visualY) * [EASING ~0.105];
velocity += ((raw - lastY) - velocity) * [VELOCITY_EASING ~0.18];

// Hero camera move (adapt values)
heroShell.style.transform = `translate3d(0, ${-hp*[VH]}vh, 0) scale(${1-hp*[SCALE]})`;
heroShell.style.opacity = `${1-hp*[OPACITY]}`;
heroShell.style.filter = `blur(${hp*[BLUR]}px)`;
heroOrb.style.transform = `translate3d(${hp*[VW]}vw, ${hp*[VH]}vh, 0) scale(${1+hp*[SCALE]}) rotate(${hp*[DEG]}deg)`;

// Card/element sleeping-to-rising (adapt per element type)
element.style.transform = `perspective(1200px) translate3d(0, ${sleeping*[PX]}px, 0) rotateX(${sleeping*[DEG]}deg) rotateZ(${twist}deg) scale(${.94+p*[SCALE]})`;
element.style.opacity = `${[BASE]+p*[RANGE]}`;

// Chapter/section lateral rise
row.style.transform = `translate3d(${(1-p)*([POS]?[PX]:-[PX])}px, ${(1-p)*[PX]}px, 0)`;
row.style.opacity = `${[BASE]+p*[RANGE]}`;
```

### Masked Display Type (Word-by-Word Reveal)
```js
// Split heading into .word > .word-inner spans
// .word-inner { transform: translate3d(0, 112%, 0) rotate(2deg); transition: transform .9s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--wi)*70ms); }
// .section.type-live .word-inner { transform: translate3d(0,0,0) rotate(0); }
```

### Magnetic Cursor (Pointer-fine only)
```js
// Custom cursor orbit ([PX]px) + core ([PX]px), mix-blend-mode: difference
// .btn/.event/.card get data-magnetic="1"
// pointermove: transform = translate3d(x*.10, y*.16) on magnetic targets
// hover: element glow follows cursor (--px, --py CSS vars for radial gradient)
```

### Chapter Rail Navigation
- Fixed [right/left] rail, [N] dots (one per section)
- Active dot expands ([PX]→[PX]px), shows label on hover
- Click → smooth scroll to section (respect reduced-motion)

---

## Data Layer

### Primary Data Structures (Define Schemas)

```js
// Example: Conversation nodes
const chats = [
  { date: 'YYYY-MM-DD', title: '...', category: '...', summary: '...' },
  // ...
];

// Example: Mementos (Evidence)
const seedMementos = [
  { id: 'mem-...', title: '...', type: 'file|artifact|photo|link|note|chat-export', date: 'YYYY-MM-DD', source: '...', summary: '...', tags: [...] },
];

// Example: Deductions (Interpretations)
const seedDeductions = [
  { id: 'ded-...', agent: '...', conclusion: '...', confidence: 'low|medium|high', reasoning: '...', evidence: ['mem-...'], contradicts: 'ded-...' },
];
```

### Export Schema (Portable Bundle)
```js
{
  schema: '[project]/v[VERSION]',
  exportedAt: 'ISO8601',
  subject: { name: '[NAME]' },
  coverage: { note: '...' },
  chats: [...],
  mementos: [...],
  deductions: [...]
}
```

---

## Features to Preserve (Checklist)

- [ ] Hero with cinematic camera behavior
- [ ] Continuous visual field (cinema-stage)
- [ ] Scroll progress indicator
- [ ] Chapter rail navigation
- [ ] Scroll-driven depth/scale/rotation/masking
- [ ] Split-text (masked) reveals
- [ ] Searchable/filterable archive (Atlas equivalent)
- [ ] Narrative sections with cinematic entrances
- [ ] Data visualization (bars, metrics, grids)
- [ ] Memento vault + Deduction ledger
- [ ] Evidence/interpretation separation
- [ ] Contradiction relationships
- [ ] Local persistence (localStorage)
- [ ] JSON memory-bundle import
- [ ] JSON export / copy context
- [ ] Read Aloud / narration system
- [ ] Section-specific narration
- [ ] Playback speed controls
- [ ] Responsive mobile behavior
- [ ] Reduced-motion accessibility
- [ ] Other: _______________

---

## Agent-Extensibility Protocol

Future agents can extend this project by:

1. **Reading** this SPEC + the live HTML → parsing seed data arrays
2. **Importing** a memory bundle JSON → merging into localStorage
3. **Adding evidence (mementos)** via form or direct localStorage write
4. **Adding interpretations (deductions)** with `evidence[]` pointing to memento IDs
5. **Contradicting** prior deductions via `contradicts` field
6. **Exporting** updated bundle for next agent / committing to repo

**Strict separation:** Mementos = immutable evidence. Deductions = mutable interpretations.

---

## Migration Notes

[Document the history: original prompt, version lineage, key decisions, ChatGPT/agent collaboration log]

---

## Future Work (Next Level)

[Vision for the next evolutionary step — e.g., spatial timeline, 3D, WebGL, agent-authored chapters, etc.]

---

## License / Usage

[Personal / Open / Commercial — specify]

---

*This template is part of the Oliver Payton Agent Hub. Copy, adapt, and use for any cinematic scroll-driven narrative website.*