# Frontend AI Agent Guideline

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 하며, Next.js App Router와 TypeScript, Tailwind CSS를 사용하여 구축됩니다.

---

## 🏗️ Architecture 원칙

프로젝트는 FSD의 계층(Layer) → 슬라이스(Slice) → 세그먼트(Segment) 구조를 엄격히 따릅니다.

### 1. Layers (계층)

상위 레이어는 하위 레이어만 참조할 수 있습니다. (역방향 참조 금지)

1. **app**: Next.js App Router의 라우팅 진입점. 페이지 레이아웃, 라우트 설정, 전역 Provider 등을 포함합니다.
2. **pages** _(선택적)_: 특정 라우트에 대응하는 페이지 컴포넌트. 여러 widget/feature를 조합합니다.
3. **widgets**: 독립적으로 동작하는 UI 블록. 여러 feature/entity를 조합하여 완성된 UI 섹션을 구성합니다.
4. **features**: 사용자 인터랙션과 비즈니스 유스케이스를 처리합니다. (예: 경매 입찰, 상품 검색)
5. **entities**: 비즈니스 도메인 모델과 관련 UI를 포함합니다. (예: Item, Bid, User)
6. **shared**: 재사용 가능한 UI 컴포넌트, 유틸리티, 타입, 상수 등 프로젝트 전반에서 공통으로 사용되는 코드.

### 2. Segment 구조 (각 Layer/Slice 내부)

```
<layer>/<slice>/
├── ui/          # React 컴포넌트
├── model/       # 상태, 타입, 비즈니스 로직 (zustand store, custom hook 등)
├── api/         # API 호출 함수, React Query hooks
├── lib/         # 해당 슬라이스 내 유틸리티
├── config/      # 상수, 설정값
└── index.ts     # Public API (외부에 공개할 항목만 re-export)
```

---

## 🚨 개발 규칙 및 패턴

### 1. Public API (index.ts)

- 각 슬라이스/레이어의 내부 구현은 **반드시 `index.ts`를 통해서만** 외부에 노출합니다.
- 다른 슬라이스에서 임포트할 때는 반드시 `index.ts`를 통해 접근합니다.
- 슬라이스 내부 파일을 직접 참조하는 것은 금지입니다.

```ts
// ✅ Good
import { BidCard } from "@/entities/bid";

// ❌ Bad
import { BidCard } from "@/entities/bid/ui/BidCard";
```

### 2. 레이어 간 참조 규칙

- 상위 레이어에서 하위 레이어 참조만 허용합니다.
- 동일 레이어 내 슬라이스 간 참조는 원칙적으로 **금지**합니다.
- `shared` 레이어는 어느 레이어에서든 참조 가능합니다.

```
app → pages → widgets → features → entities → shared
```

### 3. 컴포넌트 작성 규칙

- 컴포넌트는 반드시 **named export**를 사용합니다. (`export default` 지양)
- Props 타입은 컴포넌트 파일 내에 `interface` 또는 `type`으로 명시합니다.
- 서버 컴포넌트(RSC)와 클라이언트 컴포넌트(`'use client'`)를 명확히 구분합니다.
- 클라이언트 컴포넌트는 최대한 하위 트리로 내려 범위를 최소화합니다.

### 4. 데이터 페칭

- 서버 컴포넌트에서는 `async/await`로 직접 fetch합니다.
- 클라이언트에서의 서버 상태 관리는 **Tanstack Query**를 사용합니다.
- API 호출 함수는 각 슬라이스의 `api/` 세그먼트에 위치시킵니다.
- 전역 클라이언트 상태 관리는 **Zustand**를 사용합니다.

### 5. 스타일링

- 스타일링은 **Tailwind CSS**만을 사용합니다. 별도의 CSS 파일 생성을 지양합니다.
- 조건부 클래스 조합 시 `clsx` 또는 `tailwind-merge`(`cn` 유틸리티)를 사용합니다.
- 인라인 스타일(`style={{ }}`) 사용을 금지합니다.

### 6. 타입 안전성

- `any` 타입 사용을 금지합니다. 불가피한 경우 `unknown`을 사용하고 타입 가드를 작성합니다.
- API 응답 타입은 `entities` 레이어에서 정의하고 공유합니다.
- 타입 단언(`as`)은 최소화하고, 사용 시 이유를 주석으로 명시합니다.

---

## 📁 프로젝트 구조

