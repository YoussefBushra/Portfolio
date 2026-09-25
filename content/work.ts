import type { CaseStudy } from "@/lib/types";

/**
 * Selected work, told twice. `title` and `outcome` are the recruiter layer and
 * are shown in both views; `engineer` is the layer that opens underneath.
 *
 * Client-safe: the platform is described generically ("a freight-forwarding
 * ERP platform"), code is short illustrative pseudocode, and every figure comes
 * from the CV or from email-filtered git history.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: "accounting",
    title: "Automatic accounting for a logistics platform",
    company: "Skil-Dev",
    domain: "Finance · ERP integration",
    period: "2025 – 2026",
    outcome:
      "Built the system that sends every invoice, payment and customer record from the logistics platform into the company's accounting software, Microsoft Dynamics 365, automatically and safely: if something fails halfway, the books are never left half-updated.",
    tech: ["Microsoft Dynamics 365", "NestJS", "RabbitMQ", "PostgreSQL", "TypeScript"],
    engineer: {
      flow: [
        { label: "Domain service", note: "invoice / payment" },
        { label: "Outbox", note: "same DB transaction" },
        { label: "RabbitMQ", note: "at-least-once" },
        { label: "Integration service", note: "idempotent consumer" },
        { label: "D365 F&O", note: "OData · OAuth2" },
      ],
      failure:
        "reverse the lines already posted → mark FAILED; a failed reversal surfaces as ROLLBACK_FAILED instead of failing silently",
      notes: [
        {
          k: "Idempotency",
          v: "An existence check on the document's business key runs before any D365 mutation, so a redelivered message is a no-op.",
        },
        {
          k: "Compensation",
          v: "Multi-line postings are tracked line by line. On failure, what was posted is reversed and the document keeps an explicit terminal state.",
        },
        {
          k: "Auth & rate limits",
          v: "401 → refresh the OAuth2 token and retry once. 429 → back off for a validated Retry-After instead of hammering the API.",
        },
        {
          k: "Money",
          v: "decimal.js for all arithmetic, debit/credit inversion for credit notes, no floats anywhere near a ledger.",
        },
        {
          k: "Exchange rates",
          v: "LRU cache, 100 currency pairs, 5-minute TTL, keyed on the UTC date so a rate never goes stale across midnight.",
        },
        {
          k: "Retry-safe events",
          v: "Accrual stamping runs in one DB transaction under a pessimistic_write lock; only stamp-then-publish is guarded against double emit.",
        },
      ],
      figures: ["114 commits", "10+ core services authored", "3 posting pipelines owned", "2 production migrations"],
      code: `post(doc):
  if await d365.exists(doc.key): return      # redelivery → no-op
  posted = []
  try:
    for line in doc.lines:
      posted.push(await d365.create(line))    # 401 → refresh, 429 → Retry-After
    mark(doc, POSTED)
  catch err:
    ok = await reverse(posted)                # compensate what went through
    mark(doc, ok ? FAILED : ROLLBACK_FAILED)  # never silently half-posted`,
      tradeoff:
        "Compensation instead of a distributed transaction. D365's OData API has no two-phase commit, so atomicity is rebuilt from idempotent steps and explicit reversals. The cost is an extra terminal state that someone has to watch.",
      // TODO(youssef): rewrite in your own words.
      differently:
        "Stand up contract tests against a D365 sandbox from day one. Many fixes were mapping edge cases (tax groups, credit notes, rate dates) that only showed up against the real API.",
    },
  },
  {
    id: "crm",
    title: "A CRM built for a freight forwarder",
    company: "Skil-Dev",
    domain: "CRM · Sales operations",
    period: "2025 – 2026",
    outcome:
      "Built the system the sales team uses to track leads and turn them into customers, including importing thousands of records from Excel at once. Every change is recorded, so there's always an audit trail of who did what.",
    tech: ["NestJS", "PostgreSQL", "TypeORM", "RabbitMQ", "React", "Next.js"],
    engineer: {
      flow: [
        { label: "Excel upload", note: "exceljs, normalised cells" },
        { label: "Row validation", note: "class-validator, per row" },
        { label: "50-row chunks", note: "batched inserts" },
        { label: "PostgreSQL", note: "multi-tenant" },
        { label: "Audit log", note: "per chunk" },
      ],
      failure: "bad rows are reported back with their row number and reason; good rows still land",
      notes: [
        {
          k: "Scope",
          v: "Created all 10 domain modules (leads, companies, contacts, activities, financial accounts, documents…) exposing ~62 RabbitMQ RPC handlers.",
        },
        {
          k: "Conversion",
          v: "Lead → company runs as one DB transaction: create the company, back-link the lead, copy it as a contact, write four audit entries.",
        },
        {
          k: "Validation",
          v: "Phone-or-email contact rule, unique VAT ID with an actionable message, VAT rules conditional on classification and client type, payment terms checked against D365.",
        },
        {
          k: "Errors",
          v: "Generic RpcException replaced with typed BadRequest / NotFound so the gateway can map them to the right HTTP status.",
        },
        {
          k: "Frontend",
          v: "Company and lead micro-frontend in Next.js, embedded via iframe with postMessage events back to the host shell.",
        },
      ],
      figures: ["64 commits (service)", "32 commits (frontend)", "10 modules", "~62 RPC handlers"],
      code: `convertLead(leadId, operator):
  transaction(tx =>
    lead    = tx.find(Lead, leadId)
    company = tx.insert(Company.from(lead))
    tx.update(lead, { companyId: company.id })
    tx.insert(Contact.from(lead, company))
    audit.record(tx, operator, 4 entries)   # same tx: all or nothing
  )`,
      tradeoff:
        "Bulk import favours partial success over all-or-nothing: one malformed row shouldn't reject two thousand good ones. The cost is a more detailed result contract, with per-row errors the UI has to present.",
      // TODO(youssef): rewrite in your own words.
      differently:
        "Model the ERP-alignment fields (client type, terms of payment, customer group) up front. Adding them later meant backfills and form changes in two places.",
    },
  },
  {
    id: "documents",
    title: "Shipping paperwork, generated in one click",
    company: "Skil-Dev",
    domain: "Logistics operations",
    period: "2026",
    outcome:
      "Built the service that produces the paperwork every container needs, such as manifests, bills of lading and commercial invoices. It pulls the data together from several systems into a single download, and hides customer details that shouldn't be shared.",
    tech: ["NestJS", "RabbitMQ", "EJS", "PostgreSQL", "Cron jobs"],
    engineer: {
      flow: [
        { label: "Request", note: "returns a job id" },
        { label: "Job", note: "queued → processing" },
        { label: "Shipment service", note: "RMQ request/response" },
        { label: "EJS templates", note: "print CSS" },
        { label: "PDFs → ZIP", note: "archiver" },
      ],
      failure: "job status reports the error; a scheduled cleanup removes old jobs and their files",
      notes: [
        {
          k: "Async jobs",
          v: "createJob / processJob / getJobStatus, so a large container never holds an HTTP request open until it times out.",
        },
        {
          k: "Aggregation",
          v: "Shipment data fetched across services over RabbitMQ, with weight and measurement totals falling back sensibly when fields are missing.",
        },
        {
          k: "Safety",
          v: "Dangerous-goods detection on the manifest; consignee details masked unless allow-listed for that manifest.",
        },
        {
          k: "Output",
          v: "Container manifests, LCL manifests, shipping statements, bills of lading and commercial-invoice sets, bundled as one archive.",
        },
      ],
      figures: ["~1,070-line service, ~92% authored", "2 print templates"],
      tradeoff:
        "HTML templates rendered to PDF rather than a PDF layout library. They're fast to iterate on with the operations team, but print-layout fidelity needs hand-tuned CSS.",
      // TODO(youssef): rewrite in your own words.
      differently:
        "Split the generator into one small class per document type behind a shared interface early on, instead of letting one service grow past a thousand lines.",
    },
  },
  {
    id: "geo-search",
    title: "Fast location search over 10 million records",
    company: "Block Gemini",
    domain: "Search · Performance",
    period: "2024",
    outcome:
      "Made location search across more than 10 million records return in about 0.6 seconds on average, well inside the one-second target the product needed.",
    tech: ["Elasticsearch", "NestJS", "Redis", "Kibana"],
    engineer: {
      flow: [
        { label: "NestJS API", note: "GraphQL / REST" },
        { label: "Elasticsearch", note: "geo query" },
        { label: "Filebeat", note: "logs" },
        { label: "Logstash", note: "parse" },
        { label: "Kibana", note: "find slow paths" },
      ],
      notes: [
        {
          k: "Target",
          v: "Sub-one-second average response on geo-location queries over a 10M+ document index; landed at ~600 ms.",
        },
        {
          k: "Method",
          v: "Measure first: the ELK pipeline and traces showed where time went, then index mappings and query shape were tuned against that data.",
        },
        // TODO(youssef): add the specific tuning — e.g. geo query type, filter
        // ordering, mappings, shard sizing, caching — whatever actually moved it.
        {
          k: "Around it",
          v: "JWT auth and role-based access across the services; Redis for hot data.",
        },
      ],
      figures: ["10M+ records", "~600 ms avg", "< 1 s target"],
      // TODO(youssef): confirm this matches the real architecture.
      tradeoff:
        "Elasticsearch next to PostgreSQL rather than stretching Postgres: a second store to keep in sync, in exchange for geo queries that are native to the engine.",
      // TODO(youssef): rewrite in your own words.
      differently:
        "Put a latency budget and a regression check into CI, so the 600 ms is guarded by a test instead of a dashboard.",
    },
  },
];
