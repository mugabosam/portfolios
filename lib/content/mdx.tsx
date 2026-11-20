import "server-only";

import { evaluate } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { cacheLife } from "next/cache";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";

import { getHighlighter } from "./highlight";
import { codeTheme } from "./shiki-theme";

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
      [rehypeShikiFromHighlighter, shiki, { theme: codeTheme.name }],
    ],
  });
  return <Content components={mdxComponents} />;
}
