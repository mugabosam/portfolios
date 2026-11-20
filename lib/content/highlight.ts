import "server-only";

import { cacheLife } from "next/cache";
import { createHighlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { codeTheme } from "./shiki-theme";

export const CODE_LANGS = [
  "python",
  "dart",
  "solidity",
  "typescript",
  "yaml",
  "bash",
  "json",
] as const;
export type CodeLang = (typeof CODE_LANGS)[number];

let highlighter: ReturnType<typeof createHighlighter> | undefined;

/** One shared Shiki instance for case studies and code peeks. */
export function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: [codeTheme],
    langs: [...CODE_LANGS],
    // JavaScript regex engine: no WebAssembly to load at build time.
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/**
 * Highlights a snippet to HTML. Cached for the life of the deployment, so it
 * runs once, at build time.
 */
export async function highlight(code: string, lang: CodeLang) {
  "use cache";
  cacheLife("max");
  const shiki = await getHighlighter();
  return shiki.codeToHtml(code, { lang, theme: codeTheme.name! });
}
