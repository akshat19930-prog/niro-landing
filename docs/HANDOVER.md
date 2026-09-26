# Handover - tellniro.com

Written for Paarth taking ownership of the landing page, Sept 2026. The point
of this file is that the context lives **in the repo**, not in a chat log or
someone's head. Keep it current; it is cheaper than re-deriving any of it.

---

## 1. What this is

A Next.js **static export** deployed to GitHub Pages at **tellniro.com**. No
server, no API routes, no database. Every page is pre-rendered HTML.

The main page (`/`) is the live product page. The job of the page is to start a
**WhatsApp conversation with a qualified lead**, not to take a payment. Payment
happens on a hosted checkout link that sales sends in the thread after a call.

**Traffic is ~80% mobile, from Meta ads.** Design and test accordingly.

### Routes

| Route | What it is |
|---|---|
| `/` | The live product page. Everything below refers to this unless stated. |
| `/niro-assure/` | Emergency response protocol, with the published SLA. Renamed from `/niro-assured/` (Sept 2026); that old path is a redirect stub, like `/emergency/`. |
| `/what-we-do/` | The full India scope as a grid. Has an OG image, so it previews as a card when pasted into WhatsApp. |
| `/careers/` | Open roles. A trust asset as much as a hiring one - see §6. |
| `/lite/` | **Unlisted.** The $270/yr 15-task pack, for sales to share on a call. Obscure, not secret. |
| `/terms/`, `/privacy/`, `/about/` | Legal and team. |
| `/emergency/` | A noindex redirect stub to `/niro-assure/`. The old URL shipped to production, so it cannot just 404. |
| `/gulf/`, `/us/`, `/us-v2/` | **Retired 26 Sept 2026.** noindex redirect stubs to `/`, like `/emergency/`. The pages live in git history and `UsPage.tsx` / `GulfPage.tsx` are still in the repo, unmounted. |

---

## 2. Where to change what

Most changes are content, and content is centralised on purpose.

| To change | Edit |
|---|---|
| Any page copy, plan features, FAQ, scope lists, service cities | `lib/content.ts` |
| Section layout and structure on `/` | `components/sections/VariantB.tsx` |
| The sign-up modal (fields, validation, confirmation) | `components/sections/JoinModal.tsx` |
| Sign-up state, what gets sent to the sheet | `components/JoinProvider.tsx` |
| City serviceability matching, phone/ID validation | `lib/cities.ts` |
| Colours, type, spacing | `app/tokens.css` - **do not invent values outside this file** |
| Component CSS | `app/globals.css` |
| The sheet backend | `backend/waitlist.gs` (see §4) |

`lib/content.ts` is the plain-text source of truth. Three FAQ answers are
rendered richer on the page (bullets, a link, a WhatsApp link) from
`MAIN_FAQ_ITEMS` in `VariantB.tsx` - **if you edit those three answers, edit
both.**

---

## 3. How to deploy

```bash
git checkout -b <your-branch>     # never commit straight to main
npm install
npm run dev                       # local at :3000
npm run build                     # must pass before you push
git push -u origin <your-branch>
```

**Deploy = merge to `main`.** That triggers `.github/workflows/deploy.yml`,
which builds and publishes to GitHub Pages. It takes about a minute.

```bash
git checkout main && git pull origin main
git merge --no-ff <your-branch> -m "..."
git push origin main
```

There is no staging environment. To preview something without shipping it, add
a route with `robots: { index: false, follow: false }` - `/us-v2/` is the
existing example of that pattern.

**Verify after deploying**, because a green build is not proof the content is
right:

```bash
curl -s https://tellniro.com/ | grep -o "<some new copy>"
```

---

## 4. The backend

Sign-ups POST to a **Google Apps Script web app**, which appends a row to the
"Niro Sign ups" Google Sheet. That is the entire backend.

- `backend/waitlist.gs` - the web app. Receives sign-ups and funnel beacons.
- `backend/report.gs` - the daily email report. Pulls Meta spend and joins it
  to real sign-ups.

Both files are **copies for version control**. Editing them here changes
nothing. To actually change behaviour you must paste the file into the Apps
Script editor **and redeploy the web app**. Forgetting the redeploy is the
classic failure: the code looks updated and the live endpoint is not.

