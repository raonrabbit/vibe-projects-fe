# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Monorepo Context

**This is a Turborepo + pnpm workspaces monorepo.**

Structure:

- `apps/dev-news/` — Frontend/AI 뉴스 큐레이션 앱 (Next.js)
- `packages/ui/` — 공유 디자인 시스템 (모든 앱이 참조)

Rules:

- Package manager: `pnpm` only. Never use `npm` or `yarn`.
- Run tasks via `turbo` at root, or `pnpm` inside a specific package.
- When adding a dependency: specify the workspace target (`pnpm add <pkg> --filter <workspace>`).
- `packages/ui` components must be framework-agnostic where possible.
- App-specific logic never goes into `packages/ui`.

References:

- Project planning: `docs/기획.md`

## 6. Frontend Architecture (FSD)

**모든 `apps/` 하위 프론트엔드 앱은 Feature-Sliced Design(FSD) 구조를 따른다.**

레이어 구조 (의존성은 아래 방향만 허용):

```
app/       # Next.js App Router — 라우팅 진입점만, 비즈니스 로직 없음
pages/     # 위젯 조합으로 페이지 구성
widgets/   # 복합 UI 블록 (여러 feature/entity를 조합)
features/  # 사용자 인터랙션 단위 (auth, theme, …)
entities/  # 비즈니스 엔티티 (article, keyword, user, …)
shared/    # 순수 재사용 리소스 (ui, api, lib, config, types)
```

Rules:

- 의존성 방향: `shared` ← `entities` ← `features` ← `widgets` ← `pages` ← `app`
- 같은 레이어 간 참조 금지 (예: widget → widget 불가)
- 각 슬라이스는 `index.ts` barrel export로 공개 API를 명시
- `app/` Next.js 라우트 파일은 해당 `pages/` 슬라이스를 렌더링하는 것만 담당
