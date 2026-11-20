import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { endpoints } from "@/content/api";
import { peeks } from "@/content/showcase";
import { cn } from "@/lib/cn";
import { parseProjectFile } from "@/lib/content/parse";

const workDir = path.join(process.cwd(), "content", "work");
const projects = readdirSync(workDir)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) =>
    parseProjectFile(file, readFileSync(path.join(workDir, file), "utf8")),
  );

describe("code peeks", () => {
  it("exist for every project", () => {
    for (const project of projects) expect(peeks[project.slug]).toBeDefined();
  });

  it("never show code for confidential work", () => {
    for (const project of projects.filter((p) => p.confidential))
      expect(peeks[project.slug]?.kind).toBe("architecture");
  });

  it("only quote lines that appear in the case study", () => {
    for (const project of projects) {
      const peek = peeks[project.slug];
      if (peek?.kind !== "code") continue;
      const lines = peek.code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== "..." && line !== "}");
      for (const line of lines) expect(project.body).toContain(line);
    }
  });
});

describe("/api/sam", () => {
  it("has a route handler for every endpoint shown in the hero", () => {
    for (const endpoint of endpoints) {
      const file = path.join(process.cwd(), "app", endpoint.path, "route.ts");
      expect(existsSync(file), file).toBe(true);
    }
  });
});

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});
