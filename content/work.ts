/**
 * Selected work, told twice.
 *
 * `summary` and `tech` are the recruiter layer: what was built and why it
 * matters, in plain language. `engineer` replaces them in developer view with
 * a case study: the engineering problem, the technical areas it touches, the
 * design decisions and failure modes under the hood, and the trade-off.
 *
 * Every claim traces to the author's own account of the work and its git
 * history. Ownership is stated precisely: the platform's architecture, tenancy
 * model, gateway and shared libraries existed already; these projects were
 * built within them, and shared work is called shared. The client platform
 * is described generically (NDA).
 */

export type WorkFigure = { kind: "d365-flow" };

export interface WorkItem {
  title: string;
  context: string;
  /** Recruiter layer — what it does and why it matters. */
  summary: string;
  tech: string[];
  engineer: {
    /** The question the case study answers, where one frames it best. */
    question?: string;
    /** The engineering problem and what was built, in one paragraph. */
    problem: string;
    /** Engineering concepts the work demonstrates. */
    concepts: string[];
    /** The technologies it was built with. */
    stack: string[];
    /** Design decisions, constraints and failure modes: a lead-in, then the
     *  explanation. */
    points: { lead: string; text: string }[];
    figure?: WorkFigure;
    /** The central trade-off, or an engineering note where there isn't one. */
    note?: { label: "Trade-off" | "Engineering note"; text: string };
  };
}

