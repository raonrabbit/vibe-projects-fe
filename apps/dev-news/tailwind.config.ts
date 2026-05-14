import uiConfig from "@vibe/ui/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
    presets: [uiConfig],
    content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};

export default config;
