import { describe, expect, it } from "vitest";

import {
  FORM_ACTION,
  isEmail,
  mailtoFor,
  validateMessage,
} from "@/lib/contact/message";

const good = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "We would like to talk about a full-stack role on our team.",
};

describe("contact messages", () => {
  it("accept a normal message", () => {
    expect(validateMessage(good)).toEqual({});
  });

  it("explain each problem in plain words", () => {
    const errors = validateMessage({
      name: " A ",
      email: "nope",
      message: "Hi",
    });
    expect(errors.name).toBe("Please enter your name.");
    expect(errors.email).toBe("Please enter a valid email address.");
    expect(errors.message).toMatch(/at least 20 characters/);
  });

  it("recognise real-looking email addresses", () => {
    expect(isEmail("jane@company.com")).toBe(true);
    expect(isEmail(" jane@company.co ")).toBe(true);
    expect(isEmail("jane@company")).toBe(false);
    expect(isEmail("jane company.com")).toBe(false);
  });

  it("go to Web3Forms, never to a server of ours", () => {
    expect(FORM_ACTION).toBe("https://api.web3forms.com/submit");
  });

  it("can be handed to the visitor's email app", () => {
    const href = mailtoFor(good);
    expect(href).toMatch(/^mailto:/);
    expect(decodeURIComponent(href)).toContain(
      "Portfolio message from Ada Lovelace",
    );
  });
});
