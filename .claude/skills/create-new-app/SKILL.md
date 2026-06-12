# /create-new-app

이 모노레포에 새 Next.js 앱을 스캐폴딩합니다.

## 실행 절차

### 1. 정보 수집

다음 두 가지를 사용자에게 묻는다:
- **앱 이름** (kebab-case, 예: `my-app`) → `<APP_NAME>`
- **디스플레이 이름** (한국어 또는 영어, 예: `내 앱`) → `<DISPLAY_NAME>`

### 2. 디렉토리 및 파일 생성

`apps/<APP_NAME>/` 아래에 아래 파일들을 Write 툴로 생성한다.

---

#### `apps/<APP_NAME>/package.json`
```json
{
    "name": "@vibe/<APP_NAME>",
    "version": "0.0.1",
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "eslint src --max-warnings 0",
        "format": "prettier --write .",
        "format:check": "prettier --check .",
        "type-check": "tsc --noEmit"
    },
    "dependencies": {
        "clsx": "catalog:",
        "next": "catalog:",
        "react": "catalog:",
        "react-dom": "catalog:",
        "tailwind-merge": "catalog:"
    },
    "devDependencies": {
        "@vibe/eslint-config": "workspace:*",
        "@vibe/tsconfig": "workspace:*",
        "@tailwindcss/postcss": "catalog:",
        "@types/node": "catalog:",
        "@types/react": "catalog:",
        "@types/react-dom": "catalog:",
        "eslint": "catalog:",
        "prettier": "catalog:",
        "tailwindcss": "catalog:",
        "typescript": "catalog:"
    }
}
```

---

#### `apps/<APP_NAME>/tsconfig.json`
```json
{
    "extends": "@vibe/tsconfig/nextjs.json",
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

---

#### `apps/<APP_NAME>/next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

---

#### `apps/<APP_NAME>/postcss.config.mjs`
```js
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;
```

---

#### `apps/<APP_NAME>/eslint.config.js`
```js
import config from "@vibe/eslint-config/nextjs";

export default config;
```

---

#### `apps/<APP_NAME>/prettier.config.js`
```js
import baseConfig from "@vibe/eslint-config/prettier";

export default {
    ...baseConfig,
    tailwindStylesheet: "./src/app/globals.css",
};
```

---

#### `apps/<APP_NAME>/src/app/layout.tsx`
```tsx
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "<DISPLAY_NAME>",
    description: "",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
                    }}
                />
                <link
                    rel="stylesheet"
                    as="style"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

---

#### `apps/<APP_NAME>/src/app/page.tsx`
```tsx
export default function Home() {
    return <main />;
}
```

---

#### `apps/<APP_NAME>/src/app/globals.css`
```css
@import "../shared/styles/tokens.css";

@layer base {
    * {
        box-sizing: border-box;
    }

    body {
        background-color: var(--color-bg);
        color: var(--color-text-primary);
        font-family:
            "Pretendard Variable",
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
}
```

---

#### `apps/<APP_NAME>/src/shared/styles/tokens.css`

`apps/dev-news/src/shared/styles/tokens.css` 파일을 그대로 복사한다 (Read 후 Write).

---

#### `apps/<APP_NAME>/src/shared/lib/cn.ts`
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

---

#### `apps/<APP_NAME>/src/shared/ui/index.ts`
```ts
export { cn } from "@/shared/lib/cn";
```

---

#### `apps/<APP_NAME>/CLAUDE.md`
```md
# apps/<APP_NAME> — <DISPLAY_NAME>

## Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS v4
- UI Components: `shared/ui/` (앱 전용)

## Rules

- UI 컴포넌트는 `shared/ui/`에서 import.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/<APP_NAME>`
- 앱 전용 로직은 절대 `packages/`로 올리지 않는다.
- FSD 레이어 의존성 방향 준수: `shared` ← `entities` ← `features` ← `widgets` ← `views` ← `app`
```

---

### 3. FSD 빈 디렉토리 구조 생성

각 FSD 레이어에 `.gitkeep` 파일을 생성해 디렉토리를 만든다:
- `apps/<APP_NAME>/src/entities/.gitkeep`
- `apps/<APP_NAME>/src/features/.gitkeep`
- `apps/<APP_NAME>/src/widgets/.gitkeep`
- `apps/<APP_NAME>/src/views/.gitkeep`

### 4. pnpm install 실행

```
pnpm install
```

루트에서 실행. catalog: 참조가 올바르게 해석되는지 확인한다.

### 5. 완료 안내

생성된 파일 목록을 간단히 요약하고, 다음을 안내한다:
- 앱 전용 의존성이 필요하면: `pnpm add <pkg> --filter @vibe/<APP_NAME>`
- catalog에 없는 공통 패키지가 필요하면 `pnpm-workspace.yaml`의 `catalog:` 블록에 추가
