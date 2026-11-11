import type { ThemeRegistration } from "shiki";

/**
 * Monochrome syntax theme so code blocks stay within the site's black and
 * white palette. Every colour passes 4.5:1 on the #0b0b0b block background
 * (the dimmest, comments at #8c8c8c, is 5.85:1).
 */
export const monoTheme: ThemeRegistration = {
  name: "portfolio-mono",
  type: "dark",
  colors: {
    "editor.background": "#0b0b0b",
    "editor.foreground": "#d9d9d9",
  },
  settings: [
    { settings: { foreground: "#d9d9d9", background: "#0b0b0b" } },
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#8c8c8c", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
      ],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "#b5b5b5" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
      ],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
      ],
      settings: { foreground: "#f2f2f2", fontStyle: "italic" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.other"],
      settings: { foreground: "#e6e6e6" },
    },
    {
      scope: ["variable.parameter"],
      settings: { foreground: "#cfcfcf", fontStyle: "italic" },
    },
    {
      scope: [
        "entity.name.tag",
        "meta.decorator",
        "entity.name.function.decorator",
      ],
      settings: { foreground: "#e6e6e6" },
    },
  ],
};
