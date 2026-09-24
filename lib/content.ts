import type { IconName } from "@/components/ds/Icon";
import type { TrustItem } from "@/components/ds/TrustBar";
import type { ChatMessage } from "@/components/ds/WhatsAppShowcase";
import type { TaskDef } from "@/components/ds/TaskPicker";

/**
 * All page copy/data lives here, Niro-branded. Testimonial quotes and the
 * user-story figures are placeholder beta content - replace with verbatim,
 * confirmed content before launch (see design/design-system.md).
 */

/* ---- Hero: 5 ad-matched variants, selected by ?v=1..5 (default 3) ---- */
export type HeroVariant = { tag: string; h: string; s: string };

export const HERO_VARIANTS: Record<"1" | "2" | "3" | "4" | "5", HeroVariant> = {
  // v1 - Sole Responder / peace-of-mind (emergency-fear register).
  "1": {
    tag: "Peace of mind",
    h: "Their health, watched over - even from here",
    s: "A named person handles the doctor visits, the hospital runs, and the emergencies you can't fly home for - so from anywhere, you know someone's in the room.",
  },
  // v2 - Remote Administrator / off-your-plate (parents' errands & bills).
  "2": {
    tag: "Off your plate",
    h: "The bills, the paperwork, the mental load - off your plate",
    s: "Niro's associates chase the electricity board, the passport office, and the property tax, so your calls home can just be calls home.",
  },
  // v3 - Your OWN India admin wedge (no crisis, no parental adoption needed).
  "3": {
    tag: "Your India, sorted",
    h: "Your EPF, your flat, your India paperwork - finally handled",
    s: "The stuck PF, the dormant account, the tenant, the OCI renewal - a real person in India does the running around, so you don't lose another weekend to it.",
  },
  // v4 - Default / outcome-led hook (general-purpose, not elder-care; pays off
  // the hero WhatsApp win). No eyebrow.
  "4": {
    tag: "",
    h: "Everything back home you can't be there to handle - handled",
    s: "Bills, repairs, paperwork, emergencies. One person in India who gets it done for your parents and for you - over WhatsApp.",
  },
  // v5 - broad "support for life back home" (matches the P5 ad: "A document. An
  // appointment. A repair. A health concern. One message can get it moving.").
  "5": {
    tag: "Support for life back home",
    h: "Anything waiting back home - one message and it's moving",
    s: "A document, an appointment, a repair, a health worry - for your parents or for you. Text Niro and a real person in India picks it up and gets it done.",
  },
};

// Default hero for traffic without a valid ?v= (organic, referral, or a
// mis-tagged ad that dropped its ?v=). Set to v3 - the "your own India admin"
// angle - which was the best performer and reads more concretely to cold
// visitors than the generic v4. Correctly-tagged ad traffic is unaffected.
export const DEFAULT_VARIANT = "3" as const;

export function resolveVariant(v: string | null): keyof typeof HERO_VARIANTS {
  return v && ["1", "2", "3", "4", "5"].includes(v)
    ? (v as keyof typeof HERO_VARIANTS)
    : DEFAULT_VARIANT;
}

/* ---- Hero "ask" ticker: first-person tasks people text Niro (Duckbill-style
   breadth cue that drives the first scroll). Order is optimized, not as-given:
   open with the converting money/admin angle + one ultra-relatable emotional
   ask (cab for mom), then interleave admin and parents-care so the first few
   bubbles already show the full breadth. Light copy cleanup for one consistent
   "ask" voice. ---- */
export const ASK_TASKS: string[] = [
  "Recover my stuck EPFO money",
  "Book a cab for mom when she sends a voice note",
  "Get my OCI renewal done",
  "Run quarterly blood tests for parents",
  "Sort dad's electricity overbill issue",
  "Find a verified replacement maid for parents",
  "Reactivate my dormant NRO account, no branch visit",
  "Run fortnightly physio for mom",
  "Get my degree apostilled & couriered abroad",
  "Find a backup caretaker for my Nani",
  "Manage the visa process for parents",
  "Get dad quotes from reliable house-painting vendors",
  "Accompany parents to their visa appointment",
];

/* ---- Trust strip (under hero CTA) ---- */
export const TRUST_ITEMS: TrustItem[] = [
  {
    icon: "shield-check",
    text: "Named & verified Niro Assistants",
    sub: "Introduced by photo before day one",
  },
  { icon: "lock", text: "We never ask for passwords", sub: "Not your net-banking login, not your PINs" },
  { icon: "map-pin", text: "We turn up in person", sub: "Hospital, office or their front door" },
  {
    icon: "camera",
    text: "Every task closed with proof",
    sub: "Photos, receipts, a written note",
  },
];

/* ---- The Mirror ---- */
export const MIRROR: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "sunrise",
    title: "3 a.m. timezone math",
    text: "The impossible EPFO claim, a dormant bank account, a utility bill issue troubling Dad - all of it only moves during Indian office hours, which is the dead of your night.",
  },
  {
    icon: "home",
    title: "Problems the parents hide",
    text: "The delinquent, unverified maid, the AC that's been broken for weeks - stuff they struggle with but play down so you won't worry.",
  },
  {
    icon: "map-pin",
    title: "The moments you can't phone in",
    text: "A medical emergency, a visa appointment, a parent travelling alone - the times a phone call isn't enough, and you can't be on the next flight home.",
  },
];

/* ---- How it works ---- */
export const STEPS: { n: string; title: string; text: string }[] = [
  {
    n: "01",
    title: "Runs on WhatsApp",
    text: "Niro creates a WhatsApp family thread, where you and your parents give it tasks.",
  },
  {
    n: "02",
    title: "Ask anything, any way",
    text: "Text, send a voice note in any language, or even call - whatever's natural. Easy for your parents.",
  },
  {
    n: "03",
    title: "A named person owns it",
    text: "Your family manager runs the task to completion - chasing the vendor, standing in the queue, showing up in person when that is what it takes - and closes it with proof.",
  },
];

