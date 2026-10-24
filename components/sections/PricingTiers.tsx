import { Icon } from "@/components/ds/Icon";
import {
  PLANS, MEMBERSHIP_HALF_PRICE, NIRO_LITE, NIRO_LITE_EXCLUDES,
} from "@/lib/content";

/**
 * The two pricing tiers, Niro Lite and the membership, shared by the home page
 * and /pfmoneytasks so both show one pricing story.
 *
 * Two TIERS, not three cards. Monthly, quarterly and six-monthly are nested
 * inside the membership because they are a payment choice, not a product
 * choice. Neither tier is styled as preferred and neither carries a badge:
 * same service, two ways to pay for it.
 *
 * `liteLead` / `memberLead` put one highlighted line at the top of each card's
 * list. /pfmoneytasks uses it for the PF Recovery Credit; the home page leaves
 * it out.
 */
export function PricingTiers({
  membershipFeatures,
  liteLead,
  memberLead,
}: {
  membershipFeatures: string[];
  liteLead?: string;
  memberLead?: string;
}) {
  return (
    <div className="tier-pair">
      {/* Lite sits first: on a phone the cards stack, and the pack is the
          one most price-objectors are looking for. */}
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
        {/* A text link, not a button: the section keeps one primary action.
            This is for someone who wants to read how the pack works first. */}
        <a className="tier-more" href="/lite/">
          How Niro Lite works &rarr;
        </a>
      </div>

      <div className="tier">
        <div className="tier-head">
          <span className="tier-name">Membership</span>
        </div>
        {/* The quarterly rate is the headline; the six-month and monthly
            figures are the alternatives, not the anchor. */}
        <div className="tier-price">
          <span className="tier-num">{PLANS[1].price}</span>
          <span className="tier-per">{PLANS[1].per}</span>
        </div>
        <div className="tier-alt">
          Billed quarterly, $250 every three months. Or <b>{MEMBERSHIP_HALF_PRICE}</b> for six months, or <b>{PLANS[0].price}</b> per month.
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
    </div>
  );
}
