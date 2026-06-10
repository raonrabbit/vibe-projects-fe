"use client";

import { useEffect, useState } from "react";

type Segment =
  | { type: "text"; content: string }
  | { type: "code-block"; lang: string; content: string }
  | { type: "inline-code"; content: string };

function parse(text: string): Segment[] {
  const segments: Segment[] = [];
  const codeBlockRe = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushText(segments, text.slice(lastIndex, match.index));
    }
    segments.push({
      type: "code-block",
      lang: match[1],
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    pushText(segments, text.slice(lastIndex));
  }

  return segments;
}

function pushText(segments: Segment[], raw: string) {
  for (const part of raw.split(/(`[^`\n]+`)/g)) {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      segments.push({ type: "inline-code", content: part.slice(1, -1) });
    } else if (part) {
      segments.push({ type: "text", content: part });
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let highlighterPromise: Promise<any> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: ["javascript", "jsx", "typescript", "tsx", "bash", "css"],
      }),
    );
  }
  return highlighterPromise;
}

const LANG_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
};

function CodeBlock({ lang, content }: { lang: string; content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    getHighlighter().then((hl) => {
      try {
        setHtml(
          hl.codeToHtml(content, {
            lang: LANG_ALIASES[lang] ?? lang ?? "text",
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          }),
        );
      } catch {
        // unsupported lang — plain text fallback remains
      }
    });
  }, [lang, content]);

  if (!html) {
    return (
      <pre className="my-3 overflow-x-auto rounded-lg bg-text-primary/[0.06] px-4 py-3 font-mono text-xs leading-relaxed text-text-primary/80">
        <code>{content}</code>
      </pre>
    );
  }

  return (
    <div
      className="quiz-code my-3"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface Props {
  text: string;
  className?: string;
}

export function MarkdownBlock({ text, className }: Props) {
  const segments = parse(text);

  return (
    <div className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "code-block") {
          return <CodeBlock key={i} lang={seg.lang} content={seg.content} />;
        }
        if (seg.type === "inline-code") {
          return (
            <code
              key={i}
              className="rounded bg-text-primary/10 px-1 py-0.5 font-mono text-[0.85em]"
            >
              {seg.content}
            </code>
          );
        }
        return (
          <span key={i} className="whitespace-pre-wrap">
            {seg.content}
          </span>
        );
      })}
    </div>
  );
}

/** 코드블록 이전의 텍스트만 반환 — 리스트 버튼 제목용 */
export function getQuestionTitle(question: string): string {
  const idx = question.indexOf("```");
  return (idx === -1 ? question : question.slice(0, idx)).trim();
}
