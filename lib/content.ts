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
  "1": {
    tag: "Peace of mind",
    h: "Their health, watched over — even from here.",
    s: "A named associate handles doctor visits, emergencies, and the 2am calls, so you don't have to be in the room to know they're safe.",
  },
  "2": {
    tag: "Off your plate",
    h: "The bills, the paperwork, the mental load — off your plate.",
    s: "Niro's associates chase the electricity board, the passport office, and the plumber, so your calls home can just be calls home.",
  },
  "3": {
    tag: "A real person, there",
    h: "A real person, walking beside them.",
    s: "Meet your family's named, verified associate in India — at the passport office, the hospital, wherever they need someone in the room.",
  },
  "4": {
    tag: "One membership. Everything covered.",
    h: "Your family's own person in India.",
    s: "One membership. A named associate for errands, bills, appointments, and emergencies — so you can be there, from anywhere.",
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
    title: "3am, timezone math",
    text: "The phone rings at an hour that's daytime there and dead of night here. You do the math before you even answer.",
  },
  {
    icon: "file-text",
    title: "The bill nobody can fix",
    text: "An electricity bill in your father's name, a portal that wants an OTP sent to a number that no longer exists.",
  },
  {
    icon: "heart-pulse",
    title: "The appointment someone should attend",
    text: "A cardiology follow-up on a Tuesday morning. Someone should sit in that waiting room. It's rarely you.",
  },
];

/* ---- How it works ---- */
export const STEPS: { n: string; title: string; text: string }[] = [
  {
    n: "01",
    title: "Join the family group",
    text: "Niro joins your family's WhatsApp thread — no new app to install, nothing for your parents to learn.",
  },
  {
    n: "02",
    title: "Ask anything, any way",
    text: "Text or send a voice note, in English, Hindi, or Tamil — whatever's natural. Niro understands all of it.",
  },
  {
    n: "03",
    title: "A named person makes it happen",
    text: "Not a bot reply. Priya, or Arjun, or Meena — a real associate calls, visits, and reports back with proof.",
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
        icon: "shield-check",
        t: "Parents' Cyber-Fraud Risk Score",
        d: "Ongoing scam checks & alerts, in plain language.",
      },
      {
        icon: "heart-pulse",
        t: "Verified emergency response",
        d: "Hospital runs and ambulance calls, someone there in minutes.",
      },
      {
        icon: "user-check",
        t: "Verified domestic help",
        d: "Background-checked, introduced by name and photo.",
      },
    ],
  },
  {
    name: "Handle",
    items: [
      {
        icon: "file-text",
        t: "Bill audits & payments",
        d: "Electricity, gas, KYC — chased down and closed.",
      },
      {
        icon: "home",
        t: "Appliance & home repairs",
        d: "A visit, a fix, photos of the finished job.",
      },
      {
        icon: "wallet",
        t: "Passport & government paperwork",
        d: "Appointments booked, forms filed, queues stood in.",
      },
    ],
  },
  {
    name: "Delight",
    items: [
      { icon: "gift", t: "Birthdays, remembered", d: "Flowers or sweets on the doorstep, on the day." },
      { icon: "home", t: "Ghar ka khana, shipped", d: "A tiffin from home, packed for the journey abroad." },
      {
        icon: "camera",
        t: "Photo memories, curated",
        d: "A weekly photo or two, just because you asked.",
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
    name: "Ankush",
    route: "Boston ↔ Chandigarh",
    situation:
      "His father's ₹6,400 electricity bill had gone unpaid for two cycles — the portal wanted an OTP sent to a number that no longer worked.",
    action:
      "Niro's associate went to the office in person, paid the bill, and got the connection re-verified under his father's name.",
    result:
      "Fixed by the next morning. Ankush found out from a voice note, not a disconnection notice.",
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
  relation: "Mother, Chandigarh · Beta member",
};

export const TESTIMONIALS_SHORT: { name: string; location: string; quote: string }[] = [
  {
    name: "Priyanka",
    location: "Fremont ↔ Chandigarh",
    quote:
      "I used to call Papa every day just to check he was okay. Now I call him because I want to talk about cricket.",
  },
  {
    name: "Rahul",
    location: "Austin ↔ Lucknow",
    quote:
      "Fixed a gas connection issue in two days that I couldn't get anywhere with in two months, from here.",
  },
  {
    name: "Anjali",
    location: "Dubai ↔ Jaipur",
    quote:
      "They sent Amma's blood pressure readings every week for a month without me even asking. That's the part that got me.",
  },
  {
    name: "Vivek",
    location: "Boston ↔ Patna",
    quote: "No app, no login. Just a WhatsApp thread. My parents didn't have to change anything.",
  },
];

/* ---- FAQ (first item is the trust moment) ---- */
export const FAQ: { q: string; a: string; special?: boolean }[] = [
  {
    q: "Will you ever ask for OTPs or passwords?",
    a: "Never. Not once, not for any reason. Niro's associates will never ask your parents — or you — for a password, OTP, PIN, or card number. If someone claiming to be Niro asks for one, it isn't Niro.",
    special: true,
  },
  {
    q: "What does it cost?",
    a: "$69 a month, or $49 a month billed annually. One membership covers unlimited everyday tasks and one dedicated associate for your family. Emergencies are always included — never billed as extras.",
  },
  {
    q: "Which cities are you in today?",
    a: "We open one city at a time so every family gets an associate who actually knows them. Live today in Chandigarh, Lucknow, and Hyderabad, with Pune, Jaipur, and Patna opening this year.",
  },
  {
    q: "How are associates verified?",
    a: "Every associate passes a background check, an in-person interview, and a supervised trial period before they're introduced to your family — by name and photo, before their first task.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime, no questions asked. Your first 30 days are fully refundable — we'd rather earn the second month than lock you into the first.",
  },
  {
    q: "Do my parents need to install anything?",
    a: "No. Everything happens over WhatsApp — a group they're probably already using with the rest of the family. Nothing new to learn, nothing to download.",
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
