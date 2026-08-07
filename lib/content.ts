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
  // v4 — Default / "home manager" ROI + task-offload framing (no eyebrow).
  "4": {
    tag: "",
    h: "Your family's 24/7 India home manager",
    s: "A home manager for NRI families: bills, chores, repairs, and government paperwork — taken off your plate, and your parents'.",
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
  {
    name: "Upgrade their lifestyle",
    items: [
      {
        icon: "camera",
        t: "Regular check-ins",
        d: "Staying on top of anything at home that needs resolving.",
      },
      {
        icon: "message-circle",
        t: "Hassle-free living",
        d: "A cab, a driver, a reliable at-home physio or massage — a WhatsApp text away.",
      },
      {
        icon: "star",
        t: "Privileges",
        d: "Airport-lounge access and other perks they'll love, unlocked with membership.",
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
export const TESTIMONIALS_SHORT: { name: string; location: string; quote: string }[] = [
  {
    // Guilt-carrier / remote-admin blend — stopped being the 2am help-desk.
    name: "Sudiksha, 31",
    location: "London, UK ↔ Patiala, India",
    quote:
      "I'd stopped being the family help-desk at 2am London time. Niro sorted Papa's pension paperwork and now drops by every fortnight — Mummy says the house finally feels looked after.",
  },
  {
    // Remote Administrator — the NRI's own India admin, off the plate.
    name: "Kartik, 34",
    location: "Seattle, US ↔ Nagpur, India",
    quote:
      "My India admin used to eat a full weekend every quarter — EPF, the tenant, property tax. Now it's one message. And my parents get a real person who shows up, not another portal.",
  },
  {
    // Remote Administrator + scam phobia across a property portfolio.
    name: "Harshit, 36",
    location: "Jakarta, Indonesia ↔ Lucknow, India",
    quote:
      "We have property across two cities and I'd lie awake about a scam call reaching Dad. Niro watches the bills, flags the dodgy calls, and closes every task with a photo. That fear is just gone.",
  },
  {
    // Sole Responder — H1B, father's heart scare, emergency cover.
    name: "Ankush, 32",
    location: "San Francisco, US ↔ Patiala, India",
    quote:
      "On an H1B I can't just fly home. After Papa's heart scare, knowing there's a named person who'll be at the hospital before I've even booked a flight — that's the only reason I sleep.",
  },
  {
    // Sole Responder — continuity, stopped flying for a single appointment.
    name: "Dhruva, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "I was flying home every few months just to take Dad to one appointment. Now the same associate takes him and sends me the doctor's notes — and Dad actually looks forward to the visits.",
  },
  {
    // Caregiver-in-Chief — companionship, reliability, paid-vs-favour.
    name: "Paridhi, 38",
    location: "Dubai, UAE ↔ Noida, India",
    quote:
      "I was running a helper rota from Dubai and checking in ten times a day. A service I can rely on beats a favour from relatives who mean well and forget. Now someone sits with Mumma, and Papa's anxiety is so much better.",
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
