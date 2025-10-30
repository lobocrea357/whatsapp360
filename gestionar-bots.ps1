# Script Maestro para Gestionar Todos los Bots
# Permite iniciar, detener y ver el estado de todos los bots

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("iniciar", "detener", "estado", "ayuda")]
    [string]$Accion = "ayuda",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("1", "2", "3", "4", "5", "todos")]
    [string]$Bot = "todos"
)

$baseDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot"

# Configuración de bots
$bots = @{
    "1" = @{ Nombre = "Bot 1 (Asesor 1)"; Puerto = 3001; API = 3009; Dir = "bot1" }
    "2" = @{ Nombre = "Bot 2 (Asesor 2)"; Puerto = 3002; API = 3010; Dir = "bot2" }
    "3" = @{ Nombre = "Bot 3 (Asesor 3)"; Puerto = 3003; API = 3011; Dir = "bot3" }
    "4" = @{ Nombre = "Bot 4 (Asesor 4)"; Puerto = 3004; API = 3012; Dir = "bot4" }
    "5" = @{ Nombre = "Bot 5 (Asesor 5)"; Puerto = 3005; API = 3013; Dir = "bot5" }
}

function Show-Header {
    Clear-Host
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          🤖 GESTOR DE BOTS WHATSAPP - VIAJES NOVA         ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Show-Header
    Write-Host "📖 USO DEL SCRIPT:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  .\gestionar-bots.ps1 -Accion <accion> -Bot <numero>" -ForegroundColor White
    Write-Host ""
    Write-Host "ACCIONES DISPONIBLES:" -ForegroundColor Green
    Write-Host "  iniciar   - Inicia uno o todos los bots" -ForegroundColor White
    Write-Host "  detener   - Detiene uno o todos los bots" -ForegroundColor White
    Write-Host "  estado    - Muestra el estado de los bots" -ForegroundColor White
    Write-Host "  ayuda     - Muestra esta ayuda" -ForegroundColor White
    Write-Host ""
    Write-Host "BOTS DISPONIBLES:" -ForegroundColor Green
    Write-Host "  1         - Bot 1 (Asesor 1) - Puertos: 3001/3009" -ForegroundColor White
    Write-Host "  2         - Bot 2 (Asesor 2) - Puertos: 3002/3010" -ForegroundColor White
    Write-Host "  3         - Bot 3 (Asesor 3) - Puertos: 3003/3011" -ForegroundColor White
    Write-Host "  4         - Bot 4 (Asesor 4) - Puertos: 3004/3012" -ForegroundColor White
    Write-Host "  5         - Bot 5 (Asesor 5) - Puertos: 3005/3013" -ForegroundColor White
    Write-Host "  todos     - Todos los bots" -ForegroundColor White
    Write-Host ""
    Write-Host "EJEMPLOS:" -ForegroundColor Green
    Write-Host "  .\gestionar-bots.ps1 -Accion iniciar -Bot 1" -ForegroundColor Cyan
    Write-Host "  .\gestionar-bots.ps1 -Accion detener -Bot todos" -ForegroundColor Cyan
    Write-Host "  .\gestionar-bots.ps1 -Accion estado" -ForegroundColor Cyan
    Write-Host ""
}

function Get-BotStatus {
    param([int]$Puerto, [int]$API)
    
    $botRunning = Get-NetTCPConnection -LocalPort $Puerto -ErrorAction SilentlyContinue
    $apiRunning = Get-NetTCPConnection -LocalPort $API -ErrorAction SilentlyContinue
    
    if ($botRunning -and $apiRunning) {
        return "🟢 ACTIVO"
    } elseif ($botRunning -or $apiRunning) {
        return "🟡 PARCIAL"
    } else {
        return "🔴 DETENIDO"
    }
}

function Show-Status {
    Show-Header
    Write-Host "📊 ESTADO DE LOS BOTS:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($key in $bots.Keys | Sort-Object) {
        $bot = $bots[$key]
        $status = Get-BotStatus -Puerto $bot.Puerto -API $bot.API
        
        Write-Host "  $($bot.Nombre)" -ForegroundColor Cyan
        Write-Host "    Estado: $status" -NoNewline
        if ($status -eq "🟢 ACTIVO") {
            Write-Host " - http://localhost:$($bot.API)" -ForegroundColor Green
        } else {
            Write-Host ""
        }
        Write-Host "    Puertos: Bot=$($bot.Puerto), API=$($bot.API)" -ForegroundColor Gray
        Write-Host ""
    }
}

function Start-Bot {
    param([string]$BotNum)
    
    $bot = $bots[$BotNum]
    $botDir = Join-Path $baseDir $bot.Dir
    $scriptPath = Join-Path $botDir "start-bot$BotNum.ps1"
    
    Write-Host "🚀 Iniciando $($bot.Nombre)..." -ForegroundColor Green
    
    if (Test-Path $scriptPath) {
        Start-Process powershell -ArgumentList "-NoExit", "-File", $scriptPath
        Write-Host "   ✅ Script de inicio ejecutado" -ForegroundColor Green
        Write-Host "   📱 URL: http://localhost:$($bot.API)" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Error: No se encuentra el script de inicio" -ForegroundColor Red
    }
}

function Stop-Bot {
    param([string]$BotNum)
    
    $bot = $bots[$BotNum]
    $botDir = Join-Path $baseDir $bot.Dir
    $scriptPath = Join-Path $botDir "stop-bot$BotNum.ps1"
    
    Write-Host "🛑 Deteniendo $($bot.Nombre)..." -ForegroundColor Yellow
    
    if (Test-Path $scriptPath) {
        & $scriptPath
    } else {
        Write-Host "   ❌ Error: No se encuentra el script de detención" -ForegroundColor Red
    }
}

# Ejecutar acción
switch ($Accion) {
    "ayuda" {
        Show-Help
    }
    
    "estado" {
        Show-Status
    }
    
    "iniciar" {
        Show-Header
        if ($Bot -eq "todos") {
            Write-Host "🚀 Iniciando todos los bots..." -ForegroundColor Green
            Write-Host ""
            foreach ($key in $bots.Keys | Sort-Object) {
                Start-Bot -BotNum $key
                Start-Sleep -Seconds 2
            }
            Write-Host ""
            Write-Host "✅ Todos los bots han sido iniciados" -ForegroundColor Green
            Write-Host "   Cada bot se abrió en una ventana separada" -ForegroundColor Cyan
        } else {
            Start-Bot -BotNum $Bot
        }
        Write-Host ""
    }
    
    "detener" {
        Show-Header
        if ($Bot -eq "todos") {
            Write-Host "🛑 Deteniendo todos los bots..." -ForegroundColor Yellow
            Write-Host ""
            foreach ($key in $bots.Keys | Sort-Object) {
                Stop-Bot -BotNum $key
            }
            Write-Host ""
            Write-Host "✅ Todos los bots han sido detenidos" -ForegroundColor Green
        } else {
            Stop-Bot -BotNum $Bot
        }
        Write-Host ""
    }
}