```
fe/
├── src/
│   ├── app/                    # Next.js App Router (라우팅 진입점)
│   │   ├── (auth)/             # 라우트 그룹
│   │   ├── auction/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── pages/                  # [FSD] 페이지 레이어 (선택적)
│   │   └── auction-detail/
│   │       ├── ui/
│   │       └── index.ts
│   │
│   ├── widgets/                # [FSD] 위젯 레이어
│   │   └── auction-list/
│   │       ├── ui/
│   │       └── index.ts
│   │
│   ├── features/               # [FSD] 피처 레이어
│   │   └── place-bid/
│   │       ├── ui/
│   │       ├── model/
│   │       ├── api/
│   │       └── index.ts
│   │
│   ├── entities/               # [FSD] 엔티티 레이어
│   │   ├── item/
│   │   │   ├── ui/
│   │   │   ├── model/          # 타입 정의 포함
│   │   │   ├── api/
│   │   │   └── index.ts
│   │   └── bid/
│   │       ├── ui/
│   │       ├── model/
│   │       ├── api/
│   │       └── index.ts
│   │
│   └── shared/                 # [FSD] 공유 레이어
│       ├── ui/                 # 공통 UI 컴포넌트 (Button, Input 등)
│       ├── api/                # API 클라이언트 설정 (fetch wrapper 등)
│       ├── lib/                # 공통 유틸리티 함수
│       ├── config/             # 환경변수, 상수
│       ├── types/              # 공통 타입 (ApiResponse 등)
│       └── index.ts
│
├── public/
├── docs/
│   └── ai-agent/
│       └── FRONTEND_AI_AGENT_GUIDELINE.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 Code Style

### 네이밍 컨벤션

- **컴포넌트(파일/클래스)**: `PascalCase` (예: `AuctionCard.tsx`, `PlaceBidForm.tsx`)
- **함수/변수/훅**: `camelCase` (예: `usePlaceBid`, `fetchAuctionList`)
- **상수**: `UPPER_SNAKE_CASE` (예: `MAX_BID_AMOUNT`)
- **타입/인터페이스**: `PascalCase` (예: `AuctionItem`, `BidResponse`)
- **폴더/슬라이스**: `kebab-case` (예: `auction-detail`, `place-bid`)
- **CSS 클래스**: Tailwind 유틸리티 클래스 사용 (별도 네이밍 불필요)

### 파일 구조 규칙

- 컴포넌트 파일명은 컴포넌트 이름과 동일하게 작성합니다. (예: `AuctionCard.tsx`)
- 훅 파일은 `use` 접두사로 시작합니다. (예: `usePlaceBid.ts`)
- 타입 정의 파일은 `.types.ts` 확장자를 사용합니다. (예: `bid.types.ts`)
- 테스트 파일은 `.test.ts(x)` 확장자를 사용합니다. (예: `AuctionCard.test.tsx`)

### Import 순서

1. React, Next.js 등 외부 라이브러리
2. FSD 상위 레이어 → 하위 레이어 순서
3. 상대 경로 임포트 (`./`)

---

## 🚧 Boundaries (작업 경계)

### ✅ Always Do (항상 수행)

- [ ] 각 슬라이스에 `index.ts` Public API 파일 작성
- [ ] 레이어 간 참조 방향 준수 (상위 → 하위만 허용)
- [ ] 컴포넌트는 `named export` 사용
- [ ] 서버 컴포넌트와 클라이언트 컴포넌트 명확히 구분
- [ ] `any` 타입 대신 명시적 타입 또는 `unknown` 사용
- [ ] 스타일링은 Tailwind CSS 사용

### ⚠️ Ask First (먼저 확인)

- [ ] 새로운 외부 라이브러리 추가
- [ ] 전역 상태 구조 변경
- [ ] API 클라이언트 설정 변경
- [ ] `app/` 레이어의 라우팅 구조 변경
- [ ] 환경변수 추가 또는 변경

### 🚫 Never Do (절대 금지)

- [ ] **API 키, 토큰 등 시크릿 정보 커밋 절대 금지**
- [ ] 레이어 간 역방향 참조 (예: `entities`에서 `features` 참조)
- [ ] 동일 레이어 내 슬라이스 간 직접 참조
- [ ] 슬라이스 내부 파일을 `index.ts`를 거치지 않고 직접 임포트
- [ ] `any` 타입 사용
- [ ] 인라인 스타일(`style={{ }}`) 사용
- [ ] co-author로 너를 넣어서 커밋하지마
