import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { EMERGENCY_SLA, EMERGENCY_STEPS, SERVICE_CITIES } from "@/lib/content";

/**
 * /niro-assure - the emergency response protocol, with numbers.
 *
 * This page exists because of the single sharpest finding in the research:
 * emergency response is the most-wanted capability (68.9% of task selections,
 * 9 of 18 interviews ranked it first) AND the least believed. Respondents did
 * not ask for reassurance, they asked for specifics - a response benchmark, a
 * documented protocol, a hospital within a defined time. Until now there was
 * no published SLA at all: the feature that most needed one had none.
 *
 * Two deliberate restraints:
 *  - The times are scoped to the launch cities, stated on the page. An SLA that
 *    silently implies national coverage is worse than no SLA.
 *  - "Median arrival", not "guaranteed arrival", for the 20-minute figure. We
 *    control the call pickup and the dispatch; we do not control traffic.
 */
export const metadata: Metadata = {
  title: "Niro Assure - our emergency response protocol",
  description:
    "What happens when your parents have a medical emergency: a person in 45 seconds, an ambulance dispatched in 5 minutes, and a Niro Assistant at the hospital.",
  alternates: { canonical: "https://tellniro.com/niro-assure" },
};

export default function EmergencyPage() {
  return (
    <PageShell>
      <article className="prose">
        <p className="assured-mark">Niro Assure</p>
        <h1>When something goes wrong at 3 a.m.</h1>
        <p>
          This is the part of Niro people ask about first and believe last. So
          here is exactly what happens, with the numbers we hold ourselves to -
          and the honest limits of each one.
        </p>

        <div className="sla-grid">
          {EMERGENCY_SLA.map((s) => (
            <div key={s.label} className="sla-card">
              <div className="sla-value">{s.value}</div>
              <div className="sla-label">{s.label}</div>
              <p className="sla-detail">{s.detail}</p>
            </div>
          ))}
        </div>

        <p className="sla-scope">
          These times apply in our five launch cities:{" "}
          <strong>
            {SERVICE_CITIES.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}
          </strong>
          . Outside them we will still coordinate an emergency for you, but we
          will not pretend to a response time we cannot hold.
        </p>

        <h2>The protocol, step by step</h2>
        <ol className="emg-steps">
          {EMERGENCY_STEPS.map((s) => (
            <li key={s.title}>
              <b>{s.title}</b>
              <span>{s.body}</span>
            </li>
          ))}
        </ol>

        <h2>Who actually turns up</h2>
        <p>
          The ambulance comes from our partner - a fleet of equipped ambulances
          with paramedics on board. The person who meets your parents at the
          hospital is a{" "}
          <strong>Niro Assistant on our own payroll</strong>, background-checked
          and introduced to your family by name and photo before anything ever
          happens. You are not being handed to a marketplace at the worst moment
          of your year.
        </p>

        <h2>What we set up before you need it</h2>
        <p>
          Almost all of the speed above comes from work done in advance, on your
          onboarding call. We record your parents&rsquo; medical history, current
          medication, allergies, blood group, insurance policy and preferred
          hospital, and we write down your family&rsquo;s protocol: who we call
          first, which hospital you want, what needs your approval, and what we
          should never do without asking you. In an emergency we execute that
          document. We do not improvise.
        </p>
        <p>
          The same file is what our insurance desk works from: we hold the
          policy details in advance and prepare the pre-authorisation, so that
          paperwork is already moving while your parents are being seen.
        </p>

        <h2>What this is not</h2>
        <p className="note">
          <strong>
            Niro is a coordination service, not a medical provider.
          </strong>{" "}
          We do not diagnose, treat, or give medical advice, and Niro Assistants
          are not clinicians. In a life-threatening emergency, call your local
          emergency number directly - and then tell us, so we can get a person
          moving and be at the hospital when your parents arrive.
        </p>

      </article>
    </PageShell>
  );
}
