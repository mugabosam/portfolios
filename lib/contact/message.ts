import { site } from "@/content/site";

/**
 * Messages to Sam, from the contact form and the assistant. They go straight
 * to his inbox through Web3Forms, a form-to-email service: the browser posts
 * the message to Web3Forms and Web3Forms emails it on. There is no server of
 * ours in between.
 */

export type Message = { name: string; email: string; message: string };
export type MessageField = keyof Message;
export type MessageErrors = Partial<Record<MessageField, string>>;

/** Where messages are posted, by script and by the plain form alike. */
export const FORM_ACTION = "https://api.web3forms.com/submit";
/** The sender name Sam sees in his inbox. */
export const FORM_SENDER = "Portfolio contact form";

/** Subject line of every email Sam receives. */
export const subjectFor = (name: string) => `Portfolio message from ${name}`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A real-looking address: something@domain.tld, at most 120 characters. */
export const isEmail = (value: string) =>
  EMAIL.test(value.trim()) && value.trim().length <= 120;

/** The same rules everywhere: a name, a real-looking email, a real message. */
export function validateMessage(input: Message): MessageErrors {
  const errors: MessageErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 80) errors.name = "That name is too long.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 20)
    errors.message = "Please say a little more: at least 20 characters.";
  else if (message.length > 4000)
    errors.message = "Please keep it under 4,000 characters.";
  return errors;
}

export type SendResult = { ok: true } | { ok: false; error: string };

/** Sends a message through Web3Forms, as JSON like its documentation. */
export async function sendMessage(input: Message): Promise<SendResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  try {
    const response = await fetch(FORM_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: site.formAccessKey,
        name,
        email,
        message: input.message.trim(),
        subject: subjectFor(name),
        from_name: FORM_SENDER,
        replyto: email,
      }),
    });
    const result = (await response.json().catch(() => ({}))) as {
      success?: boolean;
    };
    if (response.ok && result.success === true) return { ok: true };
    return { ok: false, error: "The message could not be sent right now." };
  } catch {
    return { ok: false, error: "The connection failed." };
  }
}

/** The same message, ready in the visitor's own email app (fallback). */
export function mailtoFor(input: Message) {
  const subject = encodeURIComponent(subjectFor(input.name.trim()));
  const body = encodeURIComponent(
    `${input.message.trim()}\n\n${input.name.trim()}\n${input.email.trim()}`,
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
