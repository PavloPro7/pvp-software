import type { Platform } from "@/lib/projects";
import styles from "./PlatformList.module.scss";

// Shows where a project is available. A platform with a link is live there;
// one without a link is not released there yet.
export function PlatformList({ platforms, label }: { platforms: Platform[]; label: string }) {
  if (platforms.length === 0) return null;
  return (
    <ul className={styles.list} aria-label={label}>
      {platforms.map((platform) => (
        <li key={platform.name}>
          {platform.href ? (
            <a href={platform.href} rel="noopener" className={`${styles.badge} ${styles.live}`}>
              <span className={styles.dot} aria-hidden="true" />
              {platform.name}
              <span className="visually-hidden"> (live)</span>
            </a>
          ) : (
            <span className={`${styles.badge} ${styles.soon}`}>
              <span className={styles.dot} aria-hidden="true" />
              {platform.name}
              <span className={styles.note}>soon</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
