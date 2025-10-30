# Script para copiar archivos faltantes de bot1 a bots 6-10
Write-Host "🔧 Copiando archivos faltantes a bots 6-10..." -ForegroundColor Cyan
Write-Host ""

$baseDir = "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot"
$sourceBot = "$baseDir\bot1"

# Lista de archivos a copiar
$filesToCopy = @(
    "package.json",
    "package-lock.json",
    "README.md",
    "SUPABASE_SETUP.md",
    "supabase-schema.sql",
    "env.example",
    "src\supabase.js",
    "src\message-sync.js"
)

# Función para copiar archivos
function Copy-BotFiles {
    param (
        [int]$BotNum
    )
    
    $targetBot = "$baseDir\bot$BotNum"
    Write-Host "Bot $BotNum:" -ForegroundColor Yellow
    
    foreach ($file in $filesToCopy) {
        $sourcePath = Join-Path $sourceBot $file
        $targetPath = Join-Path $targetBot $file
        
        # Crear directorio si no existe
        $targetDir = Split-Path $targetPath -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Copiar archivo si existe en origen
        if (Test-Path $sourcePath) {
            Copy-Item -Path $sourcePath -Destination $targetPath -Force
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $file no encontrado en bot1" -ForegroundColor Yellow
        }
    }
    
    # Actualizar package.json con el puerto correcto
    $packageJsonPath = "$targetBot\package.json"
    if (Test-Path $packageJsonPath) {
        $port = 3000 + $BotNum
        $content = Get-Content $packageJsonPath -Raw
        $content = $content -replace 'PORT=3001', "PORT=$port"
        Set-Content -Path $packageJsonPath -Value $content
        Write-Host "  ✅ package.json actualizado con PORT=$port" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Copiar a cada bot
Copy-BotFiles -BotNum 6
Copy-BotFiles -BotNum 7
Copy-BotFiles -BotNum 8
Copy-BotFiles -BotNum 9
Copy-BotFiles -BotNum 10

Write-Host "✅ Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Siguiente paso: Verifica que cada bot tenga todos los archivos necesarios" -ForegroundColor Cyan
