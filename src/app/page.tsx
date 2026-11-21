import Link from "next/link";
import { PlatformList } from "@/components/PlatformList";
import { PostList } from "@/components/PostList";
import { ProjectGrid } from "@/components/ProjectGrid";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import button from "@/components/Button.module.scss";
import styles from "./page.module.scss";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const projects = getAllProjects();
  const shipped = projects.filter((project) => project.isLive);

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <h1 className={styles.slogan}>
              {site.slogan.split(" ").map((word) => (
                <span key={word}>{word} </span>
              ))}
            </h1>
            <p className={styles.lead}>{site.tagline}</p>
            <div className={styles.actions}>
              <Link href="/projects" className={button.button}>
                See the projects
              </Link>
              <a href={site.telegram.href} rel="noopener" className={styles.handle}>
                {site.telegram.handle}
              </a>
            </div>
          </div>

          {shipped.length > 0 && (
            <aside className={styles.board} aria-labelledby="board-title">
              <div className={styles.boardBar}>
                <span className={styles.lights} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <h2 id="board-title" className={styles.boardTitle}>
                  Shipped
                </h2>
                <span className={styles.liveTag}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  LIVE
                </span>
              </div>
              <ul className={styles.boardList}>
                {shipped.map((project) => (
                  <li key={project.slug}>
                    {project.hasPage ? (
                      <Link href={`/projects/${project.slug}`} className={styles.boardName}>
                        {project.title}
                      </Link>
                    ) : (
                      <span className={styles.boardName}>{project.title}</span>
                    )}
                    <PlatformList
                      platforms={project.platforms}
                      label={`Where ${project.title} is available`}
                    />
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      <div className="container">
        <section className="section" aria-labelledby="projects-heading">
          <div className={styles.sectionHead}>
            <h2 id="projects-heading">Projects</h2>
            <Link href="/projects">All projects</Link>
          </div>
          <ProjectGrid projects={projects} />
        </section>

        <section className="section" aria-labelledby="posts-heading">
          <div className={styles.sectionHead}>
            <h2 id="posts-heading">Latest posts</h2>
            <Link href="/blog">All posts</Link>
          </div>
          <PostList posts={posts} />
        </section>
      </div>
    </>
  );
}
