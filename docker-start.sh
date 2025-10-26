#!/bin/bash
# Script para iniciar el sistema Multi-Bot con Docker

echo "🐳 Iniciando Sistema Multi-Bot WhatsApp con Docker..."
echo ""

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar que los archivos .env existen
echo "📋 Verificando archivos de configuración..."
missing_env=0

for i in {1..5}; do
    if [ ! -f "bot$i/.env" ]; then
        echo "⚠️  Falta bot$i/.env"
        missing_env=1
    fi
done

if [ ! -f "dashboard/.env.local" ]; then
    echo "⚠️  Falta dashboard/.env.local"
    missing_env=1
fi

if [ $missing_env -eq 1 ]; then
    echo ""
    echo "❌ Faltan archivos de configuración. Por favor configura los archivos .env antes de continuar."
    echo "   Ver DOCKER_SETUP.md para más información."
    exit 1
fi

echo "✅ Todos los archivos de configuración están presentes"
echo ""

# Construir las imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir las imágenes"
    exit 1
fi

echo ""
echo "✅ Imágenes construidas exitosamente"
echo ""

# Iniciar los contenedores
echo "▶️  Iniciando contenedores..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Error al iniciar los contenedores"
    exit 1
fi

echo ""
echo "✅ Contenedores iniciados exitosamente"
echo ""

# Esperar un momento para que los servicios se inicien
echo "⏳ Esperando a que los servicios se inicien..."
sleep 10

# Verificar el estado
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "📱 Códigos QR disponibles en:"
echo "   - Bot 1 (Asesor 1): http://localhost:3009"
echo "   - Bot 2 (Asesor 2): http://localhost:3010"
echo "   - Bot 3 (Asesor 3): http://localhost:3011"
echo "   - Bot 4 (Asesor 4): http://localhost:3012"
echo "   - Bot 5 (Asesor 5): http://localhost:3013"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo ""
echo "📝 Para ver los logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener el sistema:"
echo "   docker-compose down"
echo ""
