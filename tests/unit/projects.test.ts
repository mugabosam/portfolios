import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { answers, opening } from "@/content/assistant";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

describe("projects", () => {
  it("have unique slugs and an existing cover", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of projects)
      expect(
        existsSync(path.join(process.cwd(), "public", project.cover)),
        project.cover,
      ).toBe(true);
  });

  it("keep the card summary short", () => {
    for (const project of projects) {
      expect(project.summary.length, project.slug).toBeLessThanOrEqual(170);
      expect(project.highlight.value.length, project.slug).toBeLessThanOrEqual(
        10,
      );
    }
  });

  it("never link confidential work to code", () => {
    for (const project of projects.filter((p) => p.confidential))
      expect(project.repo).toBeUndefined();
  });

  it("are written without code", () => {
    const text = projects
      .flatMap((p) => [p.summary, p.problem, p.built, p.result])
      .join(" ");
    expect(text).not.toMatch(/[{}<>;]|=>|\(\)/);
  });
});

describe("assistant", () => {
  it("opens with a question and an answer, in turn", () => {
    expect(opening.map((message) => message.from)).toEqual([
      "user",
      "bot",
      "user",
      "bot",
    ]);
  });

  it("never offers junior or internship roles", () => {
    const all = JSON.stringify({ opening, answers });
    expect(all).not.toMatch(/junior|internship/i);
  });
});

describe("hero", () => {
  it("has a transparent cut-out portrait", () => {
    const file = path.join(
      process.cwd(),
      "public",
      "portrait",
      "sam-cutout.webp",
    );
    const header = readFileSync(file).subarray(0, 32);
    // RIFF....WEBPVP8X with the alpha flag (bit 4 of the first flags byte).
    expect(header.toString("ascii", 0, 4)).toBe("RIFF");
    expect(header.toString("ascii", 8, 16)).toBe("WEBPVP8X");
    expect(header[20]! & 0x10).toBe(0x10);
  });
});

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});
