import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container narrow section">
      <h1>Contact</h1>
      <p className="muted">
        Write to me here or at <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <ContactForm />
    </div>
  );
}
