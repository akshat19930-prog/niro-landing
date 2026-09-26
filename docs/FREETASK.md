# /freetask - the first-task sales page

**Live:** https://tellniro.com/freetask/
**Status:** shipped 25 Sept 2026. Unlisted - `noindex, nofollow`. Obscure, not
secret: anyone with the link can open it.

For Paarth. This page exists to be **sent by hand** to a lead after a call. It
offers one free task from a menu of eight, and every interaction on it is
instrumented so we learn which of the eight people actually want.

---

## 1. What it is, and what it is not

It is a **static HTML file**, not a React page. It lives at
`public/freetask/index.html` and Next copies it into the build **verbatim** -
nothing in the site's design system, layout, nav, footer, fonts or analytics
touches it.

That was deliberate. In the Next App Router the root layout (`app/layout.tsx`)
is inescapable: it renders `<html>`/`<body>`, imports `globals.css`, and injects
the Meta Pixel, PostHog and two fonts. Any `app/freetask/page.tsx` would have
inherited all of it. `public/` is the only way to get a genuinely standalone
page.

**Consequence you need to remember:** this page shares *nothing* with the rest
of the site. Changing a token, a font or a component will not change this page,
and editing this page cannot break anything else.

---

## 2. Editing it

Open `public/freetask/index.html`. It is one file: inline CSS in `<style>`, the
markup, and one `<script>` at the bottom. No build step, no components.

| To change | Where |
|---|---|
| A task's heading or hook | the `<h3>` and `<p class="ask">` in that `<article class="card">` |
| What's behind "Know more" | the `.deliver`, `<dl class="meta">` in the same card |
| Colours | the `:root` custom properties at the top of `<style>` - they mirror `app/tokens.css`, so keep them in step with the site |
| The WhatsApp number | `var WA_NUMBER` in the script at the bottom |

Deploy is the same as the rest of the site: **merge to `main`**, which triggers
`.github/workflows/deploy.yml`. Live in about 90 seconds.

**On the design.** Since 25 Sept 2026 the page is in Niro's own visual
language: ivory `#F6F1E7`, forest `#1E4536`, Newsreader headlines, Hanken
Grotesk body, soft radii and the real wordmark with its gold speech-bubble
tittle. It is light-only, like the rest of the site - the previous dark palette
was a second brand nobody had signed off. The values are copied rather than
imported, because nothing from the design system reaches `public/`.

> **Do not reformat or "tidy" this file.** It was authored as a finished asset
> and is deliberately not held to the repo's component conventions.

---

## 3. The eight tasks

Drawn from the **TaskZero** framework - see
`Niro_TaskZero_final_23` in Drive, which scored 23 candidates out of 30 on
Blast, Wow, Reach, Speed, Cost and Objection, and concluded with a two-track
menu (the NRI's own India setup vs the parent-side tasks).

The rule from that work was **offer three at a time, matched to what they ticked
at signup**, plus "or something else you have in mind". This page shows all
eight instead, because it is sent cold and we do not yet know which three to
pick. The instrumentation below is how we find out.

---

## 4. How the measurement works

Each card is collapsed to kicker, heading and hook. Everything else sits behind
a **"Know more"** button. Three beacons go to the same Apps Script endpoint and
`events` tab as the rest of the site:

| Event | Fires when | Tells you |
|---|---|---|
| `freetask_view` | page loads | the denominator |
| `freetask_expand` | a card is first opened | **which tasks people want** |
| `whatsapp_click` | "Start this task" is clicked | which converted |

`freetask_expand` **dedupes per task per session** - re-opening a card is the
same person still deciding, and counting it twice would flatter whichever card
sits first.

All three carry `sid`, `page`, `geo`, `campaign` and `placement: "freetask"`,
and the two task-level events carry `task`.

### Reading the numbers honestly

- The **relative ranking across the eight is the signal.** All eight buttons
  look identical, so the comparison is clean.
- The **absolute open rate is not pure interest.** "Know more" is deliberately
  the loudest thing on a collapsed card, so some of that rate is the button's
  pull, not the task's appeal.
- Collapsing put the CTA one tap further away. Raw chat starts may be lower than
  an always-visible-button design would produce. That is the price of learning
  which of the eight to lead with.

---

## 5. Tagging the link, so attribution works

The page reads UTMs **from its own query string first**, because it is sent by
hand and that is usually the only attribution there is. Tag the link when you
send it:

```
https://tellniro.com/freetask/?utm_source=whatsapp&utm_campaign=<campaign>&utm_content=<who_or_which_send>
```

Those land in the beacons, and they also go into the WhatsApp message as a `Ref`
line, so an inbound chat is reconcilable:

```
Hi Niro - I'd like to start with the insurance policy audit and gap report.

Ref: na · paarth_oct
```

If the visitor carries on into the main site in the same tab, the UTMs are
written to `sessionStorage` under the same key the React site uses, so
attribution survives the hop.

---

## 6. Two things that will bite, and one open item

1. **The WhatsApp number is a placeholder decision, not a confirmed one.**
   `WA_NUMBER` is currently `919180581481` - `SALES_WHATSAPP` from
   `lib/config.ts`. Akshat is confirming. **Check this before sending the link
   to anyone.**

2. **The Apps Script endpoint is hardcoded in this file.** The React build reads
   `NEXT_PUBLIC_WAITLIST_ENDPOINT` from a repo Actions variable; a static asset
   cannot. They match today. If that URL ever changes, **this page will silently
   stop reporting while the rest of the site keeps working.** Same silent-failure
   class as redeploying the Apps Script web app with "New deployment" instead of
   editing the existing one - see `docs/HANDOVER.md` §4.

3. **`data-task` is the measurement key.** It is the phrase that completes "I'd
   like to start with …" in the prefill *and* the label the beacons are tagged
   with. Renaming a card's heading is free; renaming its `data-task` breaks
   comparability with everything measured so far. The insurance card's heading
   has already been reworded while its `data-task` was deliberately left alone.

---

## 7. Next step, when you get to it

The plan is to stitch this into the straight-through journey rather than leave
it as a hand-sent link. When that happens the attribution already works - the
UTM merge and the shared `niro_sid` were written for exactly that, so the page
does not need rewriting, only linking to.

Before that, the thing worth deciding from the data: **which three of the eight
to lead with**, which is the question the TaskZero two-track menu was already
pointing at.
