"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";
import button from "@/components/Button.module.scss";
import styles from "./contact.module.scss";

const initialState: ContactState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return <p role="status">{state.message}</p>;
  }

  return (
    <form action={action} className={styles.form}>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" required maxLength={100} />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required maxLength={200} />
      </label>
      <label className={styles.honeypot} aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        Message
        <textarea name="message" rows={6} required minLength={10} maxLength={5000} />
      </label>
      {state.status === "error" && (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      )}
      <button type="submit" className={button.button} disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
