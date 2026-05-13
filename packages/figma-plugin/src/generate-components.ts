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
    const variants = ["Primary", "Secondary", "Ghost", "Destructive"];
    const sizes = ["SM", "MD", "LG"];
    const COL_GAP = 16;
    const ROW_GAP = 12;

    // Build grid[colIdx][rowIdx] — col = size, row = variant
    const grid: ComponentNode[][] = sizes.map(() => []);

    for (let col = 0; col < sizes.length; col++) {
        for (let row = 0; row < variants.length; row++) {
            const def = BTN_DEFS.find(
                (d) => d.variant === variants[row] && d.size === sizes[col],
            )!;
            const comp = figma.createComponent();
            comp.name = `Variant=${def.variant}, Size=${def.size}`;
            figma.currentPage.appendChild(comp);

            applyAutoLayout(comp, { paddingH: def.paddingH, paddingV: def.paddingV });
            comp.cornerRadius = 8;
            comp.fills = def.bg ? colorFill(def.bg, def.bgVar) : [];
            if (def.border) {
                comp.strokes = colorFill(def.border, def.borderVar);
                comp.strokeWeight = 1;
                comp.strokeAlign = "INSIDE";
            }
            comp.appendChild(
                makeText(def.variant, def.fontSize, "Medium", def.fg, def.fgVar, def.fontSizeVar),
            );
            grid[col].push(comp);
        }
    }

    // Equalize widths within each size column so all variants align cleanly
    for (let col = 0; col < sizes.length; col++) {
        const maxW = Math.max(...grid[col].map((c) => c.width));
        for (const comp of grid[col]) {
            comp.primaryAxisSizingMode = "FIXED";
            comp.resize(maxW, comp.height);
        }
    }

    // Position components in grid then combine
    const components: ComponentNode[] = [];
    let colX = 0;
    for (let col = 0; col < sizes.length; col++) {
        const colW = grid[col][0].width;
        const rowH = grid[col][0].height;
        for (let row = 0; row < variants.length; row++) {
            const comp = grid[col][row];
            comp.x = colX;
            comp.y = row * (rowH + ROW_GAP);
            components.push(comp);
        }
        colX += colW + COL_GAP;
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Button";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
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

// ── DIVIDER ───────────────────────────────────────────────────────────────────

async function createDividerSet(): Promise<ComponentSetNode> {
    const components: ComponentNode[] = [];

    // Horizontal plain (240×1)
    {
        const comp = figma.createComponent();
        comp.name = "Variant=Horizontal";
        figma.currentPage.appendChild(comp);
        comp.resize(240, 1);
        comp.fills = colorFill("#e5e7eb", "border");
        comp.x = 0;
        comp.y = 0;
        components.push(comp);
    }

    // Labeled (line · label · line)
    {
        const comp = figma.createComponent();
        comp.name = "Variant=Labeled";
        figma.currentPage.appendChild(comp);
        applyAutoLayout(comp, {
            direction: "HORIZONTAL",
            gap: 12,
            align: "CENTER",
            counterAlign: "CENTER",
        });
        comp.counterAxisSizingMode = "FIXED";
        comp.resize(240, comp.height);
        comp.fills = [];

        const leftLine = figma.createFrame();
        leftLine.fills = colorFill("#e5e7eb", "border");
        leftLine.resize(80, 1);
        comp.appendChild(leftLine);
        leftLine.layoutSizingHorizontal = "FILL";

        comp.appendChild(
            makeText("또는", 12, "Regular", "#6b7280", "text-secondary", "fontSize/xs"),
        );

        const rightLine = figma.createFrame();
        rightLine.fills = colorFill("#e5e7eb", "border");
        rightLine.resize(80, 1);
        comp.appendChild(rightLine);
        rightLine.layoutSizingHorizontal = "FILL";

        comp.x = 256;
        comp.y = 0;
        components.push(comp);
    }

    // Vertical (1×40)
    {
        const comp = figma.createComponent();
        comp.name = "Variant=Vertical";
        figma.currentPage.appendChild(comp);
        comp.resize(1, 40);
        comp.fills = colorFill("#e5e7eb", "border");
        comp.x = 512;
        comp.y = 0;
        components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Divider";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    return set;
}

// ── SPINNER ───────────────────────────────────────────────────────────────────

async function createSpinnerSet(): Promise<ComponentSetNode> {
    const defs = [
        { size: "SM", dim: 16, r: 6, cx: 8,  cy: 8,  sw: 2 },
        { size: "MD", dim: 24, r: 9, cx: 12, cy: 12, sw: 2 },
        { size: "LG", dim: 32, r: 12, cx: 16, cy: 16, sw: 3 },
    ];
    const components: ComponentNode[] = [];
    let colX = 0;

    for (const d of defs) {
        const comp = figma.createComponent();
        comp.name = `Size=${d.size}`;
        figma.currentPage.appendChild(comp);
        comp.resize(d.dim, d.dim);
        comp.fills = [];

        const kr = 0.5522847498 * d.r;
        const { r, cx, cy } = d;

        // full-circle background ring (4 cubic bezier arcs)
        const bgVec = figma.createVector();
        bgVec.vectorPaths = [{
            windingRule: "NONZERO",
            data: `M ${cx} ${cy - r} C ${cx + kr} ${cy - r} ${cx + r} ${cy - kr} ${cx + r} ${cy} C ${cx + r} ${cy + kr} ${cx + kr} ${cy + r} ${cx} ${cy + r} C ${cx - kr} ${cy + r} ${cx - r} ${cy + kr} ${cx - r} ${cy} C ${cx - r} ${cy - kr} ${cx - kr} ${cy - r} ${cx} ${cy - r} Z`,
        }];
        bgVec.fills = [];
        bgVec.strokes = colorFill("#d1d5db", "border-strong");
        bgVec.strokeWeight = d.sw;
        bgVec.strokeCap = "ROUND";
        bgVec.strokeJoin = "ROUND";
        comp.appendChild(bgVec);

        // 3/4-circle accent arc (CW: top → right → bottom → left)
        const accentVec = figma.createVector();
        accentVec.vectorPaths = [{
            windingRule: "NONZERO",
            data: `M ${cx} ${cy - r} C ${cx + kr} ${cy - r} ${cx + r} ${cy - kr} ${cx + r} ${cy} C ${cx + r} ${cy + kr} ${cx + kr} ${cy + r} ${cx} ${cy + r} C ${cx - kr} ${cy + r} ${cx - r} ${cy + kr} ${cx - r} ${cy}`,
        }];
        accentVec.fills = [];
        accentVec.strokes = colorFill("#059669", "accent");
        accentVec.strokeWeight = d.sw;
        accentVec.strokeCap = "ROUND";
        accentVec.strokeJoin = "ROUND";
        comp.appendChild(accentVec);

        comp.x = colX;
        colX += d.dim + 16;
        components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Spinner";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    return set;
}

// ── INPUT ─────────────────────────────────────────────────────────────────────

async function createInputSet(): Promise<ComponentSetNode> {
    const W = 240;
    const defs = [
        {
            variant: "State=Default",
            borderHex: "#e5e7eb",
            borderVar: "border",
            hintText: "도움말 텍스트",
            hintHex: "#6b7280",
            hintVar: "text-secondary",
            opacity: 1,
        },
        {
            variant: "State=Error",
            borderHex: "#ef4444",
            borderVar: "error",
            hintText: "오류 메시지를 표시합니다",
            hintHex: "#ef4444",
            hintVar: "error",
            opacity: 1,
        },
        {
            variant: "State=Disabled",
            borderHex: "#e5e7eb",
            borderVar: "border",
            hintText: "도움말 텍스트",
            hintHex: "#6b7280",
            hintVar: "text-secondary",
            opacity: 0.4,
        },
    ];
    const components: ComponentNode[] = [];
    let colX = 0;

    for (const def of defs) {
        const comp = figma.createComponent();
        comp.name = def.variant;
        figma.currentPage.appendChild(comp);
        applyAutoLayout(comp, { direction: "VERTICAL", gap: 6, align: "MIN", counterAlign: "MIN" });
        comp.opacity = def.opacity;

        // label
        comp.appendChild(
            makeText("레이블", 14, "Medium", "#111827", "text-primary", "fontSize/sm"),
        );

        // input field
        const field = figma.createFrame();
        applyAutoLayout(field, {
            direction: "HORIZONTAL",
            paddingH: 12,
            align: "CENTER",
            counterAlign: "CENTER",
        });
        field.counterAxisSizingMode = "FIXED";
        field.primaryAxisSizingMode = "FIXED";
        field.resize(W, 40);
        field.fills = colorFill("#ffffff", "surface");
        field.strokes = colorFill(def.borderHex, def.borderVar);
        field.strokeWeight = 1;
        field.strokeAlign = "INSIDE";
        field.cornerRadius = 8;
        field.appendChild(
            makeText("입력값을 작성해 주세요", 14, "Regular", "#9ca3af", "text-disabled", "fontSize/sm"),
        );
        comp.appendChild(field);

        // hint / error text
        comp.appendChild(
            makeText(def.hintText, 12, "Regular", def.hintHex, def.hintVar, "fontSize/xs"),
        );

        comp.x = colX;
        colX += W + 16;
        components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Input";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    return set;
}

// ── LIST ──────────────────────────────────────────────────────────────────────

function makeListItem(title: string, description?: string, width = 0): FrameNode {
    const row = figma.createFrame();
    applyAutoLayout(row, {
        direction: "HORIZONTAL",
        paddingH: 16,
        paddingV: 12,
        gap: 12,
        align: "CENTER",
        counterAlign: "CENTER",
    });
    row.fills = [];

    // leading placeholder
    const leading = figma.createFrame();
    leading.resize(20, 20);
    leading.cornerRadius = 4;
    leading.fills = colorFill("#d1d5db", "border-strong");
    row.appendChild(leading);

    // content
    const content = figma.createFrame();
    applyAutoLayout(content, { direction: "VERTICAL", gap: 2, align: "MIN", counterAlign: "MIN" });
    content.fills = [];
    const titleNode = makeText(title, 14, "Medium", "#111827", "text-primary", "fontSize/sm");
    content.appendChild(titleNode);
    if (description) {
        content.appendChild(
            makeText(description, 12, "Regular", "#6b7280", "text-secondary", "fontSize/xs"),
        );
    }
    row.appendChild(content);

    // trailing placeholder
    const trailing = figma.createFrame();
    trailing.resize(16, 16);
    trailing.cornerRadius = 3;
    trailing.fills = colorFill("#d1d5db", "border-strong");
    row.appendChild(trailing);

    if (width > 0) {
        // Fix row width so content can FILL; then revert height to AUTO
        row.resize(width, row.height);
        row.counterAxisSizingMode = "AUTO";
        content.layoutSizingHorizontal = "FILL";
    }

    return row;
}

async function createListComponent(): Promise<ComponentNode> {
    const W = 320;
    const comp = figma.createComponent();
    comp.name = "List";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, { direction: "VERTICAL", gap: 0, align: "MIN", counterAlign: "MIN" });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(W, comp.height);
    comp.fills = colorFill("#ffffff", "surface");
    comp.strokes = colorFill("#e5e7eb", "border");
    comp.strokeWeight = 1;
    comp.strokeAlign = "INSIDE";
    comp.cornerRadius = 16;
    comp.clipsContent = true;

    // item 1 (with description)
    const item1 = makeListItem("프로필", "계정 설정 관리", W);
    comp.appendChild(item1);
    item1.layoutSizingHorizontal = "FILL";

    // divider
    const divider = figma.createFrame();
    divider.fills = colorFill("#e5e7eb", "border");
    divider.resize(W, 1);
    comp.appendChild(divider);
    divider.layoutSizingHorizontal = "FILL";

    // item 2 (title only)
    const item2 = makeListItem("설정", undefined, W);
    comp.appendChild(item2);
    item2.layoutSizingHorizontal = "FILL";

    // footer
    const footer = figma.createFrame();
    applyAutoLayout(footer, {
        direction: "HORIZONTAL",
        paddingH: 16,
        paddingV: 12,
        gap: 8,
        align: "CENTER",
        counterAlign: "CENTER",
    });
    footer.fills = colorFill("#f9fafb", "surface-raised");
    footer.strokes = colorFill("#e5e7eb", "border");
    footer.strokeWeight = 1;
    footer.strokeAlign = "INSIDE";
    footer.appendChild(
        makeText("마지막 업데이트: 5분 전", 12, "Regular", "#6b7280", "text-secondary", "fontSize/xs"),
    );
    comp.appendChild(footer);
    footer.layoutSizingHorizontal = "FILL";

    return comp;
}

// ── ICON ──────────────────────────────────────────────────────────────────────

// Each entry: icon name + array of SVG path `d` strings (shares stroke style)
const ICON_DEFS: { name: string; paths: string[] }[] = [
    { name: "ChevronRight",   paths: ["M 9 6 L 15 12 L 9 18"] },
    { name: "ChevronLeft",    paths: ["M 15 6 L 9 12 L 15 18"] },
    { name: "ChevronDown",    paths: ["M 6 9 L 12 15 L 18 9"] },
    { name: "ChevronUp",      paths: ["M 18 15 L 12 9 L 6 15"] },
    { name: "ArrowRight",     paths: ["M 5 12 L 19 12", "M 12 5 L 19 12 L 12 19"] },
    {
        name: "Search",
        paths: [
            "M 3 11 C 3 6.582 6.582 3 11 3 C 15.418 3 19 6.582 19 11 C 19 15.418 15.418 19 11 19 C 6.582 19 3 15.418 3 11 Z",
            "M 21 21 L 16.65 16.65",
        ],
    },
    { name: "Close",          paths: ["M 18 6 L 6 18", "M 6 6 L 18 18"] },
    { name: "Check",          paths: ["M 20 6 L 9 17 L 4 12"] },
    {
        name: "Info",
        paths: [
            "M 2 12 C 2 6.477 6.477 2 12 2 C 17.523 2 22 6.477 22 12 C 22 17.523 17.523 22 12 22 C 6.477 22 2 17.523 2 12 Z",
            "M 12 16 L 12 12",
            "M 12 8 L 12.01 8",
        ],
    },
    {
        name: "AlertTriangle",
        paths: [
            "M 12 3 L 2 21 L 22 21 Z",
            "M 12 9 L 12 13",
            "M 12 17 L 12.01 17",
        ],
    },
    {
        name: "ExternalLink",
        paths: [
            "M 18 13 L 18 19 C 18 20.105 17.105 21 16 21 L 5 21 C 3.895 21 3 20.105 3 19 L 3 8 C 3 6.895 3.895 6 5 6 L 11 6",
            "M 15 3 L 21 3 L 21 9",
            "M 10 14 L 21 3",
        ],
    },
    { name: "Bookmark",       paths: ["M 19 21 L 12 16 L 5 21 L 5 5 C 5 3.895 5.895 3 7 3 L 17 3 C 18.105 3 19 3.895 19 5 Z"] },
    { name: "Star",           paths: ["M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 Z"] },
    {
        name: "Share",
        paths: [
            "M 15 5 C 15 3.343 16.343 2 18 2 C 19.657 2 21 3.343 21 5 C 21 6.657 19.657 8 18 8 C 16.343 8 15 6.657 15 5 Z",
            "M 3 12 C 3 10.343 4.343 9 6 9 C 7.657 9 9 10.343 9 12 C 9 13.657 7.657 15 6 15 C 4.343 15 3 13.657 3 12 Z",
            "M 15 19 C 15 17.343 16.343 16 18 16 C 19.657 16 21 17.343 21 19 C 21 20.657 19.657 22 18 22 C 16.343 22 15 20.657 15 19 Z",
            "M 8.59 13.51 L 15.42 17.49",
            "M 15.41 6.51 L 8.59 10.49",
        ],
    },
    { name: "Menu",           paths: ["M 3 6 L 21 6", "M 3 12 L 21 12", "M 3 18 L 21 18"] },
    {
        name: "User",
        paths: [
            "M 20 21 L 20 19 C 20 16.791 18.209 15 16 15 L 8 15 C 5.791 15 4 16.791 4 19 L 4 21",
            "M 8 7 C 8 4.791 9.791 3 12 3 C 14.209 3 16 4.791 16 7 C 16 9.209 14.209 11 12 11 C 9.791 11 8 9.209 8 7 Z",
        ],
    },
];

async function createIconSet(): Promise<ComponentSetNode> {
    const ICON_SIZE = 24;
    const COLS = 4;
    const GAP = 16;
    const components: ComponentNode[] = [];

    for (let i = 0; i < ICON_DEFS.length; i++) {
        const def = ICON_DEFS[i];
        const comp = figma.createComponent();
        comp.name = `Name=${def.name}`;
        figma.currentPage.appendChild(comp);
        comp.resize(ICON_SIZE, ICON_SIZE);
        comp.fills = [];

        const vec = figma.createVector();
        vec.vectorPaths = def.paths.map((data) => ({
            windingRule: "NONZERO" as WindingRule,
            data,
        }));
        vec.fills = [];
        vec.strokes = colorFill("#6b7280", "text-secondary");
        vec.strokeWeight = 1.5;
        vec.strokeCap = "ROUND";
        vec.strokeJoin = "ROUND";
        comp.appendChild(vec);

        const row = Math.floor(i / COLS);
        const col = i % COLS;
        comp.x = col * (ICON_SIZE + GAP);
        comp.y = row * (ICON_SIZE + GAP);
        components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Icon";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop =
        set.paddingBottom =
        set.paddingLeft =
        set.paddingRight =
            20;
    set.itemSpacing = GAP;
    return set;
}

// ── SKELETON ──────────────────────────────────────────────────────────────────

async function createSkeletonComponent(): Promise<ComponentNode> {
    const comp = figma.createComponent();
    comp.name = "Skeleton";
    figma.currentPage.appendChild(comp);
    comp.resize(240, 16);
    comp.cornerRadius = 6;
    comp.fills = colorFill("#f3f4f6", "surface-overlay");
    return comp;
}

// ── CHECKBOX ──────────────────────────────────────────────────────────────────

async function createCheckboxSet(): Promise<ComponentSetNode> {
    const defs = [
        { state: "Unchecked", checked: false, opacity: 1 },
        { state: "Checked",   checked: true,  opacity: 1 },
        { state: "Disabled",  checked: false, opacity: 0.4 },
    ];
    const components: ComponentNode[] = [];
    let colX = 0;

    for (const def of defs) {
        const comp = figma.createComponent();
        comp.name = `State=${def.state}`;
        figma.currentPage.appendChild(comp);
        applyAutoLayout(comp, { gap: 8, align: "CENTER", counterAlign: "CENTER" });
        comp.fills = [];
        comp.opacity = def.opacity;

        const box = figma.createFrame();
        box.resize(16, 16);
        box.cornerRadius = 3;
        box.fills = def.checked ? colorFill("#059669", "accent") : colorFill("#ffffff", "surface");
        box.strokes = def.checked
            ? colorFill("#059669", "accent")
            : colorFill("#e5e7eb", "border");
        box.strokeWeight = 1;
        box.strokeAlign = "INSIDE";
        comp.appendChild(box);

        if (def.checked) {
            const check = figma.createVector();
            check.vectorPaths = [{ windingRule: "NONZERO", data: "M 2.5 8 L 6.5 12 L 13.5 4" }];
            check.fills = [];
            check.strokes = colorFill("#ffffff", "accent-foreground");
            check.strokeWeight = 1.5;
            check.strokeCap = "ROUND";
            check.strokeJoin = "ROUND";
            box.appendChild(check);
        }

        comp.appendChild(
            makeText("레이블", 14, "Regular", "#111827", "text-primary", "fontSize/sm"),
        );

        comp.x = colX;
        colX += comp.width + 20;
        components.push(comp);
    }

    const set = figma.combineAsVariants(components, figma.currentPage);
    set.name = "Checkbox";
    set.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.976, b: 0.984 } }];
    set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 20;
    return set;
}

// ── TAB ───────────────────────────────────────────────────────────────────────

async function createTabComponent(): Promise<ComponentNode> {
    const W = 320;
    const comp = figma.createComponent();
    comp.name = "Tab";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, { direction: "VERTICAL", gap: 0, align: "MIN", counterAlign: "MIN" });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(W, comp.height);
    comp.fills = colorFill("#ffffff", "surface");

    // Tab list row
    const tabList = figma.createFrame();
    applyAutoLayout(tabList, { direction: "HORIZONTAL", gap: 0, align: "MIN", counterAlign: "CENTER" });
    tabList.fills = [];
    comp.appendChild(tabList);
    tabList.layoutSizingHorizontal = "FILL";

    const tabs = [
        { label: "개요", active: true },
        { label: "상세", active: false },
        { label: "설정", active: false },
    ];
    for (const tab of tabs) {
        const trigger = figma.createFrame();
        applyAutoLayout(trigger, { paddingH: 16, paddingV: 10, align: "CENTER", counterAlign: "CENTER" });
        trigger.fills = [];
        if (tab.active) {
            trigger.strokes = colorFill("#059669", "accent");
            trigger.strokeWeight = 2;
            trigger.strokeAlign = "OUTSIDE";
        }
        trigger.appendChild(
            makeText(
                tab.label,
                14,
                "Medium",
                tab.active ? "#111827" : "#6b7280",
                tab.active ? "text-primary" : "text-secondary",
                "fontSize/sm",
            ),
        );
        tabList.appendChild(trigger);
    }

    // Border line under tab list
    const borderLine = figma.createFrame();
    borderLine.resize(W, 1);
    borderLine.fills = colorFill("#e5e7eb", "border");
    comp.appendChild(borderLine);
    borderLine.layoutSizingHorizontal = "FILL";

    // Panel
    const panel = figma.createFrame();
    applyAutoLayout(panel, {
        direction: "VERTICAL",
        paddingH: 0,
        paddingV: 16,
        align: "MIN",
        counterAlign: "MIN",
    });
    panel.fills = [];
    panel.appendChild(
        makeText("탭 패널 콘텐츠", 14, "Regular", "#6b7280", "text-secondary", "fontSize/sm"),
    );
    comp.appendChild(panel);
    panel.layoutSizingHorizontal = "FILL";

    return comp;
}

