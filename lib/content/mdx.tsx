import "server-only";

import { evaluate } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { cacheLife } from "next/cache";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { mdxComponents } from "@/components/mdx/mdx-components";

import { monoTheme } from "./shiki-theme";

let highlighter: ReturnType<typeof createHighlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: [monoTheme],
    langs: ["python", "dart", "solidity", "typescript", "yaml", "bash"],
    // JavaScript regex engine: no WebAssembly to load at build time.
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/**
 * Compiles and renders an MDX body. Cached for the life of the deployment, so
 * MDX compilation and syntax highlighting happen once, at build time.
 */
export async function MdxContent({ source }: { source: string }) {
  "use cache";
  cacheLife("max");

  const shiki = await getHighlighter();
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeShikiFromHighlighter, shiki, { theme: "portfolio-mono" }],
    ],
  });
  return <Content components={mdxComponents} />;
}
