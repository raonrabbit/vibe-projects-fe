#Requires -Version 5.1
# Advisory-only hook: never block, never fail loudly.
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $payload = $raw | ConvertFrom-Json } catch { exit 0 }

$editedRaw = $payload.tool_input.file_path
if (-not $editedRaw) { exit 0 }

# Normalize to forward-slash repo-root-relative path
$repoRoot  = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) -replace '\\', '/'
$normalized = $editedRaw -replace '\\', '/'
$edited     = $normalized -replace [regex]::Escape($repoRoot + '/'), ''

# If stripping failed (path not under repo root), skip silently
if ($edited -eq $normalized) { exit 0 }

# workspace.yaml changes are handled by sync-workspace.ps1 — skip here
if ($edited -eq '.claude/workspace.yaml' -or $edited -like '*/.claude/workspace.yaml') { exit 0 }

# Load dependency-map.yaml
$mapPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'dependency-map.yaml'
if (-not (Test-Path $mapPath)) { exit 0 }

# ── Hand-parse dependency-map.yaml ────────────────────────────────────────
$edges      = [System.Collections.Generic.List[hashtable]]::new()
$current    = $null
$inEdges    = $false
$inTargets  = $false

foreach ($line in (Get-Content $mapPath -Encoding UTF8)) {
    if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }

    if ($line -match '^edges:') {
        $inEdges = $true; continue
    }

    if ($inEdges -and $line -match '^\s+-\s+source:\s*"?([^"#\r\n]+?)"?\s*$') {
        if ($current) { $edges.Add($current) }
        $current   = @{ source = $Matches[1].Trim(); targets = @(); message = '' }
        $inTargets = $false
        continue
    }

    if ($current) {
        if ($line -match '^\s+targets:\s*$') {
            $inTargets = $true; continue
        }
        if ($inTargets -and $line -match '^\s+-\s+"?([^"#\r\n]+?)"?\s*$') {
            $current.targets += $Matches[1].Trim(); continue
        }
        if ($line -match '^\s+message:\s*"?([^"#\r\n]+?)"?\s*$') {
            $current.message = $Matches[1].Trim(); $inTargets = $false; continue
        }
        # Any non-indented line starts a new top-level block
        if ($line -notmatch '^\s') { $inTargets = $false }
    }
}
if ($current) { $edges.Add($current) }

# ── Match edges and collect warnings ──────────────────────────────────────
$warnings = [System.Collections.Generic.List[string]]::new()

foreach ($edge in $edges) {
    if ($edited -notlike $edge.source) { continue }

    # Exclude the file just edited from the target list (no self-warnings)
    $relevant = $edge.targets | Where-Object { $_ -ne $edited }
    if (-not $relevant) { continue }

    $targetList = ($relevant -join ', ')
    $msg = if ($edge.message) { $edge.message } else { "You edited '$edited' — also check: $targetList" }
    $warnings.Add("[DEP-WARN] $msg")
}

if ($warnings.Count -eq 0) { exit 0 }

@{
    hookSpecificOutput = @{
        hookEventName     = 'PostToolUse'
        additionalContext = ($warnings -join "`n")
    }
} | ConvertTo-Json -Compress

exit 0
