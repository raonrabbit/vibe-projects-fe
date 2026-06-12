# Changesets

Add a changeset file here whenever you modify `packages/tsconfig` or `packages/eslint-config`. Name it:

    YYYYMMDD-HHmmss-<slug>.md   (e.g. 20260519-143022-tsconfig-target.md)

The pre-commit hook warns when `packages/tsconfig` or `packages/eslint-config` is staged without a changeset staged alongside.

See `template.md` for the required frontmatter format.
