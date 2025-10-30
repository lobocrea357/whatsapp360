# Script para iniciar el Bot 6
Write-Host "🤖 Iniciando Bot 6..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
$botDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot6"
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
Write-Host "🔍 Verificando puertos 3006 y 3014..." -ForegroundColor Yellow

$port3006 = Get-NetTCPConnection -LocalPort 3006 -ErrorAction SilentlyContinue
if ($port3006) {
    Write-Host "⚠️ Puerto 3006 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3006.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

$port3014 = Get-NetTCPConnection -LocalPort 3014 -ErrorAction SilentlyContinue
if ($port3014) {
    Write-Host "⚠️ Puerto 3014 en uso. Liberando..." -ForegroundColor Yellow
    $processId = $port3014.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar el bot y la API en paralelo
Write-Host "🚀 Iniciando Bot 6 y API Server..." -ForegroundColor Green
Write-Host "   - Bot WhatsApp en puerto 3006" -ForegroundColor Cyan
Write-Host "   - API Server en puerto 3014" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📱 Para conectar WhatsApp, abre: http://localhost:3014" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Ejecutar npm run dev (que inicia bot y api juntos)
npm run dev
