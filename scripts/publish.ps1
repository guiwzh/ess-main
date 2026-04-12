<#
.SYNOPSIS
  发布 ess-main-template 到 npmjs.org

.DESCRIPTION
  自动升级版本号、构建检查、发布到 npm。
  使用项目级 .npmrc 避免被全局 JFrog 配置干扰。

.PARAMETER Version
  版本号升级类型：patch | minor | major，或直接指定版本号如 1.2.0

.EXAMPLE
  .\scripts\publish.ps1 -Version minor
  .\scripts\publish.ps1 -Version 2.0.0
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$NpmrcPath = Join-Path $ProjectRoot ".npmrc"

Set-Location $ProjectRoot

Write-Host "=== 1. 检查 .npmrc 配置 ===" -ForegroundColor Cyan
if (-not (Test-Path $NpmrcPath)) {
    Write-Error ".npmrc 文件不存在，请先创建项目级 .npmrc"
    exit 1
}

$npmrcContent = Get-Content $NpmrcPath -Raw
if ($npmrcContent -notmatch "_authToken") {
    Write-Host "未检测到 auth token，正在登录 npmjs.org..." -ForegroundColor Yellow
    npm login --registry=https://registry.npmjs.org/ --auth-type=web --userconfig="$NpmrcPath"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm 登录失败"
        exit 1
    }
}

Write-Host "=== 2. TypeScript 类型检查 ===" -ForegroundColor Cyan
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript 类型检查失败，请修复错误后重试"
    exit 1
}

Write-Host "=== 3. 升级版本号 ===" -ForegroundColor Cyan
$currentVersion = (Get-Content (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json).version
Write-Host "当前版本: $currentVersion"

npm version $Version --no-git-tag-version
if ($LASTEXITCODE -ne 0) {
    Write-Error "版本号升级失败"
    exit 1
}

$newVersion = (Get-Content (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json).version
Write-Host "新版本: $newVersion" -ForegroundColor Green

Write-Host "=== 4. 发布到 npmjs.org ===" -ForegroundColor Cyan
npm publish --registry=https://registry.npmjs.org/ --userconfig="$NpmrcPath"
if ($LASTEXITCODE -ne 0) {
    Write-Error "发布失败"
    # 回滚版本号
    npm version $currentVersion --no-git-tag-version --allow-same-version
    exit 1
}

Write-Host "=== 5. 提交版本号变更 ===" -ForegroundColor Cyan
git add package.json
git commit -m "chore: bump version to $newVersion"

Write-Host ""
Write-Host "=== 发布成功! ===" -ForegroundColor Green
Write-Host "包名: ess-main-template@$newVersion"
Write-Host "查看: https://www.npmjs.com/package/ess-main-template"
