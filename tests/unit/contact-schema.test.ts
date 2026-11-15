import { describe, expect, it } from "vitest";

import { contactSchema } from "@/lib/contact/schema";

const good = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message:
    "I would like to talk about a backend project that needs a careful engineer.",
};

describe("contactSchema", () => {
  it("accepts a normal message and defaults the honeypot to empty", () => {
    const result = contactSchema.safeParse(good);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.company).toBe("");
  });

  it("trims whitespace before checking lengths", () => {
    const result = contactSchema.safeParse({ ...good, name: "  Al  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Al");
  });

  it("rejects short messages, bad emails and a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...good, message: "Hi" }).success).toBe(
      false,
    );
    expect(
      contactSchema.safeParse({ ...good, email: "not-an-email" }).success,
    ).toBe(false);
    expect(contactSchema.safeParse({ ...good, company: "Acme" }).success).toBe(
      false,
    );
  });

  it("reports one readable message per field", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "x",
      message: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(
        expect.arrayContaining(["name", "email", "message"]),
      );
    }
  });
});