/* Chat vignette in "How it works" */
export const HOW_MESSAGES: ChatMessage[] = [
  {
    from: "you",
    type: "text",
    text: "Niro, Papa has a cardiology follow-up this week. Can you sort it?",
    time: "8:02 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    badge: "your associate: Priya",
    type: "text",
    text: "On it. I'll call Apollo Jubilee Hills now and find the earliest slot with Dr. Rao. Will confirm before I book anything.",
    time: "8:04 AM",
  },
  { from: "leo", sender: "Niro", type: "voice", dur: "0:24", played: 0.5, time: "8:19 AM" },
  {
    from: "leo",
    sender: "Niro",
    type: "text",
    text: "Booked - Thursday 11:30 AM. Priya will accompany Papa and share the prescription here after. 🙏",
    time: "8:20 AM",
  },
  { from: "you", type: "text", text: "Thank you. Genuinely.", time: "8:21 AM" },
];

/* ---- Hero WhatsApp teaser - a short, everyday, non-medical task so the very
   first impression reads "general-purpose home manager", not elder care. The
   fuller flow (and the medical example) lives in the How-it-works section. */
export const HERO_MESSAGES: ChatMessage[] = [
  {
    from: "you",
    type: "text",
    text: "Papa's electricity bill shows massive overcharges - can you sort it out?",
    time: "9:02 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    badge: "your associate: Priya",
    type: "text",
    text: "Filed a dispute with the electricity board and got the meter re-checked - it was a faulty reading. Bill corrected from ₹19,600 to ₹2,150, excess adjusted to next month. ✅",
    time: "4:48 PM",
  },
  { from: "you", type: "text", text: "Huge relief - thank you 🙏", time: "5:03 PM" },
];

/* ---- Single hero pull-quote - early social proof, above the product detail.
   Concrete and money-related (not elder-care), and the same person appears in
   the testimonials section below for consistency. ---- */
export const HERO_QUOTE = {
  quote:
    "Niro recovered for me ₹4L of my EPF that had been stuck for eight years - I'd completely given up on it.",
  name: "Abhishek, 43",
  location: "Dubai ↔ Gwalior",
  photo: "/people/abhishek.jpg",
};

/* ---- What we handle ---- */
export const HANDLE_GROUPS: {
  name: string;
  items: { icon: IconName; t: string; d: string }[];
}[] = [
  {
    name: "Look after them",
    items: [
      {
        icon: "heart-pulse",
        t: "Family\u2019s health admin & emergency response",
        d: "Check-ups booked and samples collected at home, appointments and reports chased - and an ambulance in minutes with our Niro Assistant at the hospital when it matters.",
      },
      {
        icon: "wrench",
        t: "Household chores, upkeep & staff",
        d: "Repairs, maintenance and pest control, plus verifying domestic help and finding a replacement when one walks out.",
      },
      {
        icon: "home",
        t: "Property management & misc",
        d: "Tenants, rent follow-ups and the small things nobody else will chase - including tech support for your parents\u2019 how-to questions.",
      },
    ],
  },
  {
    name: "Sort the admin",
    items: [
      {
        icon: "wallet",
        t: "Bills, banking & customer support issues",
        d: "Bill reminders and property tax, dormant accounts reactivated, and the wrong electricity bill argued down to what it should have been.",
      },
      {
        icon: "file-text",
        t: "EPFO, tax, govt paperwork & documents",
        d: "Stuck EPFO claims, attestation for NRI needs, CGHS and pension life certificates, India ITR filing.",
      },
      {
        icon: "plane",
        t: "Travel concierge & admin",
        d: "Visa and passport appointments with someone alongside them on the day, and travel booked end to end, cabs included.",
      },
    ],
  },
];

/* ---- User stories (illustrative figures - confirm before launch) ---- */
export const STORIES: {
  name: string;
  route: string;
  situation: string;
  action: string;
  result: string;
}[] = [
  {
    name: "Nikhil",
    route: "Boston ↔ Chandigarh",
    situation:
      "His father's ₹6,400 electricity bill had gone unpaid for two cycles - the portal wanted an OTP sent to a number that no longer worked.",
    action:
      "Niro's associate went to the office in person, paid the bill, and got the connection re-verified under his father's name.",
    result:
      "Fixed by the next morning. Nikhil found out from a voice note, not a disconnection notice.",
  },
  {
    name: "Meera",
    route: "Edison, NJ ↔ Lucknow",
    situation:
      "Her mother's EPF withdrawal had been stuck for eight months - three bank branches, no one giving a straight answer.",
    action:
      "Niro's associate tracked the claim through the EPFO office and corrected a bank-seeding mismatch nobody had flagged.",
    result:
      "₹4.1L released three weeks later. Meera keeps the confirmation screenshot pinned in the family group.",
  },
  {
    name: "Farah",
    route: "Dubai ↔ Hyderabad",
    situation:
      "Her parents needed a passport renewal before visiting her - no slots for six weeks, and neither of them drives anymore.",
    action:
      "Niro's associate booked the Tatkaal slot, drove them there, and stood in line so they didn't have to.",
    result: "New passports in nine days. Farah booked their tickets that same week.",
  },
];

/* ---- Testimonials (PLACEHOLDER beta quotes - replace with verbatim) ---- */
export const PARENT_VOICE = {
  hinglish: "Beta abroad hai, par uska aadmi yahan hai. Mujhe kabhi akela nahi lagta.",
  translation: "My child is abroad, but their person is here. I never feel alone.",
  name: "Kaushalya",
  relation: "Mother, Patiala · Beta member",
};

/**
 * Beta-member testimonials. Written from the interview archetypes in the user
 * research - each balances the NRI's own relief with the enhanced day-to-day
 * the family reports. These are synthesized from research, not verbatim-approved
 * quotes: get each named person's sign-off before public launch.
 */
