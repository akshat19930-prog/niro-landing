import type { IconName } from "@/components/ds/Icon";

/**
 * Copy for /family-guide only.
 *
 * The home page and /what-we-do read GUIDE_SCOPE from lib/content.ts, so the
 * guide's catalogue cannot be reorganised there without reorganising both of
 * them too. This file holds the guide's own arrangement of the same scope: six
 * categories, each with a short core list and a longer "more" list that keeps
 * the rest of the existing breadth. House rules still apply: no long dashes,
 * "AI" spent once on the page (the FAQ), no numbers or claims that are not
 * already on the site.
 */

/* ---- The opening line every guide CTA starts from. It names the page the
   reader is on, so the inbox can tell a guide reader from a cold visitor, and
   it ends mid-sentence on purpose: the reader finishes it. */
const FROM_GUIDE = "Hi Niro, I'm reading your family guide.";

export const GUIDE_FIRST_TASK_MESSAGE =
  `${FROM_GUIDE} Here's the first task I'd like to hand over: `;

export const GUIDE_SOMETHING_ELSE_MESSAGE =
  `${FROM_GUIDE} I need something else done in India: `;

export const GUIDE_FINAL_MESSAGE =
  `${FROM_GUIDE} Here's what needs doing, and the city: `;

/* ---- Six examples of what someone can ask. Illustrative, and labelled as
   such on the page: not customer conversations, not completed tasks. */
export const GUIDE_EXAMPLES: string[] = [
  "Dad needs a follow-up appointment. Can you arrange the visit and the cab?",
  "Our cook has stopped coming. Can you help find someone?",
  "My EPFO claim keeps getting rejected. Can someone work out what's wrong?",
  "Mum has called customer care three times. The refund still hasn't come.",
  "My parents are visiting me. Can you help organise the trip?",
  "The tenant is moving out next month. Can you coordinate the handover?",
];

