import { Fragment } from "react";
import { skillGroups } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";

/**
 * Editorial category/value pairs: a small uppercase category on the left and
 * the technologies as a quiet, readable line on the right. No cards, pills,
 * rules or proficiency levels — the type and spacing do the organising.
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <dl className="grid gap-y-9 sm:gap-y-11">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="grid items-baseline gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-x-10"
          >
            <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text">
              {group.name}
            </dt>
            <dd className="text-[19px] leading-snug text-muted sm:text-[21px]">
              {/* Each separator is glued to the item before it, with a real
                  space after, so lines wrap after a dot — never before one. */}
              {group.items.map((item, i) => (
                <Fragment key={item}>
                  <span className="whitespace-nowrap">
                    {item}
                    {i < group.items.length - 1 ? (
                      <span className="ml-2.5 mr-1 text-faint" aria-hidden>
                        ·
                      </span>
                    ) : null}
                  </span>{" "}
                </Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
