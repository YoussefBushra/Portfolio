/**
 * Selected work, told twice.
 *
 * `summary` and `tech` are the recruiter layer: what was built and why it
 * matters, in plain language. `engineer` replaces them in developer view with
 * a case study: the engineering problem, the technical areas it touches, the
 * design decisions and failure modes under the hood, and the trade-off.
 *
 * Every claim traces to the author's own account of the work. Ownership is
 * stated precisely: the platform's architecture, tenancy model and gateway
 * existed already; these projects were built within them. The client platform
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
    title: "Business system integration — Microsoft Dynamics 365",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    summary:
      "Connected the logistics platform to Microsoft Dynamics 365, the company's accounting system, so invoices and payments are posted automatically — with safeguards so a failure never leaves the books half-updated.",
    tech: ["Microsoft Dynamics 365", "NestJS", "TypeScript", "RabbitMQ"],
    engineer: {
      problem:
        "The platform posts invoices, payments and customer records to Microsoft Dynamics 365 Finance & Operations. The ERP is reached over HTTP and cannot take part in the platform's PostgreSQL transaction, so a financial workflow can succeed in one system and fail in the other. I owned key parts of the integration client and its posting logic, which treat the ERP as a separate consistency boundary: every financial mutation is safe to repeat, and a partial failure is either undone or left in an explicit, visible state.",
      concepts: [
        "Distributed consistency boundary",
        "Idempotent financial mutations",
        "At-least-once delivery",
        "Compensating transactions",
        "Failure recovery",
        "Financial precision",
      ],
      stack: ["Dynamics 365 F&O (OData)", "RabbitMQ", "NestJS", "TypeScript"],
      points: [
        {
          lead: "Duplicate-safe posting.",
          text: "Messages are delivered at least once, so a posting can arrive again after it already reached the ERP. Every financial mutation is preceded by an existence check against the ERP, which turns a redelivery into a no-op instead of a duplicate invoice or payment.",
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
          lead: "Transport concerns live in one place.",
          text: "Token lifecycle and rate-limit-aware retries are handled inside the integration client, behind a generic OData query layer, so posting logic expresses business operations rather than HTTP mechanics.",
        },
        {
          lead: "Correct numbers at the edges.",
          text: "Amounts stay in arbitrary-precision decimals end to end, and exchange rates are cached per UTC date in a short-lived LRU cache, so a cached rate is never applied to the wrong day.",
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
    title: "CRM & business platform development",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    summary:
      "Built the CRM used to manage leads, companies and contacts, and to turn a lead into a customer in one step — including bulk import from Excel with row-by-row error reports, and a full audit trail.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "React"],
    engineer: {
      problem:
        "The CRM service owns the customer lifecycle on the platform — leads, companies, contacts, activities, financial accounts and documents — and serves it to the rest of the platform over message-based RPC. I built its feature modules within the existing service architecture: about 10 modules and ~62 RPC handlers. The non-trivial parts are where one business action changes several records at once, and where data entering the system must already satisfy the rules the ERP will enforce later.",
      concepts: [
        "Domain-oriented service design",
        "Message contracts (RPC)",
        "Atomic state transitions",
        "Auditability",
        "Batch ingestion",
        "Validation pipeline",
      ],
      stack: ["NestJS", "RabbitMQ", "TypeORM", "PostgreSQL", "React"],
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
          lead: "Spreadsheet import is a batch-ingestion pipeline.",
          text: "Row-level validation is separated from persistence, records are written in bounded chunks, and the caller gets a structured per-row success and failure report rather than a single error for the whole file.",
        },
        {
          lead: "Application rules are aligned with the ERP's.",
          text: "VAT requirements by customer classification, credit limits, payment terms and customer groups are validated where records are created, so data the ERP would reject is caught at the source instead of during a later integration.",
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
      "Built the service that produces a shipment's paperwork — container manifests, shipping statements, bills of lading and commercial invoices — automatically from data spread across several systems, bundled for download.",
    tech: ["NestJS", "PostgreSQL", "RabbitMQ", "Background jobs"],
    engineer: {
      problem:
        "A shipment's paperwork — container manifests, shipping statements, bills of lading, commercial invoices — depends on data owned by several independently running services. Producing a full document set is long-running and only as available as its slowest dependency, so it can't live inside an HTTP request. I built the service that runs it as an asynchronous job with explicit state.",
      concepts: [
        "Asynchronous workflow orchestration",
        "Job lifecycle & explicit state",
        "Cross-service aggregation",
        "Data normalisation",
        "Document-generation pipeline",
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
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis"],
    engineer: {
      problem:
        "Location search over more than 10 million records, with a response target of one second. At that size, latency is decided mostly by how the data is indexed and how queries reach it, not by the application code around it. I worked on the Elasticsearch indexing and geospatial queries, the APIs and data-access services in front of them, and the logging and monitoring used to find where the time went — reaching about 600 ms on average.",
      concepts: [
        "Geospatial search",
        "Indexing & query design",
        "Latency-sensitive APIs",
        "Observability-driven tuning",
        "Access control (RBAC)",
      ],
      stack: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis", "GraphQL"],
      points: [
        {
          lead: "A measured target, not a feeling.",
          text: "Geo-location search across 10M+ records averages ~600 ms against a one-second goal, so every change could be judged against an explicit number.",
        },
        {
          lead: "Evidence before tuning.",
          text: "Logs shipped through Filebeat and Logstash into Elasticsearch and Kibana, read together with traces, located the slow paths before indexing or queries were changed.",
        },
        {
          lead: "The search path end to end.",
          text: "Elasticsearch serves the geospatial queries; PostgreSQL and Redis back the surrounding data-access services, exposed through NestJS and GraphQL APIs.",
        },
        {
          lead: "Access control across the services.",
          text: "Authentication and role-based authorization were implemented across the services the search was served from.",
        },
      ],
      note: {
        label: "Engineering note",
        text: "At this scale, most of the latency budget is spent inside the search engine, so the leverage is in how data is indexed and queried rather than in the API layer — which is why the work started from measurements of where time actually went.",
      },
    },
  },
];
