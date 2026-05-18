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
- `packages/figma-plugin/` — Figma 플러그인

Rules:

- Package manager: `pnpm` only. Never use `npm` or `yarn`.
- Run tasks via `turbo` at root, or `pnpm` inside a specific package.
- When adding a dependency: specify the workspace target (`pnpm add <pkg> --filter <workspace>`).
- `packages/ui` components must be framework-agnostic where possible.
- App-specific logic never goes into `packages/ui`.

References:

- Project planning: `docs/기획.md`

## 6. 팀 경계 — Agent 라우팅 규칙

**이 모노레포는 4개의 전담 팀(Agent)으로 구성되어 있습니다.**
각 팀은 고유한 전문성과 담당 영역을 가지며, 타 팀의 파일을 직접 수정하지 않습니다.

### 팀 → 담당 경로 매핑

| 팀             | 담당 경로                                                                            | Agent 브리핑                      |
| -------------- | ------------------------------------------------------------------------------------ | --------------------------------- |
| Design System  | `packages/ui/**`                                                                     | `.claude/agents/design-system.md` |
| Figma Sync     | `packages/figma-plugin/**`                                                           | `.claude/agents/figma-sync.md`    |
| Dev-News App   | `apps/dev-news/**`                                                                   | `.claude/agents/dev-news.md`      |
| Monorepo Infra | `.claude/**`, `.github/**`, `turbo.json`, `pnpm-workspace.yaml`, 루트 `package.json` | `.claude/agents/infra.md`         |

### 라우팅 규칙 (반드시 준수)

1. **현재 작업 컨텍스트를 파악한다.** 사용자 요청의 주 대상이 어느 팀의 영역인지 확인.

2. **타 팀 파일을 직접 수정하지 않는다.** 요청이 다른 팀의 영역에 해당하면:
    - 직접 Edit/Write 금지
    - 해당 팀의 Agent 브리핑을 읽고 서브에이전트를 소환
    - 소환 방법: `Agent(prompt="[브리핑 전체 내용]\n\n## 요청\n[구체적 요청 내용]")`

3. **경계 침범 감지 시 사용자에게 먼저 확인한다.**

    ```
    이 작업은 Design System 팀(packages/ui)의 영역입니다.
    Design System Agent를 소환하여 처리할까요?
    해당 Agent는 디자인 원칙과 토큰 규칙을 검토한 후 구현합니다.
    ```

4. **소환된 Agent의 결과를 메인 세션에 보고한다.**
   Agent 완료 후 변경 사항, 브레이킹 체인지 여부, 후속 조치를 요약해 사용자에게 전달.

### 연쇄 요청 예시

> 사용자: "dev-news에서 쓸 버튼 variant 하나 추가해줘"

올바른 흐름:

```
1. 현재 컨텍스트: apps/dev-news 작업 중
2. 버튼 variant는 packages/ui 영역 → Design System Agent 소환
3. Agent가 디자인 원칙 검토 후 Button 컴포넌트 수정
4. Agent 보고: "variant 추가 완료, 브레이킹 체인지 없음, Figma 동기화 불필요"
5. 메인 세션 복귀: dev-news에서 새 variant import 사용 가능
```

## 7. Git Hooks

Run once after cloning to install pre-commit enforcement:

```
powershell -File .claude/hooks/install-hooks.ps1
```

What it installs: a pre-commit hook that warns when `packages/ui` is staged without a changeset file (`.changeset/*.md`) staged alongside. Set `$env:CHANGESET_BLOCK = '1'` to make it blocking.
