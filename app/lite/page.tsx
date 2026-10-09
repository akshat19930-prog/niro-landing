import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { NIRO_LITE, NIRO_LITE_EXCLUDES } from "@/lib/content";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";

/**
 * /lite - UNLISTED. The 20-task annual pack, for sales to share on a call.
 *
 * Deliberately off the public pricing grid. At $300 a year it reads as $25
 * a month, which sits inside the band where six research respondents said a
 * low price made them DISTRUST the service ("I would be suspicious it's
 * basically a glorified wrapper"), and putting it beside $99 would reset the
 * anchor on the page that is doing the selling.
 *
 * It exists because the demand is real and specific: the leads who refused
 * monthly billing outright wanted their OWN India admin done - a blocked OTP,
 * a stuck EPF claim - rather than parent care. That is a different job, and
 * this is the SKU for it.
 *
 * Note on "private": the path is unguessable-ish and noindex'd, but this is a
 * static export - anyone with the URL can open it. Obscure, not secret. Do not
 * put anything here you would mind a competitor reading.
 */
export const metadata: Metadata = {
  title: "Niro Lite - 20 tasks a year",
  description: "A task pack for people who don't want a monthly membership.",
  robots: { index: false, follow: false },
};

export default function TasksPackPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>Niro Lite</h1>
        <p>
          Most people join Niro monthly, because the work is continuous. But if
          you have a handful of specific things to get done in India this year -
          a stuck EPF claim, a dormant account, paperwork that needs a person on
          the ground - this is the simpler way to buy.
        </p>

        <div className="pack-card">
          <div className="pack-price">
            <span className="pack-amount">{NIRO_LITE.price}</span>
            <span className="pack-per">{NIRO_LITE.per}</span>
          </div>
          <p className="pack-sub">{NIRO_LITE.sub}</p>
          <ul className="pack-features">
            {NIRO_LITE.features.map((f) => (
              <li key={f}>
                <Icon name="check-circle" size={16} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {/* The exclusions sit on the card, not in prose further down, because
              this is the moment someone decides. Assure and Visits are the two
              people assume are in it. */}
          <p className="pack-excl-label">Not included</p>
          <ul className="pack-features pack-excludes">
            {NIRO_LITE_EXCLUDES.map((f) => (
              <li key={f}>
                <Icon name="x-circle" size={16} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <WhatsAppLink
            className="btn btn-primary btn-md"
            placement="lite_payment_link"
            message="Hi Niro - I'd like the Niro Lite pack, 20 tasks at $300 a year. Can you send me the payment link?"
            showIcon={false}
          >
            Ask for the payment link
          </WhatsAppLink>
        </div>

        <h2>How the tasks work</h2>
        <p>
          A task is one thing you want done, run to completion - not one phone
          call. Chasing an EPF claim through four visits to the office is one
          task, not four. We tell you before we start if something is large
          enough to count as two, and you decide.
        </p>

        <p>
          Unused tasks do not carry into a second year.
        </p>
      </article>
    </PageShell>
  );
}