export const TESTIMONIALS_SHORT: {
  name: string;
  location: string;
  quote: string;
  /** Optional headshot path under /public. Falls back to the placeholder avatar. */
  photo?: string;
}[] = [
  {
    name: "Sudiksha, 31",
    location: "Dallas, US ↔ Patiala, India",
    quote:
      "I automated Papa's quarterly blood tests and finally recovered my stuck EPFO money. When the maid absconded, Papa had a verified replacement in minutes - he's even set up birthday reminders for his whole circle. He's loving it!",
    photo: "/people/sudiksha.jpg",
  },
  {
    name: "Kartik, 34",
    location: "Seattle, US ↔ Nagpur, India",
    quote:
      "Mom can't book a cab on the apps. I used to book one for her from the US every time she had to travel and Dad was away - now she just sends Niro a voice note and it happens.",
    photo: "/people/kartik.jpg",
  },
  {
    name: "Mayank, 36",
    location: "New York, US ↔ Lucknow, India",
    quote:
      "We have property across three cities, and between my schedule I kept missing property-tax filings and rent follow-ups. Niro handles all of it now - the filings, the tenants, the chasing I used to do at midnight.",
    photo: "/people/mayank.jpg",
  },
  {
    name: "Vaibhav, 32",
    location: "San Francisco, US ↔ Patiala, India",
    quote:
      "On an H1B, I can't just fly home. After Papa's heart scare, knowing there's a named person who'll be at the hospital - with full context, acting on our behalf - is what lets me sleep.",
    photo: "/people/vaibhav.jpg",
  },
  {
    name: "Abhishek, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "They recovered ₹4L of my EPFO that had been stuck for eight years - I'd completely given up on it. And Mom now gets at-home massages on a fortnightly rhythm I set up once.",
    photo: "/people/abhishek.jpg",
  },
  {
    name: "Nikita, 38",
    location: "Dubai, UAE ↔ Noida, India",
    quote:
      "Mom lives alone, and I wanted her to be able to visit - but the passport and visa process isn't something she can do alone, and asking my cousin for the same favour again and again felt awkward. Niro handled the whole thing and even accompanied her on the appointment date. Can't wait to see her here in September!",
    photo: "/people/nikita.jpg",
  },
];

/* ---- FAQ ------------------------------------------------------------------
   Nine questions, ordered by what a buyer needs settled before paying rather
   than by what is easiest to answer. Vetting moves to second: it is the only
   answer people re-read (2.25 opens per session against ~1.1 for everything
   else), and it sat at position five.

   These strings are the plain-text source of truth. The main page renders a
   richer version of three of them - bullets in the data answer, a link to Niro
   Assure, a WhatsApp link on the trial - from MAIN_FAQ_ITEMS in VariantB. Keep
   the two in sync. ------------------------------------------------------- */
export const FAQ: { q: string; a: string; special?: boolean }[] = [
  {
    q: "What does the membership include, and what does it not?",
    a: "The membership covers Niro's time - the calls, the portals, the chasing, the coordination - with no cap on how many tasks you send us. It includes one booked on-demand Niro visit of four hours or less each month, your family WhatsApp group, and Niro Assure emergency response. What it doesn't cover is anyone else's costs. Vendor charges and anything ordered through us are billed at exactly what they cost, with no commission added. So are government and legal fees. Additional Niro visits in the same month are $15 per four hours. We tell you the cost and get your go-ahead before we spend a rupee on your behalf.",
  },
  {
    q: "How are Niro Assistants vetted and verified?",
    a: "They are on our payroll - not a marketplace we forward your family's request to. Before anyone joins we test three things: patience and warmth with older parents, communication in the language your family actually speaks, and the operational judgement to chase something until it is finished. Everyone is background-checked and identity-verified. You are introduced to your assistant by name and photo before day one. They work to central SOPs and to the protocols you set for your own family, every task is tracked to completion and closed with proof, and they are appraised on one thing: whether your family is satisfied.",
  },
  {
    q: "Is my family's data safe with Niro?",
    a: "Yes, and here is how we are building it rather than how we are describing it. You keep control: we periodically tell you exactly what data we hold on your family, you can delete all of it in one click, and leaving Niro erases your records permanently within 30 days. Documents live in a secure vault, encrypted in transit and at rest, inaccessible to our staff without an open task that requires them - access is scoped to the task and logged. We never ask for your passwords, PINs or net-banking logins; where a task genuinely needs a one-time code we tell you what we are about to do, ask you at that moment, and use it only for that task. We operate under India's DPDP Act and are building to GDPR-aligned practices for members abroad. Your data is never sold. Questions? hello@tellniro.com reaches the founders.",
  },
  {
    q: "How fast is the emergency response, really?",
    a: "We answer the emergency line in 45 seconds - a person, not a menu. Our ambulance partner dispatches the nearest equipped ambulance within 3 minutes, and median arrival across our launch cities is 20 minutes. A Niro Assistant meets your parents at the hospital, carries their medical history and insurance details, and handles admission. Most of that speed comes from work done before anything happens: on your onboarding call we record their history, medication, blood group, insurance and preferred hospital, and write down your family's protocol. In an emergency we execute that document - we don't improvise. If we miss our own numbers, we tell you in writing the same day.",
  },
  {
    q: "Who actually does the work - humans or AI?",
    a: "Both, in a specific order. Every remote task is run by a human Niro Assistant, with AI doing the parts software is genuinely better at: drafting, tracking, remembering, never letting a follow-up slip between time zones. Nothing reaches your family without a person having checked it, and one named person is accountable for the task from start to finish. And for Niro Visits there is no software involved at all - a Niro Assistant physically goes to the hospital, the government office, or your parents' front door.",
  },
  {
    q: "Can I try Niro before I pay?",
    a: "Yes, twice over. Your first task is free - tell us what you need, we do it, and you decide afterwards whether to join. And once you join, you have a 30-day money-back guarantee: if Niro isn't right for your family in the first 30 days, tell us and we refund you in full. No forms, no exit interview. Between the two, you can see the service work before any money is at risk.",
  },
  {
    q: "Does Niro take decisions on its own?",
    a: "No. Niro understands what you need and does what it takes to get it done, but the decisions stay yours. You set in advance what needs your approval, who we may contact, and what we should never do without asking. Even when we recommend something proactively - a better vendor, a cheaper option, an appointment worth moving - we wait for your go-ahead. We spend nothing on your behalf without telling you the cost first.",
  },
  {
    q: "Which cities is Niro serviceable in today?",
    a: "Bengaluru, Delhi NCR, Mumbai, Hyderabad and Chennai. These are the cities where our assistants are on the ground and where our emergency response times hold. If your family is somewhere else, join anyway and tell us their city. We open new cities where our members' families already are, so your answer genuinely moves yours up the list - and we'll message you the week we get there.",
  },
  {
    q: "How many people can I add, and how many groups can I create?",
    a: "You can add up to 5 family members including yourself to a family group - your parents, a sibling, anyone who needs to be able to ask. You also get a private 1:1 chat with Niro for anything you'd rather keep between us. And you can create up to 2 groups, for two separate family locations - your parents in one city and your in-laws in another, say.",
  },
];

