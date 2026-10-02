import { Fragment } from "react";
import { stack } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { Engineer, Recruiter } from "@/components/view/Layer";

const category =
  "text-[11.5px] font-semibold uppercase tracking-[0.14em] text-faint";

/** Tools joined by dots. Each separator is glued to the item before it, with
 *  a real space after, so lines wrap after a dot — never before one. */
function Tools({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <Fragment key={item}>
      <span className="whitespace-nowrap">
        {item}
        {i < items.length - 1 ? (
          <span className="ml-1.5 mr-0.5 text-faint" aria-hidden>
            ·
          </span>
        ) : null}
      </span>{" "}
    </Fragment>
  ));
}

/**
 * The tools, as a compact grid of groups, told two ways. Recruiter view: the
 * tools under plain category names. Developer view: every group (practices
 * too) in mono, each with a note on where it was used. No cards, pills or
 * proficiency levels.
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <Recruiter label="tools">
        <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {stack
            .filter((g) => !g.practice)
            .map((g) => (
              <div key={g.name}>
                <dt className={category}>{g.plain ?? g.name}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-text">
                  <Tools items={g.items} />
                </dd>
              </div>
            ))}
        </dl>
      </Recruiter>

      <Engineer label="stack">
        <dl className="grid gap-x-12 gap-y-7 lg:grid-cols-2">
          {stack.map((g) => (
            <div key={g.name}>
              <dt className={category}>{g.name}</dt>
              <dd className="mt-2 font-mono text-[13.5px] leading-relaxed text-text">
                <Tools items={g.items} />
              </dd>
              {g.note ? (
                <dd className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted">
                  {g.note}
                </dd>
              ) : null}
            </div>
          ))}
        </dl>
      </Engineer>
    </SectionShell>
  );
}
