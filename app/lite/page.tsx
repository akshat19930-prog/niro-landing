import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { NIRO_LITE, NIRO_LITE_EXCLUDES, NIRO_LITE_COUNTS } from "@/lib/content";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";

/**
 * /lite - the detail page for Niro Lite, linked from the pricing section.
 *
 * UNLISTED until Oct 2026, to keep a sub-$50 monthly figure off the page:
 * six research respondents said unprompted that such a price made them
 * DISTRUST the service ("I would be suspicious it's basically a glorified
 * wrapper"). The pack is now shown beside the membership, which is a
 * deliberate reversal, but the same finding still governs how it is PRICED
 * on screen: the headline is the $300 pack, never the $25 a month it works
 * out at. Keep it that way here too.
 *
 * It exists because the demand is real and specific: the leads who refused
 * monthly billing outright wanted their OWN India admin done - a blocked OTP,
 * a stuck EPF claim - rather than parent care. That is a different job, and
 * this is the SKU for it.
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
        <h1 className="pack-title">Niro Lite</h1>
        <p>
          If you have a handful of specific things to get done in India this
          year - a stuck EPF claim, a dormant account, a wrong electricity bill
          at your parents&rsquo; place that needs correction - this is the
          simpler way to buy.
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

        <h2>How tasks are counted</h2>
        <p>
          A task is one thing you want done, run to completion, not one phone
          call. Chasing an EPF claim through four follow-ups is one task, not
          four. A few things are really a bundle of tasks, and count as more.
        </p>
        <table className="pack-counts">
          <tbody>
            {NIRO_LITE_COUNTS.map((r) => (
              <tr key={r.what}>
                <td>{r.what}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Before we start anything that counts as more than one, we tell you
          the number and you decide. The count never changes afterwards: if a
          visit overruns, that is on us.
        </p>

        <p>
          The pack is paid in one go, and unused tasks do not carry into a
          second year.
        </p>
      </article>
    </PageShell>
  );
}
