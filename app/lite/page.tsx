import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { NIRO_LITE, COVERAGE_NOTE } from "@/lib/content";
import { Icon } from "@/components/ds/Icon";
import { SUPPORT_WHATSAPP } from "@/lib/config";

/**
 * /lite - UNLISTED. The 15-task annual pack, for sales to share on a call.
 *
 * Deliberately off the public pricing grid. At $270 a year it reads as $22.50
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
  title: "Niro Lite - 15 tasks a year",
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
          <a
            className="btn btn-primary btn-md"
            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
              "Hi Niro - I'd like the Niro Lite pack at $270 a year. Can you send me the payment link?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask for the payment link
          </a>
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

        <h2>If you change your mind</h2>
        <p>
          The same 30-day money-back guarantee applies. Unused tasks do not carry
          into a second year.
        </p>
      </article>
    </PageShell>
  );
}
