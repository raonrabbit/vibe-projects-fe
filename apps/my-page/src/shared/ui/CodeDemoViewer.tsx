"use client";

import { useState } from "react";

export interface CodePanel {
  label: string;
  code: string;
  filename?: string;
}

export interface CodeDemoItem {
  title?: string;
  panels: CodePanel[];
}

function highlightCode(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match: comment | string | jsx-tag+component | keyword
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|((?:<\/?))([A-Z][A-Za-z0-9.]*)|(\b(?:const|let|var|return|export|import|from|async|await|function|type|interface|if|else|true|false|null|undefined|default|new|class)\b)/g;

  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={key++} className="text-zinc-300">
          {code.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const [full, comment, str, tagPrefix, componentName, keyword] = match;

    if (comment !== undefined) {
      nodes.push(
        <span key={key++} className="text-zinc-500 italic">
          {comment}
        </span>,
      );
    } else if (str !== undefined) {
      nodes.push(
        <span key={key++} className="text-emerald-400">
          {str}
        </span>,
      );
    } else if (componentName !== undefined) {
      nodes.push(
        <span key={key++} className="text-zinc-500">
          {tagPrefix}
        </span>,
      );
      nodes.push(
        <span key={key++} className="text-sky-300">
          {componentName}
        </span>,
      );
    } else if (keyword !== undefined) {
      nodes.push(
        <span key={key++} className="text-violet-400">
          {keyword}
        </span>,
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < code.length) {
    nodes.push(
      <span key={key} className="text-zinc-300">
        {code.slice(lastIndex)}
      </span>,
    );
  }

  return nodes;
}

function CodeBlock({ panel }: { panel: CodePanel }) {
  return (
    <div className="overflow-x-auto bg-zinc-950 p-5">
      {panel.filename && (
        <div className="mb-3 font-mono text-xs text-zinc-500">
          {panel.filename}
        </div>
      )}
      <pre className="font-mono text-sm leading-relaxed">
        <code>{highlightCode(panel.code)}</code>
      </pre>
    </div>
  );
}

function DemoTabs({ demo }: { demo: CodeDemoItem }) {
  const [active, setActive] = useState(0);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700/60">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-zinc-700/60 bg-zinc-900">
        {demo.panels.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 cursor-pointer px-4 py-2.5 text-xs font-medium transition-colors ${
              i === active
                ? "border-b-2 border-sky-400 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <CodeBlock panel={demo.panels[active]} />
    </div>
  );
}

export function CodeDemoViewer({ demos }: { demos: CodeDemoItem[] }) {
  return (
    <div className="mt-4 space-y-4">
      {demos.map((demo, i) => (
        <div key={i}>
          {demo.title && (
            <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              {demo.title}
            </p>
          )}
          <DemoTabs demo={demo} />
        </div>
      ))}
    </div>
  );
}
