import {
    PALETTE,
    SEMANTIC_LIGHT,
    SEMANTIC_DARK,
    SPACING,
    RADIUS,
    TYPE_SCALE,
    resolveColor,
} from "./tokens-data";

type Progress = (msg: string) => void;

// ── Primitive helpers ─────────────────────────────────────────────────────────

function parseHex(hex: string): RGBA {
    const h = hex.replace("#", "");
    if (h.length === 8)
        return {
            r: parseInt(h.slice(0, 2), 16) / 255,
            g: parseInt(h.slice(2, 4), 16) / 255,
            b: parseInt(h.slice(4, 6), 16) / 255,
            a: parseInt(h.slice(6, 8), 16) / 255,
        };
    return {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255,
        a: 1,
    };
}

function sf(hex: string): Paint[] {
    const { r, g, b, a } = parseHex(hex);
    return [{ type: "SOLID", color: { r, g, b }, opacity: a }];
}

function txt(
    chars: string,
    size: number,
    style: "Regular" | "Medium" | "Semi Bold" | "Bold",
    hex: string,
): TextNode {
    const t = figma.createText();
    t.fontName = { family: "Inter", style };
    t.fontSize = size;
    t.characters = chars;
    t.fills = sf(hex);
    return t;
}

function hframe(gap = 0, padH = 0, padV = 0): FrameNode {
    const f = figma.createFrame();
    f.layoutMode = "HORIZONTAL";
    f.itemSpacing = gap;
    f.paddingLeft = f.paddingRight = padH;
    f.paddingTop = f.paddingBottom = padV;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.fills = [];
    return f;
}

function vframe(gap = 0, padH = 0, padV = 0): FrameNode {
    const f = figma.createFrame();
    f.layoutMode = "VERTICAL";
    f.itemSpacing = gap;
    f.paddingLeft = f.paddingRight = padH;
    f.paddingTop = f.paddingBottom = padV;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.fills = [];
    return f;
}

// Card-style section container
function section(title: string): FrameNode {
    const f = vframe(20, 24, 24);
    figma.currentPage.appendChild(f);
    f.name = title;
    f.fills = sf("#ffffff");
    f.strokes = sf("#e5e7eb");
    f.strokeWeight = 1;
    f.strokeAlign = "INSIDE";
    f.cornerRadius = 12;
    f.primaryAxisAlignItems = "MIN";
    f.counterAxisAlignItems = "MIN";
    f.appendChild(txt(title, 18, "Semi Bold", "#111827"));
    return f;
}

// ── Color swatch ──────────────────────────────────────────────────────────────

function swatch(name: string, hex: string, size = 44): FrameNode {
    const resolved = resolveColor(hex);
    const f = vframe(4);
    f.counterAxisAlignItems = "MIN";

    const rect = figma.createRectangle();
    rect.resize(size, size);
    const { r, g, b, a } = parseHex(resolved);
    rect.fills = [{ type: "SOLID", color: { r, g, b }, opacity: a }];
    rect.cornerRadius = 6;
    // Thin border for near-white swatches
    if (r > 0.9 && g > 0.9 && b > 0.9) {
        rect.strokes = sf("#e5e7eb");
        rect.strokeWeight = 1;
        rect.strokeAlign = "INSIDE";
    }
    f.appendChild(rect);
    f.appendChild(txt(name, 10, "Regular", "#6b7280"));
    f.appendChild(txt(resolved.toUpperCase(), 9, "Regular", "#9ca3af"));
    return f;
}

// ── 1. Color Palette ──────────────────────────────────────────────────────────

function createPaletteSection(): FrameNode {
    const card = section("Color Palette");

    for (const [colorName, shades] of Object.entries(PALETTE)) {
        const group = vframe(8);
        group.counterAxisAlignItems = "MIN";
        group.appendChild(txt(colorName, 12, "Medium", "#374151"));

        const row = hframe(6);
        row.counterAxisAlignItems = "MIN";
        for (const [shade, hex] of Object.entries(shades)) {
            row.appendChild(swatch(shade, hex));
        }
        group.appendChild(row);
        card.appendChild(group);
    }

    return card;
}

// ── 2. Semantic Colors ────────────────────────────────────────────────────────