/* ---- Membership plans (shown inside the join flow after email) ---- */
export type Plan = {
  id: "prime" | "global" | "lite" | "quarter";
  name: string;
  price: string;
  per: string;
  sub: string;
  lead?: string;
  features: string[];
  highlight: boolean;
  badge?: string;
};

/**
 * Shared by both SKUs. The two plans are the SAME PRODUCT at two prices, so
 * they carry an identical feature list on purpose - the repetition is what
 * makes "$83 vs $99, nothing else changes" unmistakable at a glance.
 *
 * "Create up to 2 groups" states the multi-household allowance on the page.
 * That supersedes the earlier decision to leave the unit undefined: read as a
 * positive allowance rather than a ceiling, it pre-empts the in-laws question
 * instead of provoking it, and it gives the later multi-household SKU a
 * boundary that already exists in the customer's mind.
 */
export const MEMBERSHIP_FEATURES: string[] = [
  "Unlimited tasks for you or your family",
  "WhatsApp group chat for tasks",
  "Niro assured emergency response",
  "One free booked on-demand Niro visit",
  "Create up to 2 groups",
];

/**
 * The full membership, and the default. Stays first in PLANS so it sets the
 * anchor: the research is unambiguous that whoever anchors first sets the
 * price, and on mobile (~80% of traffic) the cards stack, so first == top.
 */
export const MEMBERSHIP_SINGLE: Plan = {
  id: "prime",
  name: "Monthly",
  price: "$99",
  per: "/month",
  sub: "Your family, fully covered",
  // Balances the two cards' heights against the quarter plan's longer lead.
  // Without it the cheaper card is the taller one, which quietly hands the
  // discount more visual weight than the anchor.
  lead: "The full membership, month to month. No lock-in, cancel any time - your first task is free either way.",
  features: MEMBERSHIP_FEATURES,
  highlight: true,
  badge: "Most families",
};

/**
 * The three-month term, billed once. Deliberately a TERM, not a prepay
 * discount: the research is explicit that this service cannot be judged in
 * thirty days ("these whole maid cycles are too short a thing to test in two
 * weeks"), so three months is how long it takes to know. The card stays on
 * file and rolls to monthly at month four - that is what keeps it a
 * subscription rather than a 90-day trial we have to re-close by hand.
 */
export const MEMBERSHIP_QUARTER: Plan = {
  id: "quarter",
  name: "Three months",
  // Shown as a MONTHLY rate, not as "$250 for 3 months". Two reasons: it puts
  // the two SKUs on the same unit so the saving is legible without arithmetic,
  // and it keeps $250 off the page - the same number is the off-menu 15-task
  // pack, and a salesperson quoting "250" on a call must not be ambiguous.
  price: "$83",
  per: "/month",
  sub: "Save $47 - billed $250 once, today",
  lead: "Exactly the same membership, at a lower monthly rate, for the three months it actually takes to judge us. Continues at $99/month from month four - we remind you seven days before.",
  features: MEMBERSHIP_FEATURES,
  highlight: false,
};

/**
 * Niro Lite - a light annual entry point, re-introduced after the single-SKU
 * period. Three deliberate choices, because a cheap second tier is the easiest
 * way to damage a trust-led proposition:
 *
 * 1. Priced and displayed as $250/YEAR, never as its $20.83/month equivalent.
 *    Six research respondents said unprompted that a sub-$50/mo price makes
 *    them suspect the service isn't staffed by real people ("I would be
 *    suspicious it's basically a glorified wrapper"). An annual number sits
 *    outside that monthly comparison; a per-month figure would sit inside it.
 * 2. The emergency line says exactly what it is. Emergency response is the #1
 *    requested capability (68.9% of task picks) and the least believed one -
 *    so the partner-ambulance version must not borrow the credibility of the
 *    Niro-Assistant-on-the-ground version. It names the absence.
 * 3. It carries no badge and is not the dark card. Lite is the step down, not
 *    the recommendation.
 */
export const NIRO_LITE: Plan = {
  id: "lite",
  name: "Niro Lite",
  price: "$270",
  per: "/year",
  sub: "For a handful of things a year",
  features: [
    "15 tasks, used any time across the year",
    "Same WhatsApp group, same vetted Niro Assistants",
    "Emergency ambulance through our partner network - no Niro Assistant on the ground",
  ],
  highlight: false,
};

/** The two public SKUs. NIRO_LITE is deliberately NOT here - it lives only on
 *  the unlisted /lite page, for the segment that refuses monthly billing. */
export const PLANS: Plan[] = [MEMBERSHIP_SINGLE, MEMBERSHIP_QUARTER];

/**
 * What the fee buys, and what it does not. Stated before payment rather than
 * discovered at the first invoice: "are all tasks covered under the monthly
 * cost?" was a live question in the WhatsApp threads, and an unstated answer
 * becomes a refund request in week two.
 */
