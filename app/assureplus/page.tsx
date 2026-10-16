import type { Metadata } from "next";
import { Nav } from "@/components/ds/Nav";
import { Footer } from "@/components/ds/Footer";
import { Icon } from "@/components/ds/Icon";
import { SALES_WHATSAPP } from "@/lib/config";
import "./assureplus.css";

/**
 * /assureplus - the Niro Assure+ concept page.
 *
 * NOT an offer page. It exists to put one question to members and to the
 * leads who are close to paying: given these two, which would you take and
 * why. So there is no join modal, no pricing CTA and no form. One WhatsApp
 * link, and the two tiers side by side with nothing marking either as the
 * recommended one, because the page is asking its reader to choose and a
 * "most popular" badge would answer its own question.
 *
 * Four deliberate restraints, all of them from the radar briefing:
 *
 *  - NO VITALS ANYWHERE. Heart rate and breathing rate tip a fall detector
 *    into Class B medical device territory under CDSCO's July 2026 guidance,
 *    and the sensor we are testing cannot measure them in any case. What this
 *    page calls health monitoring is activity and routine: when someone is up,
 *    how long they are about, how the pattern moves over weeks. If a later
 *    draft adds a pulse figure to this page, the regulatory position changes.
 *
 *  - NO CITY LIST. Installation needs a person in the room, and we have that
 *    in one city for a ten-home pilot. Naming cities would turn a concept test
 *    into a promise; the page asks for the parents' city instead.
 *
 *  - NO TURNAROUND OR DETECTION-RATE NUMBER. We have not run the home trial
 *    yet. Every figure quoted here is someone else's, attributed on the page.
 *
 *  - THE LIMITS SECTION IS NOT OPTIONAL. The reader is being asked to put a
 *    sensor in their parents' home; a page that only lists what it catches is
 *    answered with "and what does it miss?" in the first WhatsApp reply. It is
 *    also the section most likely to produce a useful answer to the question
 *    the page is actually asking.
 */
export const metadata: Metadata = {
  title: "Niro Assure+ - ambient sensing for your parents' home",
  description:
    "A radar sensor on the wall that notices a fall and raises the alarm itself. No camera, no microphone, nothing to wear.",
  robots: { index: false, follow: false },
};

const WA = `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(
  "Hi Niro, I read the Assure+ page. Here's what I'd pick and why:"
)}`;

const PROPS: {
  icon: Parameters<typeof Icon>[0]["name"];
  title: string;
  body: string;
}[] = [
  {
    icon: "heart-pulse",
    title: "Fall detection",
    body:
      "A fall is noticed as it happens, with nothing worn and nobody to press anything. If they get back up on their own, the alert cancels itself and you never hear about it.",
  },
  {
    icon: "sunrise",
    title: "Health analytics",
    body:
      "When they wake, how long they are up, how often they are up at night. The slow changes a fortnightly call never shows. Patterns, not readings.",
  },
  {
    icon: "user-check",
    title: "Staff monitoring and attendance",
    body:
      "Who came, when they arrived, how long they stayed, in one weekly log. Built from presence in a room: no cameras, no recordings, and the staff are told.",
  },
  {
    icon: "lock",
    title: "Empty home safety",
    body:
      "While your parents travel, the same sensor watches an empty house for movement instead of watching for falls.",
  },
];

const STEPS = [
  {
    t: "We install it",
    b: "A Niro person mounts the sensors, sets them up and explains them to your parents in their own language. Nothing for them to learn or charge.",
  },
  {
    t: "It learns the house",
    b: "The first days are spent learning what normal looks like in those rooms. We do not act on anything it says until it has settled.",
  },
  {
    // Added third on purpose: the two steps before it are ours, everything
    // after it runs on what the member sets here. It is also the answer to
    // the objection this page attracts most, which is not "does it work" but
    // "what will it do without asking me".
    t: "You define the protocol",
    b: "For falls, for staff attendance, for every other signal: what we act on, what we only mention, and who we call first. We nudge or act on nothing you have not set.",
  },
  {
    t: "It watches, quietly",
    b: "No camera, no microphone, no recording. It reports position and movement to a Niro server, and nothing leaves the house that is not that.",
  },
  {
    t: "A person checks",
    b: "An alert reaches the Niro desk, not your phone. A human calls your parent first, because most alerts are nothing and a false alarm should cost you nothing.",
  },
  {
    t: "Then it escalates",
    b: "If nobody answers or something is wrong, the Niro Assure chain runs: ambulance dispatch, a call to you, and a Niro Assistant at the hospital.",
  },
];

const SHARED = [
  "Unlimited tasks for you or your family",
  "WhatsApp group chat for tasks",
  "Niro Assure emergency response",
  "One free booked on-demand Niro visit",
  "Create up to 2 groups",
];

