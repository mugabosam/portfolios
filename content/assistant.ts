/**
 * What the hero's assistant says. It is not a language model: it matches
 * keywords in what the visitor types (or the button they press) and answers
 * with the text below, written from Sam's own facts. Edit freely; keep each
 * answer short.
 */

import { availability, languages, now } from "./profile";
import { site } from "./site";

/** The conversation that plays when the page opens. */
export const opening = [
  { from: "user", text: "What does Sam do?" },
  {
    from: "bot",
    text: "Sam is a software developer in Kigali. He builds web and mobile apps end to end: the screens people use and the systems behind them.",
  },
  { from: "user", text: "Is he open to new roles?" },
  {
    from: "bot",
    text: "Yes. Software development roles: frontend, backend or full-stack, remote or in Kigali. Type cv to download his CV, or contact to send him a message.",
  },
] as const;

export const answers = {
  greeting:
    "Hello! Ask me anything about Sam, or tap one of the buttons below.",
  thanks: "You're welcome. Anything else you'd like to know?",
  help: "Ask in your own words, or type one of these: cv, projects, skills, experience, education, contact, email.",
  about:
    "Sam Mugabo is a software developer from Kigali, Rwanda. He builds complete products: websites, mobile apps, and the servers and data behind them.",
  cv: "Here is Sam's CV. The download has started.",
  projects: "Sam has six projects on this page. Pick one for a short summary:",
  skills:
    "Websites and web apps: React, Next.js and TypeScript. Mobile apps: Flutter. Servers and data: NestJS, Django, PostgreSQL and Python. He also builds small machine-learning models.",
  now: now.text,
  availability: `Yes, he's ${availability.status.toLowerCase()}: frontend, backend or full-stack, remote or in Kigali.`,
  education:
    "He's finishing a Bachelor's degree in Information Technology at the University of Rwanda, College of Science and Technology, expected in 2027.",
  location: `He's based in ${site.location} (UTC+2) and happy to work remotely.`,
  spoken: `He speaks ${languages.join(" and ")}.`,
  email: `You can write to Sam at ${site.email}.`,
  github: "His public projects are on GitHub.",
  fallback:
    "I don't have an answer for that yet. Try asking about his projects, skills or experience, or type cv to download his CV.",
  contact: {
    start: "Happy to pass a message to Sam. What's your name?",
    nameRetry: "Could you tell me your name? Two letters at least.",
    askEmail: (first: string) =>
      `Thanks, ${first}. Which email should Sam reply to?`,
    emailRetry: "That email doesn't look right. Could you check it?",
    askMessage:
      "And your message? A few sentences about the role or project is perfect.",
    messageRetry: "Could you say a little more? At least 20 characters.",
    confirm: "Here's your message. Shall I send it?",
    sending: "Sending…",
    sent: (email: string) =>
      `Sent. Sam will reply to ${email} within a few days.`,
    mailto:
      "Your email app should open with the message ready. Just press send.",
    failed: (error: string) =>
      `${error} You can still send it from your email app:`,
    cancelled: "Cancelled. Nothing was sent.",
  },
} as const;
