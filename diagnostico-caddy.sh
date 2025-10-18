#!/bin/bash

# Script de diagnóstico para WhatsApp Bot con Caddy
# Verifica que todo esté configurado correctamente

echo "🔍 Diagnóstico del WhatsApp Bot con Caddy"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar Docker
echo "1️⃣  Verificando Docker..."
docker --version > /dev/null 2>&1
check "Docker instalado"

docker-compose --version > /dev/null 2>&1
check "Docker Compose instalado"

# 2. Verificar contenedores
echo ""
echo "2️⃣  Verificando contenedores..."
if docker ps | grep -q "bot_service"; then
    check "Contenedor bot_service corriendo"
    
    # Ver estado del contenedor
    BOT_STATUS=$(docker inspect bot_service --format='{{.State.Status}}')
    if [ "$BOT_STATUS" = "running" ]; then
        check "Estado del contenedor: $BOT_STATUS"
    else
        warn "Estado del contenedor: $BOT_STATUS"
    fi
else
    warn "Contenedor bot_service NO está corriendo"
    echo "   Ejecuta: docker-compose up -d"
fi

# 3. Verificar puertos
echo ""
echo "3️⃣  Verificando puertos..."
if netstat -tuln 2>/dev/null | grep -q ":3009"; then
    check "Puerto 3009 abierto (API Server)"
else
    warn "Puerto 3009 NO está abierto"
fi

if netstat -tuln 2>/dev/null | grep -q ":3001"; then
    check "Puerto 3001 abierto (Bot HTTP Server)"
else
    warn "Puerto 3001 NO está abierto"
fi

# 4. Verificar Caddy
echo ""
echo "4️⃣  Verificando Caddy..."
if command -v caddy &> /dev/null; then
    check "Caddy instalado"
    
    # Verificar versión
    CADDY_VERSION=$(caddy version | head -n 1)
    echo "   Versión: $CADDY_VERSION"
    
    # Verificar si Caddy está corriendo
    if systemctl is-active --quiet caddy; then
        check "Servicio Caddy activo"
    else
        warn "Servicio Caddy NO está activo"
        echo "   Ejecuta: sudo systemctl start caddy"
    fi
    
    # Verificar Caddyfile
    if [ -f "/etc/caddy/Caddyfile" ]; then
        check "Caddyfile existe en /etc/caddy/"
        
        # Validar configuración
        sudo caddy validate --config /etc/caddy/Caddyfile > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            check "Configuración de Caddy válida"
        else
            warn "Configuración de Caddy tiene errores"
            echo "   Ejecuta: sudo caddy validate --config /etc/caddy/Caddyfile"
        fi
    else
        warn "Caddyfile NO existe en /etc/caddy/"
        echo "   Ejecuta: sudo cp Caddyfile /etc/caddy/Caddyfile"
    fi
else
    warn "Caddy NO está instalado"
fi

# 5. Verificar archivos del bot
echo ""
echo "5️⃣  Verificando archivos del bot..."
if [ -f "base-js-baileys-json/bot.qr.png" ]; then
    check "Archivo QR existe (bot.qr.png)"
    
    # Ver tamaño del archivo
    QR_SIZE=$(ls -lh base-js-baileys-json/bot.qr.png | awk '{print $5}')
    echo "   Tamaño: $QR_SIZE"
    
    # Ver antigüedad
    QR_TIME=$(stat -c %y base-js-baileys-json/bot.qr.png 2>/dev/null | cut -d'.' -f1)
    echo "   Modificado: $QR_TIME"
else
    warn "Archivo QR NO existe"
    echo "   El bot aún no ha generado el QR o está autenticado"
fi

if [ -d "base-js-baileys-json/bot_sessions" ]; then
    SESSION_COUNT=$(ls -1 base-js-baileys-json/bot_sessions 2>/dev/null | wc -l)
    if [ $SESSION_COUNT -gt 0 ]; then
        check "Sesiones de WhatsApp existen ($SESSION_COUNT archivos)"
        echo "   El bot probablemente está autenticado"
    else
        warn "No hay sesiones guardadas"
        echo "   El bot necesita ser autenticado"
    fi
