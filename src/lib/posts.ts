import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// One post = one file in content/blog.
// Files are read synchronously on purpose: Next.js then builds these pages
// ahead of time, and in `npm run dev` every refresh shows your latest edits.
const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO, e.g. 2026-11-21
};

export type Post = PostMeta & { content: string };

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx$/, ""),
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map(readPost)
    .map(({ slug, title, description, date }) => ({ slug, title, description, date }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return readPost(`${slug}.mdx`);
  } catch {
    return null;
  }
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
