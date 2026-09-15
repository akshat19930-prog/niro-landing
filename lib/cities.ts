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

/** Phone validation that accepts the international formats our leads actually
 *  use (+1 415..., 00971..., 0091...), without pretending to be libphonenumber. */
export function validatePhone(raw: string): { phone?: string; error?: string } {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8) return { error: "Please enter your full number, with country code." };
  if (digits.length > 15) return { error: "That number looks too long - please check it." };
  const clean = raw.trim().startsWith("+") ? `+${digits}` : digits;
  return { phone: clean };
}
