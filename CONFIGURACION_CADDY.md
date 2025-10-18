# 🔧 Configuración de Caddy para WhatsApp Bot

## 📋 Resumen

Esta guía explica cómo configurar **Caddy como reverse proxy** para tu bot de WhatsApp con el dominio `testbot.novapolointranet.xyz`.

## ⚠️ Problema Común

Si ves el error **"ERROR AUTH"** o el bot se conecta pero no mantiene la autenticación, es porque:

1. Caddy no está configurado para manejar correctamente las conexiones persistentes de Baileys
2. Los headers de CORS no están configurados correctamente
3. Los timeouts son muy cortos para la autenticación de WhatsApp

## ✅ Solución

### 1. Configurar Caddy

He creado un `Caddyfile` optimizado en la raíz del proyecto. Cópialo a tu servidor:

```bash
# En tu VM de Google Cloud
sudo cp Caddyfile /etc/caddy/Caddyfile

# O si tienes Caddy en otro lugar
sudo cp Caddyfile /path/to/your/caddy/Caddyfile
```

### 2. Verificar la Configuración

El `Caddyfile` incluye:

```caddy
testbot.novapolointranet.xyz {
    # Interfaz web del QR (raíz)
    reverse_proxy / localhost:3009
    
    # Imagen del QR
    reverse_proxy /qr localhost:3009
    
    # Estado de autenticación
    reverse_proxy /status localhost:3009
    
    # Conversaciones
    reverse_proxy /conversations localhost:3009
    
    # API endpoints
    reverse_proxy /api/* localhost:3009
    
    # Dashboard (Next.js)
    reverse_proxy /dashboard* localhost:3000
    
    # Headers CORS y seguridad
    header {
        Access-Control-Allow-Origin *
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}
```

### 3. Recargar Caddy

```bash
# Verificar que la configuración sea válida
sudo caddy validate --config /etc/caddy/Caddyfile

# Recargar Caddy sin downtime
sudo caddy reload --config /etc/caddy/Caddyfile

# O reiniciar el servicio
sudo systemctl reload caddy
```

### 4. Verificar que los Contenedores Estén Corriendo

```bash
# Ver contenedores
docker ps

# Deberías ver:
# - bot_service en puerto 3009
# - dashboard_service en puerto 3000

# Si no están corriendo:
docker-compose up -d
```

### 5. Acceder al QR

Ahora puedes acceder a través de tu dominio:

```
https://testbot.novapolointranet.xyz
```

**Nota:** Caddy automáticamente obtiene certificados SSL de Let's Encrypt, así que usa `https://` en lugar de `http://`.

## 🔍 Verificación

### Probar los Endpoints

```bash
# Estado de autenticación
curl https://testbot.novapolointranet.xyz/status

# Debería responder:
# {"qrAvailable":true,"authenticated":false,"message":"Esperando escaneo del código QR"}

# Imagen del QR
curl -I https://testbot.novapolointranet.xyz/qr

# Debería responder:
# HTTP/2 200
# content-type: image/png
```

### Ver Logs de Caddy

```bash
# Logs en tiempo real
sudo tail -f /var/log/caddy/testbot.log

# O si usas systemd
sudo journalctl -u caddy -f
```

## 🐛 Solución de Problemas

### Error 502 Bad Gateway

**Causa:** Los contenedores no están corriendo o no están escuchando en los puertos correctos.

**Solución:**
```bash
# Verificar que los contenedores estén corriendo
docker ps | grep -E "bot_service|dashboard_service"

# Verificar que los puertos estén abiertos
netstat -tuln | grep -E "3009|3000"

# Reiniciar contenedores si es necesario
docker-compose restart
```

### Error 504 Gateway Timeout

**Causa:** Los timeouts de Caddy son muy cortos.

**Solución:** Ya está configurado en el `Caddyfile` con timeouts de 30 segundos:
```caddy
transport http {
    dial_timeout 30s
    response_header_timeout 30s
}
```

### El QR no se muestra

**Causa:** El bot aún no ha generado el QR o el archivo no existe.

**Solución:**
```bash
# Ver logs del bot
docker logs -f bot_service

# Verificar que el archivo QR exista
docker exec bot_service ls -la bot.qr.png

# Esperar 30 segundos después de iniciar los contenedores
```

### Error de CORS

**Causa:** Los headers CORS no están configurados correctamente.

**Solución:** Ya está configurado en el `Caddyfile`:
```caddy
header {
    Access-Control-Allow-Origin *
    Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers "Content-Type, Authorization"
}
```

### Sigue mostrando "ERROR AUTH"

**Causa:** Sesiones corruptas o múltiples intentos fallidos.

**Solución:**
```bash
# 1. Detener contenedores
docker-compose down

# 2. Limpiar sesiones
rm -rf base-js-baileys-json/bot_sessions/*
rm -f base-js-baileys-json/bot.qr.png

# 3. Reiniciar contenedores
docker-compose up -d

# 4. Esperar 30 segundos
sleep 30

# 5. Acceder a https://testbot.novapolointranet.xyz
# 6. Escanear el QR RÁPIDAMENTE (tienes 60 segundos)
```

