import { SERVICE_CITIES } from "@/lib/content";

/**
 * Serviceability check for the parents' city, typed free-form by the visitor.
 *
 * Why a checker and not a published list: hiding the cities behind a form is a
 * dark pattern on a product whose binding constraint is trust, and a plain list
 * reads as a rejection notice to the ~40% of leads we cannot serve yet. Asking
 * the city and branching does three things at once - it qualifies the lead, it
 * stops us selling to a family we cannot serve, and it builds the demand map
 * that decides city six. One lead told us as much unprompted: "It will be great
 * if you reach out when you plan to expand to non-metro cities."
 *
 * The matcher is deliberately forgiving. People type "blr", "bombay", "Gurgaon"
 * and "New Delhi, India". A false negative costs us a sale; a false positive
 * costs us a promise we cannot keep - so aliases are explicit rather than fuzzy,
 * and anything unrecognised falls to the waitlist branch.
 */

/** Extra spellings that map onto a SERVICE_CITIES entry, beyond its own
 *  `includes` list. Keyed by the canonical city name. */
const ALIASES: Record<string, string[]> = {
  Bengaluru: ["bangalore", "bengaluru", "blr", "banglore", "bangaluru", "whitefield", "koramangala"],
  "Delhi NCR": [
    "delhi", "new delhi", "ncr", "noida", "greater noida", "ghaziabad",
    "gurgaon", "gurugram", "faridabad", "dwarka", "delhi ncr", "ncr delhi",
  ],
  Mumbai: ["mumbai", "bombay", "navi mumbai", "thane", "borivali", "andheri", "powai"],
  Hyderabad: ["hyderabad", "hyd", "secunderabad", "cyberabad", "gachibowli"],
  Chennai: ["chennai", "madras", "chennai tamil nadu"],
  // Gandhinagar is deliberately absent: it is a separate city 25km out, and
  // claiming it would be the false positive this matcher exists to avoid.
  Ahmedabad: ["ahmedabad", "amdavad", "ahmadabad", "ahemdabad"],
  Indore: ["indore", "indaur"],
  Aligarh: ["aligarh", "aligadh", "alighar"],
  Kozhikode: ["kozhikode", "calicut", "kozhikkode"],
  Visakhapatnam: [
    "visakhapatnam", "vishakhapatnam", "visakapatnam", "vishakapatnam",
    "vizag", "vishakhapatanam", "waltair",
  ],
  Kolkata: [
    "kolkata", "calcutta", "howrah", "salt lake", "saltlake", "bidhannagar",
    "new town", "newtown", "rajarhat", "behala", "ballygunge", "kolkata west bengal",
  ],
};

export type CityMatch =
  | { served: true; city: string }
  | { served: false; city: string };

/** Strip punctuation, country suffixes and extra whitespace. */
function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\b(india|in)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolve a typed city to a launch city, or report it as not yet served.
 * Returns the CANONICAL name when served, so the confirmation can say
 * "We're live in Delhi NCR" to someone who typed "gurgaon".
 */
export function matchCity(raw: string): CityMatch {
  const q = normalise(raw);
  if (!q) return { served: false, city: "" };

  for (const c of SERVICE_CITIES) {
    const candidates = [
      c.name.toLowerCase(),
      ...(c.includes || []).map((s) => s.toLowerCase()),
      ...(ALIASES[c.name] || []),
    ];
    // Whole-token match in either direction: "gurgaon" matches, and so does
    // "gurgaon sector 42" - but "chennai" must not match inside "chennaipuram".
    for (const cand of candidates) {
      const re = new RegExp(`(^|\\s)${cand.replace(/\s+/g, "\\s+")}(\\s|$)`);
      if (re.test(q)) return { served: true, city: c.name };
    }
  }
  // Keep what they typed, tidied - it goes to the sheet and drives city six.
  return { served: false, city: raw.trim() };
}

/**
 * Contact validation that accepts EITHER a phone number or a WhatsApp ID,
 * without weakening the digit check on numbers.
 *
 * The split is made on the input itself rather than on a toggle the visitor
 * has to find: anything containing a letter or an "@" is treated as an ID and
 * keeps its digit rules relaxed; anything else is a number and still has to be
 * 8-15 digits, and, when it carries a country code we list, the right shape
 * for that country. That way a fat-fingered number ("9198") is still rejected,
 * while "arjun.mehta" or "arjun@niro" passes through untouched.
 *
 * An ID also suppresses the country-code prefix at the call site - prepending
 * "+1 " to a username would corrupt the only handle we have for that lead.
 */
export function looksLikeWhatsAppId(raw: string): boolean {
  return /[a-z@]/i.test(raw.trim());
}

