import { SectionShell } from "@/components/layout/SectionShell";

interface WorkItem {
  title: string;
  context: string;
  body: string;
  tech: string[];
  details: string[];
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
    body: "Built and maintained Microsoft Dynamics 365 integrations for invoices, payments, customers, and exchange rates across the company's logistics platform.",
    tech: ["Microsoft Dynamics 365", "NestJS", "TypeScript", "PostgreSQL"],
    details: [
      "OData client with OAuth2, token refresh and rate-limit handling",
      "Reliable, idempotent document posting with rollback on failure",
      "Exchange-rate normalization and precise currency arithmetic",
    ],
  },
  {
    title: "CRM & business platform development",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    body: "Built and maintained CRM features for leads, companies, contacts, activities, documents, and financial accounts, including bulk Excel import and validation.",
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
    body: "Built the service that generates shipping documents and document bundles from shipment data gathered across multiple systems, with asynchronous processing and scheduled cleanup.",
    tech: ["NestJS", "PostgreSQL", "Background jobs"],
    details: [
      "Shipping and container document generation from cross-service shipment data",
      "PDF documents and multi-document bundles built from templates",
      "Asynchronous document jobs with scheduled cleanup of generated files",
      "Dangerous-goods detection and consignee-data privacy handling",
    ],
  },
  {
    title: "Large-scale search optimization",
    context: "Block Gemini · Dubai",
    body: "Optimized geo-location search across more than 10 million records, reaching approximately 600 ms average response against a one-second target.",
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis"],
    details: [
      "Elasticsearch index and query tuning for geo-location queries",
      "Caching plus a logging and monitoring pipeline to operate the system",
    ],
  },
];

export function SelectedWork() {
  return (
    <SectionShell id="work" label="Selected Work">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {WORK.map((w) => (
          <article
            key={w.title}
            className="panel flex flex-col p-6 transition-all duration-200 hover:border-faint hover:shadow-md"
          >
            <h3 className="text-[17px] font-semibold tracking-tight text-text">
              {w.title}
            </h3>
            <p className="mt-1 text-[12.5px] text-faint">{w.context}</p>

            <p className="mt-3 text-[14px] leading-relaxed text-muted">{w.body}</p>

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