## 📊 Arquitectura

```
Internet
    ↓
Caddy (Puerto 80/443)
    ↓
    ├─→ / → localhost:3009 (Interfaz web del QR)
    ├─→ /qr → localhost:3009 (Imagen del QR)
    ├─→ /status → localhost:3009 (Estado)
    ├─→ /conversations → localhost:3009 (Conversaciones)
    ├─→ /api/* → localhost:3009 (API)
    └─→ /dashboard* → localhost:3000 (Dashboard Next.js)
    
Docker Containers:
    ├─→ bot_service (Puerto 3009)
    │   ├─→ API Server (Express)
    │   └─→ WhatsApp Bot (Baileys)
    └─→ dashboard_service (Puerto 3000)
        └─→ Next.js Dashboard
```

## 🔒 Seguridad

### Certificados SSL

Caddy automáticamente obtiene y renueva certificados SSL de Let's Encrypt. No necesitas hacer nada.

### Firewall

Con Caddy, solo necesitas abrir los puertos 80 y 443:

```bash
# Google Cloud Firewall
gcloud compute firewall-rules create allow-caddy \
    --allow tcp:80,tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --description "Permitir HTTP y HTTPS para Caddy"

# NO necesitas abrir el puerto 3009 directamente
# Caddy maneja todo internamente
```

### Headers de Seguridad

El `Caddyfile` incluye headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📝 Configuración Completa del Sistema

### 1. Estructura de Archivos

```
/home/usuario/
├── bot/
│   ├── base-js-baileys-json/
│   │   ├── src/
│   │   ├── bot_sessions/
│   │   ├── api-server.js
│   │   └── ...
│   ├── dashboard/
│   ├── docker-compose.yml
│   └── Caddyfile
└── ...

/etc/caddy/
└── Caddyfile (copiado desde /home/usuario/bot/Caddyfile)
```

### 2. Comandos de Inicio

```bash
# 1. Iniciar contenedores Docker
cd /home/usuario/bot
docker-compose up -d

# 2. Copiar y recargar Caddy (solo la primera vez o si cambias la config)
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo caddy reload --config /etc/caddy/Caddyfile

# 3. Verificar que todo esté corriendo
docker ps
sudo systemctl status caddy

# 4. Acceder al QR
# https://testbot.novapolointranet.xyz
```

## 🎯 Flujo de Autenticación

1. **Usuario accede a:** `https://testbot.novapolointranet.xyz`
2. **Caddy recibe la petición** en el puerto 443 (HTTPS)
3. **Caddy redirige a:** `localhost:3009` (bot_service)
4. **Express sirve** la página HTML con el QR
5. **JavaScript en la página** hace polling a `/status` cada 3 segundos
6. **Usuario escanea el QR** con WhatsApp
7. **Baileys autentica** y guarda la sesión en `bot_sessions/`
8. **Estado cambia a:** `{"authenticated": true}`
9. **Página muestra:** "✅ Bot autenticado correctamente"

## 📞 Comandos Útiles

```bash
# Ver logs de Caddy
sudo journalctl -u caddy -f

# Ver logs del bot
docker logs -f bot_service

# Ver logs del dashboard
docker logs -f dashboard_service

# Reiniciar todo
docker-compose restart
sudo systemctl reload caddy

# Verificar estado de autenticación
curl https://testbot.novapolointranet.xyz/status

# Descargar el QR directamente
curl https://testbot.novapolointranet.xyz/qr -o qr.png
```

## ✅ Checklist de Configuración

- [ ] Caddy instalado y corriendo
- [ ] `Caddyfile` copiado a `/etc/caddy/Caddyfile`
- [ ] Caddy recargado con la nueva configuración
- [ ] Docker y Docker Compose instalados
- [ ] Contenedores corriendo (`docker ps`)
- [ ] Puerto 3009 accesible desde Caddy
- [ ] Puerto 3000 accesible desde Caddy
- [ ] Dominio `testbot.novapolointranet.xyz` apunta a la IP del servidor
- [ ] Firewall permite puertos 80 y 443
- [ ] Certificado SSL obtenido automáticamente por Caddy
- [ ] Acceso a `https://testbot.novapolointranet.xyz` funciona
- [ ] QR visible en la página web
- [ ] Estado de autenticación responde en `/status`

## 🎉 Resultado Final

Una vez configurado correctamente:

1. ✅ Accedes a `https://testbot.novapolointranet.xyz`
2. ✅ Ves una interfaz web moderna con el QR
3. ✅ El QR se actualiza automáticamente cada 30 segundos
4. ✅ Escaneas el QR con WhatsApp
5. ✅ El bot se autentica correctamente
6. ✅ La sesión se mantiene persistente
7. ✅ No más errores "ERROR AUTH"

---

**¿Necesitas ayuda?** Revisa los logs:
- Caddy: `sudo journalctl -u caddy -f`
- Bot: `docker logs -f bot_service`
