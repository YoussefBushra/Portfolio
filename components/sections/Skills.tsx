import { skillTools, practices, spokenLanguages } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import {
  siNodedotjs,
  siNestjs,
  siTypescript,
  siPostgresql,
  siMongodb,
  siRedis,
  siRabbitmq,
  siReact,
  siNextdotjs,
  siElasticsearch,
  siOpentelemetry,
  siGrafana,
  siDocker,
  siGithubactions,
  siGraphql,
  siJest,
  siSwagger,
  type SimpleIcon,
} from "simple-icons";

/** Tool name to its brand mark. Keys must match content/skills.ts exactly. */
const ICONS: Record<string, SimpleIcon> = {
  "Node.js": siNodedotjs,
  NestJS: siNestjs,
  TypeScript: siTypescript,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Redis: siRedis,
  RabbitMQ: siRabbitmq,
  React: siReact,
  "Next.js": siNextdotjs,
  Elasticsearch: siElasticsearch,
  OpenTelemetry: siOpentelemetry,
  Grafana: siGrafana,
  Docker: siDocker,
  "GitHub Actions": siGithubactions,
  GraphQL: siGraphql,
  Jest: siJest,
  Swagger: siSwagger,
};

/**
 * The hover colour. Near-black brand marks (Next.js, OpenTelemetry) would
 * vanish on the dark theme, so those fall back to the accent instead.
 */
function brandColor(hex: string): string {
  const n = parseInt(hex, 16);
  const lum = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 42 ? "rgb(var(--accent-text))" : `#${hex}`;
}

function Tool({ name }: { name: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <div
      className="group flex flex-col items-center gap-2.5 rounded-lg px-2 py-3.5 text-center transition-colors duration-200 hover:bg-white/[0.06]"
      style={{ ["--brand" as string]: brandColor(icon.hex) }}
    >
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-faint transition-colors duration-200 group-hover:text-[var(--brand)]"
      >
        <path fill="currentColor" d={icon.path} />
      </svg>
      <span className="text-[11px] leading-tight text-muted transition-colors duration-200 group-hover:text-text">
        {name}
      </span>
    </div>
  );
}

/**
 * Tools shown as brand marks in a quiet grid — monochrome at rest, lit in the
 * brand's own colour on hover. Patterns and approaches, which have no logo,
 * follow as a plain list. No pills anywhere.
 */
export function Skills() {
  return (
    <SectionShell id="skills" label="Stack">
      <div className="glass-strong rounded-xl p-6 sm:p-8">
        <div className="space-y-8">
          {skillTools.map((group) => (
            <div key={group.name}>
              <h3 className="block-label">{group.name}</h3>
              <div className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9">
                {group.items.map((item) => (
                  <Tool key={item} name={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="block-label">Architecture and practices</h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
            {practices.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[13px] text-muted">
                <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 border-t border-white/10 pt-4 text-[13px] text-muted">
          Spoken languages: {spokenLanguages}.
        </p>
      </div>
    </SectionShell>
  );
}
