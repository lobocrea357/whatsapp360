# Script para iniciar el Bot 10
Write-Host "🤖 Iniciando Bot 10..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot10"
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
Write-Host "🔍 Verificando puertos 3010 y 3018..." -ForegroundColor Yellow

$port3010 = Get-NetTCPConnection -LocalPort 3010 -ErrorAction SilentlyContinue
if ($port3010) {
    Write-Host "⚠️ Puerto 3010 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3010.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3018 = Get-NetTCPConnection -LocalPort 3018 -ErrorAction SilentlyContinue
if ($port3018) {
    Write-Host "⚠️ Puerto 3018 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3018.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 10 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3010" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3018" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3018" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
