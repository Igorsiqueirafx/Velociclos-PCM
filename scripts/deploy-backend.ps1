#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploy the Velociclos backend to Vercel production without Railway or paid GitHub Actions.

.PARAMETER DryRun
Run deployment in dry-run mode without actually deploying.
#>
param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

function Write-Header([string]$text) {
  Write-Host "`n=== $text ===" -ForegroundColor Cyan
}

function Write-Step([string]$text) {
  Write-Host "• $text" -ForegroundColor Yellow
}

function Write-Ok([string]$text) {
  Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Fail([string]$text) {
  Write-Host "✗ $text" -ForegroundColor Red
}

$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'backend'

if (-not (Test-Path $backend)) {
  Write-Fail "Backend directory not found at: $backend"
  exit 1
}

Write-Header 'Velociclos Backend Deploy'
Write-Step 'Backend directory: {0}' -f $backend

Set-Location $backend

$projectArgs = @('--project', 'velociclos-api')
if ($DryRun) {
  $projectArgs += '--dry-run'
}

Write-Step 'Deploying backend to Vercel...'
try {
  $output = vercel --prod @projectArgs 2>&1 | Out-String
  Write-Ok 'Deploy command finished.'
  Write-Host $output
} catch {
  Write-Fail 'Vercel deploy failed.'
  Write-Host $_
  exit 1
}

Write-Header 'Post-deploy validation'
$healthUrl = 'https://velociclos-api.vercel.app/api/health'
$statusCode = 0
try {
  $response = Invoke-WebRequest -Uri $healthUrl -Method Head -UseBasicParsing -ErrorAction Stop
  $statusCode = $response.StatusCode
} catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
}

if ($statusCode -eq 200) {
  Write-Ok "Backend health check passed: $healthUrl"
} else {
  Write-Fail "Backend health check failed with status: $statusCode"
  Write-Host "Make sure Supabase environment variables are configured in Vercel Dashboard."
  exit 1
}

Write-Ok 'Backend deploy finished.'
Write-Host "`nRequired Vercel environment variables:"
Write-Host "  SUPABASE_URL"
Write-Host "  SUPABASE_PUBLISHABLE_KEY"
Write-Host "  SUPABASE_SECRET_KEY (optional)"
Write-Host "  FRONTEND_URL=https://velociclos.vercel.app"
Write-Host "  CORS_ORIGIN=https://velociclos.vercel.app"
Write-Host "  YOUTUBE_API_KEY"
Write-Host "  PLAYLIST_IDS"
Write-Host "  USE_IN_MEMORY=false"
Write-Host "  BACKEND_URL=https://velociclos-api.vercel.app"