export const COVERAGE_NOTE = {
  covers:
    "Niro's time - the calls, the chasing, the coordination - and one booked on-demand Niro assistant visit of four hours or less.",
  excludes:
    "Vendor charges and the cost of any product or service ordered through Niro, at cost and with no commission added. Government and legal fees. Additional Niro visits in the same month, at $15 per four hours.",
  promise: "We tell you the cost and get your go-ahead before we spend a rupee on your behalf.",
};

/** The money-back guarantee, in the words that go on the page. */
export const GUARANTEE =
  "30-day money-back guarantee. If Niro isn't right for your family in the first 30 days, tell us and we refund you in full.";

/* ---- Serviceable cities ----------------------------------------------------
   Five metros at launch. Chosen as the intersection of observed demand (the
   parent-city Pareto across 26 smoke-test households and 14 research
   interviews) and the cities where the emergency SLA below actually holds.
   Roughly 58% of leads who told us where their parents live are covered.
   Deliberately NOT published as a radius: an ambulance SLA does not survive
   150km from the metro, and a service area we cannot hold the SLA in costs
   more credibility than the coverage is worth. Out-of-area families are
   waitlisted by city - that list is how we pick city six. */
export type ServiceCity = { name: string; includes?: string[] };

export const SERVICE_CITIES: ServiceCity[] = [
  { name: "Bengaluru" },
  { name: "Delhi NCR", includes: ["Delhi", "Noida", "Greater Noida", "Ghaziabad", "Gurugram", "Faridabad"] },
  { name: "Mumbai", includes: ["Mumbai", "Navi Mumbai", "Thane"] },
  { name: "Hyderabad", includes: ["Hyderabad", "Secunderabad"] },
  { name: "Chennai" },
];

/* ---- Emergency response ----------------------------------------------------
   The most-requested capability in every instrument we have run (68.9% of task
   selections, 9 of 18 interviews) and the least believed. Respondents asked for
   numbers, not reassurance. These are the numbers. */
export const EMERGENCY_SLA: { value: string; label: string; detail: string }[] = [
  {
    value: "45 sec",
    label: "We pick up",
    detail: "A person answers the emergency line - not a menu, not a queue.",
  },
  {
    value: "3 min",
    label: "Ambulance dispatched",
    detail: "Our ambulance partner dispatches the nearest equipped ambulance to your parents' address.",
  },
  {
    value: "20 min",
    label: "Ambulance arrives",
    detail: "Median arrival across our launch cities, with a paramedic on board.",
  },
];

export const EMERGENCY_STEPS: { title: string; body: string }[] = [
  {
    title: "Anyone in the family can raise it",
    body: "Your parents send a message or a voice note in the WhatsApp group, or call the emergency line. They don't need you awake, and they don't need an app.",
  },
  {
    title: "We call back and dispatch at the same time",
    body: "We do not wait to assess before moving. The ambulance is dispatched while we are still on the phone establishing what has happened.",
  },
  {
    title: "A Niro Assistant goes to the hospital",
    body: "A named person from our team meets your parents there, carries their medical history and insurance details, and handles admission paperwork so nobody is filling forms during a crisis.",
  },
  {
    title: "You are told immediately, and kept updated",
    body: "You get a call the moment we know something real - and a written update in the family group at every step, so you are not piecing it together from missed calls.",
  },
  {
    title: "We follow your protocol, not our judgement",
    body: "You decide in advance which hospital, who gets called first, what needs your approval, and what we should never do without asking. We execute that.",
  },
];

/* =====================================================================
   GULF PAGE (/gulf) — dual-sided, single-SKU ($149) split-test page.
   Copy is verbatim from the Gulf build brief. Kept separate from the
   India-page constants above so neither test contaminates the other.
   ===================================================================== */

/** Reworded Dubai testimonials, dual-sided framing (permission obtained).
 *  Real families only — we ship the two confirmed Dubai stories rather than
 *  invent a third. */
export const GULF_TESTIMONIALS: {
  name: string;
  location: string;
  quote: string;
  /** A verbatim substring of `quote` to emphasise (the outcome sentence).
   *  Never new words — only visual weight on the real quote. */
  highlight?: string;
  photo?: string;
}[] = [
  {
    name: "Abhishek, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "Between a job here in Dubai and my parents in Gwalior, I was the family's default fixer. Niro found us a reliable cleaner within the week - and, separately, got ₹4L of my father's EPF unstuck after eight years. Two things, two countries, one WhatsApp.",
    highlight: "got ₹4L of my father's EPF unstuck after eight years",
    photo: "/people/abhishek.jpg",
  },
  {
    name: "Nikita, 38",
    location: "Dubai, UAE ↔ Noida, India",
    quote:
      "Our cleaner quit right as the kids' Emirates IDs came due - and Mom in Noida needed her passport renewed to visit. Niro handled the search and the paperwork here, and did Mom's passport-and-visa run in India, even going with her to the appointment. Can't wait to have her over in September.",
    highlight: "Niro handled the search and the paperwork here, and did Mom's passport-and-visa run in India",
    photo: "/people/nikita.jpg",
  },
  {
    name: "Kartik, 34",
    location: "Abu Dhabi, UAE ↔ Nagpur, India",
    quote:
      "Having one person for both sides is the whole point. Here in Abu Dhabi they sorted a maths tutor and our car renewal in the same week - and back home, Mom can't book a cab on the apps, so now she just sends Niro a voice note and it happens. Two households, one WhatsApp.",
    photo: "/people/kartik.jpg",
  },
];

/** Short Gulf FAQ — 5 questions, concise answers, no new features introduced. */
export const GULF_FAQ: { q: string; a: string }[] = [
  {
    q: "What can Niro handle in the Gulf?",
    a: "Domestic help, school and camp logistics, tutors, Emirates ID and visa paperwork, home and car admin. If it needs a person to sort out, ask us.",
  },
  {
    q: "Can Niro help my parents in India?",
    a: "Yes - appointments and cabs, home repairs, EPFO and government paperwork, property, and emergency coordination, through their own WhatsApp group.",
  },
  {
    q: "Which Gulf cities do you cover?",
    a: "Dubai, Abu Dhabi and Sharjah today, with Doha, Riyadh and Kuwait City next. In India, most major cities.",
  },
  {
    q: "Do my parents need an app?",
    a: "No. They message Niro or send a voice note in any language.",
  },
  {
    q: "How do you keep my family's information safe?",
    a: "We never ask for your passwords or net-banking logins. Where a task genuinely needs a one-time code, we tell you what we are doing first and use it only for that task. Everything is encrypted, and your records are deleted within 30 days if you leave.",
  },
];

