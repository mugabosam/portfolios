import YAML from "yaml";
import { z } from "zod";

import { type ProjectFrontmatter, projectSchema } from "./schema";

export type ParsedProject = ProjectFrontmatter & { body: string };

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Splits and validates one MDX file. Throws a readable error naming the file
 * and every invalid field, which fails `next build`.
 */
export function parseProjectFile(fileName: string, raw: string): ParsedProject {
  const match = FRONTMATTER.exec(raw);
  if (!match)
    throw new Error(`content/work/${fileName}: missing --- frontmatter block`);

  const [, yamlBlock = "", body = ""] = match;
  const result = projectSchema.safeParse(YAML.parse(yamlBlock));
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in content/work/${fileName}:\n${z.prettifyError(result.error)}`,
    );
  }

  const expectedSlug = fileName.replace(/\.mdx$/, "");
  if (result.data.slug !== expectedSlug) {
    throw new Error(
      `content/work/${fileName}: slug "${result.data.slug}" must match the file name "${expectedSlug}"`,
    );
  }
  if (result.data.confidential && result.data.repo) {
    throw new Error(
      `content/work/${fileName}: confidential projects cannot link a repository`,
    );
  }

  return { ...result.data, body };
}
