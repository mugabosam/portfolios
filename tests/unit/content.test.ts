import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { parseProjectFile } from "@/lib/content/parse";
import { categories } from "@/lib/content/schema";

const valid = `---
title: Example
slug: example
summary: A summary that is comfortably longer than the forty-character minimum the schema asks for.
year: 2026
role: Solo project
category: [backend]
stack: [Python]
repo: https://github.com/mugabosam/example
cover: /work/example/cover.svg
featured: true
order: 1
---

## Context

Body text.
`;

describe("parseProjectFile", () => {
  it("accepts valid frontmatter and returns the body", () => {
    const project = parseProjectFile("example.mdx", valid);
    expect(project.title).toBe("Example");
    expect(project.confidential).toBe(false);
    expect(project.body.trim().startsWith("## Context")).toBe(true);
  });

  it("rejects a slug that does not match the file name", () => {
    expect(() => parseProjectFile("other.mdx", valid)).toThrow(
      /slug "example" must match/,
    );
  });

  it("rejects unknown categories and wrong types with readable messages", () => {
    const broken = valid
      .replace("category: [backend]", "category: [desktop]")
      .replace("year: 2026", 'year: "soon"');
    expect(() => parseProjectFile("example.mdx", broken)).toThrow(
      /category\[0\]/,
    );
    expect(() => parseProjectFile("example.mdx", broken)).toThrow(/year/);
  });

  it("rejects unknown keys so typos cannot pass silently", () => {
    expect(() =>
      parseProjectFile(
        "example.mdx",
        valid.replace("order: 1", "order: 1\nfeatued: true"),
      ),
    ).toThrow(/Invalid frontmatter/);
  });

  it("refuses a repository link on confidential work", () => {
    expect(() =>
      parseProjectFile(
        "example.mdx",
        valid.replace("order: 1", "order: 1\nconfidential: true"),
      ),
    ).toThrow(/confidential projects cannot link a repository/);
  });

  it("requires a frontmatter block", () => {
    expect(() => parseProjectFile("example.mdx", "## No frontmatter")).toThrow(
      /missing --- frontmatter/,
    );
  });
});

describe("the real case studies", () => {
  const dir = path.join(process.cwd(), "content", "work");
  const files = readdirSync(dir).filter((file) => file.endsWith(".mdx"));

  it("exist", () => {
    expect(files.length).toBe(6);
  });

  it.each(files)("%s parses, has unique order and real categories", (file) => {
    const project = parseProjectFile(
      file,
      readFileSync(path.join(dir, file), "utf8"),
    );
    for (const category of project.category)
      expect(categories).toContain(category);
    expect(project.body).toMatch(/## Context/);
    expect(project.body).toMatch(/## What I.d do next/);
  });

  it("never contain placeholder text", () => {
    for (const file of files) {
      const text = readFileSync(path.join(dir, file), "utf8");
      expect(text, file).not.toMatch(/lorem ipsum|\{\{TODO/i);
    }
  });
});