// ── SEGMENTED CONTROL ─────────────────────────────────────────────────────────

async function createSegmentedControlComponent(): Promise<ComponentNode> {
    const comp = figma.createComponent();
    comp.name = "SegmentedControl";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, { paddingH: 4, paddingV: 4, gap: 4 });
    comp.cornerRadius = 10;
    comp.fills = colorFill("#f3f4f6", "surface-raised");

    const options = ["첫 번째", "두 번째", "세 번째"];
    for (let i = 0; i < options.length; i++) {
        const segment = figma.createFrame();
        applyAutoLayout(segment, { paddingH: 16, paddingV: 6, align: "CENTER", counterAlign: "CENTER" });
        segment.cornerRadius = 8;
        segment.fills = i === 0 ? colorFill("#ffffff", "surface") : [];
        if (i === 0) {
            segment.effects = [
                {
                    type: "DROP_SHADOW",
                    color: { r: 0, g: 0, b: 0, a: 0.08 },
                    offset: { x: 0, y: 1 },
                    radius: 2,
                    spread: 0,
                    visible: true,
                    blendMode: "NORMAL",
                },
            ];
        }
        segment.appendChild(
            makeText(
                options[i],
                14,
                "Medium",
                i === 0 ? "#111827" : "#6b7280",
                i === 0 ? "text-primary" : "text-secondary",
                "fontSize/sm",
            ),
        );
        comp.appendChild(segment);
    }

    return comp;
}

