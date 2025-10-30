# Script para iniciar el Bot 4
Write-Host "🤖 Iniciando Bot 4..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot4"
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
Write-Host "🔍 Verificando puertos 3004 y 3012..." -ForegroundColor Yellow

$port3004 = Get-NetTCPConnection -LocalPort 3004 -ErrorAction SilentlyContinue
if ($port3004) {
    Write-Host "⚠️ Puerto 3004 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3004.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3012 = Get-NetTCPConnection -LocalPort 3012 -ErrorAction SilentlyContinue
if ($port3012) {
    Write-Host "⚠️ Puerto 3012 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3012.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 4 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3004" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3012" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3012" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