/* Gulf post-signup qualifiers — dual (household here + parents in India). No
   plan question: the page has a single $149 SKU, and a plan chip would repeat
   the price (acceptance: "$149 appears exactly once"). */
export const GULF_QUALIFY_TASKS: string[] = [
  "House staff - hiring, visas & managing",
  "Kids - school, tuition & activities",
  "Government & paperwork - Emirates ID, visas, attestation",
  "Home & everyday admin - bills, maintenance, car, errands",
  "Support parents in India",
];
export const GULF_QUALIFY_WHO: string[] = [
  "My household here",
  "My parents in India",
  "Both",
];
export const GULF_QUALIFY_URGENCY: string[] = [
  "I have a task right now",
  "In the next few weeks",
  "Just exploring",
];

/* ---- First-task picker (order is randomized per visitor at runtime) ---- */
export const TASK_DEFS: TaskDef[] = [
  {
    id: "epf",
    icon: "wallet",
    label: "Recover stuck EPF / PF",
    note: "We track the claim in person until it's released.",
  },
  {
    id: "help",
    icon: "user-check",
    label: "Verify or find domestic help",
    note: "Background-checked, introduced by name and photo.",
  },
  {
    id: "money",
    icon: "file-text",
    label: "India Money Calendar",
    note: "A full bill audit, plus reminders so nothing lapses again.",
  },
  {
    id: "health",
    icon: "heart-pulse",
    label: "Set up parents' health check-up",
    note: "Booked, sample collected at home, reports explained."
  },
];

/* =====================================================================
   /us — NORTH AMERICA DUAL-SIDED SPLIT TEST
   ---------------------------------------------------------------------
   India-primary, US-household as the add-on (deliberately the inverse of
   the Gulf dual page, which led with the local side and lost). Two SKUs so
   the test reads dual willingness-to-pay directly rather than inferring it.
   ===================================================================== */

export const US_PLANS: Plan[] = [
  {
    id: "prime",
    name: "Niro India",
    price: "$99",
    per: "/month",
    sub: "For everything your family needs back home.",
    features: [
      "Dedicated family manager + WhatsApp group",
      "Unlimited tasks for your family in India",
      "Emergency response, with someone on the ground",
    ],
    highlight: false,
  },
  {
    id: "global",
    name: "Niro Prime Global",
    price: "$169",
    per: "/month",
    sub: "For your family in India - and everything you need handled here.",
    lead: "Everything in Niro India, plus your dedicated team for household, family and life admin in the US or Canada.",
    features: [
      "Home repairs & vendor coordination",
      "DMV, registration & vehicle admin",
      "Kids' camps, school forms & signups",
      "Insurance, refunds & warranty chasing",
      "Travel, experiences & gifting",
    ],
    highlight: true,
    badge: "Both sides",
  },
];

/** SKU question on the /us questionnaire - the core measurement of this test. */
export const US_PLAN_CHOICES: { id: string; label: string }[] = [
  { id: "india", label: "Niro India · $99/mo" },
  { id: "global", label: "Niro Prime Global · $169/mo" },
];

/** Deliberately three India-side and three US-side options, so the answers
 *  measure how much of the demand is actually local. */
export const US_QUALIFY_TASKS: string[] = [
  "Parents' health & appointments in India",
  "India paperwork - EPF, pension, banking, property",
  "Emergencies & peace of mind for parents",
  "Our US home - repairs, vendors, DMV",
  "Kids here - camps, school forms, activities",
  "US admin - insurance, subscriptions, refunds",
];

export const US_QUALIFY_WHO: string[] = [
  "My parents in India",
  "My own household here",
  "Both",
];

export const US_QUALIFY_URGENCY: string[] = [
  "I have a task right now",
  "In the next few weeks",
  "Just exploring",
];

/** Reuses the existing US-based beta voices - same people, same quotes as the
 *  main site. Nothing invented for this page. */
export const US_TESTIMONIALS: {
  name: string;
  location: string;
  quote: string;
  highlight?: string;
  photo?: string;
}[] = [
  {
    name: "Vaibhav, 32",
    location: "San Francisco, US ↔ Patiala, India",
    quote:
      "On an H1B, I can't just fly home. After Papa's heart scare, knowing there's a named person who'll be at the hospital - with full context, acting on our behalf - is what lets me sleep.",
    highlight: "a named person who'll be at the hospital",
    photo: "/people/vaibhav.jpg",
  },
  {
    name: "Sudiksha, 31",
    location: "Dallas, US ↔ Patiala, India",
    quote:
      "I automated Papa's quarterly blood tests and finally recovered my stuck EPFO money. When the maid absconded, Papa had a verified replacement in minutes - he's even set up birthday reminders for his whole circle. He's loving it!",
    highlight: "finally recovered my stuck EPFO money",
    photo: "/people/sudiksha.jpg",
  },
  {
    name: "Mayank, 36",
    location: "New York, US ↔ Lucknow, India",
    quote:
      "We have property across three cities, and between my schedule I kept missing property-tax filings and rent follow-ups. Niro handles all of it now - the filings, the tenants, the chasing I used to do at midnight.",
    highlight: "Niro handles all of it now",
    photo: "/people/mayank.jpg",
  },
];

/**
 * The full India scope, grouped the way the ops team actually groups it.
 * Rendered inside the "What can Niro handle in India?" FAQ answer rather than
 * as a page section: leads who want the exhaustive list go looking for it, and
 * putting 25 line items on the page would bury the proposition.
 */
