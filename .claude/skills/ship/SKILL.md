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

2. **Group by scope.** Analyze all modified/untracked files and group them into logical commit units. Each group gets:
    - A proposed type + scope (e.g., `chore(config)`)
    - A proposed commit message
    - The list of files it contains

3. **Present the groups and ask the user to select.**
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

4. **Determine PR grouping.** For the selected groups, decide how many PRs to create:
    - Groups with the **same type + scope** → can share one branch and one PR (multiple commits).
    - Groups with **different type or scope** → each gets its own branch and PR.
    - State the plan explicitly before proceeding, e.g.:
        ```
        PR을 2개로 나눠서 올릴게요:
        PR A — chore/md-check-hook: [1]
        PR B — feat/design-system: [2] [3]  ← (같은 feat, 관련 범위)
        ```

5. **For each PR group (repeat steps 5a–5d):**

    5a. **Branch handling:** - Check out `main` first, then `git checkout -b <branch-name>`. - Exception: if already on a non-main branch that matches this PR group's work, stay on it.

    5b. **Stage and commit each file group (in order):** - `git add <specific files>` — never `git add .` or `git add -A` - Commit with the convention format + footer:
    `       Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  `

    5c. **Push the branch:** `git push -u origin <branch-name>`

    5d. **Open a PR** with `gh pr create`: - Title: commit message of the primary (or only) commit in this PR - Body: bullet-point summary of what changed and why - Base branch: `main`

6. **Return all PR URLs** at the end so the user can review and merge each one.

## Safety Rules

- **Never push to main directly.**
- Never force push.
- Never skip hooks (`--no-verify`).
- Do not stage `.env`, secret files, or unrelated build artifacts.
