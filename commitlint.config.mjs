/** Conventional Commits, plus the `a11y` type the project brief asks for. */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "perf",
        "a11y",
        "refactor",
        "style",
        "test",
        "build",
        "ci",
        "revert",
      ],
    ],
  },
};

export default config;
