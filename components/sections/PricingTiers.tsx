import { Icon } from "@/components/ds/Icon";
import {
  MEMBERSHIP_QUARTER, MEMBERSHIP_SINGLE, MEMBERSHIP_HALF_PRICE, NIRO_LITE, NIRO_LITE_EXCLUDES,
} from "@/lib/content";

/**
 * The pricing cards, shared by the home page and /pf.
 *
 * Home page: one card since 4 Nov 2026, a single membership with two ways to
 * pay for it. The 3-month rate ($49 a month, billed $147) is the headline and
 * month to month ($65) is named in the billing line, because the billing
 * period is a payment choice, not a product choice.
 *
 * /pf (`withPacks`): the Niro Lite card comes back beside the membership, and
 * the membership's billing line also names the six-month pack. Both carry a
 * PF Recovery Credit there, which is why they are offered on /pf only. The
 * six-month pack is shown as its pack price ($270), never as the $45 a month
 * it works out at: nothing on the site goes below $49 a month. Neither card
 * is styled as preferred.
 *
 * `liteLead` / `memberLead` put one highlighted line at the top of each list.
 * /pf uses them for the PF Recovery Credit; the home page leaves them out.
 */
export function PricingTiers({
  membershipFeatures,
  memberLead,
  liteLead,
  withPacks = false,
}: {
  membershipFeatures: string[];
  memberLead?: string;
  liteLead?: string;
  withPacks?: boolean;
}) {
  return (
    <div className={withPacks ? "tier-pair" : "tier-pair tier-solo"}>
      {withPacks && (
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
      )}

      <div className="tier">
        <div className="tier-head">
          <span className="tier-name">Niro membership</span>
        </div>
        <div className="tier-price">
          <span className="tier-num">{MEMBERSHIP_QUARTER.price}</span>
          <span className="tier-per">{MEMBERSHIP_QUARTER.per}</span>
        </div>
        <div className="tier-alt">
          {withPacks ? (
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
    </div>
  );
}
