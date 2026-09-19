import { stackGroups } from "@/content/skills";
import { Container, Tag } from "@/components/aws/Container";

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-16">
      <Container
        title="Technology stack"
        description="What the work is built on — from core services outward to how it ships"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {stackGroups.map((group) => (
            <div
              key={group.name}
              className="border-t border-border-2 pt-4 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
            >
              <div className="mb-2 text-[13px] font-bold text-text">
                {group.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
