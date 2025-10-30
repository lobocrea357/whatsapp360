# Script para detener el Bot 7
Write-Host "🛑 Deteniendo Bot 7..." -ForegroundColor Yellow

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

# Detener procesos en los puertos del Bot 7
Stop-ProcessOnPort -Port 3007
Stop-ProcessOnPort -Port 3015

Write-Host ""
Write-Host "✅ Bot 7 detenido completamente" -ForegroundColor Green
