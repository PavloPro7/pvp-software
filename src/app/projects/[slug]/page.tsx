import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PlatformList } from "@/components/PlatformList";
import { site } from "@/data/site";
import { asset } from "@/lib/paths";
import { getAllProjects, getProject } from "@/lib/projects";
import button from "@/components/Button.module.scss";
import prose from "@/components/Prose.module.scss";
import styles from "./project.module.scss";

// The site is exported as static files, so only the pages that exist at build
// time are created; any other address gets the "Page not found" page.
export const dynamicParams = false;

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.filter((project) => project.hasPage).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasPage) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      images: project.cover ? [`${site.url}${project.cover}`] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasPage) notFound();

  // One button per place where the project is live, then any extra links.
  const actions = [
    ...project.platforms.flatMap((platform) =>
      platform.href ? [{ label: platform.action ?? platform.name, href: platform.href }] : [],
    ),
    ...project.links,
  ];

  return (
    <article className="container narrow section">
      <p>
        <Link href="/projects" className={styles.back}>
          ← All projects
        </Link>
      </p>

      <header className={styles.header}>
        {project.icon && (
          <Image
            src={asset(project.icon)}
            alt=""
            width={64}
            height={64}
            className={styles.icon}
          />
        )}
        <div>
          <h1>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
        </div>
      </header>

      <dl className={styles.facts}>
        {project.platforms.length > 0 && (
          <div>
            <dt>Available on</dt>
            <dd>
              <PlatformList
                platforms={project.platforms}
                label={`Where ${project.title} is available`}
              />
            </dd>
          </div>
        )}
        {project.stack.length > 0 && (
          <div>
            <dt>Built with</dt>
            <dd>{project.stack.join(", ")}</dd>
          </div>
        )}
      </dl>

      {actions.length > 0 && (
        <p className={styles.actions}>
          {actions.map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              rel="noopener"
              className={index === 0 ? button.button : `${button.button} ${button.secondary}`}
            >
              {action.label}
            </a>
          ))}
        </p>
      )}

      {project.cover && (
        <div className={styles.cover}>
          <Image
            src={asset(project.cover)}
            alt={`${project.title} cover image`}
            fill
            sizes="(min-width: 48rem) 42rem, 100vw"
            preload
          />
        </div>
      )}

      {project.screenshots.length > 0 && (
        <ul className={styles.shots} aria-label={`${project.title} screenshots`}>
          {project.screenshots.map((src, index) => (
            <li key={src}>
              <Image
                src={asset(src)}
                alt={`${project.title} screenshot ${index + 1}`}
                width={540}
                height={960}
                sizes="(min-width: 48rem) 14rem, 60vw"
              />
            </li>
          ))}
        </ul>
      )}

      <div className={prose.prose}>
        <MDXRemote source={project.content} />
      </div>
    </article>
  );
}
