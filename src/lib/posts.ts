import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getTelegramPost, getTelegramPosts, type TelegramPost } from "@/lib/telegram";

// The blog has two kinds of posts:
//   - "site": one file per post in content/blog, written by hand;
//   - "telegram": posts copied from the Telegram channel by the bot
//     (content/telegram). Their address starts with "tg-".
// Files are read synchronously on purpose: Next.js then builds these pages
// ahead of time, and in `npm run dev` every refresh shows your latest edits.
const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const TELEGRAM_PREFIX = "tg-";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date, with or without a time, e.g. 2026-11-21
  source: "site" | "telegram";
};

export type Post =
  | (PostMeta & { source: "site"; content: string })
  | (PostMeta & { source: "telegram"; telegram: TelegramPost });

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx$/, ""),
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    source: "site",
    content,
  };
}

function fromTelegram(post: TelegramPost): Post {
  return {
    slug: `${TELEGRAM_PREFIX}${post.id}`,
    title: post.title,
    description: post.description,
    date: post.date,
    source: "telegram",
    telegram: post,
  };
}

function toMeta({ slug, title, description, date, source }: Post): PostMeta {
  return { slug, title, description, date, source };
}

export function getAllPosts(): PostMeta[] {
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"))
    : [];
  return [...files.map(readPost), ...getTelegramPosts().map(fromTelegram)]
    .map(toMeta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  if (slug.startsWith(TELEGRAM_PREFIX)) {
    const post = getTelegramPost(slug.slice(TELEGRAM_PREFIX.length));
    return post ? fromTelegram(post) : null;
  }
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return readPost(`${slug}.mdx`);
  } catch {
    return null;
  }
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
