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

## Notes

- If reading the response is ever blocked by CORS, the row is **still written**
  (no preflight blocks the POST) — the visitor just sees the fallback position.
- Redeploy the Apps Script as a **new version** after any edit, or re-use the
  deployment's "Manage deployments → Edit → Version: New" so the `/exec` URL
  stays the same.
- Swappable: any endpoint that accepts this JSON body and returns
  `{ position, referralCode }` works (e.g. a Cloudflare Worker reading
  `request.text()`), if you outgrow Sheets.
