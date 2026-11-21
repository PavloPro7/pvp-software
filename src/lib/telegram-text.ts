// Turns a Telegram message (plain text + "entities" that mark bold, links,
// code and so on) into blocks that React can render. Nothing here produces
// HTML strings, so text from Telegram can never inject markup into the page.
//
// Telegram counts entity positions in UTF-16 units, the same way JavaScript
// strings do, so offsets can be used on the string directly.

export type TelegramEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  language?: string;
};

export type Mark = "bold" | "italic" | "underline" | "strike" | "code" | "spoiler";

export type InlineSegment = { text: string; marks: Mark[]; href: string | null };

export type TextBlock =
  | { kind: "text"; segments: InlineSegment[] }
  | { kind: "quote"; segments: InlineSegment[] }
  | { kind: "pre"; text: string; language: string | null };

const MARKS: Record<string, Mark> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "strike",
  code: "code",
  pre: "code", // a code block nested in a quote is shown as inline code
  spoiler: "spoiler",
};

const BLOCK_TYPES = new Set(["pre", "blockquote", "expandable_blockquote"]);
const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:", "tg:"]);

/** Returns a link that is safe to put in href, or null. */
export function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return ALLOWED_SCHEMES.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

type Range = TelegramEntity & { end: number };

function normalize(text: string, entities: TelegramEntity[]): Range[] {
  return entities
    .filter(
      (entity) =>
        Number.isInteger(entity.offset) &&
        Number.isInteger(entity.length) &&
        entity.length > 0 &&
        entity.offset >= 0 &&
        entity.offset < text.length,
    )
    .map((entity) => ({ ...entity, end: Math.min(entity.offset + entity.length, text.length) }));
}

function linkFor(entity: Range, text: string): string | null {
  const own = text.slice(entity.offset, entity.end);
  switch (entity.type) {
    case "text_link":
      return entity.url ? safeHref(entity.url) : null;
    case "url":
      return safeHref(own);
    case "email":
      return safeHref(`mailto:${own}`);
    case "mention":
      return /^@[A-Za-z0-9_]{3,}$/.test(own) ? `https://t.me/${own.slice(1)}` : null;
    default:
      return null;
  }
}

function inlineSegments(text: string, ranges: Range[], from: number, to: number): InlineSegment[] {
  const inside = ranges.filter((range) => range.offset < to && range.end > from);
  const cuts = new Set<number>([from, to]);
  for (const range of inside) {
    cuts.add(Math.max(range.offset, from));
    cuts.add(Math.min(range.end, to));
  }
  const points = [...cuts].sort((a, b) => a - b);

  const segments: InlineSegment[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [start, end] = [points[i], points[i + 1]];
    const covering = inside.filter((range) => range.offset <= start && range.end >= end);
    const marks = new Set<Mark>();
    let href: string | null = null;
    for (const range of covering) {
      const mark = MARKS[range.type];
      if (mark) marks.add(mark);
      href ??= linkFor(range, text);
    }
    segments.push({ text: text.slice(start, end), marks: [...marks], href });
  }
  return segments;
}

/** Splits a message into paragraphs of text, quotes and code blocks. */
export function toBlocks(text: string, entities: TelegramEntity[]): TextBlock[] {
  const ranges = normalize(text, entities);

  // Quotes and code blocks stand on their own; if two overlap, the first wins.
  const blockRanges: Range[] = [];
  for (const range of ranges
    .filter((candidate) => BLOCK_TYPES.has(candidate.type))
    .sort((a, b) => a.offset - b.offset)) {
    const last = blockRanges.at(-1);
    if (!last || range.offset >= last.end) blockRanges.push(range);
  }
  // Everything else is inline. A code block that lost to a quote around it
  // is kept as inline code; a quote that lost is ignored.
  const inline = ranges.filter(
    (range) =>
      !blockRanges.includes(range) && (range.type === "pre" || !BLOCK_TYPES.has(range.type)),
  );

  const blocks: TextBlock[] = [];
  const pushText = (from: number, to: number, afterBlock: boolean, beforeBlock: boolean) => {
    let [start, end] = [from, to];
    // A quote or code block already starts on its own line.
    if (afterBlock && text[start] === "\n") start += 1;
    if (beforeBlock && end > start && text[end - 1] === "\n") end -= 1;
    if (text.slice(start, end).trim() === "") return;
    blocks.push({ kind: "text", segments: inlineSegments(text, inline, start, end) });
  };

  let cursor = 0;
  blockRanges.forEach((range, index) => {
    pushText(cursor, range.offset, index > 0, true);
    if (range.type === "pre") {
      blocks.push({
        kind: "pre",
        text: text.slice(range.offset, range.end),
        language: range.language ?? null,
      });
    } else {
      blocks.push({
        kind: "quote",
        segments: inlineSegments(text, inline, range.offset, range.end),
      });
    }
    cursor = range.end;
  });
  pushText(cursor, text.length, blockRanges.length > 0, false);
  return blocks;
}

/** Keeps only the entities inside [from, to) and moves them to start at 0. */
export function sliceEntities(
  entities: TelegramEntity[],
  from: number,
  to: number,
): TelegramEntity[] {
  return entities.flatMap((entity) => {
    const start = Math.max(entity.offset, from);
    const end = Math.min(entity.offset + entity.length, to);
    return end > start ? [{ ...entity, offset: start - from, length: end - start }] : [];
  });
}