export const work: WorkItem[] = [
  {
    title: "Financial integration — Microsoft Dynamics 365",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    summary:
      "Built core parts of the platform's connection to Microsoft Dynamics 365, the company's accounting system, so invoices, payments and customer records are posted automatically — and a failure is undone or clearly flagged instead of leaving the books half-updated.",
    tech: ["Microsoft Dynamics 365", "NestJS", "TypeScript", "RabbitMQ"],
    engineer: {
      question:
        "How do you keep a business-critical financial workflow correct when the local database and the external ERP cannot take part in one transaction?",
      problem:
        "The platform posts invoices, payments and customer records to Microsoft Dynamics 365 Finance & Operations over HTTP, so a workflow can succeed in one system and fail in the other. I built the integration client and the posting pipelines for customer records, invoices and custody payments, and co-developed others with the team. They treat the ERP as a separate consistency boundary: every financial mutation is safe to repeat, and a partial failure is either undone or left in an explicit, visible state.",
      concepts: [
        "Distributed consistency boundary",
        "External-system integration",
        "Idempotency under at-least-once delivery",
        "Retries & rate limits",
        "Compensating operations",
        "Financial precision",
      ],
      stack: ["Dynamics 365 F&O (OData)", "RabbitMQ", "NestJS", "TypeScript"],
      points: [
        {
          lead: "Duplicate-safe posting.",
          text: "Messages are delivered at least once, so a posting can arrive again after it already reached the ERP. Every financial mutation is preceded by an existence check against the ERP, which turns a redelivery into a no-op instead of a duplicate invoice or payment.",
        },
        {
          lead: "Transport failures are handled once, in the client.",
          text: "Expired credentials are refreshed and the request retried; rate-limited requests wait for the interval the ERP asks for. This lives in the integration client, behind a generic OData query layer, so posting logic expresses business operations rather than HTTP mechanics.",
        },
        {
          lead: "Compensation instead of a distributed transaction.",
          text: "When a multi-line posting fails partway, the lines the ERP already accepted are reversed — a saga-like recovery step scoped to one financial document, rather than a transaction that pretends to span both systems.",
        },
        {
          lead: "A failed recovery is a state, not a log line.",
          text: "If compensation itself fails, the document is marked ROLLBACK_FAILED, so the inconsistency stays visible and can be followed up instead of disappearing into an exception.",
        },
        {
          lead: "Correct numbers at the edges.",
          text: "Amounts stay in arbitrary-precision decimals end to end. Exchange rates are held in a small in-memory LRU cache keyed by UTC date, so a cached rate is never applied to the wrong day.",
        },
      ],
      figure: { kind: "d365-flow" },
      note: {
        label: "Trade-off",
        text: "With no transaction spanning PostgreSQL and the ERP, consistency is restored after the fact. The cost is a window in which the two systems can disagree, and a terminal state that has to be resolved outside the automated flow. In return, each step can be retried safely, and every failure leaves a state that can be inspected rather than a half-posted ledger.",
      },
    },
  },
  {
    title: "CRM & customer lifecycle workflows",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    summary:
      "Built the CRM service and its company and lead screens: managing leads, companies and contacts, turning a lead into a customer in one step, bulk import from Excel with row-by-row error reports, and a complete audit trail.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "React", "Next.js"],
    engineer: {
      problem:
        "The CRM service owns the customer lifecycle on the platform — leads, companies, contacts, activities, financial accounts and documents — and serves it to other services over message-based RPC. Within the existing service architecture, I created its 10 feature modules (~62 RPC handlers) and the company and lead experience of its micro-frontend. The non-trivial parts are where one business action changes several records at once, and where data entering the system must already satisfy the rules the ERP will enforce later.",
      concepts: [
        "Customer lifecycle workflows",
        "Transactional business operations",
        "Auditability",
        "Validated bulk ingestion",
        "Business-rule enforcement",
        "Message contracts (RPC)",
      ],
      stack: ["NestJS", "RabbitMQ", "TypeORM", "PostgreSQL", "React", "Next.js"],
      points: [
        {
          lead: "Lead-to-customer conversion is one atomic state transition.",
          text: "The company, the converted lead, the contact derived from it and the audit records are written in a single database transaction, so the CRM can never hold a half-converted customer.",
        },
        {
          lead: "Auditability is part of the operation.",
          text: "Audit entries commit or roll back together with the change they describe, so the history can't claim something that didn't happen, or miss something that did.",
        },
        {
          lead: "Spreadsheet import is a validated ingestion pipeline.",
          text: "Row-level validation is separated from persistence, records are written in bounded chunks, and the caller gets a structured per-row success and failure report rather than a single error for the whole file.",
        },
        {
          lead: "Business rules are enforced at the source.",
          text: "VAT requirements by customer classification, credit limits, payment terms and customer groups are validated where records are created — in the service and in the forms — so data the ERP would reject is caught before it reaches a later integration.",
        },
      ],
      note: {
        label: "Trade-off",
        text: "The two operations make opposite choices on purpose. Import accepts partial success with precise reporting, because rejecting a whole file over one bad row helps nobody. Conversion is all-or-nothing, because a partially converted customer is worse than none.",
      },
    },
  },
  {
    title: "Document & workflow automation",
    context: "Skil-Dev · Logistics operations",
    summary:
      "Built the feature that produces a shipment's paperwork — container manifests, shipping statements, bills of lading and commercial invoices — automatically from data spread across several systems, bundled for download, with confidential customer details masked.",
    tech: ["NestJS", "PostgreSQL", "RabbitMQ", "Background jobs"],
    engineer: {
      problem:
        "A shipment's paperwork — container manifests, shipping statements, bills of lading, commercial invoices — depends on data owned by several independently running services. Producing a full document set is long-running and only as available as its slowest dependency, so it can't live inside an HTTP request. I built the document-generation subsystem of the catalog service, which runs it as an asynchronous job with explicit state.",
      concepts: [
        "Asynchronous workflow orchestration",
        "Background job lifecycle",
        "Cross-service aggregation",
        "Data normalisation",
        "Data masking",
        "Document generation",
      ],
      stack: ["NestJS", "RabbitMQ (request/response)", "PostgreSQL"],
      points: [
        {
          lead: "Long-running work is separated from the request lifecycle.",
          text: "A request creates a job and returns immediately; generation runs in the background, and the job's state — not an open connection — is what clients follow to completion.",
        },
        {
          lead: "Inputs are aggregated across service boundaries.",
          text: "Shipment data is gathered from the services that own it through request/response messaging, then normalised into one document model, with weight, measurement and package totals derived centrally and defined fallbacks where upstream data is incomplete.",
        },
        {
          lead: "Domain rules run in the pipeline, not in templates.",
          text: "Dangerous goods are detected from the shipment data, and consignee details are masked unless the party is explicitly allow-listed — decisions made once, before any document is rendered.",
        },
        {
          lead: "Job state is bounded.",
          text: "Finished jobs are expired on a schedule, so the job store reflects work in progress rather than growing without limit.",
        },
      ],
      note: {
        label: "Trade-off",
        text: "Clients get eventual completion instead of an immediate answer, and have to follow a job's state. In exchange, a slow or briefly unavailable upstream service delays one job instead of tying up request capacity, and the outcome is recorded on the job instead of being lost with a timed-out connection.",
      },
    },
  },
  {
    title: "Large-scale search optimization",
    context: "Block Gemini · Dubai",
    summary:
      "Made location search across more than 10 million records return in about 600 ms on average, against a one-second target.",
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "GraphQL"],
    engineer: {
      problem:
        "Location search over more than 10 million records, with a response target of one second. At that size, latency is decided mostly by how the data is indexed and how queries reach it, not by the application code around it. I worked on the Elasticsearch indexing and geospatial queries, the APIs in front of them, and the logging used to see where the time went — reaching about 600 ms on average.",
      concepts: [
        "Geospatial search",
        "Indexing & query design",
        "Latency-sensitive APIs",
        "Measurement-driven tuning",
        "Access control (RBAC)",
      ],
      stack: ["Elasticsearch", "NestJS", "PostgreSQL", "GraphQL"],
      points: [
        {
          lead: "Evidence before tuning.",
          text: "Logs collected through Filebeat into Elasticsearch and Kibana showed where time was being spent, so indexing and query changes were aimed at measured slow paths and judged against an explicit target.",
        },
        {
          lead: "The search path end to end.",
          text: "Elasticsearch serves the geospatial queries behind NestJS REST and GraphQL APIs, with PostgreSQL behind the surrounding data-access services.",
        },
        {
          lead: "Access control across the services.",
          text: "JWT authentication and role-based authorization were implemented across the services the search was served from.",
        },
      ],
      note: {
        label: "Engineering note",
        text: "At this scale, most of the latency budget is spent inside the search engine, so the leverage is in how data is indexed and queried rather than in the API layer — which is why the work started from measurements of where time actually went.",
      },
    },
  },
];