// ── TABLE ─────────────────────────────────────────────────────────────────────

async function createTableComponent(): Promise<ComponentNode> {
    const colWidths = [120, 200, 80];
    const W = colWidths.reduce((s, w) => s + w, 0);

    const comp = figma.createComponent();
    comp.name = "Table";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, { direction: "VERTICAL", gap: 0, align: "MIN", counterAlign: "MIN" });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(W, comp.height);
    comp.fills = colorFill("#ffffff", "surface");
    comp.strokes = colorFill("#e5e7eb", "border");
    comp.strokeWeight = 1;
    comp.strokeAlign = "INSIDE";
    comp.cornerRadius = 12;
    comp.clipsContent = true;

    function makeRow(cells: string[], isHeader: boolean): FrameNode {
        const row = figma.createFrame();
        applyAutoLayout(row, { direction: "HORIZONTAL", gap: 0, align: "MIN", counterAlign: "CENTER" });
        row.fills = isHeader ? colorFill("#f9fafb", "surface-raised") : [];
        row.strokes = colorFill("#e5e7eb", "border");
        row.strokeWeight = 1;
        row.strokeAlign = "INSIDE";
        for (let i = 0; i < cells.length; i++) {
            const cell = figma.createFrame();
            applyAutoLayout(cell, { paddingH: 16, paddingV: 12, align: "MIN", counterAlign: "CENTER" });
            cell.primaryAxisSizingMode = "FIXED";
            cell.fills = [];
            cell.resize(colWidths[i], cell.height);
            cell.appendChild(
                makeText(
                    cells[i],
                    14,
                    isHeader ? "Medium" : "Regular",
                    isHeader ? "#6b7280" : "#111827",
                    isHeader ? "text-secondary" : "text-primary",
                    "fontSize/sm",
                ),
            );
            row.appendChild(cell);
        }
        return row;
    }

    const headRow = makeRow(["이름", "이메일", "상태"], true);
    comp.appendChild(headRow);
    headRow.layoutSizingHorizontal = "FILL";

    for (const data of [
        ["김철수", "kim@example.com", "활성"],
        ["이영희", "lee@example.com", "비활성"],
    ]) {
        const row = makeRow(data, false);
        comp.appendChild(row);
        row.layoutSizingHorizontal = "FILL";
    }

    return comp;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────

