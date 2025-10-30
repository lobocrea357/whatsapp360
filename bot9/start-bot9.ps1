# Script para iniciar el Bot 9
Write-Host "🤖 Iniciando Bot 9..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot9"
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
Write-Host "🔍 Verificando puertos 3009 y 3017..." -ForegroundColor Yellow

$port3009 = Get-NetTCPConnection -LocalPort 3009 -ErrorAction SilentlyContinue
if ($port3009) {
    Write-Host "⚠️ Puerto 3009 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3009.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3017 = Get-NetTCPConnection -LocalPort 3017 -ErrorAction SilentlyContinue
if ($port3017) {
    Write-Host "⚠️ Puerto 3017 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3017.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 9 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3009" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3017" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3017" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
