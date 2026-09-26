# Niro Landing Page

Live product page for Niro (NRI family concierge) at **tellniro.com**.
Meta-ads traffic, ~80% mobile.

**The goal of the page is to start a WhatsApp conversation with a qualified
lead** - not to take a payment. Payment happens on a hosted checkout link that
sales sends in the thread after a call. This changed in Sept 2026; the page was
previously a smoke test optimising for email sign-ups.

**New here? Read `/docs/HANDOVER.md` first.** It covers architecture, the
backend, deploys, and the decisions that look arbitrary but are not.

## Source of truth

- `/lib/content.ts` - all page copy, plans, FAQ, scope lists, service cities.
  Change copy here, not in components.
- `/app/tokens.css` - colours, type, spacing. **Do not invent values outside
  this file.** Add a token instead.
- `/design/design-system.md` - the component and type system behind the tokens.

## Hard requirements

- **Static-first.** `output: "export"` to GitHub Pages: no server, no API
  routes, no sessions. Anything needing a backend goes through the Apps Script
  web app in `/backend`.
- **Minimal JS, no animation libraries.** The two animated components
  (`AskStream`, `VoiceStream`) are one interval and a CSS keyframe each.
- **Everything renders on first paint.** No section parked at `opacity: 0`
  waiting on an observer, and motion respects `prefers-reduced-motion`.
- **The lead is written to the sheet before any WhatsApp handoff**, never
  after. A handoff-only capture loses everyone who does not send the message.
- **UTM passthrough into the sign-up payload** - attribution depends on it.
- Meta Pixel + CAPI share one `eventId` for dedup.

## Copy rules

- **"AI" appears at most once on the page.** It is currently spent on the
  humans-or-AI FAQ answer. Nobody in the research bought *because* of AI and
  several discounted for it.
- **Do not claim we never ask for OTPs.** We do, for some tasks. The keepable
  claim is passwords, PINs and net-banking logins.
- **Never state a price below ~$50/month anywhere prominent.** Six research
  respondents said a sub-$50 price made them distrust the service. This is why
  `/lite` is unlisted.
- **Neither SKU is styled as preferred** - same service, two prices.
- **Do not name the household limit as a restriction.** "Create up to 2 groups"
  reads as an allowance; "only 2 groups" creates the objection.
- Emergency SLA numbers stay scoped to the five launch cities, on the page.

## Don'ts

- **No long dashes anywhere.** No em dash and no en dash, in page copy, code,
  comments, commit messages or docs. Use a comma, a colon, brackets, or split
  the sentence. A plain hyphen is the only dash. Paarth reads long dashes as
  machine-written copy.

- No purple/blue gradients, glassmorphism, or generic AI imagery.
- No competing CTAs - one primary action per section.
- No secrets in the repo. `META_ACCESS_TOKEN` stays `""`; the real token lives
  in Apps Script Properties only.
- Never commit straight to `main` - `main` is the deploy trigger.

## Stack

Next.js 15 static export · React 19 · plain CSS on design tokens (Tailwind is
installed but the page styles are token-based CSS and inline styles) ·
Google Apps Script + Google Sheets as the only backend · PostHog + Meta Pixel.
