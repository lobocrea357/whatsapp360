# Script para iniciar el Bot 8
Write-Host "🤖 Iniciando Bot 8..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot8"
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
Write-Host "🔍 Verificando puertos 3008 y 3016..." -ForegroundColor Yellow

$port3008 = Get-NetTCPConnection -LocalPort 3008 -ErrorAction SilentlyContinue
if ($port3008) {
    Write-Host "⚠️ Puerto 3008 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3008.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3016 = Get-NetTCPConnection -LocalPort 3016 -ErrorAction SilentlyContinue
if ($port3016) {
    Write-Host "⚠️ Puerto 3016 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3016.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 8 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3008" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3016" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3016" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