export type GuideCategory = {
  /** Stable anchor, also the suffix on the click beacon's placement. */
  id: string;
  title: string;
  icon: IconName;
  /** One line under the title, visible before the card is opened. */
  preview: string;
  /** The core examples. */
  core: string[];
  /** The rest of the existing breadth, under a secondary disclosure. */
  more: string[];
  /** A caveat shown with the more list, where one exists. */
  note?: string;
  cta: string;
  message: string;
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "health",
    title: "Health & appointments",
    icon: "heart-pulse",
    preview: "Doctor visits, home tests, medicines, physiotherapy",
    core: [
      "Book doctor appointments and coordinate transport.",
      "Arrange home sample collection and collect reports.",
      "Coordinate prescription refills and medicine deliveries.",
      "Find physiotherapists, attendants and other support at home.",
    ],
    more: [
      "A health file for each parent: conditions, current medicines and strengths, allergies, treating doctors.",
      "A policy audit: what your parents' cover actually pays, in plain language.",
      "Appointments in another city, with someone to go along if needed.",
      "Regular tests on a schedule, with the reports collected and filed.",
      "BP, sugar and weight readings recorded on chat, sent to the doctor before each visit, and flagged when one looks off.",
      "Medication and supplement reminders kept running.",
      "Yoga trainers and dieticians found, vetted and negotiated.",
    ],
    note: "Nobody at Niro gives medical advice. Emergencies run on the Niro Assure protocol below.",
    cta: "Ask about health support",
    message: `${FROM_GUIDE} I'd like help with a health or appointment task for my family. Here's what needs doing: `,
  },
  {
    id: "home",
    title: "Home & household help",
    icon: "wrench",
    preview: "Cooks and maids, repairs, cleaning, appliance servicing",
    core: [
      "Find cooks, maids, drivers and household help.",
      "Arrange plumbers, electricians and appliance technicians.",
      "Coordinate deep cleaning, pest control and painting.",
      "Follow up on quotes, appointments and unfinished work.",
    ],
    more: [
      "Your existing staff verified for peace of mind: ID, criminal and address checks.",
      "Same-day help for a burst pipe, a power cut, a stuck lift or a lock-out.",
      "Water tank and sump cleaning, chimney, RO and inverter servicing.",
      "The vendor found, the price negotiated, and the work seen through remotely.",
      "Vehicle upkeep: insurance, PUC, challans and servicing, and a verified driver when one is needed.",
      "Remote tech help: the wifi, the TV, the printer, the smart lock, the apps.",
      "Groceries ordered over chat.",
    ],
    cta: "Ask about help at home",
    message: `${FROM_GUIDE} I'd like help with something at my parents' home. Here's what needs doing: `,
  },
  {
    id: "paperwork",
    title: "Paperwork & renewals",
    icon: "file-text",
    preview: "EPFO, pension certificates, Aadhaar/PAN, tax coordination",
    core: [
      "Investigate EPFO claim issues and coordinate the next steps.",
      "Help with pension life certificates and document updates.",
      "Coordinate India tax paperwork with the relevant professional.",
      "Organise documents and follow up on renewals and applications.",
    ],
    more: [
      "The name, date of birth and UAN mismatches behind most EPFO refusals, worked through.",
      "Dormant accounts, unclaimed dividends, IEPF holdings, NPS and PPF traced, and the claims filed.",
      "Form 26AS and AIS checked for TDS mismatches and missing credits.",
      "Tax residency certificates, Form 10F and DTAA paperwork coordinated.",
      "NRO repatriation paperwork, within the annual limit.",
      "Tenant-side TDS on your rented-out property, followed through.",
      "Aadhaar and PAN corrections, linking and updates.",
    ],
    note: "Nothing here is tax or legal advice. Where a chartered accountant or lawyer is needed, we coordinate with yours or help you find one.",
    cta: "Ask about paperwork",
    message: `${FROM_GUIDE} I'd like help with some paperwork or a renewal in India. Here's what needs doing: `,
  },
  {
    id: "banking",
    title: "Banking, bills & refunds",
    icon: "wallet",
    preview: "KYC, dormant accounts, wrong bills, unresolved complaints",
    core: [
      "Coordinate KYC updates and dormant-account requirements.",
      "Follow up on incorrect utility and subscription bills.",
      "Pursue refunds, warranty claims and unresolved complaints.",
      "Track recurring bills and upcoming payment dates.",
    ],
    more: [
      "Electricity, water, gas, broadband, DTH, society dues and insurance premiums listed with their due dates.",
      "Blocked and frozen accounts: the paperwork and branch follow-up needed to get them reviewed.",
      "Bank mandate updates coordinated.",
      "Banking complaints escalated step by step, up to the RBI Ombudsman where needed.",
      "Telecom and electricity complaints taken up each company's escalation ladder.",
      "Mis-sold subscriptions and refused warranties, contested.",
    ],
    note: "We do the chasing and keep you informed. We cannot promise what a bank or a company will decide.",
    cta: "Ask about a banking or billing issue",
    message: `${FROM_GUIDE} I'd like help with a banking, bill or refund issue. Here's what needs doing: `,
  },
  {
    id: "travel",
    title: "Travel & getting around",
    icon: "plane",
    preview: "Cabs, flights, visas, airport assistance",
    core: [
      "Research and book flights, hotels and train journeys.",
      "Coordinate visa paperwork and appointments.",
      "Arrange airport assistance and wheelchair requests.",
      "Book local cabs and handle changes to travel plans.",
    ],
    more: [
      "Reliable city cabs arranged and tracked, with the driver's details sent to you.",
      "Tatkal bookings, tried the moment the window opens. Seats go in minutes, so we can't promise one, but we'll give it our best shot every time.",
      "Passport and OCI renewals, and someone to sit through the appointment.",
      "Itineraries, check-ins, and re-bookings when a flight moves.",
      "Fares watched for price before booking.",
    ],
    note: "Visa decisions and appointment slots are the authorities' to give. We prepare, book and follow up.",
    cta: "Ask about travel",
    message: `${FROM_GUIDE} I'd like help with travel or getting around. Here's what needs doing: `,
  },
  {
    id: "property",
    title: "Property & tenants",
    icon: "home",
    preview: "Inspections, tenants, agreements, repairs and handovers",
    core: [
      "Coordinate tenant sourcing and screening.",
      "Arrange inspections and condition reports.",
      "Follow up on agreements, renewals and property paperwork.",
      "Organise repairs, painting, access and key handovers.",
    ],
    more: [
      "Periodic inspections of the house or the let-out flat, with dated photographs.",
      "Rent agreement registration and police verification coordinated.",
      "Property tax, water and electricity transfers, and khata or mutation follow-ups.",
      "Repairs and painting supervised, with an invoice at actuals.",
      "Locking up, and access for agents or contractors.",
    ],
    cta: "Ask about your property",
    message: `${FROM_GUIDE} I'd like help with a property or tenant matter. Here's what needs doing: `,
  },
];

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
