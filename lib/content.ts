import type { IconName } from "@/components/ds/Icon";
import type { TrustItem } from "@/components/ds/TrustBar";
import type { ChatMessage } from "@/components/ds/WhatsAppShowcase";
import type { TaskDef } from "@/components/ds/TaskPicker";

/**
 * All page copy/data lives here, Niro-branded. Testimonial quotes and the
 * user-story figures are placeholder beta content - replace with verbatim,
 * confirmed content before launch (see design/design-system.md).
 */

/* ---- Share card: the WhatsApp / social link preview for EVERY page. One
   line for the whole site, by Paarth's call (Sept 2026). Pages keep their own
   preview images but take this title and description. ---- */
export const SHARE_CARD = {
  title: "Niro - Your family's India assistant",
  description:
    "Errands, bills, appointments and emergencies for your parents, and your own India paperwork too. All over WhatsApp.",
};

/* ---- Hero: 5 ad-matched variants, selected by ?v=1..5 (default 3) ---- */
export type HeroVariant = { tag: string; h: string; s: string };

export const HERO_VARIANTS: Record<"1" | "2" | "3" | "4" | "5", HeroVariant> = {
  // v1 - Sole Responder / peace-of-mind (emergency-fear register).
  "1": {
    tag: "Peace of mind",
    h: "Their health, watched over - even from here",
    s: "Someone from Niro handles the doctor visits, the hospital runs, and the emergencies you can't fly home for - so from anywhere, you know someone's in the room.",
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
    text: "Verified Niro Assistants",
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
    title: "One person owns it",
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
        t: "Property management & others",
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
/**
 * The testimonial cards on the home page.
 *
 * Two members and two parents, because the parents' voice answers a question
 * the members' cannot: whether the person in India actually uses this, or
 * whether it stays one more thing their child manages for them. Sunita and
 * Tara say it in their own words, which is worth more than any claim we make
 * about adoption.
 *
 * `headline` is the line that carries the card. `body` is what they actually
 * had done, in their own phrasing, lightly corrected for spelling only.
 */
export type MemberStory = {
  name: string;
  location: string;
  headline: string;
  body: string;
  photo?: string;
};

export const MEMBER_STORIES: MemberStory[] = [
  {
    name: "Pavas, 36",
    location: "Sweden",
    headline: "I just hand Niro the things I don\u2019t want to chase.",
    body:
      "I use Niro for my India ITR, paperwork, managing my properties and my India visit logistics. I send a message and they figure out what needs to be done.",
    photo: "/people/pavas.jpg",
  },
  {
    name: "Kartik, 38",
    location: "San Francisco \u2194 Mumbai",
    headline: "My parents tell me what they need. I tell Niro.",
    body:
      "Managing a house and three household staff used to be a headache for my dad, and sometimes for me. Niro handles it entirely now.",
    photo: "/people/kartik.jpg",
  },
  {
    name: "Sunita, 66",
    location: "Bengaluru \u00b7 mother of Kartik, Seattle",
    headline: "Now I don\u2019t have to ask my son for every little thing.",
    body:
      "Niro booked me cabs with a voice note and arranges doctor appointments in Delhi, and I don\u2019t have to bother my son too much anymore.",
    photo: "/people/sunita.jpg",
  },
  {
    name: "Tara, 69",
    location: "Ghaziabad \u00b7 mother of Mayank, Dubai",
    headline: "They sorted the house, and then planned our whole trip.",
    body:
      "Niro found us a cook when the previous one absconded, and managed the visa process for my Dubai trip. An assistant even accompanied me to the centre, which was a relief.",
    photo: "/people/tara.jpg",
  },
];

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
    name: "Ankit, 37",
    location: "San Francisco, US ↔ Patiala, India",
    quote:
      "Niro runs my parents' health the way I always wanted to - medication reminders and refills, Dad's BP readings recorded and sent to our family doctor before each appointment, Mom enrolled for yoga and a fortnightly massage. Love it.",
    photo: "/people/vaibhav.jpg",
  },
  {
    name: "Abhishek, 43",
    location: "Dubai, UAE ↔ Gwalior, India",
    quote:
      "Niro handles everything for my mom living alone - the three visiting staff including her attendant, the groceries, and her regular doctor appointments.",
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
    q: "Which cities is Niro serviceable in today?",
    a: "Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chennai and Kolkata. These are the cities where our assistants are on the ground and where our emergency response times hold. If your family is somewhere else, join anyway and tell us their city. We open new cities where our members' families already are, so your answer genuinely moves yours up the list - and we'll message you the week we get there.",
  },
  {
    q: "How are Niro Assistants vetted and verified?",
    a: "They are on our payroll - not a marketplace we forward your family's request to. Before anyone joins we test three things: patience and warmth with older parents, communication in the language your family actually speaks, and the operational judgement to chase something until it is finished. Everyone is background-checked and identity-verified. You are introduced to your assistant by name and photo before day one. They work to central SOPs and to the protocols you set for your own family, every task is tracked to completion and closed with proof, and they are appraised on one thing: whether your family is satisfied.",
  },
  {
    q: "Can I try Niro before I pay?",
    a: "Yes. Your first task is free - tell us what you need, we do it, and you decide afterwards whether to join. And once you join, you can cancel any time.",
  },
  {
    q: "What does the membership include, and what does it not?",
    a: "The membership covers Niro's time - the calls, the portals, the chasing, the coordination - with no cap on how many tasks you send us. It includes one booked on-demand Niro visit of four hours or less each month, your family WhatsApp group, and Niro Assure emergency response. What it doesn't cover is anyone else's costs. Vendor charges and anything ordered through us are billed at exactly what they cost, with no commission added. So are government and legal fees. Additional Niro visits in the same month are $15 per four hours. We tell you the cost and get your go-ahead before we spend a rupee on your behalf.",
  },
  {
    q: "Is my family's data safe with Niro?",
    a: "Yes, and here is how we are building it rather than how we are describing it. You keep control: we periodically tell you exactly what data we hold on your family, you can delete all of it in one click, and leaving Niro erases your records permanently within 30 days. Documents live in a secure vault, encrypted in transit and at rest, inaccessible to our staff without an open task that requires them - access is scoped to the task and logged. We never ask for your passwords, PINs or net-banking logins; where a task genuinely needs a one-time code we tell you what we are about to do, ask you at that moment, and use it only for that task. We operate under India's DPDP Act and are building to GDPR-aligned practices for members abroad. Your data is never sold. Questions? hello@tellniro.com reaches the founders.",
  },
  {
    q: "How fast is the emergency response, really?",
    a: "We answer the emergency line in 45 seconds - a person, not a menu. Our ambulance partner dispatches the nearest equipped ambulance within 5 minutes, and median arrival across our launch cities is 20 minutes. A Niro Assistant meets your parents at the hospital, carries their medical history and insurance details, and handles admission. Most of that speed comes from work done before anything happens: on your onboarding call we record their history, medication, blood group, insurance and preferred hospital, and write down your family's protocol. In an emergency we execute that document - we don't improvise. If we miss our own numbers, we tell you in writing the same day.",
  },
  {
    q: "Who actually does the work - humans or AI?",
    a: "Both, in a specific order. Every remote task is run by a human Niro Assistant, with AI doing the parts software is genuinely better at: drafting, tracking, remembering, never letting a follow-up slip between time zones. Nothing reaches your family without a person having checked it, and one person is accountable for the task from start to finish. And for Niro Visits there is no software involved at all - a Niro Assistant physically goes to the hospital, the government office, or your parents' front door.",
  },
  {
    q: "Does Niro take decisions on its own?",
    a: "No. Niro understands what you need and does what it takes to get it done, but the decisions stay yours. You set in advance what needs your approval, who we may contact, and what we should never do without asking. Even when we recommend something proactively - a better vendor, a cheaper option, an appointment worth moving - we wait for your go-ahead. We spend nothing on your behalf without telling you the cost first.",
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
 * The quarterly membership: $83/month, charged $250 every three months, for as
 * long as the family stays. It is a standing rate, NOT a first-term discount
 * that reverts to $99 (Paarth, 26 Sept 2026) - so no copy anywhere may say
 * "then $99/month" or imply the quarter is a trial.
 *
 * Still displayed as a MONTHLY rate, which puts both SKUs on the same unit and
 * makes the saving legible without arithmetic. The $250 charge is now stated
 * too, because it recurs and the member should know what leaves their card.
 * Watch the collision on calls: $250 is also the off-menu Niro Lite year.
 */
export const MEMBERSHIP_QUARTER: Plan = {
  id: "quarter",
  name: "Quarterly",
  price: "$83",
  per: "/month",
  sub: "Save $16 a month, billed $250 every three months",
  lead: "Exactly the same membership at a lower monthly rate, billed every three months for as long as you stay. Cancel any time and the next quarter is not charged.",
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
/** Shown as the last FAQ rather than at the pricing fold. On the page it sat
 *  between the price and the CTA, where the only thing it did was put a list
 *  of exclusions in front of someone who had just decided to buy. As a FAQ it
 *  is still findable by anyone who wants it, and /terms carries the binding
 *  version either way. */
export const COVERAGE_NOTE = {
  covers:
    "Niro's time - the calls, the chasing, the coordination - and one booked on-demand Niro assistant visit of four hours or less.",
  excludes:
    "Vendor charges and the cost of any product or service ordered through Niro, at cost and with no commission added. Government and legal fees. Additional Niro visits in the same month, at $15 per four hours.",
  promise: "We tell you the cost and get your go-ahead before we spend a rupee on your behalf.",
};

/** The coverage note as the FAQ's last question, which is where it now lives
 *  on the page. Composed from COVERAGE_NOTE so the two can never drift, and
 *  declared AFTER it: an earlier version declared it first with an empty
 *  answer and filled it in by mutation, which the bundler dropped, so the
 *  question shipped with nothing under it. */
export const COVERAGE_FAQ = {
  q: "What does the membership cover, and what is billed separately?",
  a:
    "Your membership covers " + COVERAGE_NOTE.covers +
    " Billed separately, at actual cost: " + COVERAGE_NOTE.excludes.charAt(0).toLowerCase() + COVERAGE_NOTE.excludes.slice(1) +
    " " + COVERAGE_NOTE.promise,
};

/**
 * The money-back guarantee, shown at the pricing fold and stated in full on
 * /terms.
 *
 * It sits next to the CTA rather than in the small print because the research
 * is consistent that the bottleneck here is trust, not price: people are not
 * weighing $99 against a cheaper rival, they are weighing it against the risk
 * that nobody turns up. A refund promise answers that question directly, and
 * answering it is worth more at the moment of decision than it is buried on a
 * page nobody opens.
 *
 * Keep it unconditional. Softening this into "subject to review" or similar
 * reassures nobody and reads as a trap, which is worse than making no promise
 * at all.
 */
export const GUARANTEE = {
  title: "Money-back guarantee",
  body:
    "Not for you? Ask any time up to the 25th day after you pay and we refund in full. No deductions."
};


/* ---- Serviceable cities ----------------------------------------------------
   Six metros. Chosen as the intersection of observed demand (the
   parent-city Pareto across 26 smoke-test households and 14 research
   interviews) and the cities where the emergency SLA below actually holds.
   Roughly 58% of leads who told us where their parents live are covered.
   Deliberately NOT published as a radius: an ambulance SLA does not survive
   150km from the metro, and a service area we cannot hold the SLA in costs
   more credibility than the coverage is worth. Out-of-area families are
   waitlisted by city - that list is how we picked Kolkata, city six
   (30 Sept 2026), and how the next one gets picked. */
export type ServiceCity = { name: string; includes?: string[] };

export const SERVICE_CITIES: ServiceCity[] = [
  { name: "Bengaluru" },
  { name: "Delhi NCR", includes: ["Delhi", "Noida", "Greater Noida", "Ghaziabad", "Gurugram", "Faridabad"] },
  { name: "Mumbai", includes: ["Mumbai", "Navi Mumbai", "Thane"] },
  { name: "Hyderabad", includes: ["Hyderabad", "Secunderabad"] },
  { name: "Chennai" },
  { name: "Kolkata", includes: ["Kolkata", "Howrah", "Salt Lake", "New Town"] },
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
    value: "5 min",
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
    body: "Someone from our team meets your parents there, carries their medical history and insurance details, and handles admission paperwork so nobody is filling forms during a crisis. In Bengaluru today; launching in our other cities soon.",
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
   GULF PAGE (/gulf) - dual-sided, single-SKU ($149) split-test page.
   Copy is verbatim from the Gulf build brief. Kept separate from the
   India-page constants above so neither test contaminates the other.
   ===================================================================== */

/** Reworded Dubai testimonials, dual-sided framing (permission obtained).
 *  Real families only - we ship the two confirmed Dubai stories rather than
 *  invent a third. */
export const GULF_TESTIMONIALS: {
  name: string;
  location: string;
  quote: string;
  /** A verbatim substring of `quote` to emphasise (the outcome sentence).
   *  Never new words - only visual weight on the real quote. */
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

/** Short Gulf FAQ - 5 questions, concise answers, no new features introduced. */
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

/* Gulf post-signup qualifiers - dual (household here + parents in India). No
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
   /us - NORTH AMERICA DUAL-SIDED SPLIT TEST
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
      "On an H1B, I can't just fly home. After Papa's heart scare, knowing there's someone who'll be at the hospital - with full context, acting on our behalf - is what lets me sleep.",
    highlight: "someone who'll be at the hospital",
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
    title: "Property management & others",
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
      body: "We test three things before anyone joins: compassion and patience with older parents, communication skill in the language your family actually speaks, and the operational judgement to chase something until it is finished. Everyone is background-checked, and you're introduced to your Niro Assistant by photo before day one.",
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
    a: "They are on our payroll, hired for compassion, communication and operational judgement, and background-checked. They work to central SOPs and to the protocols you set for your own family, and every task is monitored individually and closed with proof.",
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
/**
 * The eight free first tasks.
 *
 * One definition, two surfaces: the picker on the last step of the join modal,
 * and the cards on /freetask. /freetask is a static asset in public/ and
 * cannot import this file, so its copy is kept in sync BY HAND. If you change
 * a label or a scope here, change it there too. (The same hand-sync applies to
 * the attribution keys that page re-reads; there is a note to match in its
 * script block.)
 *
 * `label` is first person on purpose. The lead is telling us what they want
 * done, not reading a menu of services, and the answer goes straight into a
 * WhatsApp message they send in their own voice.
 *
 * `scope`, `needs` and `notIncluded` are shown BEFORE the handoff rather than
 * left to the assistant to explain in chat. Two reasons. Naming what is not
 * included is what stops a free task quietly growing into a paid one nobody
 * agreed to. And surfacing `needs` up front means the lead's first message can
 * carry the input, which collapses a three-message back-and-forth into one:
 * that exchange is where most of the drop-off between a lead and a started
 * task actually happens.
 *
 * There is deliberately NO turnaround here. We used to print one per task,
 * which made a promise on a page nobody was staffed to keep: a free task that
 * misses a published deadline costs more trust than the deadline ever bought.
 * The assistant commits to a date in the chat, once the task is scoped and we
 * know what we have taken on.
 */
export type FreeTask = {
  /** Stable key written to the sheet. Never reuse one for different work. */
  id: string;
  label: string;
  /** How the task is named inside the prefilled WhatsApp message. */
  waText: string;
  scope: string;
  needs: string;
  notIncluded: string;
};

/** The ninth option on the last step: none of the eight, tell us yourself.
 *  Kept out of FREE_TASKS because it has no scope of its own to show. */
export const OTHER_ID = "other";

export const FREE_TASKS: FreeTask[] = [
  {
    id: "epf",
    label: "Help me recover my PF/EPF money",
    waText: "recovering my PF/EPF money",
    scope:
      "A short report: what is blocked, why, how long it will take to clear and what it will cost. The specific rejection reason named, which is the part nobody else gives you, with the sequence of steps to fix it.",
    needs: "UAN and claim history",
    notIncluded:
      "Filing the corrected claim. That one is a member task, and we quote it before we touch it.",
  },
  {
    id: "bank-sim",
    label: "Help me unblock a bank account or a SIM",
    waText: "unblocking a bank account or a SIM",
    scope:
      "We find out why it is frozen: KYC, dormancy, an address mismatch or a re-verification, and tell you exactly what clears it, naming the branch or store that can do it.",
    needs: "The bank or operator, and whose name it is in",
    notIncluded:
      "Going in to submit it. That one is a member task, and we quote it before we touch it.",
  },
  {
    id: "insurance",
    label: "Find gaps with my family’s health insurance policy",
    waText: "finding the gaps in my family’s health insurance",
    scope:
      "A two-page gap report with the rupee figure at the top and the reasoning under it: room-rent sub-limit, co-pay, disease waiting periods, day-care exclusions, network hospitals near your parents’ home, and the cheapest way to close the biggest gap.",
    needs: "The policy PDF",
    notIncluded:
      "Buying or porting the cover. We tell you what to fix; the buying stays yours.",
  },
  {
    id: "professional",
    label: "Find me domestic staff, a physio, a painter or a property tenant",
    waText: "finding me someone trusted in India",
    scope:
      "Three named people with quoted rates, a negotiated package price, availability windows and our vetting note. A warranty floor of 30 days on plumbing and electrical, 180 days on appliance work.",
    needs: "The job and the area",
    notIncluded:
      "Supervising the work once it starts. That one is a member task.",
  },
  {
    id: "vehicle",
    label: "Health check that India vehicle (challans, PUC, insurance)",
    waText: "a health check on our vehicle in India",
    scope:
      "One page per vehicle: outstanding challans with amounts, PUC expiry, insurance expiry and service due. Runs entirely on public VAHAN records, so we need no login of yours.",
    needs: "Registration numbers",
    notIncluded:
      "Paying the challans or renewing the cover. Member tasks, quoted first.",
  },
  {
    id: "phone-safety",
    label: "Make my parent’s phones safe from cyber scams",
    waText: "making my parents’ phones safe from scams",
    // The old version of this promised that nobody from Niro, a bank or the
    // government would ever ask for an OTP. We do ask for OTPs on some tasks,
    // so the claim was not ours to make. Passwords, PINs and net-banking
    // logins are the keepable version and carry the same safety value.
    scope:
      "Medical ID filled in, your number set as emergency contact, SOS configured, text size fixed. Plus the five-minute callback rule taught and left on a fridge card: nobody legitimate asks for a password, a PIN or a net-banking login, so hang up and call back on a number you already had. Before-and-after screenshots to you.",
    needs: "15 minutes with your parent",
    notIncluded: "Ongoing monitoring. This is a one-off setup.",
  },
  {
    id: "support-case",
    label: "Sort out a tricky support/refund/claim/billing issue",
    waText: "sorting out a support and billing issue",
    scope:
      "We take the case over in writing: every reference number, the escalation path, the ombudsman or regulator route if it comes to that, and a written note of exactly where it stands and what happens next.",
    needs: "The company, the account and what went wrong",
    // Said plainly because a billing dispute genuinely cannot be closed in two
    // days, and a free task that quietly overruns is worse than one that was
    // honest about its edges.
    notIncluded:
      "Running the case to its end, which can take weeks. The free task gets it properly opened and escalated.",
  },
  {
    id: "yoga",
    label: "Get a parent started with online Yoga - Arrange a trial class",
    waText: "getting a parent started with online yoga",
    scope:
      "Vetted instructors for remote sessions over video, 1:1 or in a small group, with negotiated rates. We arrange a trial class and pay for it. Your parent sits in, decides for themselves, and picks the one who stays.",
    needs: "Their timings, and the language they are comfortable in",
    notIncluded:
      "The ongoing package, which your parent chooses and we set up once they are happy.",
  },
];

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
 *  lead answering this way is the one to show Niro Lite on a call.
 *
 *  SUPERSEDED Oct 2026 by SORT_OUT_USAGE below, which asks the same thing with
 *  enough resolution to read the positioning test. Kept because rows written
 *  before that date hold these three values, and the report still has to be
 *  able to interpret them. */
export const SORT_OUT_WHO: string[] = [
  "My family in India",
  "My India needs",
  "Both",
];

/**
 * How the member expects to use Niro, asked first on the last step.
 *
 * This is the positioning test's own question. Arm B2 claims buyers stall
 * because the pitch implies getting their parents on board, so the thing worth
 * measuring is where a lead actually sits on that line: entirely their own
 * tasks at one end, their family using Niro directly at the other. Four points
 * rather than three, because the interesting split is between coordinating FOR
 * the family and the family talking to Niro themselves, which the old "Both"
 * collapsed into one answer.
 *
 * Written to the same `whoFor` field as the question it replaces, so the sheet
 * column and the report keep working. Rows from before Oct 2026 carry the
 * SORT_OUT_WHO values instead.
 */
export const SORT_OUT_USAGE: string[] = [
  "Mostly for my own tasks",
  "For my tasks + my family's tasks through me",
  "Mainly for my family's tasks - I'll be coordinating and sending their requests",
  "For my family, with them using Niro directly too via text or call",
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

/* =====================================================================
   FAMILY GUIDE (/family-guide) - unlisted. The page sales sends after the
   first call, replacing the "What we do" PDF. House style here: no long
   dashes anywhere, "AI" spent once (the FAQ question), and the emergency
   times match EMERGENCY_SLA above.
   ===================================================================== */

export type GuideItem = {
  t: string;
  tag?: string;
  /** Optional "learn more" target, rendered as a link after the text. */
  href?: string;
  hrefLabel?: string;
};

export const GUIDE_SCOPE: {
  title: string;
  icon: IconName;
  intro: string;
  items: GuideItem[];
}[] = [
  {
    title: "Family’s health admin & emergency response",
    icon: "heart-pulse",
    intro:
      "From quarterly check-ups that run themselves to a calm, planned response when something goes wrong.",
    items: [
      { t: "A health file for each parent: conditions, current medicines and strengths, allergies, treating doctors" },
      {
        // Was four separate lines: hospitals chosen in advance, the 24x7
        // first-response line, ambulance dispatch, and an Assistant at the
        // hospital. They are one promise, and the detail lives on its own page.
        t: "Reliable emergency response with Niro Assure: hospitals chosen in advance, a 24x7 first-response line, ambulance dispatch and tracking, and a Niro Assistant at the hospital",
        tag: "Bengaluru",
        href: "/niro-assure/",
        hrefLabel: "Learn more",
      },
      { t: "A policy audit: what your parents’ cover actually pays, in plain language" },
      { t: "Appointments with their own doctor, in their city or another, with someone to go along if needed" },
      { t: "Prescription refills with two-person verification, plus medication and supplement reminders kept running" },
      { t: "Regular health tests on a schedule, with home sample collection and reports collected" },
      { t: "BP, sugar and weight readings recorded on chat, trends tracked, sent to the doctor before each visit, and flagged when one looks off" },
      { t: "Physiotherapists, attendants, yoga trainers and dieticians found, vetted, negotiated and supervised" },
    ],
  },
  {
    title: "Household chores, upkeep & staff",
    icon: "wrench",
    intro:
      "The leaking tap, the AC, the help who didn’t turn up, the cab Mum can’t book herself. Your parents shouldn’t have to struggle with it, and you shouldn’t have to drop your day for it.",
    items: [
      { t: "An asset register for each home: appliances, models, purchase dates, warranties, AMCs" },
      { t: "A maintenance calendar that follows the Indian seasons: AC before summer, geyser before winter, roof before the monsoon" },
      { t: "Sourcing, verifying and managing domestic staff, including attendants" },
      { t: "Your existing staff verified for peace of mind: ID, criminal and address checks" },
      { t: "Any maintenance vendor task: the vendor found, the price negotiated, and the work seen through remotely. Water tank and sump cleaning, pest control, chimney, RO and inverter servicing, painting" },
      { t: "Same-day help for a burst pipe, a power cut, a stuck lift or a lock-out" },
      { t: "Vehicle watch: insurance, PUC, challans and servicing, and a verified driver when one is needed" },
      { t: "Remote tech help: the wifi, the TV, the printer, the smart lock, the apps" },
      { t: "A cab booked or the groceries ordered, over chat" },
    ],
  },
  {
    title: "EPFO, tax, govt paperwork & documents",
    icon: "file-text",
    intro:
      "Government portals, forms and follow-ups wear everyone down. For us it’s a normal day at work.",
    items: [
      { t: "EPFO claims filed, and rejected ones unstuck, including the name, date of birth and UAN fixes behind most refusals" },
      { t: "Dormant accounts, unclaimed dividends, IEPF holdings, NPS and PPF traced and recovered" },
      { t: "Form 26AS and AIS checked for TDS mismatches and missing credits" },
      { t: "Tax residency certificates, Form 10F and DTAA coordination" },
      { t: "NRO repatriation paperwork, within the annual limit" },
      { t: "Tenant-side TDS on your rented-out property, followed through" },
      { t: "Pension life certificates submitted before the deadline" },
      { t: "Aadhaar and PAN corrections, linking and updates" },
      { t: "A yearly check of everything in India that quietly lapses when a family lives abroad" },
      { t: "One renewal calendar: passport, OCI, visas, policies, AMCs, licences, so neither you nor your parents have to remember" },
      { t: "An encrypted vault, hosted in India, for policies, prescriptions, property papers and IDs" },
      { t: "A signed, scope-limited authorisation, so we can represent your parents where needed" },
    ],
  },
  {
    title: "Travel concierge & admin",
    icon: "plane",
    intro:
      "A train ticket for Mum, a reliable cab to visit a relative, or the full visa run so they can come and see you.",
    items: [
      { t: "Flights and hotels researched, watched for price, and booked" },
      { t: "Regular train bookings, handled end to end" },
      {
        t: "Tatkal bookings, tried the moment the window opens. Seats go in minutes, so we can’t promise one, but we’ll give it our best shot every time",
        tag: "Best effort",
      },
      { t: "Reliable city cabs arranged and tracked, with the driver’s details sent to you" },
      { t: "Visa applications, appointments and document packs for their trip to you" },
      { t: "Passport and OCI renewals, and someone to sit through the appointment" },
      { t: "Airport assistance, wheelchair requests and meet-and-greet" },
      { t: "Itineraries, check-ins, and re-bookings when a flight moves" },
    ],
  },
  {
    title: "Bills, banking, customer support issues & refund claims",
    icon: "wallet",
    intro:
      "The wrong utility bill, the blocked account, the customer care number nobody answers. We do the chasing.",
    items: [
      { t: "Every recurring payment listed with its due date, then tracked, flagged and reconciled" },
      { t: "Electricity, water, gas, broadband, DTH, society dues and insurance premiums tracked" },
      { t: "Blocked, frozen and dormant accounts reactivated" },
      { t: "Bank KYC re-verification and mandate updates coordinated" },
      { t: "Banking complaints escalated step by step, up to the RBI Ombudsman where needed" },
      { t: "Telecom and electricity complaints taken up each company’s escalation ladder" },
      { t: "Wrong bills, refused warranties, mis-sold subscriptions and stuck refunds, fought" },
    ],
  },
  {
    title: "Property management & others",
    icon: "home",
    intro:
      "Periodic visits, tenants, agreements, repairs. Everything you’d hire a property manager for, from the same team.",
    items: [
      { t: "Periodic inspections of the house or the let-out flat, with dated photographs" },
      { t: "Tenant sourcing, screening and replacement" },
      { t: "Rent agreements, renewals, registration and police verification coordinated" },
      { t: "Property tax, water and electricity transfers, and khata or mutation follow-ups" },
      { t: "Maintenance, repairs and painting supervised, with an invoice at actuals" },
      { t: "Locking up, key handovers, and access for agents or contractors" },
      { t: "Gifting, couriering, and the long tail of small things that are easy from Bengaluru and hard from New Jersey" },
    ],
  },
];

export const GUIDE_ASSURE: { title: string; body: string; tag?: string }[] = [
  {
    title: "You set the protocol in advance.",
    body: "Hospital, doctor, medical history, insurance details, the relative nearby to call. Agreed with us beforehand, so nothing needs deciding in the moment.",
  },
  {
    title: "A person answers within 45 seconds.",
    body: "One emergency number, saved in your phone and your family’s. No menu, no queue.",
  },
  {
    title: "An ambulance is dispatched within 5 minutes,",
    body: "with advanced or basic life support as needed. Our response partner already has the pickup and drop addresses, so there is nothing to explain.",
  },
  {
    title: "A Niro Assistant goes to the hospital",
    body: "to handle the logistics and keep you updated, acting only on your instructions. Live in Bengaluru, other cities coming soon.",
    tag: "Bengaluru",
  },
  {
    title: "The health file arrives before your parent does:",
    body: "conditions, medicines, allergies, treating doctor and policy details, so nobody is piecing together a medical history in a corridor.",
  },
  {
    title: "The insurance desk is worked,",
    body: "not the billing counter: pre-authorisation submitted, room category defended, enhancement filed mid-stay.",
  },
  {
    title: "Hardware alerts, coming soon.",
    body: "We’re adding hardware partners so an Apple Watch fall, a pendant button or ambient sensing can raise the alarm before anyone has to.",
    tag: "In build",
  },
];

/* Niro Visits, as the guide tells it. One visit a month is in the membership;
   extra visits are a flat $15 per four hours. The per-purpose rate card from
   the Visits ops doc is deliberately NOT here, and neither are its service
   targets: the site makes no written guarantees. */
export const GUIDE_VISIT_PRICE = {
  included: "One visit a month, up to four hours, is part of your membership.",
  extra: "Extra visits are $15 for up to four hours.",
};

export const GUIDE_VISIT_MONTHLY: string[] = [
  "Time with your parents",
  "A walk round the home: taps, AC, geyser, meters, anything leaking or loose",
  "Anything they mention while we\u2019re there",
  "Anything you\u2019ve asked us to look at",
];

export const GUIDE_VISITS: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Home maintenance & vendors",
    icon: "wrench",
    body: "Painting, plumbing, electrical, AC service, cleaning, pest control, appliances. We inspect, get quotes, compare them, and stay in the room while the work is done and paid for.",
  },
  {
    title: "Doctor\u2019s appointments",
    icon: "heart-pulse",
    body: "Picked up from home, through registration and into the consult. We take notes, sort the prescription, and book the follow-up.",
  },
  {
    title: "Visa appointments",
    icon: "plane",
    body: "Documents checked before leaving home, and someone with them at the centre until it\u2019s done.",
  },
  {
    title: "Government offices & banks",
    icon: "file-text",
    body: "Bank branches, the registrar, pension offices, passport and Aadhaar counters. We sit in the queue with them, or for them.",
  },
  {
    title: "Property audit",
    icon: "home",
    body: "The house or the let-out flat, documented: condition, meter readings, dues status and documents, with photos.",
  },
  {
    title: "Tenant handover",
    icon: "users",
    body: "Keys, an inventory and photos of the flat\u2019s condition when a tenant moves in or out.",
  },
];

export const GUIDE_VISIT_DETAILS: { title: string; icon: IconName; points: string[] }[] = [
  {
    title: "Before, during and after a visit",
    icon: "calendar",
    points: [
      "Book on-request visits with three working days\u2019 notice.",
      "A day before, you and your parents get the assistant\u2019s name, photo and phone number.",
      "We ask before taking photos, and photograph only what the visit is about.",
      "Your parents can say no to any part of a visit, and their say is final.",
      "You can ask for the same assistant each time. We\u2019ll do our best to arrange it.",
    ],
  },
  {
    title: "The visit report",
    icon: "camera",
    points: [
      "Usually in the family group the same day.",
      "Why we went, what we checked (with photos), and what got done.",
      "Costs, with the bills attached.",
      "Any decision you need to make, with the quotes side by side.",
      "Anything we noticed, written as what we saw, not a diagnosis.",
      "A short version for your parents, in their language.",
    ],
  },
  {
    title: "Who comes to the door",
    icon: "user-check",
    points: [
      "Niro employees on contract and salary. Not gig workers, not agency staff.",
      "Checked before hiring: government photo ID, current and permanent address, past employment, education certificates, and a court-record check through a licensed agency.",
      "Two references called by us, and an in-person interview.",
      "Trained on home checklists, noting down medical instructions, reading contractor quotes, consent, and when to escalate.",
    ],
  },
  {
    title: "What a visit isn\u2019t",
    icon: "shield-check",
    points: [
      "We don\u2019t do repairs ourselves. We find the right person and watch the job.",
      "No medical, legal, tax or property-valuation advice.",
      "No personal care: bathing, feeding, lifting, giving medicines or nursing.",
      "Assistants never take cash from your parents for their time, never take anything from vendors, and never hold cards or passwords.",
    ],
  },
];

export const GUIDE_STEPS: { title: string; body: string }[] = [
  {
    title: "The group opens.",
    body: "You, your parents and your Niro Assistants in one WhatsApp group. Plus a private chat with you, and an optional one with a parent who’d rather ask separately.",
  },
  {
    title: "You ask, it gets done, with proof.",
    body: "Every request becomes a tracked task with an owner and a due date. Field work closes with photos and an invoice at actuals. We take no commission from any vendor, so we pick the right one, not the one that pays.",
  },
  {
    title: "It gets proactive.",
    body: "As we get to know your family, we stop waiting to be asked: the appointment that’s due, the document about to expire, the filing deadline, the unpaid bill, the yearly maintenance.",
  },
];

export const GUIDE_FAQ: { q: string; a: string }[] = [
  {
    q: "What does the membership include, and what doesn’t it?",
    a: "Niro’s time: the calls, the portals, the chasing and the coordination, with no cap on how many tasks you send us. It also includes one booked Niro visit of up to four hours a month. It doesn’t cover third-party costs, like the plumber, the ambulance, the lab, government fees or the appliance itself. You see those before they’re incurred, and they’re billed at actuals with the invoice attached. We add no margin and take no vendor commission. Extra visits in the same month are $15 per four hours.",
  },
  {
    q: "Who actually does the work: people or AI?",
    a: "Both, and the split matters. Software drafts, researches, tracks deadlines and keeps things from slipping. People make the judgement calls, speak to vendors and hospitals, and show up in person. Nobody at Niro gives medical advice. In an emergency we follow the protocol you set. You always know which person is looking after your family.",
  },
  {
    q: "Is my family’s data safe with Niro?",
    a: "We never ask for passwords, PINs, net-banking or UPI logins, or access to your parents’ email and messages. Anyone asking for those in our name isn’t us. What we hold instead is a signed, dated, scope-limited authorisation your parents can revoke in a sentence, and an encrypted document vault hosted in India.",
  },
];

export const GUIDE_FOUNDERS: { name: string; photo: string; bio: string }[] = [
  {
    name: "Akshat Pandey",
    photo: "/people/akshat.jpg",
    bio: "11 years building consumer startups across healthcare (core team at Curefit), fintech (business head, payments at Navi) and ecommerce. Second-time founder.",
  },
  {
    name: "Paarth Dhar",
    photo: "/people/paarth.jpg",
    bio: "12 years building consumer startups across fintech (VP Growth at AngelOne) and ecommerce. Second-time founder who exited his last company to Angel One.",
  },
];

/* ===========================================================================
   Positioning A/B: arm A (/) vs arm B2 (/start)
   ===========================================================================

   The hypothesis, from sales: buyers get convinced, go to ask their parents,
   and drop. Arm B2 sells Niro as the NRI’s OWN 1:1 assistant for everything
   back home, so they can start without anyone’s sign-off, and the family group
   becomes an optional later step rather than the premise.

   Price, offer and scope are identical in both arms. Only the story changes,
   so only the strings that carry the story live here. Everything else is
   shared, which is the point: a difference the test did not intend is a
   difference that confounds it.

   The arm itself is resolved in lib/variant.ts from a first-touch cookie. */

export type ArmCopy = {
  /** Hero subtext, one paragraph per entry. */
  heroSub: string[];
  howHeading: string;
  /** The short descriptor row under the hero CTA. */
  heroDescriptors: string[];
  howStep1Title: string;
  howVisitsTitle: string;
  howVisitsBullets: string[];
  howDonePoints: { lead: string; rest: string }[];
  familyEyebrow: string;
  familyHeading: string;
  familyBody: string[];
  visitsTrustBody: string;
  membershipFeatures: string[];
};

/** The "for your parents" section, shared verbatim by both arms. */
const ARM_COPY_A_FAMILY = {
  eyebrow: "For your parents in India",
  heading: "The struggles they don’t tell you about, quietly solved.",
  body: [
    "The haggling with vendors. The fear of being scammed. The maid who stopped turning up. The grocery run on a bad knee. The ten apps they were never going to learn.",
    "All of it solved with one WhatsApp message, or a voice note in the language they actually speak.",
  ],
};

export const ARM_COPY: Record<"A" | "B2", ArmCopy> = {
  A: {
    heroSub: [
      "Your family’s personal assistant in India, getting things done for them and for you. Peace of mind for you, unmatched convenience for them - all delivered over WhatsApp.",
    ],
    howHeading: "You ask. We do the running around.",
    heroDescriptors: [
      "Remote Assistant",
      "WhatsApp groups",
      "Shows up in person when needed",
    ],
    howStep1Title: "You or your family asks",
    howVisitsTitle: "Niro Visits - booked on demand",
    howVisitsBullets: [
      "Home maintenance inspections",
      "Accompanying your parents to appointments",
      "Standing in the queue at the office, so they don\u2019t",
    ],
    howDonePoints: [
      {
        lead: "Closed with proof",
        rest: "photos, receipts and a note in the group.",
      },
      {
        lead: "Your parents ask freely",
        rest: "the small things they used to swallow finally get handled.",
      },
    ],
    familyEyebrow: "For your parents in India",
    familyHeading: "The struggles they don\u2019t tell you about, quietly solved.",
    familyBody: [
      "The haggling with vendors. The fear of being scammed. The maid who stopped turning up. The grocery run on a bad knee. The ten apps they were never going to learn.",
      "All of it solved with one WhatsApp message, or a voice note in the language they actually speak.",
    ],
    visitsTrustBody:
      "A Niro Assistant who shows up to support your family with anything: a doctor appointment, a visa appointment, a government office task or a home repair vendor chore. Booked, on demand.",
    membershipFeatures: MEMBERSHIP_FEATURES,
  },

  B2: {
    heroSub: [
      "Your personal assistant for life in India - for you, and your family.",
      "One 1:1 WhatsApp chat. Tell Niro, & we research, call, coordinate, get it done & show up if needed.",
    ],
    howHeading: "Your tasks. Your family’s tasks. Same Niro.",
    heroDescriptors: [
      "24x7 1:1 WhatsApp assistant",
      "Monthly or on-demand Niro Visits",
      "Emergency response",
      "Optional family group chat for tasks",
    ],
    howStep1Title: "You tell Niro, in your 1:1 chat",
    howVisitsTitle: "Monthly Niro Visits, or booked on demand",
    howVisitsBullets: [
      "Accompanying for visa, passport and doctor appointments",
      "Accompanying for government paperwork",
      "Home inspection or maintenance visits",
      "Monthly check-ins and home staff audits",
    ],
    howDonePoints: [
      {
        lead: "Closed with proof",
        rest: "photos, receipts and a note in your chat.",
      },
      {
        lead: "Family-friendly assistant",
        rest: "option to add parents or siblings to a group, so they can tell Niro directly.",
      },
    ],
    // Identical to arm A on purpose: this section tested well as it is, and the
    // 1:1 story is already carried by the hero, step one and the outcome lines.
    familyEyebrow: ARM_COPY_A_FAMILY.eyebrow,
    familyHeading: ARM_COPY_A_FAMILY.heading,
    familyBody: ARM_COPY_A_FAMILY.body,
    visitsTrustBody:
      "A Niro Assistant who shows up to support your family with anything: a doctor appointment, a visa appointment, a government office task or a home repair vendor chore. Monthly, or booked on demand.",
    membershipFeatures: [
      "Unlimited tasks for you or your family",
      "24x7 1:1 WhatsApp assistant",
      "Niro assured emergency response",
      "One free booked on-demand Niro visit",
      "Optional family group chats - up to 2 groups",
    ],
  },
};

/**
 * The B2 hero chat: five 1:1 task threads, one per screen.
 *
 * Every opener is the member relaying something a parent mentioned, which is
 * the arm’s whole pitch in miniature: the parent said it in passing on a call,
 * and the member turned it into a done thing without asking anything of them.
 * The last thread is the only one where the family appears, and it appears as
 * the member’s choice, which is where the group belongs in this story.
 */
export const B2_HERO_THREADS: {
  me: string;
  system?: string;
  niro: string;
}[] = [
  {
    me: "Amma mentioned her knee pain is back. Can you start weekly physio for her?",
    niro: "Done. Home physio booked every Tuesday at 10am. First session went well, notes shared with you.",
  },
  {
    me: "Papa mentioned a property tax issue, and the tenant is leaving. Sort out both this week?",
    niro: "Done. Tax dues cleared, receipt attached. Three verified tenants shortlisted, viewings on Saturday.",
  },
  {
    me: "Amma mentioned her visa appointment is this Friday and she’s nervous about going alone. Book a Niro Visit?",
    niro: "Booked. Sunita will pick Amma up at 8am, stay with her through the appointment and update you after.",
  },
  {
    me: "Papa mentioned he needs more help at home. Find and manage a full-time attendant for him?",
    niro: "Done. Three verified attendants shortlisted. Once you pick, we handle onboarding, attendance and salary.",
  },
  {
    me: "Papa mentioned a bunch of repairs. Start a group chat with him and sort it out?",
    system: 'Niro created the group "Home repairs" with you and Papa',
    niro: "Done. Papa is listing things in the group and we’re fixing them one by one.",
  },
];

/**
 * Arm B2 testimonial copy, keyed by the name used in TESTIMONIALS_SHORT.
 *
 * Same three members as arm A, retelling the same relationships from the 1:1
 * starting point. Approved by each of them on 2 Oct 2026 before shipping.
 */
export const B2_QUOTES: Record<string, string> = {
  "Kartik, 34":
    "Mom can’t book a cab on the apps. I used to book one for her from the US every time. I started by just messaging Niro myself - then I made a family group and added Niro, and now she sends a voice note and it happens.",
  "Abhishek, 43":
    "From Dubai, I run everything for my mom living alone through one chat with Niro - her three visiting staff including her attendant, the groceries, her doctor appointments. I book a Niro Visit when someone needs to be there. My own bank and property work in Gwalior goes through the same chat.",
  "Ankit, 37":
    "I manage my parents' health the way I always wanted to - I just tell Niro. Medication refills, Dad’s BP readings sent to our family doctor before each appointment, a Niro Visit for every check-up. I do so much more for them now. Love it.",
};

/**
 * The one extra FAQ arm B2 adds, as its second question.
 *
 * It answers the objection the whole arm exists to remove, in the place a
 * buyer goes looking for it once the page has convinced them.
 */
export const B2_FAQ_EXTRA = {
  q: "Do my parents need to sign up or agree to anything?",
  a: "No. You join, and you tell Niro what needs doing. Your parents don’t have to install or learn anything. When a task involves their home or their time, we confirm it with them and say you arranged it. You can add them to a family group whenever you like.",
};

/**
 * Arm B2's version of the first FAQ answer.
 *
 * Derived from the shared answer rather than copied, so the two cannot drift:
 * only the clause naming where you talk to Niro differs. If that clause is
 * ever reworded in FAQ, the replace stops matching and B2 falls back to the
 * shared text, which is visibly wrong in review rather than quietly stale.
 */
export const B2_FAQ_FIRST_ANSWER: string = (
  FAQ.find((f) => f.a.indexOf("your family WhatsApp group") >= 0)?.a || ""
).replace(
  "your family WhatsApp group",
  "your 1:1 WhatsApp chat with Niro, optional family groups"
);

