/**
 * Selected work, told twice.
 *
 * `summary` is the recruiter layer: plain language, outcomes, no jargon.
 * `engineer` is added underneath in engineer view: mechanisms, one figure and,
 * where the design itself implies one, a trade-off. Every claim here traces to
 * the CV or the git-evidenced engineering inventory. The client platform is
 * described generically (NDA); repository and internal names are omitted.
 *
 * `differently` ("What I'd do differently") is deliberately left empty: it is
 * a personal reflection, so it must come from the author, never be inferred.
 * It renders automatically once filled in.
 */

export type WorkFigure =
  | { kind: "d365-flow" }
  | { kind: "steps"; caption: string; steps: string[] };

export interface WorkItem {
  title: string;
  context: string;
  /** Recruiter layer — what it does and why it matters. */
  summary: string;
  tech: string[];
  engineer: {
    /** Technical notes. `backticks` render as inline code. */
    points: string[];
    figure?: WorkFigure;
    /** Simplified pseudocode — illustrates the mechanism, not real source. */
    code?: string;
    tradeoff?: string;
    differently?: string;
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
      points: [
        "Owned the OData client: OAuth2 client-credentials, a generic query builder, `401` → refresh the token and retry, `429` → wait for a validated `Retry-After`.",
        "Idempotent posting: an existence check runs before any mutation in D365, so a redelivered message can't create a duplicate document.",
        "Multi-line postings are compensated on failure — lines already posted are rolled back, and a rollback that itself fails is recorded as `ROLLBACK_FAILED` instead of disappearing.",
        "Money is `decimal.js` end to end; exchange rates are cached per UTC date (LRU, 5-min TTL), so no cached rate outlives midnight.",
      ],
      figure: { kind: "d365-flow" },
      code: `// Posting one financial document (simplified)

// Idempotent: a redelivered message is a no-op
if (await d365.exists(doc.reference)) return;

const posted = [];
try {
  for (const line of doc.lines) {
    // 401 and 429 are retried inside post()
    posted.push(await d365.post(line));
  }
} catch (error) {
  // Undo what was posted; never lose a failed undo
  await rollBack(posted).catch(() =>
    markStatus(doc, "ROLLBACK_FAILED"),
  );
  throw error;
}`,
      tradeoff:
        "Dynamics 365 is reached over HTTP, so there is no shared transaction to join. Compensation — undo what was posted, and flag anything that couldn't be undone — takes the place of a distributed transaction.",
    },
  },
  {
    title: "CRM & business platform development",
    context: "Skil-Dev · Logistics & freight-forwarding platform",
    summary:
      "Built the CRM used to manage leads, companies and contacts, and to turn a lead into a customer in one step — including bulk import from Excel with row-by-row error reports, and a full audit trail.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "React"],
    engineer: {
      points: [
        "Created all 10 feature modules of the CRM service — about 62 RabbitMQ RPC handlers on NestJS, TypeORM and PostgreSQL.",
        "Lead → company conversion is one database transaction: create the company, link the lead, copy it as a contact, write four audit entries — or none of it.",
        "Excel import validates every row with `class-validator` and inserts in 50-row chunks, returning a structured success / failure report.",
        "Validation mirrors the ERP: VAT ID required by classification, credit limit required for credit customers, payment terms and customer group checked against D365.",
      ],
      figure: {
        kind: "steps",
        caption: "Lead conversion — one transaction, all or nothing",
        steps: ["Qualify lead", "Create company", "Copy lead as contact", "Write 4 audit entries"],
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
      points: [
        "Async job model: the request returns a job ID at once, generation runs in the background, clients poll for status, and a cron job cleans up old jobs.",
        "Shipment data is gathered across services over RabbitMQ request / response, with weight, measurement and package totals computed and fallbacks for missing values.",
        "Dangerous goods are detected automatically; consignee details are masked unless allow-listed for the manifest.",
        "Documents render from hand-tuned EJS templates to PDF and are zipped with `archiver`.",
      ],
      figure: {
        kind: "steps",
        caption: "Document job lifecycle",
        steps: ["Create job", "Generate in background", "Poll status", "Scheduled cleanup"],
      },
      tradeoff:
        "Generating and zipping a full document set is long-running, so it runs as a background job instead of holding a request open.",
    },
  },
  {
    title: "Large-scale search optimization",
    context: "Block Gemini · Dubai",
    summary:
      "Made location search across more than 10 million records return in about 600 ms on average, against a one-second target.",
    tech: ["Elasticsearch", "NestJS", "PostgreSQL", "Redis"],
    engineer: {
      points: [
        "Tuned the Elasticsearch index and geo-location queries over a 10M+ record dataset: ~600 ms average against a sub-one-second target.",
        "NestJS APIs and data-access services on PostgreSQL, TypeORM, GraphQL and Redis.",
        "Logs shipped through Filebeat and Logstash into Elasticsearch and Kibana, and used — with traces — to find slow paths and guide performance work.",
        "JWT authentication and role-based authorization across the services.",
      ],
      figure: {
        kind: "steps",
        caption: "Logging pipeline",
        steps: ["Filebeat", "Logstash", "Elasticsearch", "Kibana"],
      },
    },
  },
];