async function createModalComponent(): Promise<ComponentNode> {
    const comp = figma.createComponent();
    comp.name = "Modal";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, {
        direction: "VERTICAL",
        paddingH: 24,
        paddingV: 24,
        gap: 8,
        align: "MIN",
        counterAlign: "MIN",
    });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(400, comp.height);
    comp.fills = colorFill("#ffffff", "surface");
    comp.strokes = colorFill("#e5e7eb", "border");
    comp.strokeWeight = 1;
    comp.strokeAlign = "INSIDE";
    comp.cornerRadius = 24;

    comp.appendChild(
        makeText("모달 제목", 24, "Semi Bold", "#111827", "text-primary", "fontSize/2xl"),
    );

    const desc = makeText(
        "모달에 대한 설명 텍스트를 여기에 작성합니다.",
        14,
        "Regular",
        "#6b7280",
        "text-secondary",
        "fontSize/sm",
    );
    comp.appendChild(desc);
    desc.layoutSizingHorizontal = "FILL";
    desc.textAutoResize = "HEIGHT";

    // Action row
    const actions = figma.createFrame();
    applyAutoLayout(actions, {
        direction: "HORIZONTAL",
        gap: 8,
        align: "MAX",
        counterAlign: "CENTER",
    });
    actions.fills = [];
    actions.layoutSizingHorizontal = "FILL";

    const cancelBtn = figma.createFrame();
    applyAutoLayout(cancelBtn, { paddingH: 16, paddingV: 10 });
    cancelBtn.fills = colorFill("#f9fafb", "surface-raised");
    cancelBtn.strokes = colorFill("#e5e7eb", "border");
    cancelBtn.strokeWeight = 1;
    cancelBtn.strokeAlign = "INSIDE";
    cancelBtn.cornerRadius = 8;
    cancelBtn.appendChild(
        makeText("취소", 14, "Medium", "#111827", "text-primary", "fontSize/sm"),
    );
    actions.appendChild(cancelBtn);

    const confirmBtn = figma.createFrame();
    applyAutoLayout(confirmBtn, { paddingH: 16, paddingV: 10 });
    confirmBtn.fills = colorFill("#059669", "accent");
    confirmBtn.cornerRadius = 8;
    confirmBtn.appendChild(
        makeText("확인", 14, "Medium", "#ffffff", "accent-foreground", "fontSize/sm"),
    );
    actions.appendChild(confirmBtn);

    comp.appendChild(actions);
    return comp;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

