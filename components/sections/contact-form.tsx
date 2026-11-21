"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useId,
  useRef,
  useState,
} from "react";

import { CheckIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import {
  FORM_ACTION,
  FORM_SENDER,
  mailtoFor,
  type Message,
  type MessageErrors,
  type MessageField,
  sendMessage,
  validateMessage,
} from "@/lib/contact/message";
import { cn } from "@/lib/cn";

const FIELDS: {
  name: MessageField;
  label: string;
  type: "text" | "email" | "textarea";
  autoComplete: string;
  placeholder: string;
}[] = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    autoComplete: "name",
    placeholder: "Jane Doe",
  },
  {
    name: "email",
    label: "Your email",
    type: "email",
    autoComplete: "email",
    placeholder: "jane@company.com",
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    autoComplete: "off",
    placeholder: "A few sentences about the role or the project.",
  },
];

const empty: Message = { name: "", email: "", message: "" };

/**
 * The contact form. Messages go straight to Sam's inbox through Web3Forms
 * (lib/contact/message.ts); nothing is stored here. With JavaScript it
 * checks the fields in place and confirms on the page; without it, it is a
 * plain form that posts to Web3Forms and comes back to /thanks.
 */
export function ContactForm({ thanksUrl }: { thanksUrl: string }) {
  const [values, setValues] = useState<Message>(empty);
  const [errors, setErrors] = useState<MessageErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const fieldRefs = useRef<
    Partial<Record<MessageField, HTMLInputElement | HTMLTextAreaElement>>
  >({});
  const id = useId();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateMessage(values);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field.name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid.name]?.focus();
      return;
    }
    // The hidden honeypot: only a bot ticks it, so it gets a quiet "sent".
    const isBot = new FormData(event.currentTarget).has("botcheck");
    setStatus("sending");
    const result = isBot ? { ok: true } : await sendMessage(values);
    if (result.ok) {
      setSentTo({
        name: values.name.trim().split(" ")[0]!,
        email: values.email,
      });
      setValues(empty);
      setStatus("sent");
    } else {
      setStatus("failed");
    }
  };

  if (status === "sent")
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-leaf-tint text-leaf-ink">
          <CheckIcon className="size-6" />
        </span>
        <p className="type-h3 text-ink">
          Message sent. Thank you, {sentTo.name}.
        </p>
        <p className="text-ink-2">
          It went straight to Sam’s inbox. He will reply to {sentTo.email}{" "}
          within a few days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 inline-flex min-h-tap items-center rounded-full border border-line-strong px-5 text-small font-semibold text-ink hocus:border-ink"
        >
          Send another message
        </button>
      </div>
    );

  return (
    <form
      action={FORM_ACTION}
      method="POST"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-5"
    >
      <div>
        <h3 id={`${id}-title`} className="type-h3 text-ink">
          Send a message
        </h3>
        <p className="mt-1 text-small text-ink-2">
          It goes straight to Sam’s inbox.
        </p>
      </div>

      {/* Used only when JavaScript is off: the Web3Forms settings. */}
      <input type="hidden" name="access_key" value={site.formAccessKey} />
      <input type="hidden" name="subject" value="Portfolio message" />
      <input type="hidden" name="from_name" value={FORM_SENDER} />
      <input type="hidden" name="redirect" value={thanksUrl} />
      {/* Honeypot: people never see it, so a tick here means a bot. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {FIELDS.map((field) => {
        const error = errors[field.name];
        const inputId = `${id}-${field.name}`;
        const errorId = `${inputId}-error`;
        const common = {
          id: inputId,
          name: field.name,
          autoComplete: field.autoComplete,
          placeholder: field.placeholder,
          required: true,
          value: values[field.name],
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          disabled: status === "sending",
          className: cn(
            "w-full rounded-xl border bg-paper px-4 py-3 text-body text-ink transition-colors duration-(--dur-ui) placeholder:text-ink-3 focus:border-accent-ink disabled:opacity-60",
            error ? "border-[#b42318]" : "border-line-strong/70",
          ),
        };
        const onChange = (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          setValues((current) => ({
            ...current,
            [field.name]: event.target.value,
          }));
          if (error)
            setErrors((current) => ({ ...current, [field.name]: undefined }));
        };
        return (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label
              htmlFor={inputId}
              className="text-small font-semibold text-ink"
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                {...common}
                ref={(el) => {
                  if (el) fieldRefs.current[field.name] = el;
                }}
                rows={5}
                maxLength={4000}
                onChange={onChange}
                className={cn(common.className, "min-h-32 resize-y")}
              />
            ) : (
              <input
                {...common}
                ref={(el) => {
                  if (el) fieldRefs.current[field.name] = el;
                }}
                type={field.type}
                maxLength={field.type === "email" ? 120 : 80}
                onChange={onChange}
              />
            )}
            {error && (
              <p id={errorId} className="text-small font-medium text-[#b42318]">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {status === "failed" && (
        <div
          role="alert"
          className="rounded-xl border border-[#b42318]/30 bg-[#fef3f2] p-4 text-small text-ink"
        >
          The message could not be sent right now. You can still send it from
          your email app:{" "}
          <a
            href={mailtoFor(values)}
            className="font-semibold text-accent-ink underline underline-offset-4"
          >
            open it with the message filled in
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-accent-ink px-7 text-small font-semibold text-white transition-[background-color,translate] duration-(--dur-ui) disabled:opacity-60 hocus:-translate-y-px hocus:bg-accent-deep"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
