import type { IconName } from "@/components/ds/Icon";
import type { TrustItem } from "@/components/ds/TrustBar";
import type { ChatMessage } from "@/components/ds/WhatsAppShowcase";
import type { TaskDef } from "@/components/ds/TaskPicker";

/**
 * All page copy/data lives here, Niro-branded. Testimonial quotes and the
 * user-story figures are placeholder beta content — replace with verbatim,
 * confirmed content before launch (see design/design-system.md).
 */

/* ---- Hero: 4 ad-matched variants, selected by ?v=1..4 (default 4) ---- */
export type HeroVariant = { tag: string; h: string; s: string };

export const HERO_VARIANTS: Record<"1" | "2" | "3" | "4", HeroVariant> = {
  // v1 — Sole Responder / peace-of-mind (emergency-fear register).
  "1": {
    tag: "Peace of mind",
    h: "Their health, watched over — even from here",
    s: "A named person handles the doctor visits, the hospital runs, and the emergencies you can't fly home for — so from anywhere, you know someone's in the room.",
  },
  // v2 — Remote Administrator / off-your-plate (parents' errands & bills).
  "2": {
    tag: "Off your plate",
    h: "The bills, the paperwork, the mental load — off your plate",
    s: "Niro's associates chase the electricity board, the passport office, and the property tax, so your calls home can just be calls home.",
  },
  // v3 — Your OWN India admin wedge (no crisis, no parental adoption needed).
  "3": {
    tag: "Your India, sorted",
    h: "Your EPF, your flat, your India paperwork — finally handled",
    s: "The stuck PF, the dormant account, the tenant, the OCI renewal — a real person in India does the running around, so you don't lose another weekend to it.",
  },
  // v4 — Default / outcome-led hook (general-purpose, not elder-care; pays off
  // the hero WhatsApp win). No eyebrow.
  "4": {
    tag: "",
    h: "Everything back home you can't be there to handle — handled",
    s: "Bills, repairs, paperwork, emergencies. One person in India who gets it done for your parents and for you — over WhatsApp.",
  },
};

export const DEFAULT_VARIANT = "4" as const;

export function resolveVariant(v: string | null): keyof typeof HERO_VARIANTS {
  return v && ["1", "2", "3", "4"].includes(v)
    ? (v as keyof typeof HERO_VARIANTS)
    : DEFAULT_VARIANT;
}

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
    text: "The impossible EPFO claim, a dormant bank account, a utility bill issue troubling Dad — all of it only moves during Indian office hours, which is the dead of your night.",
  },
  {
    icon: "home",
    title: "The problems they hide",
    text: "The delinquent, unverified maid, the AC that's been broken for weeks — stuff they struggle with but play down so you won't worry.",
  },
  {
    icon: "map-pin",
    title: "The moments you can't phone in",
    text: "A medical emergency, a visa appointment, a parent travelling alone — the times a phone call isn't enough, and you can't be on the next flight home.",
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
    text: "Text, send a voice note in English, Hindi, or Tamil, or even call — whatever's natural. Easy for your parents.",
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
    text: "Booked — Thursday 11:30 AM. Priya will accompany Papa and share the prescription here after. 🙏",
    time: "8:20 AM",
  },
  { from: "you", type: "text", text: "Thank you. Genuinely.", time: "8:21 AM" },
];

/* ---- Hero WhatsApp teaser — a short, everyday, non-medical task so the very
   first impression reads "general-purpose home manager", not elder care. The
   fuller flow (and the medical example) lives in the How-it-works section. */
export const HERO_MESSAGES: ChatMessage[] = [
  {
    from: "you",
    type: "text",
    text: "Papa's electricity bill shows massive overcharges — can you sort it out?",
    time: "9:02 AM",
  },
  {
    from: "leo",
    sender: "Niro",
    badge: "your associate: Priya",
    type: "text",
    text: "Filed a dispute with the electricity board and got the meter re-checked — it was a faulty reading. Bill corrected from ₹19,600 to ₹2,150, excess adjusted to next month. ✅",
    time: "4:48 PM",
  },
  { from: "you", type: "text", text: "Huge relief — thank you 🙏", time: "5:03 PM" },
];

/* ---- Single hero pull-quote — early social proof, above the product detail.
   Concrete and money-related (not elder-care), and the same person appears in
   the testimonials section below for consistency. ---- */
export const HERO_QUOTE = {
  quote:
    "Recovered ₹4L of my EPF that had been stuck for eight years — I'd completely given up on it.",
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
        icon: "shield-check",
        t: "Fraud protection",
        d: "Prevent and monitor cyber-fraud risk with our unique product, Chakra.",
      },
      {
        icon: "clock",
        t: "Health monitoring",
        d: "Pre-set, periodic at-home check-ups — we keep you informed on reports and trends.",
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
        d: "Find and book verified repairs for home or appliance issues — and get the job done.",
      },
      {
        icon: "file-text",
        t: "Passport, visa & government work",
        d: "Appointments booked, forms filled, your EPFO recovery or PR-doc attestation — handled for you.",
      },
    ],
  },
];

