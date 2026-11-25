import type { Metadata } from "next";
import { site } from "@/data/site";
import button from "@/components/Button.module.scss";
import styles from "./contact.module.scss";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.owner}.`,
};

// The site has no server, so there is no form here: the page links to the
// places where messages reach me. The email appears once it is set in
// src/data/site.ts.
export default function ContactPage() {
  return (
    <div className="container narrow section">
      <h1>Contact</h1>
      <p className="muted">Feedback, a question about one of the apps, or a custom build.</p>

      <p className={styles.actions}>
        <a href={site.telegram.href} rel="noopener" className={button.button}>
          Open the Telegram channel
        </a>
        {site.email && (
          <a href={`mailto:${site.email}`} className={`${button.button} ${button.secondary}`}>
            Send an email
          </a>
        )}
      </p>

      <dl className={styles.routes}>
        <div>
          <dt>Telegram</dt>
          <dd>
            <a href={site.telegram.href} rel="noopener">
              {site.telegram.handle}
            </a>
          </dd>
        </div>
        {site.email && (
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
        )}
        {site.links
          .filter((link) => link.href !== site.telegram.href)
          .map((link) => (
            <div key={link.label}>
              <dt>{link.label}</dt>
              <dd>
                <a href={link.href} rel="me noopener">
                  {link.href.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
