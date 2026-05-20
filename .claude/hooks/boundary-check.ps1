#Requires -Version 5.1
# PreToolUse hook: team boundary enforcement — blocks all direct edits to team-owned zones.
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

# Skip .claude/ internal files (avoid chicken-and-egg when editing hooks)
if ($relPath -like '.claude/*') { exit 0 }

# ── Zone → Team name + Agent briefing map ─────────────────────────────────
$teamMap = @{
    'packages/ui'           = @{ name = 'Design System';   agent = '.claude/agents/design-system.md' }
    'packages/figma-plugin' = @{ name = 'Figma Sync';      agent = '.claude/agents/figma-sync.md'    }
    'apps/dev-news'         = @{ name = 'Dev-News App';    agent = '.claude/agents/dev-news.md'      }
    'apps/mercari-kor'      = @{ name = 'Mercari KOR App'; agent = '.claude/agents/mercari-kor.md'   }
    'apps/my-page'          = @{ name = 'My Page App';     agent = '.claude/agents/my-page.md'       }
}

# Infra zone covers root-level config paths
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

if (-not $fileZone) { exit 0 }   # unrecognized path, allow

# ── Block all direct edits to team-owned files ──────────────────────────────
$msg = "[TEAM BOUNDARY BLOCKED] '$relPath' 는 $($fileTeam.name) 팀($fileZone) 소유 파일입니다. 직접 수정 금지 — 사용자에게 $($fileTeam.name) Agent 소환 여부를 먼저 확인하세요. Agent 브리핑: $($fileTeam.agent)"

@{
    hookSpecificOutput = @{
        hookEventName     = 'PreToolUse'
        additionalContext = $msg
    }
} | ConvertTo-Json -Compress

exit 1
