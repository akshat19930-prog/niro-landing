# Waitlist backend

The landing page is a static export (GitHub Pages), so the waitlist form POSTs
to an external endpoint. `waitlist.gs` is a **Google Apps Script Web App** that
stores each signup in a Google Sheet — zero cost, no servers, no new accounts.

## What the frontend sends

`POST` with `Content-Type: text/plain;charset=utf-8` (kept a CORS "simple
request" so there's no preflight for Apps Script to answer). Body is JSON:

```json
{
  "email": "you@example.com",
  "eventId": "…",            // stable per visitor; used to de-dupe / enrich
  "arm": "A" | "B",          // pricing experiment cell
  "utm": { "utm_source": "…", "fbclid": "…", … },
  "primaryTaskId": "…",      // added at the task step
  "alsoInterestedIds": ["…"],
  "planId": "prime" | "lite" | null   // added at the plan step
}
```

The flow POSTs 3 times as the visitor progresses (email → tasks → plan) with the
same `eventId`; the script **upserts one row per `eventId`**.

Expected response: `{ "position": <number>, "referralCode": "<string>" }`.

## Deploy (see the header of `waitlist.gs` for the click-by-click)

1. New Google Sheet → **Extensions → Apps Script** → paste `waitlist.gs`.
2. (Optional) set `META_PIXEL_ID` + `META_CAPI_TOKEN` for server-side CAPI Lead
   events (de-duped with the browser pixel via `eventId`).
3. **Deploy → New deployment → Web app**, *Execute as: Me*, *Access: Anyone*,
   authorize, copy the `/exec` URL.
4. GitHub repo → **Settings → Secrets and variables → Actions → Variables** →
   add `NEXT_PUBLIC_WAITLIST_ENDPOINT` = the `/exec` URL. Re-run the deploy.

## Reporting (`report.gs`) — twice-daily email

`report.gs` lives in the **same** Apps Script project as `waitlist.gs` (add it as
a second file). It reads the `waitlist` sheet, pulls Meta metrics via the
Marketing API, and emails the smoke-test report at 09:00 and 18:00.

Setup:
1. Add `report.gs` as a second file in the Apps Script editor. Fill `CONFIG`:
   `RECIPIENTS`, `META_ACCESS_TOKEN` (ads_read), `META_AD_ACCOUNT_ID`
   (`act_…`), `BUDGET_USD`, `TEST_START`, `TEST_DAYS`.
2. **Ad-naming convention (required for per-pitch CPL):** each Meta ad's name
   must contain its cell token `P1`–`P4`, and its destination URL must carry the
   matching `?v=1`–`4`. That's how Sheet signups (the `pitch`/`v` column) join to
   Meta spend (the ad). Keep `Pn` ⇔ `?v=n` consistent.
3. Run `setupTriggers()` once (authorize) to install the 09:00 + 18:00 triggers.
   Run `sendReport()` once to test.

Without a Meta token it still sends the full Sheet-side report (signups, pitch
mix, arm, plan, referral) and marks Meta-derived rows "n/a".

The signup payload now also carries `pitch` (the `?v` cell) and `ref` (the
referrer code) — the sheet has matching columns.

## Notes

- If reading the response is ever blocked by CORS, the row is **still written**
  (no preflight blocks the POST) — the visitor just sees the fallback position.
- Redeploy the Apps Script as a **new version** after any edit, or re-use the
  deployment's "Manage deployments → Edit → Version: New" so the `/exec` URL
  stays the same.
- Swappable: any endpoint that accepts this JSON body and returns
  `{ position, referralCode }` works (e.g. a Cloudflare Worker reading
  `request.text()`), if you outgrow Sheets.