else
    warn "Directorio bot_sessions NO existe"
fi

# 6. Verificar conectividad
echo ""
echo "6️⃣  Verificando conectividad..."

# Verificar localhost:3009
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3009/status | grep -q "200"; then
    check "API Server responde en localhost:3009"
else
    warn "API Server NO responde en localhost:3009"
fi

# Verificar dominio (si Caddy está configurado)
if command -v caddy &> /dev/null && systemctl is-active --quiet caddy; then
    echo "   Verificando dominio testbot.novapolointranet.xyz..."
    
    # Intentar conectar al dominio
    DOMAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://testbot.novapolointranet.xyz/status 2>/dev/null)
    
    if [ "$DOMAIN_STATUS" = "200" ]; then
        check "Dominio responde correctamente (HTTP $DOMAIN_STATUS)"
    elif [ "$DOMAIN_STATUS" = "000" ]; then
        warn "No se puede conectar al dominio"
        echo "   Verifica que el DNS apunte a este servidor"
    else
        warn "Dominio responde con HTTP $DOMAIN_STATUS"
    fi
fi

# 7. Verificar estado de autenticación
echo ""
echo "7️⃣  Verificando estado de autenticación..."
AUTH_STATUS=$(curl -s http://localhost:3009/status 2>/dev/null)

if [ -n "$AUTH_STATUS" ]; then
    echo "$AUTH_STATUS" | grep -q '"authenticated":true'
    if [ $? -eq 0 ]; then
        check "Bot AUTENTICADO ✅"
    else
        warn "Bot NO autenticado - Necesitas escanear el QR"
    fi
    
    # Mostrar mensaje completo
    MESSAGE=$(echo "$AUTH_STATUS" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    echo "   Estado: $MESSAGE"
else
    warn "No se puede obtener el estado de autenticación"
fi

# 8. Verificar logs recientes
echo ""
echo "8️⃣  Últimas líneas de logs del bot..."
echo "────────────────────────────────────"
docker logs --tail 10 bot_service 2>/dev/null
echo "────────────────────────────────────"

# Resumen final
echo ""
echo "=========================================="
echo "📊 Resumen del Diagnóstico"
echo "=========================================="
echo ""

# Contar checks exitosos
CHECKS_OK=0
CHECKS_TOTAL=0

# Docker
if docker --version > /dev/null 2>&1; then ((CHECKS_OK++)); fi
((CHECKS_TOTAL++))

# Contenedor corriendo
if docker ps | grep -q "bot_service"; then ((CHECKS_OK++)); fi
((CHECKS_TOTAL++))

# Puerto 3009
if netstat -tuln 2>/dev/null | grep -q ":3009"; then ((CHECKS_OK++)); fi
((CHECKS_TOTAL++))

# Caddy instalado
if command -v caddy &> /dev/null; then ((CHECKS_OK++)); fi
((CHECKS_TOTAL++))

# API responde
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3009/status | grep -q "200"; then ((CHECKS_OK++)); fi
((CHECKS_TOTAL++))

echo "✅ Checks exitosos: $CHECKS_OK/$CHECKS_TOTAL"
echo ""

if [ $CHECKS_OK -eq $CHECKS_TOTAL ]; then
    echo -e "${GREEN}🎉 ¡Todo está configurado correctamente!${NC}"
    echo ""
    echo "📱 Accede al QR en:"
    echo "   https://testbot.novapolointranet.xyz"
else
    echo -e "${YELLOW}⚠️  Hay algunos problemas que necesitan atención${NC}"
    echo ""
    echo "📖 Consulta la documentación:"
    echo "   • CONFIGURACION_CADDY.md"
    echo "   • SOLUCION_RAPIDA.md"
fi

echo ""
echo "🔧 Comandos útiles:"
echo "   • Ver logs: docker logs -f bot_service"
echo "   • Reiniciar bot: docker-compose restart bot"
echo "   • Recargar Caddy: sudo caddy reload --config /etc/caddy/Caddyfile"
echo "   • Limpiar sesiones: rm -rf base-js-baileys-json/bot_sessions/*"
echo ""
