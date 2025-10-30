# Script para iniciar el Bot 3
Write-Host "🤖 Iniciando Bot 3..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot3"
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
Write-Host "🔍 Verificando puertos 3003 y 3011..." -ForegroundColor Yellow

$port3003 = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if ($port3003) {
    Write-Host "⚠️ Puerto 3003 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3003.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3011 = Get-NetTCPConnection -LocalPort 3011 -ErrorAction SilentlyContinue
if ($port3011) {
    Write-Host "⚠️ Puerto 3011 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3011.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 3 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3003" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3011" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3011" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
