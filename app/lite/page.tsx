import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { NIRO_LITE, COVERAGE_NOTE } from "@/lib/content";
import { Icon } from "@/components/ds/Icon";
import { WhatsAppLink } from "@/components/ds/WhatsAppLink";

/**
 * /lite - the detail page for the task pack, linked from the pricing section.
 *
 * It was unlisted until Oct 2026, to keep a sub-$50 monthly figure off the
 * page: six research respondents said unprompted that such a price made them
 * DISTRUST the service ("I would be suspicious it's basically a glorified
 * wrapper"). The pack is now shown beside the membership, which is a
 * deliberate reversal, but the same finding still governs how it is PRICED on
 * screen: the headline is the $300 pack, never the $25 a month it works out
 * at. Keep it that way here too.
 *
 * It exists because the demand is real and specific: the leads who refused
 * monthly billing outright wanted their OWN India admin done - a blocked OTP,
 * a stuck EPF claim - rather than parent care. That is a different job, and
 * this is the SKU for it.
 */
export const metadata: Metadata = {
  title: "Niro task pack - 20 tasks",
  description: "A task pack for people who don't want a monthly membership.",
  robots: { index: false, follow: false },
};

export default function TasksPackPage() {
  return (
    <PageShell>
      <article className="prose">
        <h1>The Niro task pack</h1>
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
          <WhatsAppLink
            className="btn btn-primary btn-md"
            placement="lite_payment_link"
            message="Hi Niro - I'd like the task pack, 20 tasks for $300. Can you send me the payment link?"
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

        <h2>What is not included</h2>
        <p>{COVERAGE_NOTE.excludes}</p>
        <p className="note">
          The pack does <strong>not</strong> include a dedicated family manager,
          a Niro Assistant on the ground during an emergency, or a second family
          group. Those are part of the monthly membership.
        </p>

        <p>
          The pack is paid in one go, and unused tasks do not carry into a
          second year.
        </p>
      </article>
    </PageShell>
  );
}
