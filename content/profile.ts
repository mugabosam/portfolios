/**
 * Sam's experience, education, skills and short copy blocks, shared by the
 * home page, /about and /resume. Edit here; components only render it.
 * Every fact is sourced from Sam's CV, GitHub or his own answers.
 */

export const availability = {
  status: "Open to internships and junior backend roles",
  where: "Based in Kigali, Rwanda (UTC+2). Happy to work remotely.",
};

export const positioning =
  "Backend systems and machine-learning tools, engineered with patience and finished with care.";

export const manifesto =
  "Software is never only software. It carries the decisions behind it, the edge cases someone cared enough to handle, the quiet reliability nobody notices until it is gone. I build backends and models the slow way: tested, documented and made to be read by the next engineer. Each release should leave a system a little more honest than I found it.";

export type TimelineEntry = {
  /** Omitted when the date is not known. */
  period?: string;
  title: string;
  org: string;
  detail?: string;
  /** Case study to link, when one exists. */
  href?: string;
};

export const experience: TimelineEntry[] = [
  {
    period: "Sep 2026 – Present",
    title: "Software Development Intern",
    org: "EUCL (Energy Utility Corporation Limited), Kigali",
    detail:
      "Set up the backend of an internal inventory and device management system (NestJS, Prisma, PostgreSQL) and build features across its API and Next.js frontend.",
    href: "/work/eucl-internship",
  },
];

export const education: TimelineEntry[] = [
  {
    period: "2023 – 2027 (expected)",
    title: "Bachelor's degree, Information Technology",
    org: "University of Rwanda, College of Science and Technology",
  },
  {
    period: "2019 – 2022",
    title: "Advanced Level (A2) Certificate",
    org: "Kiziguro Secondary School (Mathematics, Physics and Computer Science)",
  },
];

export const training: TimelineEntry[] = [
  {
    period: "2023",
    title: "Cisco Networking Academy",
    org: "Introduction to Data Science, IT Essentials, Computer Hardware Basics, Introduction to Cybersecurity",
  },
  {
    period: "2023",
    title: "CyberTechAfrica 2023 Hackathon",
    org: "Cryptography, network security and reverse engineering challenges",
  },
  {
    title: "TechGrw AI Solutions",
    org: "AI solutions training with a focus on cybersecurity and data analytics",
  },
];

export type SkillGroup = {
  name: string;
  skills: { name: string; usedIn?: string[] }[];
};

/** Grouped skills. `usedIn` lists case-study slugs where the skill shows up. */
export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    skills: [
      { name: "Python", usedIn: ["malaria-check", "inventory-pro"] },
      { name: "TypeScript", usedIn: ["eucl-internship", "medichain"] },
      { name: "JavaScript" },
      { name: "PHP" },
      { name: "SQL", usedIn: ["eucl-internship", "inventory-pro"] },
      { name: "Dart", usedIn: ["zunga", "bluesnap"] },
      { name: "Solidity", usedIn: ["medichain"] },
      { name: "HTML & CSS" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "NestJS", usedIn: ["eucl-internship"] },
      { name: "Django", usedIn: ["inventory-pro"] },
      { name: "Prisma", usedIn: ["eucl-internship"] },
      { name: "PostgreSQL", usedIn: ["eucl-internship"] },
      { name: "MySQL", usedIn: ["inventory-pro"] },
      { name: "REST APIs & OpenAPI", usedIn: ["eucl-internship"] },
      {
        name: "Role-based access control",
        usedIn: ["eucl-internship", "medichain"],
      },
    ],
  },
  {
    name: "AI / ML",
    skills: [
      { name: "scikit-learn", usedIn: ["malaria-check"] },
      { name: "pandas", usedIn: ["malaria-check"] },
      { name: "Streamlit", usedIn: ["malaria-check"] },
    ],
  },
  {
    name: "Frontend & mobile",
    skills: [
      { name: "Next.js & React", usedIn: ["eucl-internship", "medichain"] },
      { name: "Tailwind CSS" },
      { name: "Flutter", usedIn: ["zunga", "bluesnap"] },
      { name: "Riverpod", usedIn: ["zunga", "bluesnap"] },
    ],
  },
  {
    name: "Tooling & security",
    skills: [
      { name: "Git & GitHub" },
      { name: "GitHub Actions", usedIn: ["eucl-internship", "zunga"] },
      { name: "Docker", usedIn: ["eucl-internship"] },
      { name: "Automated testing", usedIn: ["medichain", "zunga"] },
      { name: "Applied cryptography", usedIn: ["bluesnap", "zunga"] },
    ],
  },
];

export const languages = ["Kinyarwanda (native)", "English (fluent)"];

export const values = [
  {
    title: "Honest numbers",
    text: "A result is only worth reporting if it was measured. When there is nothing to measure yet, I say so.",
  },
  {
    title: "Safety before cleverness",
    text: "In MalariaCheck the safety rules outrank the model. The careful path should be the default one.",
  },
  {
    title: "Code for the next reader",
    text: "Tests, plain names and written-down decisions, so whoever comes after me can change the system without fear.",
  },
];
