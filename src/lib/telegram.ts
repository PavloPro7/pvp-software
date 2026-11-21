import fs from "node:fs";
import path from "node:path";
import { sliceEntities, type TelegramEntity } from "@/lib/telegram-text";

// Posts copied from the Telegram channel. The bot writes one file per post to
// content/telegram/<message id>.json (and photos to public/telegram).
// Files are read synchronously on purpose (see src/lib/posts.ts).
const TELEGRAM_DIR = path.join(process.cwd(), "content", "telegram");

export type TelegramPhoto = { src: string; width: number; height: number };

export type TelegramPost = {
  id: number;
  url: string | null; // link to the original post
  date: string; // ISO date and time
  edited: string | null;
  title: string; // the first line of the post
  description: string;
  text: string; // the rest of the post
  entities: TelegramEntity[];
  photo: TelegramPhoto | null;
};

const TITLE_LIMIT = 110;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toEntities(value: unknown): TelegramEntity[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const { type, offset, length, url, language } = item;
    if (typeof type !== "string" || typeof offset !== "number" || typeof length !== "number") {
      return [];
    }
    return [
      {
        type,
        offset,
        length,
        ...(typeof url === "string" ? { url } : {}),
        ...(typeof language === "string" ? { language } : {}),
      },
    ];
  });
}

function toPhoto(value: unknown): TelegramPhoto | null {
  if (!isRecord(value)) return null;
  const { src, width, height } = value;
  if (typeof src !== "string" || !/^\/telegram\/[\w.-]+$/.test(src)) return null;
  if (typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0) {
    return null;
  }
  return { src, width, height };
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function shorten(text: string, limit: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > limit * 0.6 ? lastSpace : limit).trimEnd()}…`;
}

// A Telegram post has no title. A short first line becomes the title and the
// rest becomes the body; otherwise the title is the beginning of the text.
function splitTitle(text: string, entities: TelegramEntity[]) {
  const lineEnd = text.indexOf("\n");
  const firstLine = (lineEnd === -1 ? text : text.slice(0, lineEnd)).trim();

  if (lineEnd !== -1 && firstLine.length > 0 && firstLine.length <= TITLE_LIMIT) {
    let bodyStart = lineEnd;
    while (text[bodyStart] === "\n") bodyStart += 1;
    return {
      title: firstLine,
      body: text.slice(bodyStart),
      bodyEntities: sliceEntities(entities, bodyStart, text.length),
    };
  }
  return {
    title: shorten(firstLine || text, 80) || "Photo",
    body: text,
    bodyEntities: entities,
  };
}

function parsePost(raw: string): TelegramPost | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data)) return null;
  const { id, url, date, edited, text } = data;
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) return null;
  if (!isIsoDate(date) || typeof text !== "string") return null;

  const photo = toPhoto(data.photo);
  if (text.trim() === "" && !photo) return null;

  const { title, body, bodyEntities } = splitTitle(text, toEntities(data.entities));
  return {
    id,
    url: typeof url === "string" && /^https:\/\/t\.me\//.test(url) ? url : null,
    date,
    edited: isIsoDate(edited) ? edited : null,
    title,
    description: shorten(body, 160),
    text: body,
    entities: bodyEntities,
    photo,
  };
}

function readPostFile(file: string): TelegramPost | null {
  try {
    return parsePost(fs.readFileSync(path.join(TELEGRAM_DIR, file), "utf8"));
  } catch {
    return null;
  }
}

export function getTelegramPosts(): TelegramPost[] {
  if (!fs.existsSync(TELEGRAM_DIR)) return [];
  return fs
    .readdirSync(TELEGRAM_DIR)
    .filter((file) => /^\d+\.json$/.test(file))
    .flatMap((file) => readPostFile(file) ?? []);
}

export function getTelegramPost(id: string): TelegramPost | null {
  if (!/^\d+$/.test(id)) return null;
  return readPostFile(`${id}.json`);
}
