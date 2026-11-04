import { Icon } from "@/components/ds/Icon";
import { MEMBERSHIP_QUARTER, MEMBERSHIP_SINGLE } from "@/lib/content";

/**
 * The membership card, shared by the home page and /pf so both tell one
 * pricing story.
 *
 * One card since 4 Nov 2026: a single membership with two ways to pay for it.
 * Niro Lite and the six-month plan are retired. The 3-month rate ($49 a
 * month, billed $147) is the headline and month to month ($65) is named in
 * the billing line, because the billing period is a payment choice, not a
 * product choice.
 *
 * `memberLead` puts one highlighted line at the top of the list. /pf uses it
 * for the PF Recovery Credit; the home page leaves it out. The component keeps
 * its old name so the two call sites did not have to change.
 */
export function PricingTiers({
  membershipFeatures,
  memberLead,
}: {
  membershipFeatures: string[];
  memberLead?: string;
}) {
  return (
    <div className="tier-pair tier-solo">
      <div className="tier">
        <div className="tier-head">
          <span className="tier-name">Niro membership</span>
        </div>
        <div className="tier-price">
          <span className="tier-num">{MEMBERSHIP_QUARTER.price}</span>
          <span className="tier-per">{MEMBERSHIP_QUARTER.per}</span>
        </div>
        <div className="tier-alt">
          {MEMBERSHIP_QUARTER.sub}. Or <b>{MEMBERSHIP_SINGLE.price}</b> month to month.
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
