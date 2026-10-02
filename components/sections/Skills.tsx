import { Fragment } from "react";
import { stack } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

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
 * The tools, as one compact grid of groups told two ways (classes in
 * globals.css). Recruiter view: plain category names, three columns.
 * Developer view: the CV's category names, the tools in mono, a note on where
 * each was used, plus the practices (`dev-only` group), two columns.
 *
 * It is one set of groups rather than two blocks, so during a view switch
 * each group travels as a blueprint panel into its new place, like the work
 * cards ([data-reflow], components/view/pageFx.ts).
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <dl className="skills-grid grid gap-x-10 gap-y-7" data-reflow-fit>
        {stack.map((g) => (
          <div
            key={g.name}
            data-reflow
            className={g.practice ? "dev-only" : undefined}
          >
            <dt className={category}>
              {g.plain ? (
                <>
                  <span className="rec-only">{g.plain}</span>
                  <span className="dev-only">{g.name}</span>
                </>
              ) : (
                g.name
              )}
            </dt>
            <dd className="skills-tools mt-2 leading-relaxed text-text">
              <Tools items={g.items} />
            </dd>
            {g.note ? (
              <dd className="dev-only mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted">
                {g.note}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
