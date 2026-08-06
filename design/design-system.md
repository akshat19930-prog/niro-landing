# Handoff: Niro/Leo Family Concierge — Landing Page

## Overview
A single-page marketing site for "Leo" (product name used throughout copy and UI — brand name is fixed, see Design Tokens), a premium family-concierge service for NRIs. Goal: drive waitlist email signups for a paid-ads smoke test (Meta/Google, US + UAE, ages 28–50). Single conversion action throughout: "Join the waitlist."

## About the Design Files
The files in this bundle (`Niro Landing.dc.html` and the `_ds/` design-system folder) are **design references built in HTML** — high-fidelity prototypes of look, content, and interaction, not production code to copy verbatim. The task is to recreate this design in the target codebase's existing environment (React, Vue, Next.js, etc. — whatever the project already uses), following its existing patterns for components, routing, and state, rather than embedding the HTML/inline-style markup directly. If no frontend framework exists yet in the target repo, React is a safe default given the design's component structure.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and component states are all intentional — recreate pixel-close. The one deliberate exception: the hero photo and testimonial quotes are explicitly marked placeholders (see Assets and Content sections below) and are NOT final content.

## Page structure (in order)
1. **Nav** — sticky, translucent/blurred bar. Wordmark "Leo." (period in gold) left, single pill CTA button "Join the waitlist" right. Nothing else in the nav.
2. **Hero** — two-column (stacks under ~680px combined width via `grid-template-columns: repeat(auto-fit, minmax(340px,1fr))`, no media query needed).
   - Left: eyebrow tag → serif H1 (clamp 48–88px) → sans subhead (18px, max-width 520px) → primary button (56px tall) → a 4-item trust strip (icon + bold line + muted sub-line, `grid-template-columns: repeat(auto-fit, minmax(220px,1fr))`).
   - Right: a full-bleed rounded photo placeholder (24px radius, 460px tall) with a small italic art-direction caption below it.
   - **4 swappable variants**, selected by `?v=1`…`?v=4` URL param (default `4` when no param — see Design Tokens for exact copy per variant). Only headline/subhead/eyebrow tag change; layout is identical across variants.
3. **The Mirror** — section on tinted background (`--bg-inset`). Eyebrow "Sound familiar" + one serif H2, then a 3-card grid (auto-fit, min 280px) — each card: icon chip (44×44, 12px radius, brand-soft bg) + bold title + body text. No accusation — recognition tone only.
4. **How it works** — two columns (auto-fit, min 380px). Left: eyebrow + H2 + a vertical list of 3 numbered steps (large serif number in gold, bold title, body text). Right: a WhatsApp-style chat mockup card (see "Chat vignette" component below) showing Leo resolving a cardiology-appointment request, ending with a voice-note bubble.
5. **What we handle** — tinted background. Eyebrow + H2, then 3 columns (auto-fit, min 300px) grouped **Protect / Handle / Delight**, each an all-caps gold label followed by 3 rows of icon + bold line + muted sub-line.
6. **Emergency story ("The 2:47 AM promise")** — full-width dark section (`--forest-950` radial gradient), white/gold text. A 4-beat vertical timeline (time-stamp + place + narrative line, connected by a vertical line, one beat highlighted in solid gold) next to the same chat-vignette card format showing a middle-of-the-night emergency exchange.
7. **User stories** — 3-card grid (auto-fit, min 300px). Each card: name + city-corridor label (e.g. "Ankush · Boston ↔ Chandigarh") then three labeled micro-sections: Situation → What Leo did → How it ended (last line bold, brand-green).
8. **Testimonials** — tinted background. One large dark "parent voice" quote card (forest-800 bg, large italic serif quote + English translation + avatar-initial + name/relation), centered, max-width 640px. Below it, a 4-card grid (auto-fit, min 260px) of WhatsApp-screenshot-style quote cards (jaali/lattice background texture, white chat-bubble quote, sender name, city-corridor + pin icon); each has a small "Beta member" pill placed **above** the card (not overlapping it).
9. **Join the waitlist (the conversion flow)** — centered, max-width 520px, 3-step client-side state machine, no page navigation:
   - **Step 1 — email form**: eyebrow "Step 1 of 2", H2, one email input, one full-width primary button "Join the waitlist", a small "no payment, ever" lock-icon line underneath. Submitting requires a non-empty value containing "@".
   - **Step 2 — first task picker**: eyebrow "Step 2 of 2", H2 "Pick your free first task", a single-select list of 4 cards (icon, bold label, muted note, radio circle) — see task list in Content section. Once one is selected, an optional multi-select row of pill/badge chips appears ("Also interested in") for the remaining 3 tasks (toggle on/off). A "Continue" button (disabled until a task is selected) advances to step 3.
   - **Step 3 — confirmation**: a card showing a big check-circle icon, "You're #1,847 on the list" (number is dynamic/config), a line confirming the selected free task, a read-only referral-link input + "Copy link" button, and a full-width WhatsApp-share button (`https://wa.me/?text=...` prefilled message with the referral link) as the primary share mechanic ("move up the list").
