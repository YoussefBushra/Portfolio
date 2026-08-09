import type { Credential, EducationEntry } from "@/lib/types";

export const education: EducationEntry[] = [
  {
    institution: "The British University in Egypt (BUE) — London South Bank University (LSBU)",
    degree: "BSc Computer Science, Software Engineering major",
    detail: "Cumulative GPA 4.00 — Distinction with Honors",
    period: "Oct 2018 — Jul 2022",
  },
];

export const credentials: Credential[] = [
  {
    title: "Huawei ICT Competition — Gold Medal, Cloud Computing National Finals",
    issuer: "Huawei",
    period: "Feb 2021",
    kind: "award",
  },
  {
    title: "Head of Technical Committee — competitive programming & DS/algorithms",
    issuer: "ACM BUE Chapter",
    period: "Oct 2019 — Oct 2020",
    kind: "volunteer",
  },
];
