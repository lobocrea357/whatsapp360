# Script para iniciar el Bot 7
Write-Host "🤖 Iniciando Bot 7..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot7"
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
Write-Host "🔍 Verificando puertos 3007 y 3015..." -ForegroundColor Yellow

$port3007 = Get-NetTCPConnection -LocalPort 3007 -ErrorAction SilentlyContinue
if ($port3007) {
    Write-Host "⚠️ Puerto 3007 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3007.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3015 = Get-NetTCPConnection -LocalPort 3015 -ErrorAction SilentlyContinue
if ($port3015) {
    Write-Host "⚠️ Puerto 3015 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3015.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 7 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3007" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3015" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3015" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
