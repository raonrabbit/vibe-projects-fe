type Progress = (msg: string) => void;

// ── Variable cache (populated at the start of generateComponents) ─────────────

let semanticVars = new Map<string, Variable>();
let typographyVars = new Map<string, Variable>();

function initVariableCache() {
    const allVars = figma.variables.getLocalVariables();
    const allColls = figma.variables.getLocalVariableCollections();

    const semId = allColls.find((c) => c.name === "Semantic")?.id ?? "";
    const typoId = allColls.find((c) => c.name === "Typography")?.id ?? "";

    semanticVars.clear();
    typographyVars.clear();

    for (const v of allVars) {
        if (v.variableCollectionId === semId) semanticVars.set(v.name, v);
        if (v.variableCollectionId === typoId) typographyVars.set(v.name, v);
    }
}

// ── Color helpers ─────────────────────────────────────────────────────────────

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

// Returns a solid fill, optionally bound to a Semantic variable
function colorFill(hex: string, semVar = ""): SolidPaint[] {
    const { r, g, b, a } = parseHex(hex);
    let paint: SolidPaint = { type: "SOLID", color: { r, g, b }, opacity: a };
    if (semVar) {
        const v = semanticVars.get(semVar);
        if (v)
            paint = figma.variables.setBoundVariableForPaint(
                paint,
                "color",
                v,
            ) as SolidPaint;
    }
    return [paint];
}

// ── Text helper ───────────────────────────────────────────────────────────────

function makeText(
    chars: string,
    size: number,
    weight: "Regular" | "Medium" | "Semi Bold",
    colorHex: string,
    colorVar = "",
    fontSizeVar = "",
): TextNode {
    const t = figma.createText();
    t.fontName = { family: "Inter", style: weight };
    t.fontSize = size;
    t.characters = chars;
    t.fills = colorFill(colorHex, colorVar);

    if (fontSizeVar) {
        const v = typographyVars.get(fontSizeVar);
        if (v) t.setBoundVariable("fontSize", v);
    }
    return t;
}

// ── Layout helper ─────────────────────────────────────────────────────────────

function applyAutoLayout(
    node: FrameNode | ComponentNode,
    opts: {
        direction?: "HORIZONTAL" | "VERTICAL";
        paddingH?: number;
        paddingV?: number;
        gap?: number;
        align?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
        counterAlign?: "MIN" | "CENTER" | "MAX" | "BASELINE";
    } = {},
) {
    node.layoutMode = opts.direction ?? "HORIZONTAL";
    node.primaryAxisAlignItems = opts.align ?? "CENTER";
    node.counterAxisAlignItems = opts.counterAlign ?? "CENTER";
    node.paddingLeft = node.paddingRight = opts.paddingH ?? 0;
    node.paddingTop = node.paddingBottom = opts.paddingV ?? 0;
    node.itemSpacing = opts.gap ?? 0;
    node.primaryAxisSizingMode = "AUTO";
    node.counterAxisSizingMode = "AUTO";
}

// ── Section label (page annotation, not a component) ─────────────────────────

function sectionLabel(text: string): TextNode {
    return makeText(
        text,
        20,
        "Semi Bold",
        "#111827",
        "text-primary",
        "fontSize/xl",
    );
}

// ── BUTTON ────────────────────────────────────────────────────────────────────

type BtnDef = {
    variant: string;
    size: string;
    paddingH: number;
    paddingV: number;
    fontSize: number;
    fontSizeVar: string;
    bg: string | null;
    bgVar?: string;
    fg: string;
    fgVar: string;
    border?: string;
    borderVar?: string;
};