**To update the live script:** Sheet → Extensions → Apps Script → replace the
code → **Deploy → Manage deployments → pencil on the existing deployment →
Version: New version → Deploy.**

> **Never use "New deployment" for an update.** It mints a fresh `/exec` URL
> while the site keeps POSTing to the old one, which still answers HTTP 200.
> Sign-ups stop reaching the Sheet with no error anywhere. If the URL ever does
> change, the single fix point is `NEXT_PUBLIC_WAITLIST_ENDPOINT` (a repo
> Actions variable, falling back to the hardcoded URL in `lib/config.ts`).

The `waitlist` header row re-syncs itself from the `HEADER` array on the next
POST, so new trailing columns appear on their own and stay blank for older
rows. New columns are always appended **after** the sales columns W/X/Y, so no
existing column index shifts and `applyLeadNotes()` keeps working.

To check which version is actually deployed, POST anything without an email:
the script answers `{"ignored":true}` without writing a row, but still re-syncs
row 1 - so the header tells you what is live.

**Column sanity, after the phone-first funnel (25 Sept 2026).** The sheet's
columns still carry the old funnel's shape, so read them with this in mind:

- `email` is blank on every new row and was filled on 197 of the first 198.
  **The lead key is now `phone`**, not email - anything matching leads to the
  customer sheet has to join on phone.
- `planId` and `urgency` are frozen: the current form has neither a plan step
  nor an urgency question.
- `tasks` changed vocabulary in place. Old rows read "Parents' health &
  appointments"; new rows read "Family's health admin & emergency response".
  Counting across the whole column mixes two taxonomies - split on the 25 Sept
  2026 timestamp.
- `name`, `city`, `cityServed`, `ownCity` were empty for every historic row and
  fill from now on.
- `pageArm` was added and then removed again on 26 Sept 2026: the page A/B is
  over, so it read "reposition" on every row. `readPageArm()` still returns it
  and the site still posts it - add the column back when a page test starts.
- **The leads tab is matched case-insensitively.** It was renamed `waitlist` ->
  `Waitlist`, and `getSheetByName()` is case-sensitive, so the script would have
  created a second empty `waitlist` tab and split the leads in two.

**Secrets never go in this repo.** The Meta access token lives in Apps Script
Properties only. `META_ACCESS_TOKEN` in `backend/report.gs` must stay `""`.

---

## 5. Access checklist

Code access alone is not enough to run this. All of these are separate:

| System | What Paarth needs | Granted by |
|---|---|---|
| **GitHub repo** | Write access to `akshat19930-prog/niro-landing` | Repo Settings → Collaborators |
| **GitHub Pages / DNS** | Admin on the repo; check where the `tellniro.com` DNS is registered | Repo admin + domain registrar |
| **Google Sheet** ("Niro Sign ups") | **Editor** - it holds every lead | Sheet share menu |
| **Apps Script** (waitlist + report) | Editor, and the right to deploy the web app | Comes with the Sheet - see the note below |
| **Meta Ads** (`act_2246578592783321`) | Advertiser or Admin | Business Manager → People |
| **Meta Pixel / CAPI** | Pixel access for event debugging | Business Manager → Data sources |
| **PostHog** (project 415260) | Member | PostHog → Settings → Members |
| **The WhatsApp lines** | Two numbers since Sept 2026: sales (+91 91805 81481) on every prospect-facing link, support (+91 88677 38283) on the footer only. Both are set in `lib/config.ts`. | - |
| **`hello@tellniro.com`** | The only address published on the live site (replaced akshat@ and privacy@, Sept 2026) - it is the refund and cancellation route in Terms, the privacy contact, and the apply route on `/careers`. Make sure it is monitored. | Email admin |

**On Apps Script specifically.** Both `.gs` files live in **one** project, bound
to the "Niro Sign ups" Sheet. There is no separate report project and no Share
button in the script editor - a bound project is shared by sharing its Sheet.
Three consequences:

- Only `waitlist.gs` has a **web-app deployment**. `report.gs` runs on
  time-driven triggers, so there is no URL to break there.
