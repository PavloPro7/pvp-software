import Image from "next/image";
import Link from "next/link";
import { PlatformList } from "@/components/PlatformList";
import { asset } from "@/lib/paths";
import type { ProjectMeta } from "@/lib/projects";
import styles from "./ProjectGrid.module.scss";

export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) return <p className="muted">Nothing here yet.</p>;
  return (
    <ul className={styles.grid}>
      {projects.map((project) => {
        const pageHref = project.hasPage ? `/projects/${project.slug}` : null;
        return (
          <li
            key={project.slug}
            className={project.featured ? `${styles.card} ${styles.featured}` : styles.card}
          >
            <div className={styles.head}>
              {project.icon && (
                <Image
                  src={asset(project.icon)}
                  alt=""
                  width={48}
                  height={48}
                  className={styles.icon}
                />
              )}
              <h3>{pageHref ? <Link href={pageHref}>{project.title}</Link> : project.title}</h3>
            </div>
            <p className={`muted ${styles.summary}`}>{project.summary}</p>
            <PlatformList
              platforms={project.platforms}
              label={`Where ${project.title} is available`}
            />
            {project.stack.length > 0 && (
              <p className={styles.stack}>Built with {project.stack.join(", ")}</p>
            )}
            {(pageHref || project.links.length > 0) && (
              <p className={styles.links}>
                {pageHref && (
                  <Link href={pageHref} aria-label={`Read more about ${project.title}`}>
                    Read more
                  </Link>
                )}
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} rel="noopener">
                    {link.label}
                  </a>
                ))}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
