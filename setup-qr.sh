#!/bin/bash

# Script de configuración rápida para acceder al QR del bot de WhatsApp
# en Google Cloud VM

echo "🤖 Configuración del Bot de WhatsApp - Acceso al QR"
echo "=================================================="
echo ""

# Obtener la IP externa de la VM
echo "📡 Obteniendo IP externa de la VM..."
EXTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)

if [ -z "$EXTERNAL_IP" ]; then
    echo "❌ No se pudo obtener la IP externa. ¿Estás en una VM de Google Cloud?"
    echo "   Puedes obtener la IP manualmente desde Google Cloud Console."
    exit 1
fi

echo "✅ IP Externa: $EXTERNAL_IP"
echo ""

# Verificar si el firewall está configurado
echo "🔥 Verificando configuración del firewall..."
FIREWALL_RULE=$(gcloud compute firewall-rules list --filter="name=allow-bot-qr" --format="value(name)" 2>/dev/null)

if [ -z "$FIREWALL_RULE" ]; then
    echo "⚠️  La regla de firewall no existe. ¿Deseas crearla? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        echo "🔧 Creando regla de firewall..."
        gcloud compute firewall-rules create allow-bot-qr \
            --allow tcp:3009 \
            --source-ranges 0.0.0.0/0 \
            --description "Permitir acceso al QR del bot de WhatsApp"
        
        if [ $? -eq 0 ]; then
            echo "✅ Regla de firewall creada exitosamente"
        else
            echo "❌ Error al crear la regla de firewall"
            exit 1
        fi
    else
        echo "⚠️  Sin la regla de firewall, no podrás acceder al QR desde tu navegador"
    fi
else
    echo "✅ Regla de firewall 'allow-bot-qr' ya existe"
fi

echo ""

# Verificar si Docker está instalado
echo "🐳 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"
echo ""

# Verificar si los contenedores están corriendo
echo "📦 Verificando contenedores..."
if docker ps | grep -q "bot_service"; then
    echo "✅ El contenedor bot_service está corriendo"
else
    echo "⚠️  El contenedor bot_service no está corriendo"
    echo "   ¿Deseas iniciar los contenedores? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        echo "🚀 Iniciando contenedores..."
        docker-compose up -d
        echo "⏳ Esperando 10 segundos para que los servicios inicien..."
        sleep 10
    fi
fi

echo ""

# Verificar si el puerto está abierto
echo "🔌 Verificando puerto 3009..."
if netstat -tuln 2>/dev/null | grep -q ":3009"; then
    echo "✅ El puerto 3009 está abierto y escuchando"
else
    echo "⚠️  El puerto 3009 no parece estar abierto"
    echo "   Revisa los logs del contenedor: docker logs bot_service"
fi

echo ""
echo "=================================================="
echo "🎉 ¡Configuración completada!"
echo "=================================================="
echo ""
echo "📱 Para escanear el código QR, abre tu navegador y visita:"
echo ""
echo "   🌐 http://$EXTERNAL_IP:3009"
echo ""
echo "📋 Otros endpoints disponibles:"
echo "   • Estado: http://$EXTERNAL_IP:3009/status"
echo "   • QR directo: http://$EXTERNAL_IP:3009/qr"
echo "   • Conversaciones: http://$EXTERNAL_IP:3009/conversations"
echo ""
echo "🔒 IMPORTANTE: El puerto 3009 está abierto a internet."
echo "   Una vez autenticado, considera cerrar el firewall:"
echo "   gcloud compute firewall-rules delete allow-bot-qr"
echo ""
echo "📖 Para más información, consulta: INSTRUCCIONES_QR.md"
echo ""

# Ofrecer abrir el navegador (si está disponible)
echo "¿Deseas ver los logs del contenedor en tiempo real? (s/n)"
read -r response
if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    docker logs -f bot_service
fi
