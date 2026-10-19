import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";
import {
  GUIDE_ASSURE,
  GUIDE_VISITS,
  GUIDE_VISIT_PRICE,
  GUIDE_VISIT_MONTHLY,
  GUIDE_VISIT_DETAILS,
  GUIDE_FAQ,
  GUIDE_FOUNDERS,
  MEMBERSHIP_FEATURES,
  COVERAGE_NOTE,
  SERVICE_CITIES,
  SHARE_CARD,
} from "@/lib/content";
import {
  GUIDE_CATEGORIES,
  GUIDE_FOLLOW_THROUGH,
  GUIDE_PROACTIVE,
  GUIDE_ON_FILE,
  GUIDE_SOMETHING_ELSE_MESSAGE,
  GUIDE_FINAL_MESSAGE,
} from "./guide-content";
import { OpenOnHash } from "./OpenOnHash";
import "./family-guide.css";

/**
 * /family-guide - UNLISTED. What sales sends a lead after the first call,
 * replacing the "What we do" PDF that was being passed around on WhatsApp.
 *
 * Built for a phone and for one outcome: the reader recognises a task of their
 * own and sends it. So the page opens straight on the catalogue, six cards
 * with a WhatsApp link each, and nothing before it but the logo. Every card
 * carries its own WhatsApp link with a prefilled, editable opening line, all
 * to the sales line. No form, no sign-up.
 *
 * The cards are native <details>, so they open before hydration and without
 * JS; OpenOnHash only makes a jump link land on an open card. The catalogue's
 * copy lives in ./guide-content.ts rather than lib/content.ts because the
 * home page and /what-we-do read GUIDE_SCOPE, and this page arranges the same
 * scope differently.
 *
 * Static export: noindex, but anyone with the URL can open it.
 */
export const metadata: Metadata = {
  title: "Your Niro family guide",
  description:
    "What Niro can take care of for your family in India, how it follows through, and who is behind it.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/family-guide/" },
  openGraph: {
    title: SHARE_CARD.title,
    description: SHARE_CARD.description,
    type: "website",
    url: "https://tellniro.com/family-guide/",
  },
};

const cityList = SERVICE_CITIES.map((c) => c.name)
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");

