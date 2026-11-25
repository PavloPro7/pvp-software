import { site } from "@/data/site";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>
          {site.name}, built by {site.owner}
        </span>
        <ul className={styles.links}>
          {site.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} rel="me noopener">
                {link.label}
              </a>
            </li>
          ))}
          {site.email && (
            <li>
              <a href={`mailto:${site.email}`}>Email</a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
