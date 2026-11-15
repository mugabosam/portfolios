import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";
import { pad3 } from "@/lib/format";

describe("utilities", () => {
  it("pads counters to three digits", () => {
    expect(pad3(1)).toBe("001");
    expect(pad3(42)).toBe("042");
    expect(pad3(1000)).toBe("1000");
  });

  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});
