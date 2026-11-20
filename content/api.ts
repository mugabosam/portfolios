/**
 * The three responses of the small public API at /api/sam. The hero card on
 * the home page renders these same objects, so what the card shows is
 * exactly what the endpoint returns. Every value comes from content/profile.ts
 * or Sam's own answers; nothing here is invented.
 */

export type Endpoint = {
  /** Tab label in the hero card. */
  label: string;
  path: string;
  body: Record<string, string | readonly string[]>;
};

export const endpoints = [
  {
    label: "whoami",
    path: "/api/sam",
    body: {
      name: "Sam Mugabo",
      role: "Backend developer",
      languages: ["Python", "TypeScript"],
      based_in: "Kigali, Rwanda (UTC+2)",
      open_to: ["internships", "junior roles"],
    },
  },
  {
    label: "stack",
    path: "/api/sam/stack",
    body: {
      backend: ["NestJS", "Django", "PostgreSQL"],
      ml: ["scikit-learn", "pandas"],
      frontend: ["Next.js", "React", "Flutter"],
      tooling: ["Docker", "GitHub Actions"],
    },
  },
  {
    label: "now",
    path: "/api/sam/now",
    body: {
      role: "Software development intern",
      at: "EUCL, Kigali",
      since: "2026-09",
      building: "Inventory and device API",
      studying: "IT at the University of Rwanda",
      graduating: "2027 (expected)",
    },
  },
] as const satisfies readonly Endpoint[];

export type EndpointPath = (typeof endpoints)[number]["path"];

export function endpointBody(path: EndpointPath) {
  return endpoints.find((endpoint) => endpoint.path === path)!.body;
}
