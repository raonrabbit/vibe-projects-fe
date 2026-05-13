/**
 * Extracts __iconNode data from lucide-react and writes src/icon-data.ts.
 * Run with: node scripts/gen-icon-data.mjs
 * Re-run after upgrading lucide-react to keep icon paths in sync.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = resolve(__dirname, "../node_modules/lucide-react/dist/esm/icons");

const ICON_MAP = [
    { name: "ChevronRight",  file: "chevron-right" },
    { name: "ChevronLeft",   file: "chevron-left" },
    { name: "ChevronDown",   file: "chevron-down" },
    { name: "ChevronUp",     file: "chevron-up" },
    { name: "ArrowRight",    file: "arrow-right" },
    { name: "Search",        file: "search" },
    { name: "Close",         file: "x" },
    { name: "Check",         file: "check" },
    { name: "Info",          file: "info" },
    { name: "AlertTriangle", file: "triangle-alert" },
    { name: "ExternalLink",  file: "external-link" },
    { name: "Bookmark",      file: "bookmark" },
    { name: "Star",          file: "star" },
    { name: "Share",         file: "share-2" },
    { name: "Menu",          file: "menu" },
    { name: "User",          file: "user" },
    { name: "Moon",          file: "moon" },
    { name: "Sun",           file: "sun" },
];

const results = [];
for (const { name, file } of ICON_MAP) {
    const path = `file:///${ICONS_DIR.replace(/\\/g, "/")}/${file}.mjs`;
    const mod = await import(path);
    const node = mod.__iconNode;
    if (!node) {
        console.warn(`⚠ No __iconNode for ${name} (${file}.mjs)`);
        continue;
    }
    results.push({ name, node });
    console.log(`✓ ${name}`);
}

const lines = [
    "// Auto-generated from lucide-react v$(lucide). Re-run: node scripts/gen-icon-data.mjs",
    "// prettier-ignore",
    "export type IconElem = readonly [string, Readonly<Record<string, string | number>>];",
    "export type IconNode = readonly IconElem[];",
    "",
    "export const lucideIconNodes: Record<string, IconNode> = {",
    ...results.map(({ name, node }) =>
        `    ${name}: ${JSON.stringify(node)},`
    ),
    "};",
    "",
];

const outPath = resolve(__dirname, "../src/icon-data.ts");
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`\nWrote ${outPath}`);
