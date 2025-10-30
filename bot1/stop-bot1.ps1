# Script para detener el Bot 1
Write-Host "🛑 Deteniendo Bot 1..." -ForegroundColor Yellow

# Función para matar procesos en un puerto específico
function Stop-ProcessOnPort {
    param (
        [int]$Port
    )
    
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Deteniendo proceso en puerto $Port (PID: $processId)..." -ForegroundColor Cyan
            Stop-Process -Id $processId -Force
            Write-Host "   ✅ Puerto $Port liberado" -ForegroundColor Green
        }
    } else {
        Write-Host "   ℹ️ Puerto $Port ya está libre" -ForegroundColor Gray
    }
}

# Detener procesos en los puertos del Bot 1
Stop-ProcessOnPort -Port 3001
Stop-ProcessOnPort -Port 3009

# Buscar y matar procesos de Node.js relacionados con bot1
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*bot1*" -or $_.CommandLine -like "*bot1*"
}

if ($nodeProcesses) {
    Write-Host "   Deteniendo procesos adicionales de Node.js..." -ForegroundColor Cyan
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force
    }
    Write-Host "   ✅ Procesos adicionales detenidos" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Bot 1 detenido completamente" -ForegroundColor Green
