import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";

import base from "./index.js";

export default [
    ...base,
    {
        plugins: {
            "@next/next": nextPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            ...reactHooksPlugin.configs.recommended.rules,
        },
    },
    prettierConfig,
    {
        ignores: [".next/**", "out/**", "next-env.d.ts"],
    },
];
