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
    h: "Their health, watched over — even from here.",
    s: "A named person handles the doctor visits, the hospital runs, and the emergencies you can't fly home for — so from anywhere, you know someone's in the room.",
  },
  // v2 — Remote Administrator / off-your-plate (parents' errands & bills).
  "2": {
    tag: "Off your plate",
    h: "The bills, the paperwork, the mental load — off your plate.",
    s: "Niro's associates chase the electricity board, the passport office, and the property tax, so your calls home can just be calls home.",
  },
  // v3 — Your OWN India admin wedge (no crisis, no parental adoption needed).
  "3": {
    tag: "Your India, sorted",
    h: "Your EPF, your flat, your India paperwork — finally handled.",
    s: "The stuck PF, the dormant account, the tenant, the OCI renewal — a real person in India does the running around, so you don't lose another weekend to it.",
  },
  // v4 — Default / "home manager" ROI + task-offload framing.
  "4": {
    tag: "One membership. Everything covered.",
    h: "Your family's home manager in India.",
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
    text: "Your EPF claim, a dormant bank account, a utility bill in Dad's name — all of it only moves during Indian office hours, which is the dead of your night.",
  },
  {
    icon: "home",
    title: "Hidden problems at home",
    text: "The maid who stopped showing up, the AC that's been broken for weeks — the things they play down on calls so you won't worry.",
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
    title: "Join the family group",
    text: "Niro joins your family's WhatsApp thread — no new app to install, nothing for your parents to learn.",
  },
  {
    n: "02",
    title: "Ask anything, any way",
    text: "Text or send a voice note in English, Hindi, or Tamil — whatever's natural. And your parents never have to type or learn an app; they can just pick up the phone.",
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
        icon: "heart-pulse",
        t: "Verified emergency response",
        d: "A named person on the phone in minutes and on the ground fast — on a protocol you set up front.",
      },
      {
        icon: "shield-check",
        t: "Parents' scam & fraud shield",
        d: "We catch the OTP traps and dodgy calls, and explain them in plain language.",
      },
      {
        icon: "user-check",
        t: "Vetted, ongoing care staff",
        d: "Background-checked help found or replaced — the same trusted face, not a rotating cast.",
      },
    ],
  },
  {
    name: "Handle",
    items: [
      {
        icon: "file-text",
        t: "Bill audits & payments",
        d: "Electricity, gas, KYC, property tax — chased down and closed.",
      },
      {
        icon: "home",
        t: "Appliance & home repairs",
        d: "A visit, a fix, and photos of the finished job.",
      },
      {
        icon: "wallet",
        t: "Passport & government paperwork",
        d: "Appointments booked, forms filed, queues stood in.",
      },
    ],
  },
  {
    name: "Look in on them",
    items: [
      {
        icon: "camera",
        t: "Regular check-in visits",
        d: "A face at the door, and a written update after — photos, notes, how they really are.",
      },
      {
        icon: "message-circle",
        t: "Company that shows up",
        d: "Someone to sit with them and take them out — noticing what a video call can't.",
      },
      {
        icon: "clock",
        t: "Home monitoring, if you want it",
        d: "Optional check-ins and alerts, so a quiet week never hides a real problem.",
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
    q: "Will you ever ask for OTPs or passwords?",
    a: "Never. Not once, not for any reason. Niro's associates will never ask your parents — or you — for a password, OTP, PIN, or bank login. For everyday spending we use a small prepaid float that you top up and cap; anything larger or sensitive, you approve and pay directly. If someone claiming to be Niro asks for an OTP, it isn't Niro.",
    special: true,
  },
  {
    q: "How fast is “emergency,” really?",
    a: "You set a protocol with us up front — blood group, preferred hospital, who to call first — so the plan exists before the night it's needed. When something happens, a named associate is on the phone within minutes and moving on the ground immediately, and you approve the big decisions from wherever you are. We share our written response commitment for your city before you ever have to use it.",
  },
  {
    q: "Will this take over things my parents can still do themselves?",
    a: "No — we assist, we never take over. Your parent stays in charge: cc'd on the thread, asked before anything happens. The point is to lift the load that's genuinely too much, not the daily rhythm that keeps them themselves.",
  },
  {
    q: "What does it cost?",
    a: "$69 a month, or $49 a month billed annually — less than half the cost of one untrained live-in helper. One membership covers a dedicated associate and unlimited everyday tasks; emergencies are always included, never billed as extras. Start monthly; most families move to annual once they can't imagine going without it.",
  },
  {
    q: "How are associates verified?",
    a: "Every associate passes a background check, an in-person interview, and a supervised trial before they're introduced to your family — by name and photo, before their first task. And it's the same person each time, not a rotating cast.",
  },
  {
    q: "Which cities are you in today?",
    a: "We open one city at a time so every family gets an associate who actually knows them. Live today in Chandigarh, Lucknow, and Hyderabad, with Pune, Jaipur, and Patna opening this year.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime, no questions asked. Your first 30 days are fully refundable — we'd rather earn the second month than lock you into the first.",
  },
  {
    q: "Do my parents need to install anything?",
    a: "No. Everything happens over WhatsApp — and your parents can simply call or send a voice note. Nothing new to learn, nothing to download.",
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