export default function FamilyGuidePage() {
  // Roadmap items stay out of the emergency narrative; one line notes them.
  const assureLive = GUIDE_ASSURE.filter((s) => s.tag !== "In build");
  const assureRoadmap = GUIDE_ASSURE.filter((s) => s.tag === "In build");

  return (
    <>
      <OpenOnHash />
      <main className="fg">
        {/* ------------------------------------------------- 1. catalogue */}
        <section className="fg-sec" aria-labelledby="fg-cat-h">
          <div className="fg-wrap">
            {/* The official logo file, not the text-rendered Wordmark. */}
            <img
              src="/brand/niro-logo.svg"
              alt="Niro"
              className="fg-logo"
              width={3454}
              height={2037}
            />
            <Eyebrow>For Indians abroad, with family back home</Eyebrow>
            <h1 className="fg-h2" id="fg-cat-h">
              What all can Niro take over for your family
            </h1>
            <p className="fg-p">
              Everyday errands, complicated paperwork and the follow-ups that
              never seem to end. Explore some of the things Niro can help with.
            </p>

            <nav aria-label="Jump to a category">
              <ul className="fg-jump">
                {GUIDE_CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`}>{c.title}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="fg-cats">
              {GUIDE_CATEGORIES.map((c) => (
                <details key={c.id} id={c.id} className="fg-cat">
                  <summary>
                    <span className="fg-ico">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <span className="fg-cat-t">
                      {c.title}
                      <span className="fg-cat-prev">{c.preview}</span>
                    </span>
                    <span className="fg-chev" aria-hidden="true">
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </summary>
                  <div className="fg-cat-body">
                    <ul className="fg-list">
                      {c.core.map((t) => (
                        <li key={t}>
                          <Icon name="check" size={15} />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>

                    {c.more.length > 0 && (
                    <details className="fg-more">
                      <summary>
                        <span>More we can help with</span>
                        <span className="fg-plus" aria-hidden="true" />
                      </summary>
                      <ul className="fg-list">
                        {c.more.map((t) => (
                          <li key={t}>
                            <Icon name="check" size={15} />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                    )}

                    {c.note && <p className="fg-cat-note">{c.note}</p>}

                    {/* The link sits outside both summaries, so a tap on it
                        never toggles the card. */}
                    <WhatsAppLink
                      placement={`family-guide-${c.id}`}
                      message={c.message}
                      className="fg-cat-cta"
                      showIcon={false}
                    >
                      <span>
                        {c.cta} <span aria-hidden="true">&rarr;</span>
                      </span>
                    </WhatsAppLink>
                  </div>
                </details>
              ))}
            </div>

            <div className="fg-card fg-else">
              <h3>Something else you need done in India?</h3>
              <p>From sending a courier to organising a gift, tell us what you have in mind.</p>
              <WhatsAppLink
                placement="family-guide-else"
                message={GUIDE_SOMETHING_ELSE_MESSAGE}
                className="fg-cat-cta"
                showIcon={false}
              >
                <span>
                  Ask Niro <span aria-hidden="true">&rarr;</span>
                </span>
              </WhatsAppLink>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 2. after you ask */}
        <section className="fg-sec fg-inset" aria-labelledby="fg-how-h">
          <div className="fg-wrap">
            <Eyebrow>How it runs</Eyebrow>
            <h2 className="fg-h2" id="fg-how-h">
              What happens after you ask?
            </h2>
            <ol className="fg-steps">
              {GUIDE_FOLLOW_THROUGH.map((s) => (
                <li key={s.title}>
                  <p>
                    <b>{s.title}</b> {s.body}
                  </p>
                </li>
              ))}
            </ol>
            <p className="fg-small">
              Field work closes with photos and an invoice at actuals. We take no
              commission from any vendor, so we pick the right one, not the one
              that pays.
            </p>

            <h3 className="fg-h3" style={{ marginTop: 32 }}>
              And the things nobody asked about yet
            </h3>
            <p className="fg-p" style={{ marginBottom: 0 }}>
              As we get to know your family, we start reminding before you have
              to remember. We propose; you decide.
            </p>
            <div className="fg-pro">
              {GUIDE_PROACTIVE.map((p) => (
                <div key={p.title} className="fg-card">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>

            <div className="fg-onfile">
              <h3 className="fg-h3">What we keep on file to make this work</h3>
              <ul className="fg-list">
                {GUIDE_ON_FILE.map((t) => (
                  <li key={t}>
                    <Icon name="check" size={15} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 3. visits */}
        <section className="fg-sec" aria-labelledby="fg-visits-h">
          <div className="fg-wrap">
            <Eyebrow>Niro Visits</Eyebrow>
            <h2 className="fg-h2" id="fg-visits-h">
              For the things that need someone standing there.
            </h2>
            <p className="fg-p">
              A lot of India still runs on being there in person. A vetted Niro
              Assistant goes, and every visit closes with a written report in the
              family group, with photos where your parents are happy for us to
              take them.
            </p>

            <div className="fg-card fg-included">
              <div className="fg-card-label">In your membership</div>
              <div className="fg-included-t">{GUIDE_VISIT_PRICE.included}</div>
              <ul className="fg-list">
                {GUIDE_VISIT_MONTHLY.map((t) => (
                  <li key={t}>
                    <Icon name="check" size={15} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="fg-included-extra">
                <Icon name="clock" size={16} />
                <span>{GUIDE_VISIT_PRICE.extra}</span>
              </p>
            </div>

            <h3 className="fg-h3">Or book one when you need it</h3>
            <div className="fg-visits">
              {GUIDE_VISITS.map((v) => (
                <div key={v.title} className="fg-card fg-visit">
                  <div className="fg-visit-head">
                    <span className="fg-ico fg-ico-gold">
                      <Icon name={v.icon} size={20} />
                    </span>
                    <div className="fg-visit-t">{v.title}</div>
                  </div>
                  <p>{v.body}</p>
                </div>
              ))}
            </div>
            <p className="fg-small">
              Visits run in the cities we cover: {cityList}. Anything else that
              needs a person there, in one of them, just ask.
            </p>

            <div className="fg-cats fg-visit-more">
              {GUIDE_VISIT_DETAILS.map((d) => (
                <details key={d.title} className="fg-cat">
                  <summary>
                    <span className="fg-ico">
                      <Icon name={d.icon} size={20} />
                    </span>
                    <span className="fg-cat-t">{d.title}</span>
                    <span className="fg-chev" aria-hidden="true">
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </summary>
                  <div className="fg-cat-body">
                    <ul className="fg-list fg-list-pad">
                      {d.points.map((t) => (
                        <li key={t}>
                          <Icon name="check" size={15} />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 4. assure */}
        <section className="fg-sec fg-dark" data-theme="dark" aria-labelledby="fg-assure-h">
          <div className="fg-wrap">
            <Eyebrow>Niro Assure</Eyebrow>
            <h2 className="fg-h2" id="fg-assure-h">
              The emergency plan, agreed before you need it.
            </h2>
            <p className="fg-p">
              In a medical emergency, the ambulance is only part of it. Which
              hospital, which doctor, what medicines, what the policy covers:
              those questions take the most time, and every one of them can be
              answered in advance.
            </p>

            <ol className="fg-steps fg-steps-dark">
              {assureLive.map((s) => (
                <li key={s.title}>
                  <p>
                    <b>{s.title}</b> {s.body}
                    {s.tag && <span className="fg-tag">{s.tag}</span>}
                  </p>
                </li>
              ))}
            </ol>
            <p className="fg-fine">The response times apply in {cityList}.</p>
            {assureRoadmap.length > 0 && (
              <p className="fg-fine">
                On the roadmap, not yet live:{" "}
                {assureRoadmap.map((s) => s.body.replace(/^We.re adding /, "")).join(" ")}
              </p>
            )}
          </div>
        </section>

        {/* ------------------------------------------------- 5. membership */}
        <section className="fg-sec fg-inset" aria-labelledby="fg-mem-h">
          <div className="fg-wrap">
            <Eyebrow>The membership</Eyebrow>
            <h2 className="fg-h2" id="fg-mem-h">
              What the fee covers, and what is charged separately.
            </h2>
            <div className="fg-cover">
              <div className="fg-card">
                <div className="fg-card-label">Included</div>
                <ul className="fg-list">
                  {MEMBERSHIP_FEATURES.map((t) => (
                    <li key={t}>
                      <Icon name="check" size={15} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p>{COVERAGE_NOTE.covers}</p>
              </div>
              <div className="fg-card">
                <div className="fg-card-label">Charged separately</div>
                <p>{COVERAGE_NOTE.excludes}</p>
                <p style={{ marginTop: 12 }}>
                  <b>{COVERAGE_NOTE.promise}</b>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 6. faq + founders */}
        <section className="fg-sec" aria-labelledby="fg-faq-h">
          <div className="fg-wrap">
            <Eyebrow>Questions we get asked first</Eyebrow>
            <h2 className="fg-h2" id="fg-faq-h">
              Before you decide.
            </h2>
            <div className="fg-faq">
              {GUIDE_FAQ.map((f) => (
                <details key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="fg-plus" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="fg-sec fg-inset" aria-labelledby="fg-about-h">
          <div className="fg-wrap">
            <Eyebrow>About us</Eyebrow>
            <h2 className="fg-h2" id="fg-about-h">
              Who is behind Niro.
            </h2>
            <div className="fg-founders">
              {GUIDE_FOUNDERS.map((p) => (
                <div key={p.name} className="fg-card fg-founder">
                  <div className="fg-founder-head">
                    <img src={p.photo} alt={p.name} width={64} height={64} />
                    <div>
                      <div className="fg-founder-n">{p.name}</div>
                      <div className="fg-founder-r">Co-founder</div>
                    </div>
                  </div>
                  <p>{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 7. final */}
        <section className="fg-sec fg-close" aria-labelledby="fg-close-h">
          <div className="fg-wrap">
            <img src="/brand/niro-mark.svg" alt="" className="fg-mark" width={22} height={24} />
            <h2 className="fg-h2 fg-close-h" id="fg-close-h">
              What would you like Niro to take care of?
            </h2>
            <div className="fg-open">
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-md)", color: "var(--text-body)" }}>
                Tell us what needs doing and the city. We&rsquo;ll confirm how we can help.
              </p>
            </div>
            <WhatsAppLink
              placement="family-guide-final"
              message={GUIDE_FINAL_MESSAGE}
              className="btn btn-primary btn-lg"
            >
              Tell Niro what you need <span aria-hidden="true">&rarr;</span>
            </WhatsAppLink>
            <p className="fg-fine fg-disclaimer">
              Niro is a family concierge service operating in India for families
              living abroad. Nothing on this page is medical, legal, tax or
              investment advice. Service availability varies by city, and
              emergency response commitments apply only where Niro has published
              coverage.
            </p>
          </div>
        </section>
      </main>
      <Footer showEntity={false} />
    </>
  );
}
