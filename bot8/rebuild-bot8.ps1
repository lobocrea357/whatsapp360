# Script para reconstruir y reiniciar el contenedor bot8
Write-Host "🔧 Reconstruyendo y reiniciando Bot 8..." -ForegroundColor Cyan

# Ir al directorio raíz donde está docker-compose
$rootDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot"
Set-Location $rootDir

# Detener el contenedor bot8
Write-Host "🛑 Deteniendo contenedor bot8..." -ForegroundColor Yellow
docker-compose stop bot8

# Eliminar el contenedor bot8
Write-Host "🗑️ Eliminando contenedor bot8..." -ForegroundColor Yellow
docker-compose rm -f bot8

# Limpiar volúmenes de sesión del bot8 (esto eliminará la sesión corrupta)
Write-Host "🧹 Limpiando sesión corrupta del bot8..." -ForegroundColor Yellow
docker volume rm bot_bot8_sessions -f 2>$null

# Reconstruir la imagen del bot8
Write-Host "🔨 Reconstruyendo imagen del bot8..." -ForegroundColor Yellow
docker-compose build --no-cache bot8

# Iniciar el contenedor bot8
Write-Host "🚀 Iniciando contenedor bot8..." -ForegroundColor Green
docker-compose up -d bot8

# Esperar un momento
Start-Sleep -Seconds 3

# Mostrar logs
Write-Host "" -ForegroundColor White
Write-Host "📋 Mostrando logs del bot8 (Ctrl+C para salir)..." -ForegroundColor Cyan
Write-Host "📱 Para escanear el QR, abre: http://localhost:3016" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

docker-compose logs -f bot8