export const INDIA_SCOPE: { title: string; items: string[] }[] = [
  {
    title: "Family\u2019s health admin & emergency response",
    items: [
      "Pre-set periodic health checkups, with home sample collection",
      "Emergency response protocol - Niro arranges the ambulance and an on-ground Niro Assistant",
      "Medicines re-fulfilment",
      "Verified physio, massage, nutritionist and yoga sessions on demand",
      "Doctor appointments: booking and reminders",
      "Health insurance claims and cashless coordination",
    ],
  },
  {
    title: "Household chores, upkeep & staff",
    items: [
      "Verifying domestic help, and finding a replacement or backup",
      "Repairs, maintenance and periodic pest control",
      "Car servicing and repair",
    ],
  },
  {
    title: "Bills, banking & customer support issues",
    items: [
      "Bill reminders and property tax",
      "Customer support threads - wrong electricity bill, internet down, appliance in warranty",
      "Reactivating a dormant bank account, without a branch visit",
      "Chasing a refund or a claim until somebody actually pays it",
    ],
  },
  {
    title: "Travel concierge & admin",
    items: [
      "Visa and passport appointment booking, and paperwork prep",
      "A Niro Assistant alongside them for those appointments",
      "End-to-end domestic travel, cabs included",
      "End-to-end international travel, cabs included",
    ],
  },
  {
    title: "EPFO, tax, govt paperwork & documents",
    items: [
      "Recovery of a stuck EPFO claim",
      "Document attestation - marriage certificate and others - for NRI needs",
      "CGHS renewals and pension life certificate",
      "India ITR filing",
    ],
  },
  {
    title: "Property management & misc",
    items: [
      "Reminders your parents can set themselves, for birthdays and events",
      "Property and tenant management",
      "Tech support for your parents' how-to questions",
    ],
  },
];

/**
 * The other side of the same list: each capability from the "Your life in the
 * US or Canada" column, opened up into what Niro actually does for it. Order
 * mirrors that column exactly, so the FAQ reads as a double-click on the
 * section rather than a second, different list.
 */
export const US_SCOPE: { title: string; items: string[]; note?: string }[] = [
  {
    title: "Vehicle",
    items: [
      "Servicing, repairs and roadside problems - quotes, booking and follow-up",
      "DMV or provincial registration, licence renewals and title paperwork",
      "Insurance quotes, renewals and chasing a claim through",
      "Buying or selling: research, listings and dealer back-and-forth",
    ],
  },
  {
    title: "Household admin & repairs",
    items: [
      "Sourcing and vetting contractors - plumbing, HVAC, electrical, appliances",
      "Booking the visit and following up until it is actually fixed",
      "Recurring services: cleaning, lawn, pest control, snow removal",
      "Utilities, internet and mobile - setup, disputes and switching",
      "Chasing refunds, warranties and bills that are wrong",
    ],
  },
  {
    title: "Restaurant & events bookings",
    items: [
      "Restaurant reservations, including the ones that are hard to get",
      "Birthdays, anniversaries and family gatherings - venue, catering, cake",
      "Tickets for concerts, games and shows",
      "Weekends away and family trips, researched and booked end to end",
      "Gifts and flowers, sourced and delivered on the right day",
    ],
  },
  {
    title: "Health & insurance admin",
    items: [
      "Doctor, dentist and specialist appointments, with reminders",
      "Finding in-network providers and checking coverage before you go",
      "Claims, EOBs and billing disputes chased down",
      "Prescription refills and pharmacy coordination",
    ],
  },
  {
    title: "Kids logistics & school",
    items: [
      "Camp and after-school signups, at the minute registration opens",
      "School forms, permission slips and enrolment paperwork",
      "Classes and coaching: research, trials and scheduling",
      "Birthday parties - venue, invitations, the rest of it",
    ],
  },
  {
    title: "Immigration & paperwork support",
    items: [
      "Application paperwork prepared and assembled",
      "Appointment booking - biometrics, interviews, consulate visits",
      "Document collection, attestation and notarisation",
      "Case status and deadlines tracked, so nothing lapses",
      "Travel documents for family visiting you from India",
    ],
    // Stated up front rather than discovered later: we do the admin, we are not
    // an immigration practice.
    note: "We handle the admin and the chasing, not legal advice - we work alongside your attorney.",
  },
];

/**
 * The vetting answer, broken into its four claims. Leads ask this one in almost
 * every WhatsApp thread and it is the question that decides them, so it gets a
 * scannable answer rather than a paragraph they have to read twice.
 */
export const VETTING: { lead: string; points: { title: string; body: string }[] } = {
  lead: "They are on our payroll - not a marketplace of freelancers we forward your request to.",
  points: [
    {
      title: "Hired for the job your parents actually need",
      body: "We test three things before anyone joins: compassion and patience with older parents, communication skill in the language your family actually speaks, and the operational judgement to chase something until it is finished. Everyone is background-checked and named - you're introduced to your Niro Assistant by photo before day one.",
    },
    {
      title: "They work to central SOPs",
      body: "What happens on a task is defined before it starts. Niro Assistants execute the process, they don't improvise it.",
    },
    {
      title: "And to the protocols you set",
      body: "On top of our SOPs, you decide the rules for your own family: who may be contacted, what needs your approval first, what they should never do without asking you.",
    },
    {
      title: "Every task is monitored individually",
      body: "Not sampled. Each task is tracked to completion and closed with proof - photos, receipts, a written note - so nothing depends on one person remembering.",
    },
  ],
};

