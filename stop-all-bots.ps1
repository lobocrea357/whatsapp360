# Script para detener todos los bots de WhatsApp
# Uso: .\stop-all-bots.ps1

Write-Host "🛑 Deteniendo todos los bots de WhatsApp..." -ForegroundColor Red
Write-Host ""

# Puertos de los bots
$ports = @(3001, 3002, 3003, 3004, 3005, 3009, 3010, 3011, 3012, 3013)

foreach ($port in $ports) {
    Write-Host "Buscando procesos en puerto $port..." -ForegroundColor Yellow
    
    # Buscar el PID del proceso usando el puerto
    $connections = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"
    
    if ($connections) {
        foreach ($connection in $connections) {
            # Extraer el PID (última columna)
            $pid = ($connection -split '\s+')[-1]
            
            if ($pid -and $pid -match '^\d+$') {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "  ✓ Deteniendo proceso $($process.ProcessName) (PID: $pid)" -ForegroundColor Green
                        Stop-Process -Id $pid -Force
                    }
                } catch {
                    Write-Host "  ✗ Error al detener proceso PID: $pid" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "  - No hay procesos en puerto $port" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Todos los bots han sido detenidos" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