10. **Pricing teaser** (optional section — toggle) — tinted background. Eyebrow "Membership" + H2, then a 2-card pricing block: Monthly ($69/mo) and Annual ($590/yr = $49/mo, highlighted/"Best value", dark-green card with gold accents), each listing 3–4 features and a "30-day full refund" line under the CTA button.
11. **FAQ** — accordion, 6 questions, single-open-at-a-time, chevron rotates 90° on open. **First question is a deliberate design moment**: "Will you ever ask for OTPs or passwords?" — answer opens with a small gold "Never." badge before the answer text. Other 5: pricing, cities live, associate verification, cancellation/refund policy, "do parents need to install anything."
12. **Footer** — a one-line dark strip above the footer ("Associates on the ground across India · Serving families in the US & UAE"), then a standard 3-column dark footer (Leo / Company / Legal link columns + wordmark + tagline + copyright line).
13. **Sticky mobile CTA** — fixed bottom bar, full-width primary "Join the waitlist" button, shown only on narrow viewports (≤640px) and hidden once the user reaches the confirmation step. Implemented via a resize listener + conditional render, not CSS media queries, in the prototype — a real build should just use a CSS breakpoint.

## Interactions & Behavior
- Hero/nav/sticky-bar CTAs all smooth-scroll to the `#join` section (no anchor jump).
- Email step: basic client validation (must contain `@`); no server call wired in the prototype — needs a real waitlist API integration.
- Task picker: single-select (radio-style, exactly one selectable), plus an independent multi-select toggle list for secondary interest — these should be captured as two separate fields when wiring to a backend (`primary_task_id`, `also_interested_ids[]`).
- FAQ accordion: only one panel open at a time; clicking the open panel's header closes it.
- Referral "Copy link" button uses the Clipboard API.
- All hover states (buttons, cards) use a subtle upward lift (`translateY(-2px)`-equivalent) + shadow/background shift — see Motion tokens.
- Motion is deliberately calm: no bounce/overshoot, no parallax. Section reveals (if animated on scroll in production) should be simple fade/translate-up, ~200–300ms.

## Design Tokens
Full token source lives in `_ds/leo-design-system-*/tokens/*.css` (bundled). Key values:

**Colors**
- Forest (primary/brand): 950 `#0C1F18`, 800 `#16362A`, 700 `#1E4536` (brand), 600 `#2A5A47`, 500 `#3B7359`, 300 `#8FB6A3`, 100 `#E2EEE8`
- Gold (accent, use <10% of page): 700 `#7E561C`, 600 `#9A6E28`, 500 `#B8863B`, 400 `#CC9E52`, 300 `#E0BE84`, 100 `#F1E3C6`
- Warm neutrals: ivory `#F6F1E7` (page bg), sand 50/100/200/300 `#FCFAF4`/`#EFE7D6`/`#E5D9C2`/`#D8C9AC`
- Ink (text): 900 `#191A16`, 700 `#33352D`, 500 `#5C5E52`, 400 `#767869`
- Support: success `#2A6B4F`, danger `#A6432E`
- WhatsApp motif surface: bg `#E9E2D3`, incoming bubble `#FFFFFF`, outgoing bubble `#DDEAD0`
- Semantic aliases (light mode): `--bg-page`=ivory, `--brand`=forest-700, `--brand-hover`=forest-800, `--accent`=gold-500, `--text-strong`=ink-900, `--text-body`=ink-700, `--text-muted`=ink-400, `--border`=rgba(25,26,22,.12)
- A dark-mode alias set exists (`[data-theme="dark"]`) used only for the Emergency Story and parent-voice/chat-dark surfaces — not a global dark mode.

**Typography**
- Display/headline serif: **Newsreader** (fallback Georgia/Times New Roman)
- Body/UI sans: **Hanken Grotesk** (fallback system sans)
- Scale (mobile-first, some fluid via clamp): xs 12 / sm 14 / base 16 / md 18 / lg 22 / xl 28 / 2xl clamp(32→44) / 3xl clamp(40→64) / 4xl (hero) clamp(48→88)
- Line-heights: tight 1.08, snug 1.22, body 1.6. Letter-spacing: tight -0.02em (headlines), wide 0.08em (all-caps eyebrows/labels).
- Weights: regular 400, medium 500, semibold 600, bold 700.

**Spacing** (4px base): 4/8/12/16/24/32/48/64/96px. Page container max-width 1120px (narrow variant 640px), page gutter 20px.

