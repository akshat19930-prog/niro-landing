# Niro landing page

Smoke-test landing page for **Niro** (NRI family concierge). Meta-ads traffic,
~80% mobile, single conversion goal: waitlist email signup.

Built as a **Next.js static export + Tailwind**, mapped exactly onto the Niro/Leo
design tokens. See `CLAUDE.md` for the product brief and `design/` for the
source-of-truth design system.

## Stack

- **Next.js 15** (App Router) with `output: "export"` → static HTML/CSS/JS, no
  server runtime required. Deploy the `out/` folder to any static host / CDN.
- **Tailwind CSS**, mapped to the design tokens (`app/tokens.css` is the single
  source of truth; `tailwind.config.ts` resolves every utility to a `var(--…)`).
- **Fonts self-hosted** via `next/font/google` (Newsreader + Hanken Grotesk) —
  binaries are emitted into the build, so there is no runtime Google Fonts
  request (best LCP on mobile).
- No animation libraries. Interactions are CSS-driven; only the join flow, FAQ,
  hero-variant copy, and sticky CTA hydrate.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

## Configuration

All config is optional and passed via `NEXT_PUBLIC_*` env vars (see
`.env.example`). With none set, the page runs in **smoke-test mode**: no pixel
loads and the signup funnel is simulated locally so it's fully clickable.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads the Meta Pixel; fires `PageView` + `Lead`. |
| `NEXT_PUBLIC_WAITLIST_ENDPOINT` | Backend that receives the signup JSON, returns `{ position, referralCode }`, and forwards the Meta **CAPI** `Lead` event server-side (dedup via `eventId`). |
| `NEXT_PUBLIC_SITE_ORIGIN` | Origin used to build referral links. |

## Key features

- **4 ad-matched hero variants** via `?v=1..4` (default `4`). Only the eyebrow /
  headline / subhead change; layout is identical. See `lib/content.ts`.
- **UTM passthrough**: attribution params (`utm_*`, `fbclid`, `gclid`) are
  captured first-touch on load and included in the signup payload.
- **Post-signup task picker**: 4 cards, **order randomized per visitor**,
  single-select + optional multi-select of the rest.
- **Confirmation**: waitlist position + referral link, WhatsApp-first share.
- **Meta Pixel + CAPI**: pixel client-side; CAPI is server-side on the waitlist
  backend, sharing an `eventId` for de-duplication.

## Project layout

```
app/            layout (fonts, pixel), page (section assembly), tokens.css, globals.css
components/ds/  the design-system components (Button, Card, WhatsAppShowcase, …)
components/sections/  page sections (Hero, JoinFlow, Faq, StickyCta, …)
lib/            content.ts (all copy/data), analytics.ts (UTM + pixel), config.ts
design/         vendored design-system handoff — source of truth (do not edit to invent tokens)
```

## Before launch (placeholders to replace)

- Hero photo (currently a warm-graded placeholder) — art direction: unstaged
  domestic warmth, no stock-photo gloss.
- All testimonial quotes and the parent-voice quote (labeled placeholder).
- User-story figures (₹6,400 bill, ₹4.1L EPF, 9-day passport) — confirm vs real
  case data.
- Wire `NEXT_PUBLIC_WAITLIST_ENDPOINT` so the waitlist position/referral come
  from the backend rather than the local fallback.
