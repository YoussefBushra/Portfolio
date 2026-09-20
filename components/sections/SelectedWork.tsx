import { SectionShell } from "@/components/layout/SectionShell";

interface WorkItem {
  title: string;
  context: string;
  body: string;
  tech: string[];
  details: string[];
  scale?: boolean;
}

/**
 * Selected work in plain language — what was built and why it mattered to the
 * business. Deeper technical detail sits behind a "Technical details" toggle so
 * a recruiter reads the outcome and an engineer can still go deeper.
 */
const WORK: WorkItem[] = [
  {
    title: "Business system integration — Microsoft Dynamics 365",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    body: "Built and maintained integrations with Microsoft Dynamics 365 that keep financial and operational data in sync between the company's platform and its accounting systems — invoices, payments, customers and exchange rates.",
    tech: ["Microsoft Dynamics 365", "NestJS", "TypeScript", "PostgreSQL"],
    details: [
      "OData client with OAuth2, token refresh and rate-limit handling",
      "Reliable, idempotent document posting with rollback on failure",
      "Exchange-rate normalization and precise currency arithmetic",
    ],
  },
  {
    title: "Large-scale search optimization",
    context: "Block Gemini · Dubai",
    body: "Optimized geo-location search across a dataset of more than 10 million records, reaching approximately 600 ms average response — comfortably inside a one-second target.",
    scale: true,
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis"],
    details: [
      "Elasticsearch index and query tuning for geo-location queries",
      "Caching plus a logging and monitoring pipeline to operate the system",
    ],
  },
  {
    title: "CRM & business platform development",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    body: "Built and maintained core CRM features — leads, companies, contacts, activities, documents and financial accounts — including bulk data import and validation, on a platform serving logistics and financial operations.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "React"],
    details: [
      "Full CRM domain, with lead-to-company conversion as an audited transaction",
      "Bulk Excel import with per-row validation and structured error reporting",
      "Business-rule validation such as conditional VAT and credit rules",
    ],
  },
  {
    title: "Document & workflow automation",
    context: "Skil-Dev · Logistics operations",
    body: "Developed automated document generation for logistics operations — shipping documents, commercial invoices, manifests and document bundles — produced from data gathered across multiple systems.",
    tech: ["NestJS", "PostgreSQL", "Background jobs"],
    details: [
      "Cross-system data aggregation into generated PDF document sets",
      "Background job processing with scheduled cleanup",
      "Data-privacy handling and dangerous-goods detection",
    ],
  },
];

function ScaleVisual() {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-sm border border-line bg-surface px-4 py-3">
      <div>
        <div className="num text-[20px] font-semibold leading-none tracking-tight text-text">
          10M+
        </div>
        <div className="mt-1 text-[12px] text-muted">records</div>
      </div>
      <div
        className="h-px flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgb(var(--line)) 0 6px, transparent 6px 12px)",
        }}
        aria-hidden
      />
      <div className="text-right">
        <div className="num text-[20px] font-semibold leading-none tracking-tight text-accent-text">
          ~600ms
        </div>
        <div className="mt-1 text-[12px] text-muted">avg response</div>
      </div>
    </div>
  );
}

export function SelectedWork() {
  return (
    <SectionShell id="work" label="Selected Work" variant="wide">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {WORK.map((w) => (
          <article key={w.title} className="panel flex flex-col p-6">
            <h3 className="text-[17px] font-semibold tracking-tight text-text">
              {w.title}
            </h3>
            <p className="mt-1 text-[12.5px] text-faint">{w.context}</p>

            <p className="mt-3 text-[14px] leading-relaxed text-muted">{w.body}</p>

            {w.scale ? <ScaleVisual /> : null}

            <p className="mt-4 text-[12.5px] text-muted">
              <span className="font-medium text-text">Tech</span>{" "}
              <span className="text-faint">·</span> {w.tech.join(" · ")}
            </p>

            <details className="group mt-3 border-t border-line pt-3">
              <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm text-[12.5px] font-medium text-muted transition-colors hover:text-text">
                <span className="text-faint transition-transform group-open:rotate-90">
                  ›
                </span>
                Technical details
              </summary>
              <ul className="mt-2.5 space-y-1.5">
                {w.details.map((d) => (
                  <li
                    key={d}
                    className="border-l border-line pl-3 text-[12.5px] leading-[1.55] text-muted"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