/* ---- User stories (illustrative figures — confirm before launch) ---- */
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
      "His father's ₹6,400 electricity bill had gone unpaid for two cycles — the portal wanted an OTP sent to a number that no longer worked.",
    action:
      "Niro's associate went to the office in person, paid the bill, and got the connection re-verified under his father's name.",
    result:
      "Fixed by the next morning. Nikhil found out from a voice note, not a disconnection notice.",
  },
  {
    name: "Meera",
    route: "Edison, NJ ↔ Lucknow",
    situation:
      "Her mother's EPF withdrawal had been stuck for eight months — three bank branches, no one giving a straight answer.",
    action:
      "Niro's associate tracked the claim through the EPFO office and corrected a bank-seeding mismatch nobody had flagged.",
    result:
      "₹4.1L released three weeks later. Meera keeps the confirmation screenshot pinned in the family group.",
  },
  {
    name: "Farah",
    route: "Dubai ↔ Hyderabad",
    situation:
      "Her parents needed a passport renewal before visiting her — no slots for six weeks, and neither of them drives anymore.",
    action:
      "Niro's associate booked the Tatkaal slot, drove them there, and stood in line so they didn't have to.",
    result: "New passports in nine days. Farah booked their tickets that same week.",
  },
];

/* ---- Testimonials (PLACEHOLDER beta quotes — replace with verbatim) ---- */
export const PARENT_VOICE = {
  hinglish: "Beta abroad hai, par uska aadmi yahan hai. Mujhe kabhi akela nahi lagta.",
  translation: "My child is abroad, but their person is here. I never feel alone.",
  name: "Kaushalya",
  relation: "Mother, Patiala · Beta member",
};

/**
 * Beta-member testimonials. Written from the interview archetypes in the user
 * research — each balances the NRI's own relief with the enhanced day-to-day
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
      "I automated Papa's quarterly blood tests and finally recovered my stuck EPFO money. When the maid absconded, Papa had a verified replacement in minutes — he's even set up birthday reminders for his whole circle. He's loving it!",
    photo: "/people/sudiksha.jpg",
  },
  {
    name: "Kartik, 34",
    location: "Seattle, US ↔ Nagpur, India",
    quote:
      "Mom can't book a cab on the apps. I used to book one for her from the US every time she had to travel and Dad was away — now she just sends Niro a voice note and it happens.",
  },
  {
    name: "Mayank, 36",
    location: "New York, US ↔ Lucknow, India",
    quote:
      "We have property across three cities, and between my schedule I kept missing property-tax filings and rent follow-ups. Niro handles all of it now — and I worry far less about the cyber-fraud that targets senior citizens.",
    photo: "/people/mayank.jpg",
  },
  {
    name: "Vaibhav, 32",
    location: "San Francisco, US ↔ Patiala, India",
    quote:
      "On an H1B, I can't just fly home. After Papa's heart scare, knowing there's a named person who'll be at the hospital — with full context, acting on our behalf — is what lets me sleep.",
    photo: "/people/vaibhav.jpg",
  },
  {
    name: "Abhishek, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "They recovered ₹4L of my EPFO that had been stuck for eight years — I'd completely given up on it. And Mom now gets at-home massages on a fortnightly rhythm I set up once.",
    photo: "/people/abhishek.jpg",
  },
  {
    name: "Pavas, 38",
    location: "Dubai, UAE ↔ Noida, India",
    quote:
      "Mom lives alone, and I wanted her to be able to visit — but the passport and visa process isn't something she can do alone, and asking my cousin for the same favour again and again felt awkward. Niro handled the whole thing and even accompanied her on the appointment date. Can't wait to see her here in September!",
    photo: "/people/pavas.jpg",
  },
];

/* ---- FAQ (first item is the trust moment) ---- */
export const FAQ: { q: string; a: string; special?: boolean }[] = [
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
    a: "No — some tasks that require us to work with vendors (for example, EPFO recovery or document work) will be chargeable. Charges are always declared upfront, before we pick up the task.",
  },
  {
    q: "Does Niro take decisions on its own?",
    a: "No. Niro simply understands what you need and does what it takes to fulfil it the best way. Even when it recommends something proactively, it waits for your go-ahead.",
  },
  {
    q: "Is my family's data safe with Niro?",
    a: "Yes — and here's exactly how. We never ask for OTPs, passwords, PINs, or bank logins — not ever, and anyone who does isn't us. We work only on documents you choose to share; never through access to your email, phone, or accounts. Everything is encrypted in transit and at rest, sensitive documents are visible only to the team handling that task, and we operate under India's DPDP Act with GDPR-aligned practices for members abroad. Your data is never sold. Leave Niro, and your family's records are permanently deleted within 30 days. Questions? hello@tellniro.com reaches the founders.",
  },
  {
    q: "Which cities are you serviceable in today?",
    a: "We're currently in beta in a select set of cities, and will publish our list of launch cities soon.",
  },
  {
    q: "Do my parents need to install anything?",
    a: "No. For your parents, everything runs over a WhatsApp group and calls. You get an app that acts as the interface, data vault, and payments platform for the membership.",
  },
  {
    q: "What is the price, and is there a free trial?",
    a: "While we're on the waitlist, we'll launch with a 'first task free' offer, and membership will be priced between $50 and $99 a month.",
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
      "Emergency response — ambulance partner + 24/7 remote coordination",
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
      "Emergency response — Niro's concierge present on the ground with your family",
      "Cyber-fraud cover — insurance up to ₹20L, monitoring & education",
      "$10/mo wellness credits — tests, physio & more",
    ],
    highlight: true,
    badge: "Most popular",
  },
];

/**
 * Single-SKU offer for the pricing experiment's arm B — one $99 "Niro
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
    "Emergency response — Niro's concierge present on the ground with your family",
    "Cyber-fraud cover — insurance up to ₹20L, monitoring & education",
    "$10/mo wellness credits — tests, physio & more",
  ],
  highlight: true,
};

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
