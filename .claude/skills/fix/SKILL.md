# fix skill

현재 작업 디렉토리 내 코드를 전수 검사하고 수정한다.  
범위는 스킬을 실행한 폴더 안으로 한정한다.

## 실행 순서

### 1단계: 범위 확정

`pwd`로 현재 디렉토리를 확인한다. 이 경로가 모든 검사의 루트다.  
`src/` 디렉토리가 있으면 그 안을 대상으로, 없으면 현재 디렉토리 전체를 대상으로 한다.

### 2단계: Prettier auto-fix

레포 루트에서 `prettier --write <범위>` 를 실행해 포맷을 정리한다.  
범위는 1단계에서 확정한 루트 경로(예: `apps/flightrail/src`).

레포 루트의 `package.json`에 `format` 또는 `format:write` 스크립트가 있으면 그것을 사용한다.  
없으면 `pnpm prettier --write <범위>` 를 직접 실행한다.

수정된 파일 수를 한 줄로 알린다.

### 3단계: ESLint auto-fix

`package.json`이 있으면 해당 패키지의 lint 스크립트를 `--fix` 옵션으로 실행한다.  
없으면 `pnpm eslint src --fix`를 직접 실행한다.

auto-fix 후 수정된 파일 수를 한 줄로 알린다.

### 4단계: 잔여 lint 오류 수동 수정

ESLint를 재실행해 남은 오류 목록을 확인한다.

남은 오류는 파일을 직접 읽고 수정한다. 설명 없이 바로 처리한다 (lint 규칙 위반이기 때문).

**자주 나오는 패턴:**

`@typescript-eslint/no-empty-object-type` — 빈 interface를 type alias로 교체
```ts
// Before
interface FooProps extends HTMLAttributes<HTMLDivElement> {}
// After
type FooProps = HTMLAttributes<HTMLDivElement>;
```

`simple-import-sort/imports` 또는 `/exports` — auto-fix로 처리됐어야 하지만 남아있으면 직접 정렬

그 외 오류는 규칙 이름과 메시지를 보고 판단해 수정한다. 의도가 불명확한 경우에만 사용자에게 묻는다.

모든 수정 후 lint를 재실행해 오류 0을 확인한다.

### 5단계: CLAUDE.md 규칙 검사

현재 디렉토리부터 레포 루트까지 모든 `CLAUDE.md`를 수집한다.  
각 CLAUDE.md에서 코드 규칙(금지 사항, 설계 규칙, 컨벤션)을 파악한다.

파악한 규칙을 기준으로 범위 내 소스 파일을 검사한다.

**검사 예시 (발견된 CLAUDE.md 내용 기준으로 동적으로 판단):**

- `style={{}}` 인라인 스타일 사용
- 하드코딩 색상 (`#rrggbb`, `rgb(`, `hsl(` 직접 사용)
- 금지된 import (`next/image`, `next/link` 등 프레임워크 의존 모듈)
- 다른 내부 패키지 import
- `"use client"` 가 이벤트 핸들러/훅 없는 컴포넌트에 붙어있는 경우
- `text-*` + `font-*` 개별 조합 (타이포그래피 프리셋 미사용)
- FSD 레이어 의존성 방향 위반

**CLAUDE.md 규칙 위반은 반드시 수정 전에 사용자에게 확인을 받는다.**

위반이 여러 개면 파일별로 묶어서 한 번에 보고한다:

```
[CLAUDE.md 규칙 위반 발견]

파일: src/components/Foo.tsx
  • 3번째 줄 — 하드코딩 색상 금지
    현재: className="text-[#3b82f6]"
    권장: className="text-accent"
    이유: 시맨틱 토큰을 써야 다크모드·테마 변경에 대응 가능

  • 12번째 줄 — Next.js import 금지 (CLAUDE.md 규칙)
    현재: import Image from "next/image"
    권장: <img> 또는 소비하는 앱에서 주입

수정할까요?
```

동의하면 수정, 거부하면 다음 파일로 넘어간다.

### 6단계: 완료 보고

```
✓ Prettier auto-fix: N개 파일
✓ ESLint auto-fix: N개 파일
✓ 잔여 오류 수동 수정: N개
✓ CLAUDE.md 규칙 위반: N개 수정 / M개 건너뜀
✓ lint 최종: 오류 0
```

발생하지 않은 항목은 생략한다.
