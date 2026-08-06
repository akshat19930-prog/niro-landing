# Niro Landing Page

Smoke-test landing page for Niro (NRI family concierge). Meta-ads traffic, 
80% mobile, single conversion goal: waitlist email signup.

## Source of truth
- /design/design-system.md — tokens, type, components. FOLLOW EXACTLY. 
  Do not invent colors, fonts, or spacing outside these tokens.
- /design/screenshot-*.png — visual reference for layout and feel.

## Hard requirements
- 4 hero variants switched by URL param (?v=1..4) — same layout, different 
  headline/subhead/image. Ad-matched landing.
- Post-signup step 2: task-basket picker, 4 cards, ORDER RANDOMIZED per 
  visitor, single-select + optional multi-select.
- UTM passthrough into the signup payload (pitch cell attribution depends on it).
- Referral link + waitlist position on confirmation. WhatsApp-first share.
- Fast: static-first, minimal JS, no heavy animation libs. Meta pixel + CAPI.

## Stack
[your choice — e.g., Next.js static export + Tailwind mapped to the tokens, 
or plain HTML/CSS if you prefer]

## Don'ts
- No purple/blue gradients, glassmorphism, generic AI imagery (see design system)
- "AI" appears at most once on the page
- No competing CTAs
