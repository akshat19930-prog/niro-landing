import { Icon } from "@/components/ds/Icon";
import {
  MEMBERSHIP_QUARTER, MEMBERSHIP_SINGLE, MEMBERSHIP_HALF_PRICE, NIRO_LITE, NIRO_LITE_EXCLUDES,
} from "@/lib/content";

/**
 * The pricing cards, shared by the home page and /pf: the Niro membership and
 * the Niro Lite pack. Neither card is styled as preferred and neither carries
 * a badge.
 *
 * The membership card's headline is the 3-month rate ($49 a month, billed
 * $147), with month to month ($65) named in the billing line, because the
 * billing period is a payment choice, not a product choice.
 *
 * `lite` places the Lite card:
 *  - "last" on the home page (5 Nov 2026): the membership leads and Lite sits
 *    after it, so on a phone, where the cards stack, Lite is the second card.
 *  - "first" on /pf, where the pack is what most price-objectors look for.
 *
 * `withHalfPack` (/pf only) also names the six-month pack ($294, the same $49
 * a month) in the membership's billing line; it carries a larger PF Recovery
 * Credit, which is why it is offered on /pf only.
 *
 * `liteLead` / `memberLead` put one highlighted line at the top of each list.
 * /pf uses them for the PF Recovery Credit; the home page leaves them out.
 */
export function PricingTiers({
  membershipFeatures,
  memberLead,
  liteLead,
  lite,
  withHalfPack = false,
}: {
  membershipFeatures: string[];
  memberLead?: string;
  liteLead?: string;
  lite?: "first" | "last";
  withHalfPack?: boolean;
}) {
  const liteCard = (
    <div className="tier tier-lite">
      <div className="tier-head">
        <span className="tier-name">{NIRO_LITE.name}</span>
      </div>
      <div className="tier-price">
        <span className="tier-num">{NIRO_LITE.price}</span>
        <span className="tier-per">{NIRO_LITE.per}</span>
      </div>
      <div className="tier-alt">Paid once. Nothing recurring.</div>
      <p className="tier-for">{NIRO_LITE.sub}.</p>
      <ul className="tier-list">
        {liteLead && (
          <li className="tier-lead"><Icon name="wallet" size={16} /><span>{liteLead}</span></li>
        )}
        {NIRO_LITE.features.map((f) => (
          <li key={f}><Icon name="check-circle" size={16} /><span>{f}</span></li>
        ))}
        {NIRO_LITE_EXCLUDES.map((f) => (
          <li key={f} className="tier-no"><span className="tier-x" aria-hidden="true" />
            <span>{f}</span></li>
        ))}
      </ul>
      {/* A text link, not a button: the section keeps one primary action. */}
      <a className="tier-more" href="/lite/">
        How Niro Lite works &rarr;
      </a>
    </div>
  );

  return (
    <div className={lite ? "tier-pair" : "tier-pair tier-solo"}>
      {lite === "first" && liteCard}

      <div className="tier">
        <div className="tier-head">
          <span className="tier-name">Niro membership</span>
        </div>
        <div className="tier-price">
          <span className="tier-num">{MEMBERSHIP_QUARTER.price}</span>
          <span className="tier-per">{MEMBERSHIP_QUARTER.per}</span>
        </div>
        <div className="tier-alt">
          {withHalfPack ? (
            <>
              {MEMBERSHIP_QUARTER.sub}. Or <b>{MEMBERSHIP_HALF_PRICE}</b> for 6 months, or{" "}
              <b>{MEMBERSHIP_SINGLE.price}</b> month to month.
            </>
          ) : (
            <>
              {MEMBERSHIP_QUARTER.sub}. Or <b>{MEMBERSHIP_SINGLE.price}</b> month to month.
            </>
          )}
        </div>
        <p className="tier-for">Everything Niro does, continuously, with no cap on tasks.</p>
        <ul className="tier-list">
          {memberLead && (
            <li className="tier-lead"><Icon name="wallet" size={16} /><span>{memberLead}</span></li>
          )}
          {membershipFeatures.map((f) => (
            <li key={f}><Icon name="check-circle" size={16} /><span>{f}</span></li>
          ))}
        </ul>
      </div>

      {lite === "last" && liteCard}
    </div>
  );
}
