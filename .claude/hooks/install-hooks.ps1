#Requires -Version 5.1
# Installs git pre-commit hook for packages/ui changeset enforcement.
# Run once after cloning: powershell -File .claude/hooks/install-hooks.ps1
$ErrorActionPreference = 'Stop'

$repoRoot  = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$hooksDir  = Join-Path $repoRoot '.git\hooks'

if (-not (Test-Path $hooksDir)) {
    Write-Error "Not a git repository or .git/hooks not found at $hooksDir"
    exit 1
}

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# ── pre-commit.ps1 (PowerShell logic) ────────────────────────────────────
$ps1Path    = Join-Path $hooksDir 'pre-commit.ps1'
$ps1Content = @'
#Requires -Version 5.1
$ErrorActionPreference = 'SilentlyContinue'

$staged = git diff --cached --name-only 2>$null
if (-not $staged) { exit 0 }

$uiChanged = $staged | Where-Object { $_ -match '^packages/ui/' }
if (-not $uiChanged) { exit 0 }

# ── Changeset check (advisory by default) ────────────────────────────────
$changesetStaged = $staged | Where-Object { $_ -match '^\.changeset/[^/]+\.md$' }
if (-not $changesetStaged) {
    $slug = Get-Date -Format 'yyyyMMdd-HHmmss'
    $msg = "[CHANGESET] packages/ui has staged changes but no changeset file is staged.`n`n  To add a changeset:`n    1. Copy .changeset\template.md to .changeset\$slug-<slug>.md`n    2. Fill in type (patch/minor/major) and summary`n    3. git add .changeset\*.md`n    4. git commit`n`n  To skip (not recommended): git commit --no-verify"
    [Console]::Error.WriteLine($msg)
    if ($env:CHANGESET_BLOCK -eq '1') { exit 1 }
}

# ── Type-check: @vibe/ui + all dependents (always blocking) ──────────────
[Console]::Error.WriteLine("[TYPE-CHECK] packages/ui changed — verifying @vibe/ui and all dependents...")
$ErrorActionPreference = 'Continue'

pnpm turbo run type-check --filter=...@vibe/ui
$tcResult = $LASTEXITCODE

if ($tcResult -ne 0) {
    [Console]::Error.WriteLine("`n[TYPE-CHECK FAILED] Fix type errors before committing.")
    exit 1
}

[Console]::Error.WriteLine("[TYPE-CHECK] All packages passed.")
exit 0
'@
[System.IO.File]::WriteAllText($ps1Path, $ps1Content, $utf8NoBom)

# ── pre-commit (sh trampoline for Git Bash — must be BOM-free) ───────────
$trampolinePath    = Join-Path $hooksDir 'pre-commit'
$trampolineContent = @'
#!/bin/sh
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(git rev-parse --show-toplevel)/.git/hooks/pre-commit.ps1"
exit $?
'@
[System.IO.File]::WriteAllText($trampolinePath, $trampolineContent, $utf8NoBom)

Write-Host "Git hooks installed:"
Write-Host "  $trampolinePath"
Write-Host "  $ps1Path"
Write-Host ""
Write-Host "To enforce blocking (exit 1): set CHANGESET_BLOCK=1 in your shell."