const EXTRA = [
  "Radar sensors installed in your parents' home",
  "Falls detected and escalated without anyone calling",
  "Sleep, activity and night-waking patterns, with a nudge when they move",
  "A weekly log of who came to the house and how long they stayed",
  "Empty-house monitoring while your parents travel",
];

const LIMITS = [
  {
    t: "It cannot see through walls or furniture.",
    b: "Radar needs line of sight. A sensor in the living room does not cover the bedroom, which is why there is more than one.",
  },
  {
    t: "A slow slide is not a fall.",
    b: "Sliding down a wall, or slipping gradually from a bed or a chair, may not register. The sudden fall is what this catches well.",
  },
  {
    t: "It steps back when two people are in the room.",
    b: "Fall alerts are suppressed with more than one person present, on the assumption that the other person will act faster than we can.",
  },
  {
    t: "It needs mains power and home Wi-Fi.",
    b: "A long power cut or a dead router takes it offline, and we find out within about twenty minutes. The desk is told; you are not woken for it.",
  },
];

export default function AssurePlusPage() {
  return (
    <div className="ap">
      <Nav cta="Talk to us" ctaHref={WA} ctaPosition="assureplus_nav" />

      <main>
        {/* ---------------------------------------------------------- hero */}
        <section className="ap-hero">
          <div className="ap-wrap ap-hero-grid">
            <div>
              <span className="ap-stamp">Launching soon</span>
              <h1>
                Enhanced peace of mind. <em>For you &amp; your family.</em>
              </h1>
              <p className="ap-lead">
                Niro Assure answers in 45 seconds when somebody calls it. Assure+
                is for the times nobody can. A small radar sensor on the wall
                notices a fall and raises the alarm itself.
              </p>
            </div>

            {/* The device. Drawn rather than photographed: the unit is a
                white-label board in a plain housing today, and showing a
                stock photo of somebody else's product would be the one
                dishonest thing on the page. */}
            <div className="ap-device">
              <svg
                viewBox="0 0 460 346"
                role="img"
                aria-label="A Niro sensor mounted on a wall, sensing the room in front of it to a range of about seven metres"
              >
                <defs>
                  <linearGradient id="apBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2a5a47" />
                    <stop offset="1" stopColor="#16362a" />
                  </linearGradient>
                  <linearGradient id="apGlass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0c1f18" />
                    <stop offset="1" stopColor="#10281f" />
                  </linearGradient>
                </defs>

                {/* The sensing field. Arcs, not a cone: the unit reads 90
                    degrees across and the point of the drawing is reach, not
                    a precise beam pattern. */}
                <g fill="none" stroke="#5a9078" strokeLinecap="round">
                  <path d="M162 163 A 68 68 0 0 0 298 163" strokeOpacity="0.42" strokeWidth="1.7" />
                  <path d="M128 163 A 102 102 0 0 0 332 163" strokeOpacity="0.26" strokeWidth="1.7" />
                  <path d="M94 163 A 136 136 0 0 0 366 163" strokeOpacity="0.15" strokeWidth="1.7" />
                </g>

                {/* floor, then the range dimension BELOW it so the label
                    never sits on top of an arc */}
                <line x1="50" y1="300" x2="410" y2="300" stroke="#191a16" strokeOpacity="0.14" strokeWidth="1.5" />
                <g stroke="#767869" strokeOpacity="0.55" strokeWidth="1">
                  <line x1="230" y1="313" x2="230" y2="327" />
                  <line x1="366" y1="313" x2="366" y2="327" />
                  <line x1="230" y1="320" x2="366" y2="320" strokeDasharray="3 4" />
                </g>
                <text
                  x="298"
                  y="341"
                  textAnchor="middle"
                  fontFamily="Hanken Grotesk, system-ui, sans-serif"
                  fontSize="12.5"
                  fill="#767869"
                >
                  senses about 7 m out
                </text>

                {/* mount shadow */}
                <ellipse cx="230" cy="166" rx="100" ry="8" fill="#191a16" opacity="0.08" />

                {/* body */}
                <rect x="135" y="24" width="190" height="135" rx="24" fill="url(#apBody)" />
                <rect
                  x="136"
                  y="25"
                  width="188"
                  height="133"
                  rx="23"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.14"
                />

                {/* the sensing window: no lens, because there is no camera */}
                <rect x="158" y="46" width="144" height="53" rx="14" fill="url(#apGlass)" />
                <g stroke="#3b7359" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="188" y1="64" x2="188" y2="81" />
                  <line x1="209" y1="60" x2="209" y2="85" />
                  <line x1="230" y1="58" x2="230" y2="87" />
                  <line x1="251" y1="60" x2="251" y2="85" />
                  <line x1="272" y1="64" x2="272" y2="81" />
                </g>

                {/* wordmark and a single status light */}
                <text
                  x="230"
                  y="138"
                  textAnchor="middle"
                  fontFamily="Newsreader, Georgia, serif"
                  fontSize="25"
                  fontWeight="500"
                  fill="#f6f1e7"
                  letterSpacing="0.5"
                >
                  niro
                </text>
                <circle cx="300" cy="130" r="4" fill="#b8863b" />
              </svg>

              <p className="ap-device-caption">
                About the size of a light switch plate, mounted high on a wall.
                It looks like a home accessory, because a box that looks like a
                hospital device is a box your parents will ask you to take down.
              </p>

              <ul className="ap-specs">
                <li>
                  <Icon name="x-circle" size={15} />
                  <span>No camera, ever</span>
                </li>
                <li>
                  <Icon name="x-circle" size={15} />
                  <span>No microphone</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Nothing to wear</span>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <span>Works in steam and the dark</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- the four props */}
        <section>
          <div className="ap-wrap">
            <p className="ap-eyebrow">What it does</p>
            <h2>Four things, from one sensor on the wall</h2>
            <p className="ap-lead">
              Three of them have nothing to do with emergencies. A device you
              only hear from on the worst day of your life is a device you stop
              trusting is working.
            </p>

            <div className="ap-props">
              {PROPS.map((p) => (
                <article className="ap-prop" key={p.title}>
                  <span className="ap-prop-icon">
                    <Icon name={p.icon} size={21} />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>

            <p className="ap-note">
              What it does not do: heart rate, breathing rate or anything else a
              doctor would call a vital sign. Those make it a medical device
              under Indian rules, and we would rather ship something honest than
              something impressive.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- how it works */}
        <section className="ap-inset">
          <div className="ap-wrap">
            <p className="ap-eyebrow">How it works</p>
            <h2>Six steps, and a person at the fifth</h2>
            <ol className="ap-steps">
              {STEPS.map((s) => (
                <li key={s.t}>
                  <b>{s.t}</b>
                  <span>{s.b}</span>
                </li>
              ))}
            </ol>
            <p className="ap-note">
              There is a deliberate pause between the fall and the phone
              ringing, set between 30 seconds and 3 minutes. Most people who go
              down get themselves up, and an alert that fires the instant
              somebody sits down heavily is an alert you learn to ignore.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------- comparison */}
        <section>
          <div className="ap-wrap">
            <p className="ap-eyebrow">The two memberships</p>
            <h2>Choose one membership tier</h2>

            <div className="ap-compare">
              <div className="ap-tier">
                <p className="ap-tier-name">Niro</p>
                <p className="ap-tier-sub">
                  The membership as it works today.
                </p>
                <div className="ap-price">
                  <b>$83</b>
                  <span>/ month</span>
                </div>
                <p className="ap-billed">Billed quarterly, $249 every 3 months</p>
                <ul className="ap-feats">
                  {SHARED.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                  {EXTRA.map((f) => (
                    <li className="ap-dim" key={f}>
                      <Icon name="x" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ap-tier">
                <p className="ap-tier-name">Niro Assure+</p>
                <p className="ap-tier-sub">
                  Everything above, plus sensing in the house.
                </p>
                <div className="ap-price">
                  <b>$119</b>
                  <span>/ month</span>
                </div>
                <p className="ap-billed">Billed quarterly, $357 every 3 months</p>
                <ul className="ap-feats">
                  {SHARED.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="ap-extra-head">What Assure+ adds</p>
                <ul className="ap-feats" style={{ borderTop: "none", paddingTop: 0 }}>
                  {EXTRA.map((f) => (
                    <li className="ap-new" key={f}>
                      <Icon name="check-circle" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="ap-hardware">
                  <b>The hardware is included.</b> No purchase, no deposit,
                  nothing to set up. Two sensors in most homes, placed where
                  falls actually happen, installed by us. They stay ours: if you
                  ever stop, we come and collect them.
                </p>
              </div>
            </div>

            <p className="ap-note">
              Assure+ opens city by city, because somebody has to come and put
              the sensors on the wall. Tell us where your parents are and we
              will tell you honestly when we can get there.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------- honest limits */}
        <section className="ap-inset">
          <div className="ap-wrap">
            <p className="ap-eyebrow">What it misses</p>
            <h2>The things we would rather you heard from us</h2>
            <p className="ap-lead">
              This is a real sensor with real limits, and it would be going
              into your parents' home. So here they are.
            </p>
            <ul className="ap-limits">
              {LIMITS.map((l) => (
                <li key={l.t}>
                  <Icon name="x-circle" size={17} />
                  <span>
                    <b>{l.t}</b> {l.b}
                  </span>
                </li>
              ))}
            </ul>
            <p className="ap-note">
              We have not run this in Indian homes yet. The first ten go in
              shortly, and the one number we care about is how many false
              alarms a sensor produces in an ordinary week. Until we have it, we
              are not going to quote you a detection rate.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
