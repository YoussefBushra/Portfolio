import { Fragment } from "react";
import { capabilities, stack } from "@/content/skills";
import { SectionShell } from "@/components/layout/SectionShell";
import { Engineer, Recruiter } from "@/components/view/Layer";

const row =
  "grid items-baseline gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-x-10";
const category = "text-[12px] font-semibold uppercase tracking-[0.14em] text-text";

/**
 * Editorial category/value pairs, told two ways. Recruiter view: capabilities
 * in plain language. Engineer view: the actual stack in mono, each row with a
 * note on where it was used. No cards, pills, rules or proficiency levels.
 */
export function Skills() {
  return (
    <SectionShell id="skills" index="04" label="Skills" tint>
      <Recruiter>
        <dl className="grid gap-y-8 sm:gap-y-10">
          {capabilities.map((c) => (
            <div key={c.name} className={row}>
              <dt className={category}>{c.name}</dt>
              <dd className="max-w-2xl text-[17px] leading-snug text-muted sm:text-[18px]">
                {c.text}
              </dd>
            </div>
          ))}
        </dl>
      </Recruiter>

      <Engineer>
        <dl className="grid gap-y-8 sm:gap-y-10">
          {stack.map((group) => (
            <div key={group.name} className={row}>
              <dt className={category}>{group.name}</dt>
              <dd>
                <p className="font-mono text-[15px] leading-relaxed text-text sm:text-[16px]">
                  {/* Each separator is glued to the item before it, with a real
                      space after, so lines wrap after a dot — never before one. */}
                  {group.items.map((item, i) => (
                    <Fragment key={item}>
                      <span className="whitespace-nowrap">
                        {item}
                        {i < group.items.length - 1 ? (
                          <span className="ml-2 mr-0.5 text-faint" aria-hidden>
                            ·
                          </span>
                        ) : null}
                      </span>{" "}
                    </Fragment>
                  ))}
                </p>
                {group.note ? (
                  <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">
                    {group.note}
                  </p>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Engineer>
    </SectionShell>
  );
}
