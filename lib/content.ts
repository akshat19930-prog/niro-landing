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
    text: "Named & verified concierges",
    sub: "Introduced by photo before day one",
  },
  { icon: "lock", text: "No passwords or OTPs, ever", sub: "We will never ask. Full stop." },
  { icon: "user-check", text: "Built by NRIs", sub: "We lived this before we built it" },
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
    text: "Text, send a voice note in English, Hindi, or Tamil, or even call - whatever's natural. Easy for your parents.",
  },
  {
    n: "03",
    title: "Humans at your service",
    text: "A dedicated house manager completes your tasks. Outsource the stuff you and your parents don't like doing.",
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
    name: "Protect",
    items: [
      {
        icon: "heart-pulse",
        t: "Emergency response",
        d: "A human showing up and following the protocol you set, within minutes of a medical emergency.",
      },
      {
        icon: "clock",
        t: "Health monitoring & admin",
        d: "Pre-set at-home check-ups, plus the appointments, reports, and insurance paperwork that go with them.",
      },
      {
        icon: "shield-check",
        t: "Cyber-fraud protection",
        d: "Prevent and monitor cyber-fraud risk with the senior citizens in your family.",
      },
    ],
  },
  {
    name: "Handle",
    items: [
      {
        icon: "wallet",
        t: "Bills & payments",
        d: "Bill reminders and issue resolution for utilities, property tax, or ITR.",
      },
      {
        icon: "home",
        t: "Repairs & issues",
        d: "Find and book verified repairs for home or appliance issues - and get the job done.",
      },
      {
        icon: "file-text",
        t: "Passport, visa & government work",
        d: "Appointments booked, forms filled, your EPFO recovery or PR-doc attestation - handled for you.",
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
      "We have property across three cities, and between my schedule I kept missing property-tax filings and rent follow-ups. Niro handles all of it now - and I worry far less about the cyber-fraud that targets senior citizens.",
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

/* ---- FAQ (first item is the trust moment) ---- */
export const FAQ: { q: string; a: string; special?: boolean }[] = [
  {
    q: "What is the membership pricing?",
    a: "While your first task is free, monthly membership pricing ranges between US $55 to $99, depending on your plan.",
  },
  {
    q: "Is Niro a human manager?",
    a: "Every family is allocated a dedicated remote family manager, who is a Niro employee. Some tasks may be completed by Niro's AI, as per your instructions.",
  },
  {
    q: "How fast is the emergency response, really?",
    a: "Check-in calls are instant, and ambulance dispatch is within 3 minutes. We're working to define city-level SLAs.",
  },
  {
    q: "Are all tasks covered under the monthly membership cost?",
    a: "No - some tasks that require us to work with vendors (for example, EPFO recovery or document work) will be chargeable. Charges are always declared upfront, before we pick up the task.",
  },
  {
    q: "Does Niro take decisions on its own?",
    a: "No. Niro simply understands what you need and does what it takes to fulfil it the best way. Even when it recommends something proactively, it waits for your go-ahead.",
  },
  {
    q: "Is my family's data safe with Niro?",
    a: "Yes - and here's exactly how. We never ask for OTPs, passwords, PINs, or bank logins - not ever, and anyone who does isn't us. We work only on documents you choose to share; never through access to your email, phone, or accounts. Everything is encrypted in transit and at rest, sensitive documents are visible only to the team handling that task, and we operate under India's DPDP Act with GDPR-aligned practices for members abroad. Your data is never sold. Leave Niro, and your family's records are permanently deleted within 30 days. Questions? hello@tellniro.com reaches the founders.",
  },
  {
    q: "Which cities are you serviceable in today?",
    a: "We're currently in beta in a select set of cities, and will publish our list of launch cities soon.",
  },
  {
    q: "Do my parents need to install anything?",
    a: "No. For your parents, everything runs over a WhatsApp group and calls. You get an app that acts as the interface, data vault, and payments platform for the membership.",
  },
];

/* ---- Membership plans (shown inside the join flow after email) ---- */
export type Plan = {
  id: "lite" | "prime";
  name: string;
  price: string;
  per: string;
  sub: string;
  lead?: string;
  features: string[];
  highlight: boolean;
  badge?: string;
};

export const PLANS: Plan[] = [
  {
    id: "lite",
    name: "Niro Lite",
    price: "$55",
    per: "/month",
    sub: "The essentials, covered",
    features: [
      "Family WhatsApp group for tasks",
      "8 tasks included",
      "Emergency response - ambulance partner + 24/7 remote coordination",
    ],
    highlight: false,
  },
  {
    id: "prime",
    name: "Niro Prime",
    price: "$99",
    per: "/month",
    sub: "Your family, fully covered",
    lead: "Everything in Lite, plus",
    features: [
      "Unlimited tasks",
      "Emergency response - Niro's concierge present on the ground with your family",
      "Cyber-fraud cover - insurance up to ₹20L, monitoring & education",
      "$10/mo wellness credits - tests, physio & more",
    ],
    highlight: true,
    badge: "Most popular",
  },
];

/**
 * Single-SKU offer for the pricing experiment's arm B - one $99 "Niro
 * membership" with the full benefit set spelled out (no tier to compare
 * against, so Lite's essentials are folded in explicitly).
 */
export const MEMBERSHIP_SINGLE: Plan = {
  id: "prime",
  name: "Niro membership",
  price: "$99",
  per: "/month",
  sub: "Your family, fully covered",
  features: [
    "Dedicated family manager + WhatsApp group for tasks",
    "Unlimited tasks",
    "Emergency response - Niro's concierge present on the ground with your family",
    "Cyber-fraud cover - insurance up to ₹20L, monitoring & education",
    "$10/mo wellness credits - tests, physio & more",
  ],
  highlight: true,
};

/* ---- Post-signup qualifiers (lead quality + needs). Tap-based, all optional;
   captured right after the email so we read intent at peak, from ~100% of
   signups, with no email-open dependency. ---- */
export const QUALIFY_TASKS: string[] = [
  "Parents' health & appointments",
  "Bills, banking & paperwork",
  "EPF / pension / govt work",
  "Home repairs & upkeep",
  "Property / tenants",
  "Emergencies & peace of mind",
];
export const QUALIFY_WHO: string[] = [
  "My parents in India",
  "My own household",
  "Both",
];
export const QUALIFY_URGENCY: string[] = [
  "I have a task right now",
  "In the next few weeks",
  "Just exploring",
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
  photo?: string;
}[] = [
  {
    name: "Abhishek, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "Between a job here in Dubai and my parents in Gwalior, I was the family's default fixer. Niro found us a reliable cleaner within the week — and, separately, got ₹4L of my father's EPF unstuck after eight years. Two things, two countries, one WhatsApp.",
    photo: "/people/abhishek.jpg",
  },
  {
    name: "Nikita, 38",
    location: "Dubai, UAE ↔ Noida, India",
    quote:
      "Our cleaner quit right as the kids' Emirates IDs came due — and Mom in Noida needed her passport renewed to visit. Niro handled the search and the paperwork here, and did Mom's passport-and-visa run in India, even going with her to the appointment. Can't wait to have her over in September.",
    photo: "/people/nikita.jpg",
  },
  {
    name: "Kartik, 34",
    location: "Abu Dhabi, UAE ↔ Nagpur, India",
    quote:
      "Having one person for both sides is the whole point. Here in Abu Dhabi they sorted a maths tutor and our car renewal in the same week — and back home, Mom can't book a cab on the apps, so now she just sends Niro a voice note and it happens. Two households, one WhatsApp.",
    photo: "/people/kartik.jpg",
  },
];

/** 8 Gulf FAQs (brief §4). */
export const GULF_FAQ: { q: string; a: string }[] = [
  {
    q: "What can Niro handle here in the Gulf?",
    a: "Domestic help, school and summer-camp logistics, tutors, children's activities, Emirates ID and visa paperwork, home and car admin, insurance follow-ups. If it needs research, coordination or chasing, ask us.",
  },
  {
    q: "And in India?",
    a: "Parents' appointments and cabs, home repairs, EPFO and government paperwork, property and tenant issues, emergency coordination. Same membership, separate WhatsApp group.",
  },
  {
    q: "Why does having both sides matter?",
    a: "Some things genuinely span two countries. Attesting a marriage certificate means state attestation, then MEA Delhi, then the UAE Embassy, then MOFA here. Most families courier the original and hope. We run the India leg and the Gulf leg as one job.",
  },
  {
    q: "Is emergency response available here too?",
    a: "No — emergency response and the cyber-fraud cover apply to your parents in India only. Here, we handle everyday coordination, not medical emergencies.",
  },
  {
    q: "Which cities?",
    a: "Dubai, Abu Dhabi and Sharjah today, expanding to Doha, Riyadh and Kuwait City. In India, most major cities — tell us where your parents are and we'll confirm.",
  },
  {
    q: "Do my parents need an app?",
    a: "No. WhatsApp, a voice note, or a plain phone call. English, Hindi, Tamil or Malayalam.",
  },
  {
    q: "Is my family's data safe?",
    a: "Yes — and here's how. We never ask for OTPs, passwords, PINs or bank logins, and anyone who does isn't us. We work only on what you choose to share, never through access to your email or accounts. Everything is encrypted, and your records are permanently deleted within 30 days if you leave.",
  },
  {
    q: "What happens after I join?",
    a: "We set up your two WhatsApp groups, learn your household and your parents, and the things that come up regularly. Your first task is free.",
  },
];

/* Gulf post-signup qualifiers — dual (household here + parents in India). No
   plan question: the page has a single $149 SKU, and a plan chip would repeat
   the price (acceptance: "$149 appears exactly once"). */
export const GULF_QUALIFY_TASKS: string[] = [
  "Domestic help & home admin",
  "Kids — school, camps, tutors",
  "Emirates ID & visas",
  "Parents' health & appointments (India)",
  "Paperwork — here & in India",
  "Property in India",
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
    id: "fraud",
    icon: "shield-check",
    label: "Parents' Cyber-Fraud Risk Score",
    note: "A plain-language read on where they're exposed.",
  },
];
