# Script para iniciar el Bot 1
Write-Host "🤖 Iniciando Bot 1..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot1"
Set-Location $botDir

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: No se encuentra el archivo .env" -ForegroundColor Red
    exit 1
}

# Verificar que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Matar procesos que puedan estar usando los puertos
Write-Host "🔍 Verificando puertos 3001 y 3009..." -ForegroundColor Yellow

$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port3001) {
    Write-Host "⚠️ Puerto 3001 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3001.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3009 = Get-NetTCPConnection -LocalPort 3009 -ErrorAction SilentlyContinue
if ($port3009) {
    Write-Host "⚠️ Puerto 3009 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3009.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 1 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3001" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3009" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3009" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
