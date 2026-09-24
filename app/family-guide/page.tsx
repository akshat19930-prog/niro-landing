import type { Metadata } from "next";
import { Footer } from "@/components/ds/Footer";
import { Eyebrow } from "@/components/ds/Eyebrow";
import { Icon } from "@/components/ds/Icon";
import { ChatVideo } from "@/components/ds/ChatVideo";
import { AskStream } from "@/components/ds/AskStream";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";
import {
  GUIDE_SCOPE,
  GUIDE_ASSURE,
  GUIDE_VISITS,
  GUIDE_VISIT_PRICE,
  GUIDE_VISIT_MONTHLY,
  GUIDE_VISIT_DETAILS,
  GUIDE_STEPS,
  GUIDE_FAQ,
  GUIDE_FOUNDERS,
  SERVICE_CITIES,
  SHARE_CARD,
} from "@/lib/content";

/**
 * /family-guide - UNLISTED. What sales sends a lead after the first call,
 * replacing the "What we do" PDF that was being passed around on WhatsApp.
 *
 * Built for a phone: every section is a self-contained card, the six scope
 * lists collapse (native <details>, so they work before hydration), and the
 * creatives are the ones already on the home page (the chat video, the live
 * ask feed) so the lead recognises the product from the ad and the site.
 *
 * No nav CTA and no "Join the beta": this reader has already spoken to us, so
 * the only action is a message to the sales line.
 *
 * Like /lite this is a static export: noindex, but anyone with the URL can
 * open it. Obscure, not secret.
 */
export const metadata: Metadata = {
  title: "Your Niro family guide",
  description:
    "What Niro does for your family in India, how it runs, and who is behind it.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tellniro.com/family-guide/" },
  openGraph: {
    title: SHARE_CARD.title,
    description: SHARE_CARD.description,
    type: "website",
    url: "https://tellniro.com/family-guide/",
  },
};