export function validateContact(raw: string): { value?: string; isId?: boolean; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { error: "Please enter your WhatsApp number or ID." };

  if (looksLikeWhatsAppId(trimmed)) {
    // Loose on purpose - WhatsApp IDs vary, and we would rather accept an
    // unusual one and sort it out in the first message than turn a real lead
    // away at the form.
    if (trimmed.length < 4) return { error: "That ID looks too short - please check it." };
    if (trimmed.length > 60) return { error: "That looks too long - please check it." };
    if (!/^[\w.@+\- ]+$/.test(trimmed))
      return { error: "Please use letters, numbers, dots, dashes or @ only." };
    return { value: trimmed, isId: true };
  }

  const digits = trimmed.replace(/[^\d]/g, "");
  if (digits.length < 8) return { error: "Please enter your full number." };
  if (digits.length > 15) return { error: "That number looks too long - please check it." };

  // A number written with its country code is checked against that country.
  // The digit count alone let "+971 56190602" through (11 digits, one short of
  // a UAE mobile), and saved "+9710551854920" and "+971971506313867" as typed.
  if (/^(\+|00)/.test(trimmed)) {
    const intl = trimmed.startsWith("00") ? digits.slice(2) : digits;
    const checked = checkNational(intl);
    if (checked) return checked;
  }
  return { value: trimmed, isId: false };
}

/**
 * Mobile number shapes, by country code, for the countries our sign-up forms
 * list. `national` is the number after the code, with no leading 0.
 */
const PHONE_RULES: { code: string; name: string; national: RegExp; example: string }[] = [
  { code: "971", name: "UAE", national: /^5\d{8}$/, example: "50 123 4567" },
  { code: "966", name: "Saudi", national: /^5\d{8}$/, example: "50 123 4567" },
  { code: "974", name: "Qatar", national: /^[3567]\d{7}$/, example: "3312 3456" },
  { code: "965", name: "Kuwait", national: /^[4569]\d{7}$/, example: "5012 3456" },
  { code: "968", name: "Oman", national: /^[79]\d{7}$/, example: "9212 3456" },
  { code: "973", name: "Bahrain", national: /^[36]\d{7}$/, example: "3612 3456" },
  { code: "44", name: "UK", national: /^7\d{9}$/, example: "7400 123456" },
  { code: "65", name: "Singapore", national: /^[389]\d{7}$/, example: "8123 4567" },
  { code: "61", name: "Australian", national: /^4\d{8}$/, example: "412 345 678" },
  { code: "64", name: "New Zealand", national: /^2\d{7,9}$/, example: "21 123 4567" },
  { code: "852", name: "Hong Kong", national: /^[4-9]\d{7}$/, example: "5123 4567" },
  { code: "49", name: "German", national: /^1[5-7]\d{8,9}$/, example: "151 2345678" },
  { code: "353", name: "Irish", national: /^8\d{8}$/, example: "85 123 4567" },
  { code: "31", name: "Dutch", national: /^6\d{8}$/, example: "6 1234 5678" },
  { code: "41", name: "Swiss", national: /^7\d{8}$/, example: "78 123 45 67" },
  { code: "1", name: "US/Canada", national: /^[2-9]\d{2}[2-9]\d{6}$/, example: "415 555 0134" },
  { code: "91", name: "Indian", national: /^[6-9]\d{9}$/, example: "98765 43210" },
];

/**
 * Checks digits that start with a country code. Fixes the two slips the PF
 * form saw most (a leading 0, and the code typed again in the number box)
 * and returns the number as "+code national". Codes not in PHONE_RULES
 * return undefined, so the caller keeps the plain digit-count rule: we would
 * rather take an unfamiliar number than turn the lead away.
 */
function checkNational(intl: string): { value?: string; isId?: boolean; error?: string } | undefined {
  const rule = PHONE_RULES
    .filter((r) => intl.startsWith(r.code))
    .sort((a, b) => b.code.length - a.code.length)[0];
  if (!rule) return undefined;

  const typed = intl.slice(rule.code.length);
  const candidates = [typed, typed.replace(/^0/, "")];
  if (typed.startsWith(rule.code)) candidates.push(typed.slice(rule.code.length).replace(/^0/, ""));
  const national = candidates.find((n) => rule.national.test(n));
  if (national) return { value: `+${rule.code} ${national}`, isId: false };

  if (rule.code !== "91" && /^0?[6-9]\d{9}$/.test(typed))
    return { error: `That looks like an Indian number. Use +91 for it, or enter your ${rule.name} number.` };
  // NZ and German mobiles vary in length, so those get the shape, not a count.
  const fixed = !/\{\d+,\d+\}/.test(rule.national.source);
  const size = fixed ? `have ${rule.example.replace(/\D/g, "").length} digits after +${rule.code}, like` : "look like";
  return { error: `${rule.name} mobile numbers ${size} ${rule.example}. Please check yours.` };
}
