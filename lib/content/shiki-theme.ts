import type { ThemeRegistration } from "shiki";

/**
 * Syntax theme for the navy code panels. It reuses the site palette: sky for
 * keywords, sun for strings, leaf for numbers. Every colour passes 4.5:1 on
 * the #0b1b2b panel (the dimmest, comments at #8ea3ba, is 6.6:1); see
 * docs/contrast.md.
 */
export const codeTheme: ThemeRegistration = {
  name: "portfolio-navy",
  type: "dark",
  colors: {
    "editor.background": "#0b1b2b",
    "editor.foreground": "#d6e2ee",
  },
  settings: [
    { settings: { foreground: "#d6e2ee", background: "#0b1b2b" } },
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "#8ea3ba", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.logical",
      ],
      settings: { foreground: "#6cc9f2" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "#f6dc5c" },
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
      settings: { foreground: "#a9dcf5" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.other"],
      settings: { foreground: "#7fdcae" },
    },
    {
      scope: ["variable.parameter"],
      settings: { foreground: "#e3ebf3", fontStyle: "italic" },
    },
    {
      scope: [
        "entity.name.tag",
        "meta.decorator",
        "entity.name.function.decorator",
        "punctuation.decorator",
      ],
      settings: { foreground: "#7fdcae" },
    },
  ],
};
