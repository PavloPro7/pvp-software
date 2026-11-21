import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// One project = one file in content/projects.
// The top block holds the card details; any text below it becomes the
// project's own page at /projects/<file-name>.
// Files are read synchronously on purpose (see src/lib/posts.ts).
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectLink = { label: string; href: string };

// Where a project can be used. With `href` it is live there (the link goes to
// the listing); without `href` it is not released there yet.
export type Platform = { name: string; href: string | null; action: string | null };

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  platforms: Platform[];
  isLive: boolean; // true when at least one platform has a link
  stack: string[];
  links: ProjectLink[];
  icon: string; // image path under /public, or ""
  cover: string; // wide image path under /public (shown 16:9), or ""
  screenshots: string[]; // phone screenshots under /public (shown 9:16)
  featured: boolean;
  order: number;
  hasPage: boolean;
};

export type Project = ProjectMeta & { content: string };

function toStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function toPlatforms(value: unknown): Platform[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return [{ name: item, href: null, action: null }];
    if (typeof item !== "object" || item === null) return [];
    const { name, href, action } = item as Record<string, unknown>;
    if (typeof name !== "string") return [];
    return [
      {
        name,
        href: typeof href === "string" ? href : null,
        action: typeof action === "string" ? action : null,
      },
    ];
  });
}

function toLinks(value: unknown): ProjectLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const { label, href } = item as Record<string, unknown>;
    return typeof label === "string" && typeof href === "string" ? [{ label, href }] : [];
  });
}

function readProject(file: string): { meta: ProjectMeta; content: string } {
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const body = content.trim();
  const platforms = toPlatforms(data.platforms);
  return {
    meta: {
      slug: file.replace(/\.mdx$/, ""),
      title: String(data.title ?? "Untitled"),
      summary: String(data.summary ?? ""),
      platforms,
      isLive: platforms.some((platform) => platform.href !== null),
      stack: toStrings(data.stack),
      links: toLinks(data.links),
      icon: String(data.icon ?? ""),
      cover: String(data.cover ?? ""),
      screenshots: toStrings(data.screenshots),
      featured: data.featured === true,
      order: Number(data.order ?? 100),
      hasPage: body.length > 0,
    },
    content: body,
  };
}

export function getAllProjects(): ProjectMeta[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => readProject(file).meta)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getProject(slug: string): Project | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const { meta, content } = readProject(`${slug}.mdx`);
    return { ...meta, content };
  } catch {
    return null;
  }
}
