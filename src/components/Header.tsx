import Link from "next/link";
import { site } from "@/data/site";
import styles from "./Header.module.scss";

export function Header() {
  // "PVP Software" becomes the channel's wordmark: PVP + SOFTWARE + cursor.
  const [first, ...rest] = site.name.split(" ");

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          <span className={styles.first}>{first}</span>
          <span className={styles.rest}>{rest.join(" ")}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </Link>
        <nav aria-label="Main">
          <ul className={styles.nav}>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
