interface TechTagProps {
  children: React.ReactNode;
  accent?: boolean;
}

export function TechTag({ children, accent }: TechTagProps) {
  return <span className={`chip ${accent ? "chip-accent" : ""}`}>{children}</span>;
}
