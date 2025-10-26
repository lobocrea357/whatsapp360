# Script para iniciar todos los bots de WhatsApp en paralelo
# Uso: .\start-all-bots.ps1

Write-Host "🚀 Iniciando todos los bots de WhatsApp..." -ForegroundColor Green
Write-Host ""

# Función para iniciar un bot en una nueva ventana de PowerShell
function Start-Bot {
    param (
        [string]$BotName,
        [string]$BotPath,
        [int]$BotPort,
        [int]$ApiPort
    )
    
    Write-Host "▶️  Iniciando $BotName (Bot: $BotPort, API: $ApiPort)..." -ForegroundColor Cyan
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BotPath'; Write-Host '🤖 $BotName' -ForegroundColor Green; Write-Host 'Puerto Bot: $BotPort | Puerto API: $ApiPort' -ForegroundColor Yellow; npm run dev"
}

# Obtener la ruta base
$BasePath = $PSScriptRoot

# Iniciar cada bot
Start-Bot -BotName "Asesor 1" -BotPath "$BasePath\bot1" -BotPort 3001 -ApiPort 3009
Start-Sleep -Seconds 2

Start-Bot -BotName "Asesor 2" -BotPath "$BasePath\bot2" -BotPort 3002 -ApiPort 3010
Start-Sleep -Seconds 2

Start-Bot -BotName "Asesor 3" -BotPath "$BasePath\bot3" -BotPort 3003 -ApiPort 3011
Start-Sleep -Seconds 2

Start-Bot -BotName "Asesor 4" -BotPath "$BasePath\bot4" -BotPort 3004 -ApiPort 3012
Start-Sleep -Seconds 2

Start-Bot -BotName "Asesor 5" -BotPath "$BasePath\bot5" -BotPort 3005 -ApiPort 3013

Write-Host ""
Write-Host "✅ Todos los bots se están iniciando..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Códigos QR disponibles en:" -ForegroundColor Yellow
Write-Host "   - Asesor 1: http://localhost:3009" -ForegroundColor White
Write-Host "   - Asesor 2: http://localhost:3010" -ForegroundColor White
Write-Host "   - Asesor 3: http://localhost:3011" -ForegroundColor White
Write-Host "   - Asesor 4: http://localhost:3012" -ForegroundColor White
Write-Host "   - Asesor 5: http://localhost:3013" -ForegroundColor White
Write-Host ""
Write-Host "📊 Dashboard: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
Write-Host "⚠️  Cada bot se abrirá en una ventana separada de PowerShell" -ForegroundColor Yellow
Write-Host "⚠️  Para detener un bot, cierra su ventana correspondiente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
