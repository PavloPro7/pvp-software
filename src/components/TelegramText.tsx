import type { ReactNode } from "react";
import {
  toBlocks,
  type InlineSegment,
  type Mark,
  type TelegramEntity,
} from "@/lib/telegram-text";
import styles from "./TelegramText.module.scss";

const WRAPPERS: Record<Mark, (children: ReactNode) => ReactNode> = {
  code: (children) => <code>{children}</code>,
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strike: (children) => <s>{children}</s>,
  spoiler: (children) => <span className={styles.spoiler}>{children}</span>,
};

const ORDER: Mark[] = ["code", "bold", "italic", "underline", "strike", "spoiler"];

function renderSegments(segments: InlineSegment[]): ReactNode {
  return segments.map((segment, index) => {
    let node: ReactNode = segment.text;
    for (const mark of ORDER) {
      if (segment.marks.includes(mark)) node = WRAPPERS[mark](node);
    }
    if (segment.href) {
      node = (
        <a href={segment.href} rel="noopener">
          {node}
        </a>
      );
    }
    return <span key={index}>{node}</span>;
  });
}

// Renders the text of a Telegram post with its formatting (bold, links,
// quotes, code). Line breaks are kept as they were written.
export function TelegramText({ text, entities }: { text: string; entities: TelegramEntity[] }) {
  return (
    <div className={styles.text}>
      {toBlocks(text, entities).map((block, index) => {
        if (block.kind === "pre") {
          return (
            <pre key={index}>
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.kind === "quote") {
          return <blockquote key={index}>{renderSegments(block.segments)}</blockquote>;
        }
        return <p key={index}>{renderSegments(block.segments)}</p>;
      })}
    </div>
  );
}
