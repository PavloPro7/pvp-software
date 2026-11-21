"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "");

  // Bots fill hidden fields; pretend it worked.
  if (honeypot) return { status: "success", message: "Thanks! I will reply soon." };

  if (!name || name.length > 100) {
    return { status: "error", message: "Please enter your name." };
  }
  if (!EMAIL.test(email) || email.length > 200) {
    return { status: "error", message: "Please enter a valid email." };
  }
  if (message.length < 10 || message.length > 5000) {
    return { status: "error", message: "Please write at least a couple of sentences." };
  }

  // TODO: deliver the message (an email API such as Resend, or a database).
  // Until then it only appears in the server log.
  console.log("[contact]", { name, email, message });

  return { status: "success", message: "Thanks! I will reply soon." };
}
