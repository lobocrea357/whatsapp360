#!/bin/bash
# Script para detener el sistema Multi-Bot con Docker

echo "🛑 Deteniendo Sistema Multi-Bot WhatsApp..."
echo ""

# Detener los contenedores
docker-compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Todos los contenedores han sido detenidos"
    echo ""
    echo "💡 Para iniciar nuevamente: ./docker-start.sh"
    echo "💡 Para eliminar volúmenes (sesiones): docker-compose down -v"
else
    echo ""
    echo "❌ Error al detener los contenedores"
    exit 1
fi
