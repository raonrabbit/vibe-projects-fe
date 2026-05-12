import {
    PALETTE,
    SEMANTIC_LIGHT,
    SEMANTIC_DARK,
    SPACING,
    RADIUS,
    FONT_SIZES,
    TYPE_SCALE,
} from "./tokens-data";

type Progress = (msg: string) => void;

function hexToRgba(hex: string): RGBA {
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

function resolveRef(ref: string): { color: string; key: string } | null {
    const m = ref.match(/^\{palette\.(\w+)\.(\w+)\}$/);
    if (!m) return null;
    return { color: m[1], key: m[2] };
}

function getOrCreateCollection(name: string): VariableCollection {
    return (
        figma.variables
            .getLocalVariableCollections()
            .find((c) => c.name === name) ??
        figma.variables.createVariableCollection(name)
    );
}

function getOrCreateVariable(
    name: string,
    collection: VariableCollection,
    type: VariableResolvedDataType,
): Variable {
    return (
        figma.variables
            .getLocalVariables()
            .find(
                (v) =>
                    v.name === name && v.variableCollectionId === collection.id,
            ) ?? figma.variables.createVariable(name, collection, type)
    );
}

export async function importAllTokens(onProgress: Progress) {
    // 1. Palette
    onProgress("Creating Palette variables...");
    const paletteColl = getOrCreateCollection("Palette");
    const paletteModeId = paletteColl.modes[0].modeId;
    paletteColl.renameMode(paletteModeId, "Default");

    const paletteIdMap = new Map<string, string>();
    for (const [colorName, shades] of Object.entries(PALETTE)) {
        for (const [shade, hexValue] of Object.entries(shades)) {
            const variable = getOrCreateVariable(
                `${colorName}/${shade}`,
                paletteColl,
                "COLOR",
            );
            variable.setValueForMode(paletteModeId, hexToRgba(hexValue));
            paletteIdMap.set(`${colorName}.${shade}`, variable.id);
        }
    }

    // 2. Semantic — try single collection with Light/Dark modes; fall back to two collections on free plan
    onProgress("Creating Semantic variables...");
    const semanticColl = getOrCreateCollection("Semantic");
    semanticColl.renameMode(semanticColl.modes[0].modeId, "Light");
    const lightModeId = semanticColl.modes[0].modeId;

    let darkColl: VariableCollection;
    let darkModeId: string;
    let sharedCollection: boolean;

    if (semanticColl.modes.length > 1) {
        darkColl = semanticColl;
        darkModeId = semanticColl.modes[1].modeId;
        semanticColl.renameMode(darkModeId, "Dark");
        sharedCollection = true;
    } else {
        try {
            darkModeId = semanticColl.addMode("Dark");
            darkColl = semanticColl;
            sharedCollection = true;
        } catch {
            onProgress('Free plan: creating "Semantic (Dark)" collection...');
            darkColl = getOrCreateCollection("Semantic (Dark)");
            darkModeId = darkColl.modes[0].modeId;
            darkColl.renameMode(darkModeId, "Dark");
            sharedCollection = false;
        }
    }

    const setValue = (variable: Variable, modeId: string, raw: string) => {
        const ref = resolveRef(raw);
        if (ref) {
            const paletteId = paletteIdMap.get(`${ref.color}.${ref.key}`);
            if (paletteId) {
                variable.setValueForMode(modeId, {
                    type: "VARIABLE_ALIAS",
                    id: paletteId,
                });
                return;
            }
        }
        variable.setValueForMode(modeId, hexToRgba(raw));
    };

    const allKeys = new Set([
        ...Object.keys(SEMANTIC_LIGHT),
        ...Object.keys(SEMANTIC_DARK),
    ]);
    for (const key of allKeys) {
        const lightVar = getOrCreateVariable(key, semanticColl, "COLOR");
        if (SEMANTIC_LIGHT[key])
            setValue(lightVar, lightModeId, SEMANTIC_LIGHT[key]);
        const darkVar = sharedCollection
            ? lightVar
            : getOrCreateVariable(key, darkColl, "COLOR");
        if (SEMANTIC_DARK[key])
            setValue(darkVar, darkModeId, SEMANTIC_DARK[key]);
    }

    // 3. Spacing
    onProgress("Creating Spacing variables...");
    const spacingColl = getOrCreateCollection("Spacing");
    const spacingModeId = spacingColl.modes[0].modeId;
    for (const [key, value] of Object.entries(SPACING)) {
        getOrCreateVariable(key, spacingColl, "FLOAT").setValueForMode(
            spacingModeId,
            value,
        );
    }

    // 4. Radius
    onProgress("Creating Radius variables...");
    const radiusColl = getOrCreateCollection("Radius");
    const radiusModeId = radiusColl.modes[0].modeId;
    for (const [key, value] of Object.entries(RADIUS)) {
        getOrCreateVariable(key, radiusColl, "FLOAT").setValueForMode(
            radiusModeId,
            value,
        );
    }

    // 5. Typography
    onProgress("Creating Typography variables...");
    const typoColl = getOrCreateCollection("Typography");
    const typoModeId = typoColl.modes[0].modeId;
    for (const [key, value] of Object.entries(FONT_SIZES)) {
        getOrCreateVariable(key, typoColl, "FLOAT").setValueForMode(
            typoModeId,
            value,
        );
    }

    // 6. Text Styles
    onProgress("Creating Text Styles...");
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });

    for (const style of TYPE_SCALE) {
        const styleName = `${style.category}/${style.label}`;
        const existing = figma
            .getLocalTextStyles()
            .find((s) => s.name === styleName);
        const ts = existing ?? figma.createTextStyle();
        ts.name = styleName;
        ts.fontName = { family: "Inter", style: style.weight };
        ts.fontSize = style.size;
        ts.lineHeight = { value: style.lineHeight * 100, unit: "PERCENT" };
        ts.letterSpacing = {
            value: style.letterSpacing * 100,
            unit: "PERCENT",
        };
    }
}
