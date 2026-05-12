import { importAllTokens } from "./import-tokens";
import { generateComponents } from "./generate-components";
import { generateTokenShowcase } from "./generate-showcase";

figma.showUI(__html__, { width: 300, height: 430 });

figma.ui.onmessage = async (msg: { type: string; components?: string[] }) => {
    const progress = (message: string) =>
        figma.ui.postMessage({ type: "progress", message });

    try {
        if (msg.type === "import-tokens") {
            await importAllTokens(progress);
            figma.ui.postMessage({
                type: "success",
                message: "✓ Tokens imported successfully",
            });
        } else if (msg.type === "generate-showcase") {
            await generateTokenShowcase(progress);
            figma.ui.postMessage({
                type: "success",
                message: "✓ Token showcase generated",
            });
        } else if (msg.type === "generate-components") {
            await generateComponents(msg.components ?? [], progress);
            figma.ui.postMessage({
                type: "success",
                message: "✓ Components generated",
            });
        }
    } catch (e) {
        figma.ui.postMessage({ type: "error", message: `Error: ${String(e)}` });
    }
};
