param(
  [string]$ProjectsRoot = (Join-Path $env:USERPROFILE "Projects"),
  [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeScript = Join-Path $ScriptRoot "sync_agent_skill_context.mjs"

$argsForNode = @("--projects-root", $ProjectsRoot)
if (-not [string]::IsNullOrWhiteSpace($OutputDir)) {
  $argsForNode += @("--output-dir", $OutputDir)
}

node $NodeScript @argsForNode
exit $LASTEXITCODE