export const US_FAQ: { q: string; a: string }[] = [
  {
    q: "Do my parents need to download anything?",
    a: "No. They message Niro on WhatsApp, send a voice note, or call - in English or their local language. Nothing new to learn.",
  },
  {
    // Answer is rendered as the INDIA_SCOPE grid, not this string - kept as the
    // fallback and for anything that reads the FAQ as plain text.
    q: "What can Niro handle in India?",
    a: "Health admin and emergencies, home admin and chores, travel, paperwork and banking - and a good deal else besides.",
  },
  {
    // Answer is rendered as the US_SCOPE list; string is the fallback.
    q: "And what can Niro handle in your US or Canada life?",
    a: "The household admin that eats your evenings: vehicle and repairs, restaurant and event bookings, health and insurance admin, kids' school and camp signups, and immigration paperwork.",
  },
  {
    q: "What's the difference between the two memberships?",
    a: "Niro India covers your family back home. Niro Prime Global covers that plus your household admin here in the US or Canada - one person, both sides.",
  },
  {
    // Merged with the older, shorter "how do you vet" question - two adjacent
    // vetting answers read as though we were dodging one of them. Rendered from
    // VETTING below; this string is the plain-text fallback.
    q: "What is the process for vetting the Niro Assistants who will be interacting with my parents?",
    a: "They are on our payroll, hired for compassion, communication and operational judgement, background-checked and named. They work to central SOPs and to the protocols you set for your own family, and every task is monitored individually and closed with proof.",
  },
  {
    q: "What will you ask my family for, and what will you never ask for?",
    a: "We never ask for passwords, PINs or net-banking logins. Some tasks need a one-time code to complete - an EPFO release, a portal correction - and for those we explain what we are doing, ask at that moment, and use the code only for that task. Your parents never have to decide alone: you set in advance what needs your approval first.",
  },
];

/* =====================================================================
   CAREERS (/careers)
   ---------------------------------------------------------------------
   This page is a trust asset before it is a hiring asset. The single most
   common objection in the research was that Niro might be software wearing
   a human costume - "I would be suspicious it's basically a glorified
   wrapper, they are not people." Named, real, open roles answer that in a
   way no FAQ can. Only list roles we will actually fill this quarter: a
   stale board proves the opposite of the point.
   ===================================================================== */
export type Role = {
  title: string;
  location: string;
  type: string;
  blurb: string;
  looking: string[];
};

export const ROLES: Role[] = [
  {
    title: "Founding Engineer",
    location: "Bengaluru",
    type: "Full-time",
    blurb:
      "The first engineer. You will build the systems our Niro Assistants run on - task routing, the family record, the WhatsApp layer - and you will own what you ship end to end.",
    looking: [
      "5+ years building products people use daily, not internal tools",
      "Comfortable owning a surface from database to interface",
      "Has worked somewhere small enough that the job had no edges",
    ],
  },
  {
    title: "Niro Assistant - Operations",
    location: "Bengaluru",
    type: "Full-time",
    blurb:
      "You are the person our members' parents actually meet. You run their tasks to completion - the hospital visit, the stuck EPFO claim, the plumber who said he would come on Tuesday - and you close each one with proof.",
    looking: [
      "Patience and warmth with older parents - this is the part we test hardest",
      "Fluent in English and Hindi; a third Indian language is a real advantage",
      "The judgement to chase something until it is finished, and to escalate before it is too late",
    ],
  },
];

export const CAREERS_INTRO =
  "Niro is a small team in Bengaluru building an assistant service for families split between India and everywhere else. Everyone who works with our members' parents is on our payroll - we do not forward your family's requests to a marketplace, which is why this page exists at all.";

/* =====================================================================
   PHONE-FIRST QUALIFIERS (main page)
   ===================================================================== */

/** "What are you looking to sort out?" - multi-select. Grouped the way the ops
 *  team scopes work, so an answer maps straight onto who picks the lead up. */
export const SORT_OUT_OPTIONS: string[] = [
  "Family's health admin & emergency response",
  "Household chores, upkeep & staff",
  "Bills, banking & customer support issues",
  "EPFO, tax, govt paperwork & documents",
  "Property management & misc",
  "Travel concierge & admin",
];

/** Who the membership is for. "My India needs" is the own-admin wedge - the
 *  segment that refused monthly billing and wanted a task pack instead, so a
 *  lead answering this way is the one to show Niro Lite on a call. */
export const SORT_OUT_WHO: string[] = [
  "My family in India",
  "My India needs",
  "Both",
];

/** Autocomplete source for the parents' city. A datalist, not a dropdown: it
 *  suggests without constraining, so the long tail still reaches the sheet -
 *  and the long tail is exactly what decides which city we open next. Ordered
 *  metros first, then the tier-2 cities our leads have actually named. */
export const INDIA_CITIES: string[] = [
  "Bengaluru", "Delhi", "New Delhi", "Noida", "Greater Noida", "Ghaziabad",
  "Gurugram", "Faridabad", "Mumbai", "Navi Mumbai", "Thane", "Hyderabad",
  "Secunderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Surat",
  "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna",
  "Vadodara", "Ludhiana", "Agra", "Nashik", "Chandigarh", "Mohali", "Panchkula",
  "Coimbatore", "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  "Visakhapatnam", "Vijayawada", "Mysuru", "Mangaluru", "Hubballi",
  "Madurai", "Tiruchirappalli", "Salem", "Puducherry", "Vellore",
  "Guwahati", "Bhubaneswar", "Cuttack", "Ranchi", "Jamshedpur", "Bokaro",
  "Dhanbad", "Asansol", "Durgapur", "Siliguri", "Raipur", "Jabalpur",
  "Gwalior", "Ujjain", "Kota", "Udaipur", "Jodhpur", "Ajmer", "Bikaner",
  "Amritsar", "Jalandhar", "Patiala", "Dehradun", "Haridwar", "Shimla",
  "Jammu", "Srinagar", "Varanasi", "Prayagraj", "Gorakhpur", "Meerut",
  "Bareilly", "Aligarh", "Rajkot", "Jamnagar", "Bhavnagar", "Gandhinagar",
  "Aurangabad", "Solapur", "Kolhapur", "Goa", "Panaji", "Belagavi",
  "Davanagere", "Shivamogga", "Tirupati", "Guntur", "Nellore", "Warangal",
  "Karimnagar", "Kollam", "Kottayam", "Kannur", "Alappuzha", "Palakkad",
];