const BTN_DEFS: BtnDef[] = [
    {
        variant: "Primary",
        size: "SM",
        paddingH: 12,
        paddingV: 10,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#059669",
        bgVar: "accent",
        fg: "#ffffff",
        fgVar: "accent-foreground",
    },
    {
        variant: "Primary",
        size: "MD",
        paddingH: 16,
        paddingV: 13,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#059669",
        bgVar: "accent",
        fg: "#ffffff",
        fgVar: "accent-foreground",
    },
    {
        variant: "Primary",
        size: "LG",
        paddingH: 24,
        paddingV: 16,
        fontSize: 16,
        fontSizeVar: "fontSize/base",
        bg: "#059669",
        bgVar: "accent",
        fg: "#ffffff",
        fgVar: "accent-foreground",
    },
    {
        variant: "Secondary",
        size: "SM",
        paddingH: 12,
        paddingV: 10,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#f9fafb",
        bgVar: "surface-raised",
        fg: "#111827",
        fgVar: "text-primary",
        border: "#e5e7eb",
        borderVar: "border",
    },
    {
        variant: "Secondary",
        size: "MD",
        paddingH: 16,
        paddingV: 13,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#f9fafb",
        bgVar: "surface-raised",
        fg: "#111827",
        fgVar: "text-primary",
        border: "#e5e7eb",
        borderVar: "border",
    },
    {
        variant: "Secondary",
        size: "LG",
        paddingH: 24,
        paddingV: 16,
        fontSize: 16,
        fontSizeVar: "fontSize/base",
        bg: "#f9fafb",
        bgVar: "surface-raised",
        fg: "#111827",
        fgVar: "text-primary",
        border: "#e5e7eb",
        borderVar: "border",
    },
    {
        variant: "Ghost",
        size: "SM",
        paddingH: 12,
        paddingV: 10,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: null,
        fg: "#6b7280",
        fgVar: "text-secondary",
    },
    {
        variant: "Ghost",
        size: "MD",
        paddingH: 16,
        paddingV: 13,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: null,
        fg: "#6b7280",
        fgVar: "text-secondary",
    },
    {
        variant: "Ghost",
        size: "LG",
        paddingH: 24,
        paddingV: 16,
        fontSize: 16,
        fontSizeVar: "fontSize/base",
        bg: null,
        fg: "#6b7280",
        fgVar: "text-secondary",
    },
    {
        variant: "Destructive",
        size: "SM",
        paddingH: 12,
        paddingV: 10,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#ef4444",
        bgVar: "error",
        fg: "#ffffff",
        fgVar: "text-inverse",
    },
    {
        variant: "Destructive",
        size: "MD",
        paddingH: 16,
        paddingV: 13,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#ef4444",
        bgVar: "error",
        fg: "#ffffff",
        fgVar: "text-inverse",
    },
    {
        variant: "Destructive",
        size: "LG",
        paddingH: 24,
        paddingV: 16,
        fontSize: 16,
        fontSizeVar: "fontSize/base",
        bg: "#ef4444",
        bgVar: "error",
        fg: "#ffffff",
        fgVar: "text-inverse",
    },
];

