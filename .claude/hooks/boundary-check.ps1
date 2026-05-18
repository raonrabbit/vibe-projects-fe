#Requires -Version 5.1
# PreToolUse hook: team boundary enforcement with agent routing guidance.
$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $payload = $raw | ConvertFrom-Json } catch { exit 0 }

$filePath = $payload.tool_input.file_path
if (-not $filePath) { exit 0 }

# Normalize to repo-root-relative forward-slash path
$repoRoot   = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) -replace '\\', '/'
$normalized = $filePath -replace '\\', '/'
$relPath    = $normalized -replace [regex]::Escape($repoRoot + '/'), ''
if ($relPath -eq $normalized) { exit 0 }   # not under repo root

# Skip .claude/ internal files
if ($relPath -like '.claude/*') { exit 0 }

# ── Zone → Team name + Agent briefing map ─────────────────────────────────
$teamMap = @{
    'packages/ui'           = @{ name = 'Design System';  agent = '.claude/agents/design-system.md' }
    'packages/figma-plugin' = @{ name = 'Figma Sync';     agent = '.claude/agents/figma-sync.md'    }
    'apps/dev-news'         = @{ name = 'Dev-News App';   agent = '.claude/agents/dev-news.md'      }
}

# Infra zone covers root-level config paths (not under apps/ or packages/)
$infraPaths = @('.github', 'turbo.json', 'pnpm-workspace.yaml', 'package.json', '.prettierrc', '.gitignore')

# ── Parse workspace.yaml for zone paths ────────────────────────────────────
$yamlPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'workspace.yaml'
if (-not (Test-Path $yamlPath)) { exit 0 }

$zones     = [System.Collections.Generic.List[string]]::new()
$inSection = $false

foreach ($line in (Get-Content $yamlPath -Encoding UTF8)) {
    if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
    if ($line -match '^(packages|apps):')               { $inSection = $true; continue }
    if ($line -match '^[^\s-]' -and $line -notmatch '^(packages|apps):') { $inSection = $false }
    if ($inSection -and $line -match '^\s+-\s+path:\s+(.+)') {
        $zones.Add($Matches[1].Trim())
    }
}
$zones = @($zones | Sort-Object { $_.Length } -Descending)

# ── Resolve zone and team for the file being edited ────────────────────────
$fileZone = $null
$fileTeam = $null

foreach ($z in $zones) {
    if ($relPath -like "$z/*" -or $relPath -eq $z) {
        $fileZone = $z
        $fileTeam = $teamMap[$z]
        break
    }
}

# Check infra zone if no package zone matched
if (-not $fileZone) {
    foreach ($p in $infraPaths) {
        if ($relPath -eq $p -or $relPath -like "$p/*") {
            $fileZone = 'infra'
            $fileTeam = @{ name = 'Monorepo Infra'; agent = '.claude/agents/infra.md' }
            break
        }
    }
}

if (-not $fileZone) { exit 0 }   # unrecognized path, skip

# ── Read session state ──────────────────────────────────────────────────────
$statePath   = Join-Path (Split-Path $PSScriptRoot -Parent) '.boundary-state'
$sessionZone = $null
$stateValid  = $false

if (Test-Path $statePath) {
    $stateLines = Get-Content $statePath -Encoding UTF8
    if ($stateLines.Count -ge 2) {
        $storedZone  = $stateLines[0].Trim()
        $storedEpoch = [long]$stateLines[1].Trim()
        $nowEpoch    = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        if (($nowEpoch - $storedEpoch) -lt 14400) {
            $sessionZone = $storedZone
            $stateValid  = $true
        }
    }
}

# ── Emit advisory ───────────────────────────────────────────────────────────
$msg = $null

if (-not $stateValid) {
    # First edit of session — record zone, greet with team context
    $epoch = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    [System.IO.File]::WriteAllText($statePath, "$fileZone`n$epoch`n", [System.Text.Encoding]::UTF8)
    $msg = "[TEAM: $($fileTeam.name)] Session started. Zone: $fileZone"
} elseif ($fileZone -ne $sessionZone) {
    # Cross-boundary — name the owning team and the agent to spawn
    $sessionTeamName = if ($teamMap[$sessionZone]) { $teamMap[$sessionZone].name } else { 'Monorepo Infra' }
    $msg = "[TEAM BOUNDARY] Direct edit blocked. File belongs to: $($fileTeam.name) team ($fileZone). Current session: $sessionTeamName ($sessionZone). Do NOT edit directly - spawn the $($fileTeam.name) Agent using briefing: $($fileTeam.agent)"
}

if ($msg) {
    @{
        hookSpecificOutput = @{
            hookEventName     = 'PreToolUse'
            additionalContext = $msg
        }
    } | ConvertTo-Json -Compress
}

exit 0
