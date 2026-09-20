import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Engineering evidence, above the detailed experience. Every figure is drawn
 * from work described elsewhere on the page — nothing invented.
 */
const HIGHLIGHTS = [
  {
    value: "10M+",
    label: "Records under search",
    note: "Elasticsearch geo-location dataset",
  },
  {
    value: "~600ms",
    label: "Average query response",
    note: "against a sub-1-second target",
  },
  {
    value: "Multi-tenant",
    label: "SaaS platform",
    note: "domain-decoupled, message-driven services",
  },
  {
    value: "Event-driven",
    label: "Distributed backend",
    note: "RabbitMQ, idempotent consumers",
  },
];

export function Highlights() {
  return (
    <SectionShell id="highlights" label="Engineering Highlights" variant="wide">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="panel p-6">
            <dt className="num text-[30px] font-semibold leading-none tracking-tight text-text sm:text-[34px]">
              {h.value}
            </dt>
            <dd className="mt-3 text-[14px] font-medium text-text">{h.label}</dd>
            <dd className="mt-1 text-[13px] leading-snug text-muted">
              {h.note}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
