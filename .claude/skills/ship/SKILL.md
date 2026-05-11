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
- Multiple scopes: `feat(ui, dev-news): ...`

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

4. **Determine branch name** from the selected groups' dominant type and a short description.

5. **Branch handling:**
   - If already on a non-main branch that matches this work, stay on it.
   - Otherwise: `git checkout -b <branch-name>` from main.

6. **For each selected group (in order):**
   - `git add <specific files>` — never `git add .` or `git add -A`
   - Commit with the convention format + footer:
     ```
     Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
     ```

7. **Push the branch:** `git push -u origin <branch-name>`

8. **Open a PR** with `gh pr create`:
   - Title: same as the primary commit message (without footer)
   - Body: bullet-point summary of what changed and why
   - Base branch: `main`

9. **Return the PR URL** so the user can review and merge.

## Safety Rules

- **Never push to main directly.**
- Never force push.
- Never skip hooks (`--no-verify`).
- Do not stage `.env`, secret files, or unrelated build artifacts.
