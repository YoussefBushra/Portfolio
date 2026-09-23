import { SectionShell } from "@/components/layout/SectionShell";

interface WorkItem {
  title: string;
  context: string;
  body: string;
  tech: string[];
}

/**
 * Selected work in plain language — what was built and why it mattered to the
 * business, with the relevant stack. Kept to a scannable outcome per card.
 */
const WORK: WorkItem[] = [
  {
    title: "Business system integration — Microsoft Dynamics 365",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    body: "Built and maintained Microsoft Dynamics 365 integrations for invoices, payments, customers, and exchange rates across the company's logistics platform.",
    tech: ["Microsoft Dynamics 365", "NestJS", "TypeScript", "PostgreSQL"],
  },
  {
    title: "CRM & business platform development",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    body: "Built and maintained CRM features for leads, companies, contacts, activities, documents, and financial accounts, including bulk Excel import and validation.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "React"],
  },
  {
    title: "Document & workflow automation",
    context: "Skil-Dev · Logistics operations",
    body: "Built the service that generates shipping documents and document bundles from shipment data gathered across multiple systems, with asynchronous processing and scheduled cleanup.",
    tech: ["NestJS", "PostgreSQL", "Background jobs"],
  },
  {
    title: "Large-scale search optimization",
    context: "Block Gemini · Dubai",
    body: "Optimized geo-location search across more than 10 million records, reaching approximately 600 ms average response against a one-second target.",
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis"],
  },
];

export function SelectedWork() {
  return (
    <SectionShell id="work" index="01" label="Selected Work">
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
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