async function createToastComponent(): Promise<ComponentNode> {
    const comp = figma.createComponent();
    comp.name = "Toast";
    figma.currentPage.appendChild(comp);
    applyAutoLayout(comp, {
        direction: "HORIZONTAL",
        paddingH: 16,
        paddingV: 12,
        gap: 12,
        align: "MIN",
        counterAlign: "CENTER",
    });
    comp.counterAxisSizingMode = "FIXED";
    comp.resize(320, comp.height);
    comp.fills = colorFill("#ffffff", "surface");
    comp.strokes = colorFill("#e5e7eb", "border");
    comp.strokeWeight = 1;
    comp.strokeAlign = "INSIDE";
    comp.cornerRadius = 12;
    comp.effects = [
        {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.08 },
            offset: { x: 0, y: 4 },
            radius: 6,
            spread: -1,
            visible: true,
            blendMode: "NORMAL",
        },
    ];

    const content = figma.createFrame();
    applyAutoLayout(content, { direction: "VERTICAL", gap: 2, align: "MIN", counterAlign: "MIN" });
    content.fills = [];
    content.appendChild(
        makeText("알림 제목", 14, "Medium", "#111827", "text-primary", "fontSize/sm"),
    );
    content.appendChild(
        makeText("알림 설명 텍스트입니다.", 14, "Regular", "#6b7280", "text-secondary", "fontSize/sm"),
    );
    comp.appendChild(content);
    content.layoutSizingHorizontal = "FILL";

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

    const usageHints: Record<string, string> = {
        Button:           `<Button variant="primary" size="md">Label</Button>`,
        Badge:            `<Badge variant="primary" size="sm">텍스트</Badge>`,
        Card:             `<Card title="제목" description="설명" />`,
        Divider:          `<Divider />  ·  <Divider variant="labeled" />  ·  <Divider variant="vertical" />`,
        Spinner:          `<Spinner size="md" />`,
        Input:            `<Input label="레이블" placeholder="입력값을 작성해 주세요" state="default" />`,
        List:             `<List items={[{ title: "프로필", description: "계정 설정 관리" }]} />`,
        Icon:             `<Icon name="Search" size={24} />`,
        Skeleton:         `<Skeleton width={240} height={16} />`,
        Checkbox:         `<Checkbox label="레이블" checked={false} onChange={fn} />`,
        Tab:              `<Tab tabs={["개요", "상세", "설정"]} activeIndex={0} />`,
        SegmentedControl: `<SegmentedControl options={["첫 번째", "두 번째", "세 번째"]} value={0} />`,
        Table:            `<Table columns={cols} rows={rows} />`,
        Modal:            `<Modal title="제목" onConfirm={fn} onCancel={fn} />`,
        Toast:            `<Toast title="알림" description="설명" />`,
    };

    const placeSection = async (
        name: string,
        create: () => Promise<FrameNode | ComponentNode | ComponentSetNode>,
    ) => {
        const node = await create();
        node.x = PAGE_X;
        node.y = pageY;
        pageY += node.height + 8;

        const hint = usageHints[name];
        if (hint) {
            const t = figma.createText();
            t.fontName = { family: "Inter", style: "Regular" };
            t.fontSize = 11;
            t.characters = hint;
            t.fills = [{ type: "SOLID", color: { r: 0.42, g: 0.45, b: 0.50 } }];
            figma.currentPage.appendChild(t);
            t.x = PAGE_X;
            t.y = pageY;
            pageY += t.height + 40;
        } else {
            pageY += 48;
        }
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
    if (names.includes("Divider")) {
        onProgress("Generating Divider...");
        await placeSection("Divider", createDividerSet);
    }
    if (names.includes("Spinner")) {
        onProgress("Generating Spinner...");
        await placeSection("Spinner", createSpinnerSet);
    }
    if (names.includes("Input")) {
        onProgress("Generating Input...");
        await placeSection("Input", createInputSet);
    }
    if (names.includes("List")) {
        onProgress("Generating List...");
        await placeSection("List", createListComponent);
    }
    if (names.includes("Icon")) {
        onProgress("Generating Icon...");
        await placeSection("Icon", createIconSet);
    }
    if (names.includes("Skeleton")) {
        onProgress("Generating Skeleton...");
        await placeSection("Skeleton", createSkeletonComponent);
    }
    if (names.includes("Checkbox")) {
        onProgress("Generating Checkbox...");
        await placeSection("Checkbox", createCheckboxSet);
    }
    if (names.includes("Tab")) {
        onProgress("Generating Tab...");
        await placeSection("Tab", createTabComponent);
    }
    if (names.includes("SegmentedControl")) {
        onProgress("Generating SegmentedControl...");
        await placeSection("SegmentedControl", createSegmentedControlComponent);
    }
    if (names.includes("Table")) {
        onProgress("Generating Table...");
        await placeSection("Table", createTableComponent);
    }
    if (names.includes("Modal")) {
        onProgress("Generating Modal...");
        await placeSection("Modal", createModalComponent);
    }
    if (names.includes("Toast")) {
        onProgress("Generating Toast...");
        await placeSection("Toast", createToastComponent);
    }

    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
}