export default function FamilyGuidePage() {
  const total = GUIDE_SCOPE.reduce((n, g) => n + g.items.length, 0);
  const rounded = Math.floor(total / 10) * 10;

  return (
    <>
      <main className="fg">
        {/* ------------------------------------------------------ hero */}
        <section className="fg-hero">
          <div className="fg-jaali" aria-hidden="true" />
          <div className="fg-wrap fg-hero-grid">
            <div>
              {/* The official logo file, not the text-rendered Wordmark. */}
              <img
                src="/brand/niro-logo.svg"
                alt="Niro"
                className="fg-logo"
                width={3454}
                height={2037}
              />
              <Eyebrow>For Indians abroad, with family back home</Eyebrow>
              <p className="fg-lead">
                Niro is your family&rsquo;s personal assistant in India, getting
                things done for your parents and for you. It all runs on
                WhatsApp: a group with you and your parents (you can set up two),
                a private chat for your own errands, and an assistant who picks
                up whatever is asked and sees it through. In person too, when
                that&rsquo;s what it takes.
              </p>
              <div className="fg-chips">
                <span>Remote assistant</span>
                <span aria-hidden="true">·</span>
                <span>WhatsApp groups</span>
                <span aria-hidden="true">·</span>
                <span>Shows up in person</span>
              </div>
            </div>
            <div className="fg-hero-media">
              <ChatVideo maxWidth={340} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ scope */}
        <section className="fg-sec fg-inset">
          <div className="fg-wrap">
            <Eyebrow>The scope</Eyebrow>
            <h2 className="fg-h2">
              {rounded}+ kinds of task, across six categories.
            </h2>
            <p className="fg-p">
              Ask the way you&rsquo;d ask a capable younger cousin who lives around
              the corner. Behind the chat is your Niro Assistant, a task tracker,
              vetted vendors, an encrypted document vault hosted in India, and
              people who visit when it needs someone there.
            </p>

            <div className="fg-card fg-ask">
              <div className="fg-card-label">What families send us</div>
              <AskStream />
              <p className="fg-small">
                Your parents ask too. After the first month most requests come
                from them, which is the point. They rarely ask you, but
                they&rsquo;ll ask someone whose job it is.
              </p>
            </div>

            <div className="fg-cats">
              {GUIDE_SCOPE.map((g) => (
                <details key={g.title} className="fg-cat">
                  <summary>
                    <span className="fg-ico">
                      <Icon name={g.icon} size={20} />
                    </span>
                    <span className="fg-cat-t">
                      {g.title}
                      <span className="fg-cat-n">{g.items.length} tasks</span>
                    </span>
                    <span className="fg-chev" aria-hidden="true">
                      <Icon name="chevron-right" size={18} />
                    </span>
                  </summary>
                  <div className="fg-cat-body">
                    <p className="fg-cat-intro">{g.intro}</p>
                    <ul className="fg-list">
                      {g.items.map((it) => (
                        <li key={it.t}>
                          <Icon name="check" size={15} />
                          <span>
                            {it.t}
                            {it.tag && <span className="fg-tag">{it.tag}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ assure */}
        <section className="fg-sec fg-dark" data-theme="dark">
          <div className="fg-wrap">
            <Eyebrow>Niro Assure</Eyebrow>
            <h2 className="fg-h2">The emergency plan, agreed before you need it.</h2>
            <p className="fg-p">
              In a medical emergency, the ambulance is only part of it. Which
              hospital, which doctor, what medicines, what the policy covers:
              those questions take the most time, and every one of them can be
              answered in advance.
            </p>
            <blockquote className="fg-quote">
              What you would do if you were there, done by someone who is.
            </blockquote>

            <ol className="fg-steps fg-steps-dark">
              {GUIDE_ASSURE.map((s) => (
                <li key={s.title}>
                  <p>
                    <b>{s.title}</b> {s.body}
                    {s.tag && <span className="fg-tag">{s.tag}</span>}
                  </p>
                </li>
              ))}
            </ol>
            <p className="fg-fine">
              The response times apply in{" "}
              {SERVICE_CITIES.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}
              .
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------ visits */}
        <section className="fg-sec">
          <div className="fg-wrap">
            <Eyebrow>Niro Visits</Eyebrow>
            <h2 className="fg-h2">For the things that need someone standing there.</h2>
            <p className="fg-p">
              A lot of India still runs on being there in person. A vetted Niro
              Assistant goes, and every visit closes with photos and a written
              report in the family group.
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
              Anything else that needs a person there, in a city we cover, just ask.
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

        {/* ------------------------------------------------------ how it runs */}
        <section className="fg-sec fg-inset">
          <div className="fg-wrap">
            <Eyebrow>Working with Niro</Eyebrow>
            <h2 className="fg-h2">How it actually runs.</h2>
            <ol className="fg-steps">
              {GUIDE_STEPS.map((s) => (
                <li key={s.title}>
                  <p>
                    <b>{s.title}</b> {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ faq */}
        <section className="fg-sec">
          <div className="fg-wrap">
            <Eyebrow>Questions we get asked first</Eyebrow>
            <h2 className="fg-h2">Before you decide.</h2>
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

        {/* ------------------------------------------------------ about */}
        <section className="fg-sec fg-inset">
          <div className="fg-wrap">
            <Eyebrow>About us</Eyebrow>
            <h2 className="fg-h2">Who is behind Niro.</h2>
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

        {/* ------------------------------------------------------ close */}
        <section className="fg-sec fg-close">
          <div className="fg-wrap">
            <img src="/brand/niro-mark.svg" alt="" className="fg-mark" width={22} height={24} />
            <h2 className="fg-h2 fg-close-h">Anything else on your mind?</h2>
            <WhatsAppLink
              placement="family-guide"
              message="Hi Niro, I've read the family guide and have a question."
              className="btn btn-primary btn-lg"
            >
              Message us on WhatsApp
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