**Radii / elevation / motion**: generous rounding on cards (large radius token, ~20px) and pill buttons; soft warm multi-layer shadows (no hard drop shadows); transitions ~150–250ms, no bounce/overshoot easing ("calm" ease curve).

**Hero variant copy** (drive by a `variant` prop/route param in production):
1. *Peace of mind*: "Their health, watched over — even from here." / "A named associate handles doctor visits, emergencies, and the 2am calls, so you don't have to be in the room to know they're safe."
2. *Off your plate*: "The bills, the paperwork, the mental load — off your plate." / "Leo's associates chase the electricity board, the passport office, and the plumber, so your calls home can just be calls home."
3. *A real person, there*: "A real person, walking beside them." / "Meet your family's named, verified associate in India — at the passport office, the hospital, wherever they need someone in the room."
4. *Everything, one membership* (default): "Your family's own person in India." / "One membership. A named associate for errands, bills, appointments, and emergencies — so you can be there, from anywhere."

## Reusable components (build these first)
- **Button** — variants: primary (solid forest, gold-ish shadow), secondary (outline), quiet (text-only), accent (gold solid). Sizes sm/md/lg (40/48/56px min-height). Pill radius on nav CTA, standard radius elsewhere.
- **Card** — white surface, hairline border, soft shadow, large radius; optional hover-lift; tone variants default/inset/brand(dark-forest)/outline.
- **Badge/Pill** — small rounded label, tone variants neutral/brand/accent/success/solid. "Eyebrow" is a related but distinct element: small gold all-caps label with an 18×1px rule before it, used above section headings.
- **Input** — 48px min-height, warm border, brand-colored focus ring (4px soft glow), label + optional hint/error text below.
- **Chat vignette card** ("WhatsApp Showcase") — the signature visual device: a phone-width card with a dark-green header (avatar circle with "L", name, online status dot, phone icon), a lattice-textured background, chat bubbles (incoming white / outgoing pale-green, tail on relevant corner), a support for **voice-note bubbles** (play button + static waveform + duration), read-receipts (blue double-check), and an optional caption strip below the thread. Used in "How it works" and the Emergency Story section with different message sets.
- **Quote/testimonial card** — WhatsApp-screenshot style single quote (lattice bg, one bubble, sender name, timestamp+receipts) plus a location line with a pin icon below the bubble.
- **Parent-voice card** — dark forest card, oversized decorative quotation mark, italic serif quote + plain translation, avatar-initial + name + relation line in gold.
- **Task picker card** — full-width row button: icon chip + label + note + trailing radio circle; selected state = brand-soft background, brand border, filled radio with checkmark; unselected hover = lifted + darker border.
- **Trust bar** — a bordered card containing a 2–4 item responsive grid of icon-chip + bold line + muted sub-line, used directly under the hero CTA.
- **FAQ accordion item** — Card wrapping a full-width unstyled button header (question + rotating chevron) and a conditionally-rendered answer block.
- **Nav** — sticky, translucent + backdrop-blur, wordmark + single CTA only.
- **Footer** — dark, 3 link columns + wordmark/tagline block + bottom copyright bar.

## Content that is placeholder — do not ship as-is
- **Hero photo**: currently an empty drop-zone placeholder. Art direction note baked into the design: "unstaged domestic warmth, honest interiors — no stock-photo gloss" (a father reading the paper on a balcony, warm morning light, Tier-2 home). Needs a real photo shoot/licensed image before launch.
- **All testimonial quotes** (the 4 short WhatsApp-style quotes + the 1 long parent-voice quote) are labeled in-page as placeholder beta-user words and must be replaced with real, verbatim beta-user testimonials before launch. Do not invent new quotes when implementing — wire them to real content instead.
- **User story numbers** (₹6,400 bill, ₹4.1L EPF, 9-day passport turnaround) are illustrative and should be confirmed against real case data before publishing.
- **Waitlist position counter** ("#1,847") should be wired to a real counter/backend, not hardcoded.

## State management (for the join flow)
- `step`: `"form" | "tasks" | "done"`
- `email`: string
- `selectedTaskId`: string | null (single-select, required to advance)
- `alsoInterestedIds`: string[] (optional multi-select)
- `heroVariant`: derived from URL/query param at load, 1 of 4 fixed values
- `faqOpenIndex`: number | null (accordion, single-open)
- Waitlist position + referral link should come from the backend response after step 1's email submit, not be computed client-side as in the prototype.

## Files in this bundle
- `Niro Landing.dc.html` — the full page prototype (inline-styled, self-contained aside from the design-system bundle it loads).
- `_ds/` — the complete design-system source (color/type/spacing/radii/elevation/motion tokens as CSS, plus the compiled component bundle) referenced by the prototype. Use the token files as the canonical source of truth for exact values; the compiled JS bundle is prototype-only plumbing, not something to import into production.