async function createButtonSet(): Promise<ComponentSetNode> {
    const components: ComponentNode[] = [];
    const variants = ["Primary", "Secondary", "Ghost", "Destructive"];
    const sizes = ["SM", "MD", "LG"];
    const COL_GAP = 16;
    const ROW_GAP = 12;

    for (let row = 0; row < variants.length; row++) {
        let colX = 0;
        for (let col = 0; col < sizes.length; col++) {
            const def = BTN_DEFS.find(
                (d) => d.variant === variants[row] && d.size === sizes[col],
            )!;
            const comp = figma.createComponent();
            comp.name = `Variant=${def.variant}, Size=${def.size}`;
            figma.currentPage.appendChild(comp);

            applyAutoLayout(comp, {
                paddingH: def.paddingH,
                paddingV: def.paddingV,
            });
            comp.cornerRadius = 8;
            comp.fills = def.bg ? colorFill(def.bg, def.bgVar) : [];
            if (def.border) {
                comp.strokes = colorFill(def.border, def.borderVar);
                comp.strokeWeight = 1;
                comp.strokeAlign = "INSIDE";
            }

            comp.appendChild(
                makeText(
                    def.variant,
                    def.fontSize,
                    "Medium",
                    def.fg,
                    def.fgVar,
                    def.fontSizeVar,
                ),
            );

            comp.x = colX;
            comp.y = row * (comp.height + ROW_GAP);
            colX += comp.width + COL_GAP;
            components.push(comp);
        }
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Button";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    set.itemSpacing = ROW_GAP;
    return set;
}

// ── BADGE ─────────────────────────────────────────────────────────────────────

type BadgeDef = {
    variant: string;
    size: string;
    paddingH: number;
    paddingV: number;
    fontSize: number;
    fontSizeVar: string;
    bg: string;
    bgVar: string;
    fg: string;
    fgVar: string;
};

const BADGE_DEFS: BadgeDef[] = [
    {
        variant: "Default",
        size: "SM",
        paddingH: 8,
        paddingV: 2,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#f3f4f6",
        bgVar: "surface-overlay",
        fg: "#6b7280",
        fgVar: "text-secondary",
    },
    {
        variant: "Default",
        size: "MD",
        paddingH: 10,
        paddingV: 4,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#f3f4f6",
        bgVar: "surface-overlay",
        fg: "#6b7280",
        fgVar: "text-secondary",
    },
    {
        variant: "Primary",
        size: "SM",
        paddingH: 8,
        paddingV: 2,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#ecfdf5",
        bgVar: "accent-subtle",
        fg: "#059669",
        fgVar: "accent",
    },
    {
        variant: "Primary",
        size: "MD",
        paddingH: 10,
        paddingV: 4,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#ecfdf5",
        bgVar: "accent-subtle",
        fg: "#059669",
        fgVar: "accent",
    },
    {
        variant: "Success",
        size: "SM",
        paddingH: 8,
        paddingV: 2,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#ecfdf5",
        bgVar: "success-subtle",
        fg: "#059669",
        fgVar: "success",
    },
    {
        variant: "Success",
        size: "MD",
        paddingH: 10,
        paddingV: 4,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#ecfdf5",
        bgVar: "success-subtle",
        fg: "#059669",
        fgVar: "success",
    },
    {
        variant: "Warning",
        size: "SM",
        paddingH: 8,
        paddingV: 2,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#fffbeb",
        bgVar: "warning-subtle",
        fg: "#d97706",
        fgVar: "warning",
    },
    {
        variant: "Warning",
        size: "MD",
        paddingH: 10,
        paddingV: 4,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#fffbeb",
        bgVar: "warning-subtle",
        fg: "#d97706",
        fgVar: "warning",
    },
    {
        variant: "Error",
        size: "SM",
        paddingH: 8,
        paddingV: 2,
        fontSize: 12,
        fontSizeVar: "fontSize/xs",
        bg: "#fef2f2",
        bgVar: "error-subtle",
        fg: "#ef4444",
        fgVar: "error",
    },
    {
        variant: "Error",
        size: "MD",
        paddingH: 10,
        paddingV: 4,
        fontSize: 14,
        fontSizeVar: "fontSize/sm",
        bg: "#fef2f2",
        bgVar: "error-subtle",
        fg: "#ef4444",
        fgVar: "error",
    },
];

async function createBadgeSet(): Promise<ComponentSetNode> {
    const components: ComponentNode[] = [];
    const variants = ["Default", "Primary", "Success", "Warning", "Error"];
    const sizes = ["SM", "MD"];
    const COL_GAP = 12;
    const ROW_GAP = 10;

    for (let row = 0; row < variants.length; row++) {
        let colX = 0;
        for (let col = 0; col < sizes.length; col++) {
            const def = BADGE_DEFS.find(
                (d) => d.variant === variants[row] && d.size === sizes[col],
            )!;
            const comp = figma.createComponent();
            comp.name = `Variant=${def.variant}, Size=${def.size}`;
            figma.currentPage.appendChild(comp);

            applyAutoLayout(comp, {
                paddingH: def.paddingH,
                paddingV: def.paddingV,
            });
            comp.cornerRadius = 4;
            comp.fills = colorFill(def.bg, def.bgVar);
            comp.appendChild(
                makeText(
                    def.variant,
                    def.fontSize,
                    "Medium",
                    def.fg,
                    def.fgVar,
                    def.fontSizeVar,
                ),
            );

            comp.x = colX;
            comp.y = row * (comp.height + ROW_GAP);
            colX += comp.width + COL_GAP;
            components.push(comp);
        }
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Badge";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    set.itemSpacing = ROW_GAP;
    return set;
}

// ── CARD ──────────────────────────────────────────────────────────────────────

async function createCardComponent(): Promise<ComponentNode> {
    const comp = figma.createComponent();
    comp.name = "Card";
    figma.currentPage.appendChild(comp);

    applyAutoLayout(comp, {
        direction: "VERTICAL",
        paddingH: 20,
        paddingV: 20,
        gap: 12,
        align: "MIN",
        counterAlign: "MIN",
    });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(320, comp.height);
    comp.fills = colorFill("#ffffff", "surface");
    comp.strokes = colorFill("#e5e7eb", "border");
    comp.strokeWeight = 1;
    comp.strokeAlign = "INSIDE";
    comp.cornerRadius = 16;

    const title = makeText(
        "Card Title",
        16,
        "Semi Bold",
        "#111827",
        "text-primary",
        "fontSize/base",
    );
    comp.appendChild(title);

    const desc = makeText(
        "Card description goes here. This is a sample text that shows how the card content is laid out.",
        14,
        "Regular",
        "#6b7280",
        "text-secondary",
        "fontSize/sm",
    );
    comp.appendChild(desc);
    desc.layoutSizingHorizontal = "FILL";
    desc.textAutoResize = "HEIGHT";

    return comp;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function generateComponents(
    names: string[],
    onProgress: Progress,
) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

    initVariableCache();

    const hasVars = semanticVars.size > 0;
    if (!hasVars)
        onProgress(
            "⚠ Tokens not found — generating without variable bindings...",
        );

    const PAGE_X = 100;
    let pageY = 100;

    const placeSection = async (
        label: string,
        create: () => Promise<FrameNode | ComponentNode | ComponentSetNode>,
    ) => {
        const title = sectionLabel(label);
        figma.currentPage.appendChild(title);
        title.x = PAGE_X;
        title.y = pageY;
        pageY += title.height + 16;

        const node = await create();
        node.x = PAGE_X;
        node.y = pageY;
        pageY += node.height + 72;
    };

    if (names.includes("Button")) {
        onProgress("Generating Button...");
        await placeSection("Button", createButtonSet);
    }
    if (names.includes("Badge")) {
        onProgress("Generating Badge...");
        await placeSection("Badge", createBadgeSet);
    }
    if (names.includes("Card")) {
        onProgress("Generating Card...");
        await placeSection("Card", createCardComponent);
    }

    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
}