function semanticRow(tokenName: string): FrameNode {
    const row = hframe(12);
    row.counterAxisAlignItems = "CENTER";

    // Token name — fixed width column
    const label = txt(tokenName, 12, "Regular", "#374151");
    row.appendChild(label);
    label.resize(160, label.height);
    label.layoutSizingHorizontal = "FIXED";

    // Light swatch
    const lightHex = resolveColor(SEMANTIC_LIGHT[tokenName] ?? "#ffffff");
    const lightRect = figma.createRectangle();
    lightRect.resize(40, 24);
    const lc = parseHex(lightHex);
    lightRect.fills = [
        { type: "SOLID", color: { r: lc.r, g: lc.g, b: lc.b }, opacity: lc.a },
    ];
    lightRect.cornerRadius = 4;
    if (lc.r > 0.9 && lc.g > 0.9 && lc.b > 0.9) {
        lightRect.strokes = sf("#e5e7eb");
        lightRect.strokeWeight = 1;
        lightRect.strokeAlign = "INSIDE";
    }
    row.appendChild(lightRect);
    row.appendChild(txt(lightHex.toUpperCase(), 10, "Regular", "#6b7280"));

    // Spacer text
    const sep = txt("/", 10, "Regular", "#d1d5db");
    sep.resize(12, sep.height);
    sep.textAlignHorizontal = "CENTER";
    row.appendChild(sep);

    // Dark swatch
    const darkHex = resolveColor(SEMANTIC_DARK[tokenName] ?? "#000000");
    const darkRect = figma.createRectangle();
    darkRect.resize(40, 24);
    const dc = parseHex(darkHex);
    darkRect.fills = [
        { type: "SOLID", color: { r: dc.r, g: dc.g, b: dc.b }, opacity: dc.a },
    ];
    darkRect.cornerRadius = 4;
    row.appendChild(darkRect);
    row.appendChild(txt(darkHex.toUpperCase(), 10, "Regular", "#6b7280"));

    return row;
}

function createSemanticSection(): FrameNode {
    const card = section("Semantic Colors");

    // Column headers
    const header = hframe(12);
    header.counterAxisAlignItems = "CENTER";
    const spacer = txt("", 12, "Regular", "#ffffff");
    spacer.resize(160, 16);
    spacer.layoutSizingHorizontal = "FIXED";
    header.appendChild(spacer);
    header.appendChild(txt("Light", 11, "Medium", "#9ca3af"));
    const sep2 = txt("", 10, "Regular", "#ffffff");
    sep2.resize(12 + 40 + 12 + 12, 16);
    header.appendChild(sep2);
    header.appendChild(txt("Dark", 11, "Medium", "#9ca3af"));
    card.appendChild(header);

    // Divider
    const div = figma.createRectangle();
    div.resize(560, 1);
    div.fills = sf("#e5e7eb");
    card.appendChild(div);

    for (const key of Object.keys(SEMANTIC_LIGHT)) {
        card.appendChild(semanticRow(key));
    }

    return card;
}

// ── 3. Typography ─────────────────────────────────────────────────────────────

const CATEGORY_DESCS: Record<string, string> = {
    Display: "텍스트를 가장 주요하게 나타낼 때 — Hero, 랜딩 페이지",
    Title: "텍스트를 주요하게 나타낼 때 — 페이지/섹션/카드 타이틀",
    Heading: "섹션에서 주제를 나타낼 때",
    Headline: "본문 상위로 내용을 강조해야 할 때",
    Body: "기준 크기로 본문을 나타낼 때",
    Label: "참고 내용·UI 레이블을 나타낼 때",
    Caption: "부가적인 내용을 나타낼 때",
};

const SAMPLE_TEXTS: Record<string, string> = {
    Display: "더 나은 경험을 만드는 서비스",
    Title: "계정 설정",
    Heading: "프로필",
    Headline: "알림 받기",
    Body: "이 영역에는 본문이 들어갑니다. 서비스 안내, 도움말, 긴 설명 문단 등 다양한 텍스트를 표시할 수 있습니다.",
    Label: "이메일 주소",
    Caption: "마지막 저장: 오늘 오후 3:42",
};

