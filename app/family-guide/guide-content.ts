import { GUIDE_FROM as FROM_GUIDE } from "@/lib/content";

/**
 * Copy for /family-guide only.
 *
 * The six catalogue categories are NOT here: they live in lib/content.ts as
 * GUIDE_CATEGORIES, because the home page and /what-we-do are built from the
 * same list, in the same order. This file keeps only what the guide alone
 * shows. House rules still apply: no long dashes,
 * "AI" spent once on the page (the FAQ), no numbers or claims that are not
 * already on the site.
 */

export const GUIDE_SOMETHING_ELSE_MESSAGE =
  `${FROM_GUIDE} I need something else done in India: `;

export const GUIDE_FINAL_MESSAGE =
  `${FROM_GUIDE} Here's what needs doing, and the city: `;

/* ---- What happens after you ask. */
export const GUIDE_FOLLOW_THROUGH: { title: string; body: string }[] = [
  {
    title: "Tell us what needs doing.",
    body: "Send a WhatsApp message or voice note. You don't need to work out the process first.",
  },
  {
    title: "We work out the next steps.",
    body: "We clarify what's needed, check options and coordinate the people involved. Where your approval or documents are needed, we ask.",
  },
  {
    title: "We follow up and keep you informed.",
    body: "We handle the chasing and explain what has been completed, what is still pending and what needs your decision.",
  },
];

/* ---- The quieter, ongoing side: reminders and planning. Each line is a
   capability the site already describes; none promises action without being
   asked. */
export const GUIDE_PROACTIVE: { title: string; body: string }[] = [
  {
    title: "Reminders, before things lapse",
    body: "One renewal calendar for the family: passport, OCI, visas, policies, AMCs, licences, pension certificates and filing deadlines. We remind you, and your parents, ahead of time, and take on the renewal when you say so.",
  },
  {
    title: "Maintenance planned by the season",
    body: "An asset register for each home, with models, purchase dates, warranties and AMCs, and a maintenance calendar that follows the Indian seasons: AC before summer, geyser before winter, roof before the monsoon. We propose the work; you approve it.",
  },
  {
    title: "A yearly check",
    body: "Everything in India that quietly lapses when a family lives abroad, reviewed once a year and brought to you as a short list of decisions.",
  },
];

/* ---- What we keep on file to make this work. Previously listed as tasks;
   they are infrastructure, so they live with the explanation of how it runs. */
export const GUIDE_ON_FILE: string[] = [
  "Every request becomes a tracked task with an owner and a due date, so nothing depends on anyone's memory.",
  "An encrypted document vault, hosted in India, for policies, prescriptions, property papers and IDs. Shared only as you and your parents agree.",
  "A signed, dated, scope-limited authorisation, so we can represent your parents where a task needs it. They can revoke it in a sentence.",
  "We never ask for passwords, PINs, net-banking or UPI logins. For some tasks an OTP is needed; we say so each time, and only for that step.",
];
