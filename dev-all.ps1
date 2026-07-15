$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'

if (-not (Test-Path $backendPath)) {
  throw "Backend folder not found: $backendPath"
}

if (-not (Test-Path $frontendPath)) {
  throw "Frontend folder not found: $frontendPath"
}

$backendCommand = "Set-Location '$backendPath'; go run ./cmd/api"
Start-Process powershell -ArgumentList '-NoExit', '-Command', $backendCommand

Set-Location $frontendPath
npm start
