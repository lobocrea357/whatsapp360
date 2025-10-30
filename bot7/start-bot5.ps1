# Script para iniciar el Bot 5
Write-Host "🤖 Iniciando Bot 5..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot5"
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
Write-Host "🔍 Verificando puertos 3005 y 3013..." -ForegroundColor Yellow

$port3005 = Get-NetTCPConnection -LocalPort 3005 -ErrorAction SilentlyContinue
if ($port3005) {
    Write-Host "⚠️ Puerto 3005 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3005.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3013 = Get-NetTCPConnection -LocalPort 3013 -ErrorAction SilentlyContinue
if ($port3013) {
    Write-Host "⚠️ Puerto 3013 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3013.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 5 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3005" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3013" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3013" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
