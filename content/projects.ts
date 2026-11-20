/**
 * Sam's projects, written for recruiters rather than engineers: what each
 * one is, the problem, what he built and the result, in plain words. No
 * code is shown anywhere on the site. Every fact comes from the projects'
 * repositories and READMEs (the longer write-ups are in git history).
 */

export type Project = {
  slug: string;
  title: string;
  year: number;
  /** Plain label for the kind of project. */
  kind: string;
  /** One sentence for the card. */
  summary: string;
  /** The one thing to remember, shown large on the card. */
  highlight: { value: string; label: string };
  problem: string;
  built: string;
  result: string;
  role: string;
  /** A few recognisable tool names, not the full stack. */
  tools: readonly string[];
  /** Public code, when there is some. */
  repo?: string;
  /** Decorative artwork, not a screenshot (`pnpm covers`). */
  cover: string;
  /** Internal work: no code, data or screenshots, and no repository link. */
  confidential?: boolean;
};

export const projects: readonly Project[] = [
  {
    slug: "malaria-check",
    title: "MalariaCheck",
    year: 2026,
    kind: "Health app with AI",
    summary:
      "A web tool that tells people in under a minute whether their symptoms point to malaria, and when a blood test cannot wait.",
    highlight: {
      value: "9 in 10",
      label: "real malaria cases caught in testing",
    },
    problem:
      "Early malaria feels like the flu, so many people wait too long to get tested, and it can become life-threatening within a day.",
    built:
      "A short symptom check that learned from 1,622 real hospital records, with safety rules on top: warning signs always trigger an urgent-care message with Rwanda's emergency number.",
    result:
      "On records it had never seen, it flagged about 9 in 10 real malaria cases. Nothing a person types is stored.",
    role: "Built alone: data, model and app",
    tools: ["Python", "Machine learning", "Streamlit"],
    repo: "https://github.com/mugabosam/Malaria-Detection",
    cover: "/work/malaria-check/cover.svg",
  },
  {
    slug: "eucl-internship",
    title: "EUCL device system",
    year: 2026,
    kind: "Work project",
    summary:
      "An internal system for EUCL, Rwanda's electricity utility, that keeps track of every device: what exists, where it is and who is responsible for it.",
    highlight: {
      value: "Day one",
      label: "set up its server side; still its most active contributor",
    },
    problem:
      "EUCL needed one place to see its devices and equipment, who holds each one, and how that changed over time.",
    built:
      "The server side from the first commit, then the features staff use every day: spreadsheet imports that are safe to repeat, custody reports and a readable history of every change. I also build screens in the web app.",
    result:
      "In active development with EUCL's software team. It is internal software, so no screenshots or data are shown.",
    role: "Developer in a small team",
    tools: ["TypeScript", "NestJS", "Next.js", "PostgreSQL"],
    cover: "/work/eucl-internship/cover.svg",
    confidential: true,
  },
  {
    slug: "zunga",
    title: "Zunga",
    year: 2026,
    kind: "Mobile app",
    summary:
      "Mobile money without memorising codes: enter an amount and a number, tap Pay, and the carrier's own payment screen opens already filled in.",
    highlight: {
      value: "17 banks",
      label: "plus MTN and Airtel, through Rwanda's eKash network",
    },
    problem:
      "Paying by mobile money means typing long codes like *182*1*1*number*amount#, and one wrong digit can send money to the wrong person.",
    built:
      "A simple screen that prepares the code and opens the carrier's session, so people only type their PIN. It never touches the money, and it speaks Kinyarwanda, English and French.",
    result:
      "Works with MTN, Airtel and 17 banks, checked by 23 automated tests. There are no usage numbers yet.",
    role: "Built alone: product, app and Android integration",
    tools: ["Flutter", "Dart", "Android"],
    repo: "https://github.com/mugabosam/Zunga",
    cover: "/work/zunga/cover.svg",
  },
  {
    slug: "bluesnap",
    title: "BlueSnap",
    year: 2026,
    kind: "Mobile app",
    summary:
      "A social app that needs no internet: chat, photos and voice notes travel phone to phone over Bluetooth and Wi-Fi.",
    highlight: {
      value: "Offline",
      label: "no internet and no server, encrypted end to end",
    },
    problem:
      "On campus, at events or anywhere with poor signal, data is expensive or missing, yet the people you want to reach are a few metres away.",
    built:
      "A feed, stories and private messages that travel directly between nearby phones, encrypted end to end. A message waits and is delivered when a friend comes back in range.",
    result:
      "A working Android app with automated tests for its encryption and delivery. It has not had an independent security audit yet.",
    role: "Built alone: connectivity, encryption and app",
    tools: ["Flutter", "Dart", "Bluetooth"],
    repo: "https://github.com/mugabosam/BlueSnap",
    cover: "/work/bluesnap/cover.svg",
  },
  {
    slug: "medichain",
    title: "MediChain",
    year: 2026,
    kind: "Health records on blockchain",
    summary:
      "Medical records where the patient decides who can see them and for how long, with an emergency option for doctors and a record of every access.",
    highlight: {
      value: "55 tests",
      label: "check every access rule automatically",
    },
    problem:
      "Medical records must reach doctors quickly, but each access should be the patient's choice, temporary and traceable.",
    built:
      "Rules on a blockchain where patients grant time-limited access, doctors can open 24-hour emergency access that is always flagged, and every action is logged. Plus a web app with a screen for each role.",
    result:
      "55 automated tests cover access, emergencies, prescriptions and the audit trail.",
    role: "Built alone: rules, tests and web app",
    tools: ["Solidity", "React", "TypeScript"],
    repo: "https://github.com/mugabosam/Blockchain-Health",
    cover: "/work/medichain/cover.svg",
  },
  {
    slug: "inventory-pro",
    title: "Inventory Pro",
    year: 2025,
    kind: "Web app",
    summary:
      "A web app for tracking products, suppliers and stock across several locations, with reports in one click.",
    highlight: {
      value: "3 formats",
      label: "reports in Excel, PDF and CSV",
    },
    problem:
      "Small inventories often live in spreadsheets that lose track of where stock went and why.",
    built:
      "A catalog of products and suppliers, stock in several locations, a full history of every movement, a log of every sign-in, and downloadable reports.",
    result:
      "It covers the whole daily routine of a small inventory. An early project (2025) that taught me how to model real business data.",
    role: "Built alone",
    tools: ["Python", "Django", "MySQL"],
    repo: "https://github.com/mugabosam/Inventory",
    cover: "/work/inventory-pro/cover.svg",
  },
];