function createTypographySection(): FrameNode {
    const card = section("Typography");

    let currentCategory = "";

    for (const style of TYPE_SCALE) {
        // Category header
        if (style.category !== currentCategory) {
            currentCategory = style.category;

            // Spacer between categories (except first)
            if (currentCategory !== "Display") {
                const spacer = figma.createRectangle();
                spacer.resize(700, 1);
                spacer.fills = [
                    { type: "SOLID", color: { r: 0.929, g: 0.937, b: 0.949 } },
                ]; // #e5e7eb
                card.appendChild(spacer);
            }

            const catHeader = vframe(4);
            catHeader.counterAxisAlignItems = "MIN";
            catHeader.appendChild(
                txt(currentCategory, 13, "Semi Bold", "#111827"),
            );
            catHeader.appendChild(
                txt(
                    CATEGORY_DESCS[currentCategory] ?? "",
                    11,
                    "Regular",
                    "#9ca3af",
                ),
            );
            card.appendChild(catHeader);
        }

        // Type style row
        const row = hframe(20);
        row.counterAxisAlignItems = "CENTER";

        // Left: meta info
        const meta = vframe(2);
        meta.counterAxisAlignItems = "MIN";
        meta.resize(140, 10);
        meta.counterAxisSizingMode = "AUTO";
        meta.primaryAxisSizingMode = "FIXED";

        meta.appendChild(txt(style.label, 11, "Medium", "#374151"));
        meta.appendChild(
            txt(
                `${style.size}px · ${style.weight} · lh ${style.lineHeight}`,
                10,
                "Regular",
                "#9ca3af",
            ),
        );
        meta.appendChild(txt(style.usage, 10, "Regular", "#d1d5db"));
        row.appendChild(meta);

        // Right: sample text
        const sample = txt(
            SAMPLE_TEXTS[style.category] ?? "The quick brown fox",
            style.size,
            style.weight,
            "#111827",
        );
        row.appendChild(sample);

        card.appendChild(row);
    }

    return card;
}

// ── 4. Spacing ────────────────────────────────────────────────────────────────

function createSpacingSection(): FrameNode {
    const card = section("Spacing");
    const MAX_BAR = 320;

    for (const [key, value] of Object.entries(SPACING)) {
        const row = hframe(12);
        row.counterAxisAlignItems = "CENTER";

        const label = txt(`${key}  ·  ${value}px`, 11, "Regular", "#9ca3af");
        label.resize(80, label.height);
        label.layoutSizingHorizontal = "FIXED";
        row.appendChild(label);

        const bar = figma.createRectangle();
        bar.resize(Math.min(value * 2, MAX_BAR), 16);
        bar.fills = sf("#2563eb");
        bar.cornerRadius = 3;
        row.appendChild(bar);

        card.appendChild(row);
    }

    return card;
}

// ── 5. Border Radius ──────────────────────────────────────────────────────────

function createRadiusSection(): FrameNode {
    const card = section("Border Radius");
    const row = hframe(24);
    row.counterAxisAlignItems = "MIN";

    for (const [key, value] of Object.entries(RADIUS)) {
        const group = vframe(8);
        group.counterAxisAlignItems = "CENTER";

        const rect = figma.createRectangle();
        rect.resize(56, 56);
        rect.fills = sf("#eff6ff");
        rect.strokes = sf("#2563eb");
        rect.strokeWeight = 1.5;
        rect.strokeAlign = "INSIDE";
        rect.cornerRadius = Math.min(value, 28);
        group.appendChild(rect);

        group.appendChild(txt(key, 11, "Medium", "#374151"));
        group.appendChild(
            txt(value === 9999 ? "∞" : `${value}px`, 10, "Regular", "#9ca3af"),
        );
        row.appendChild(group);
    }

    card.appendChild(row);
    return card;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function generateTokenShowcase(onProgress: Progress) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });

    const PAGE_X = 100;
    let pageY = 100;

    const place = (node: FrameNode) => {
        node.x = PAGE_X;
        node.y = pageY;
        pageY += node.height + 48;
    };

    onProgress("Generating Color Palette...");
    place(createPaletteSection());

    onProgress("Generating Semantic Colors...");
    place(createSemanticSection());

    onProgress("Generating Typography...");
    place(createTypographySection());

    onProgress("Generating Spacing...");
    place(createSpacingSection());

    onProgress("Generating Border Radius...");
    place(createRadiusSection());

    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
}
