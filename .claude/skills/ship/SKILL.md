# ship skill

Create a branch, commit changes, push, and open a PR for review — never push directly to main.

## Git Convention

**Commit format:** `<type>(<scope>): <subject>`

**Branch format:** `<type>/<short-kebab-description>`

**Types:**
| Type | When to use |
|------|-------------|
| `feat` | New feature or behavior |
| `fix` | Bug fix |
| `chore` | Build, config, tooling, dependency updates |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Restructure without behavior change |
| `test` | Add or update tests |
| `ci` | CI/CD pipeline changes |

**Scopes (monorepo-aware):**
| Scope | Path |
|-------|------|
| `ui` | `packages/ui/` |
| `dev-news` | `apps/dev-news/` |
| `figma-plugin` | `packages/figma-plugin/` |
| `config` | root config files (`.claude/`, `turbo.json`, etc.) |
| `deps` | dependency changes (`pnpm-lock.yaml`, `package.json`) |

**Subject rules:**

- Lowercase, imperative mood ("add" not "added")
- No trailing period, max 72 characters

**Examples:**

```
feat(dev-news): add article card hover animation    → branch: feat/article-card-hover
fix(ui): correct button disabled state color        → branch: fix/button-disabled-color
chore(config): add md-check hook to settings        → branch: chore/md-check-hook
```

## Execution Steps

1. **Understand the changes:** run `git status` and `git diff`.

2. **Lint check — run before anything else.**

    2a. Identify which workspaces have changed files (e.g., `apps/dev-news`, `packages/ui`).

    2b. For each affected workspace, run ESLint with autofix:
    ```
    pnpm eslint --fix <changed files in this workspace>
    ```
    Autofixable violations (import order, formatting) are fixed silently — no need to report them.

    2c. After autofix, re-run lint to check for remaining errors:
    ```
    pnpm eslint <changed files in this workspace>
    ```

    2d. If errors remain, classify each one:
    - **Related to the current changes** → diagnose root cause and fix. Do not patch over the symptom (e.g., do not add `// eslint-disable`).
    - **Unrelated to the current changes** (pre-existing in untouched files) → report to the user:
        ```
        ESLint 오류가 발견됐습니다. 이번 변경과 무관한 파일에서 발생했습니다:
        - src/widgets/foo/ui/Foo.tsx: no-unused-vars
        어떻게 할까요? (수정 / 무시하고 진행 / 중단)
        ```
        Wait for the user's answer before proceeding.

    2e. **Do not proceed to step 3 until lint is clean** (or the user has explicitly approved skipping).

3. **Group by scope.** Analyze all modified/untracked files and group them into logical commit units. Each group gets:
    - A proposed type + scope (e.g., `chore(config)`)
    - A proposed commit message
    - The list of files it contains

4. **Present the groups and ask the user to select.**
   Show a numbered list like:

    ```
    변경사항을 다음 그룹으로 나눴습니다:

    [1] chore(config): add md-check hook and git push permission
        .claude/settings.json, .claude/hooks/md-check.ps1

    [2] feat(ui): add design system components and tokens
        packages/ui/src/, packages/ui/tokens.json, ...

    [3] feat(dev-news): scaffold Next.js app
        apps/dev-news/

    전부 포함할까요, 아니면 포함할 번호를 알려주세요. (예: 1 3)
    ```

    Wait for the user's answer before proceeding.

5. **Determine PR grouping.** For the selected groups, decide how many PRs to create:
    - Groups with the **same type + scope** → can share one branch and one PR (multiple commits).
    - Groups with **different type or scope** → each gets its own branch and PR.
    - State the plan explicitly before proceeding, e.g.:
        ```
        PR을 2개로 나눠서 올릴게요:
        PR A — chore/md-check-hook: [1]
        PR B — feat/design-system: [2] [3]  ← (같은 feat, 관련 범위)
        ```

6. **For each PR group (repeat steps 6a–6d):**

    6a. **Branch handling:** - Check out `main` first, then `git checkout -b <branch-name>`. - Exception: if already on a non-main branch that matches this PR group's work, stay on it.

    6b. **Stage and commit each file group (in order):** - `git add <specific files>` — never `git add .` or `git add -A` - Commit with the convention format + footer:
    `       Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  `

    6c. **Push the branch:** `git push -u origin <branch-name>`

    6d. **Open a PR** with `gh pr create`: - Title: commit message of the primary (or only) commit in this PR - Body: bullet-point summary of what changed and why - Base branch: `main`

7. **Return all PR URLs** at the end so the user can review and merge each one.

## Safety Rules

- **Never push to main directly.**
- Never force push.
- Never skip hooks (`--no-verify`).
- Do not stage `.env`, secret files, or unrelated build artifacts.
