import type { Config } from "tailwindcss";
import uiConfig from "@vibe/ui/tailwind";

const config: Config = {
    presets: [uiConfig],
    content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};

export default config;