- **Triggers are per-user.** The thrice-daily report fires under whoever ran
  `setupTriggers()`. A second person running it means two reports a day, not a
  handover - so don't, unless you are deliberately moving it.
- Editor access **includes Script Properties**, which is where the Meta access
  token lives. Sharing the Sheet shares the token.

**Do not send the Meta access token over chat or email.** Rotate it and let him
set it in Apps Script Properties himself.

---

## 6. Decisions that look arbitrary but are not

Change these only deliberately - each one cost a test or an interview to learn.

- **Trust is the constraint, not price.** Across a $149-vs-$99 test, a plan
  question, and eleven WhatsApp conversations, price never showed up as the
  blocker. Below ~$50/month actively *destroys* credibility - six research
  respondents said so unprompted. That is why `/lite` is off-menu.
- **Neither SKU is styled as preferred.** They are the same service at two
  prices; nudging someone onto a term they did not want is a churn problem.
- **The city field is a checker, not a gate.** Out-of-area leads are captured
  and waitlisted by city - that list decides which city opens next. Hiding the
  city list behind the form would be a dark pattern on a trust-led product.
- **The lead is written to the sheet *before* any WhatsApp handoff.** If the
  click were the only capture we would lose everyone who never sends the
  message.
- **The careers page is a trust asset.** The most common objection in the
  research was that Niro might be software pretending to be people. Only list
  roles you will actually fill; a stale board proves the opposite.
- **"AI" appears exactly once on the page**, in the humans-or-AI FAQ answer.
  Nobody in the research bought *because* of AI and several discounted for it.
- **Emergency SLA numbers are published and scoped to the five launch cities.**
  Do not widen the scope without widening the ops that hold it.
- **We no longer claim "we never ask for OTPs"** - we do, for some tasks. The
  claim narrowed to passwords/PINs/net-banking, which is keepable.

**The fuller record is `git log`.** Commit messages here carry the *reasoning*,
not just the change. `git log --oneline` then `git show <sha>` beats asking.

---

## 7. Known gaps, as of handover

1. ~~`/us/` and `/gulf/` are materially behind `/`.~~ **Closed 26 Sept 2026:**
   retired rather than brought into line. Both were noindex dead ends running
   the old email-first flow and SKUs the live pricing no longer has ($99 +
   $169 on `/us`, $149 on `/gulf`), and in September they took 31 and 1
   sessions against 795 on `/`. All three routes, `/us`, `/us-v2` and `/gulf`,
   are now meta-refresh stubs to `/`. Reviving either test means remounting
   `UsPage.tsx` / `GulfPage.tsx` and repricing it first.
2. **No email is captured at sign-up any more.** Sales must collect one on
   WhatsApp before anyone is invoiced; the checkout needs it for receipts.
   This silently broke the sheet between 16 and 25 Sept 2026: `doPost` only
   created a row when an email was present, so every phone-only lead was
   answered `{"ignored":true}` and dropped. Three leads were lost that way.
   Fixed in `backend/waitlist.gs` (email OR phone). **The lesson: the events
   tab filling is not evidence that leads are landing - check the `waitlist`
   tab's last timestamp.**
3. **Payment rails are not live.** Recurring cross-border card billing from an
   India entity is the open question - verify a foreign-issued card can be
   stored for auto-debit before promising monthly billing.
4. **Three live claims need an owner**: the monthly free Niro visit, the data
   commitments in the FAQ (one-click deletion, periodic disclosure,
   task-scoped logged access), and the 20-minute ambulance median.
5. **`CLAUDE.md` describes the page's rules for AI coding agents.** It was
   rewritten at handover to match reality - keep it that way, or the next agent
   will confidently build the wrong thing.
6. **The parents' voices are Hindi-transliterated only**, while the page offers
   any language. Add a Tamil and a Bengali one once a native speaker can check them.

---

## 8. Reference docs

Written during the build, outside the repo:

- **Launch spec and open decisions** - the twelve calls, and which are still open
- **Multi-tenancy decision record** - why $99 covers two households
- **FAQ drafts** - the nine answers with what needed confirming

Ask Akshat for the links; they are private artifacts on his account.
