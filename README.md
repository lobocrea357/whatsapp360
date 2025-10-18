# 🤖 WhatsApp Bot - Viajes Nova

Bot de WhatsApp con interfaz web para gestión de conversaciones y autenticación mediante QR.

## 🚀 Inicio Rápido con Caddy

Tu dominio: **`testbot.novapolointranet.xyz`**

### 1. Configurar Caddy

```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo caddy reload --config /etc/caddy/Caddyfile
```

### 2. Iniciar el Bot

```bash
docker-compose down
rm -rf base-js-baileys-json/bot_sessions/*
docker-compose up -d
sleep 30
```

### 3. Acceder al QR

Abre tu navegador en: **https://testbot.novapolointranet.xyz**

### 4. Escanear con WhatsApp

1. Abre WhatsApp → **Configuración** → **Dispositivos vinculados**
2. Toca **Vincular un dispositivo**
3. Escanea el QR **en menos de 60 segundos**

## 📚 Documentación

### Guías Principales

| Archivo | Descripción |
|---------|-------------|
| **[PASOS_CADDY.txt](PASOS_CADDY.txt)** | 📋 Pasos exactos para configurar Caddy (EMPIEZA AQUÍ) |
| **[CONFIGURACION_CADDY.md](CONFIGURACION_CADDY.md)** | 🔧 Guía completa de configuración de Caddy |
| **[SOLUCION_RAPIDA.md](SOLUCION_RAPIDA.md)** | ⚡ Solución rápida al error AUTH |
| **[INSTRUCCIONES_QR.md](INSTRUCCIONES_QR.md)** | 📱 Guía detallada del código QR |
| **[COMANDOS_UTILES.txt](COMANDOS_UTILES.txt)** | 💻 Comandos para copiar y pegar |

### Scripts de Ayuda

| Script | Descripción |
|--------|-------------|
| **[diagnostico-caddy.sh](diagnostico-caddy.sh)** | 🔍 Diagnóstico automático del sistema |
| **[setup-qr.sh](setup-qr.sh)** | 🛠️ Configuración automática (sin Caddy) |

## 🎯 Estructura del Proyecto

```
bot/
├── base-js-baileys-json/       # Bot de WhatsApp
│   ├── src/
│   │   └── bot.js              # Lógica principal
│   ├── api-server.js           # API + Interfaz web QR
│   ├── bot_sessions/           # Sesiones persistentes
│   ├── db.json                 # Base de datos
│   └── bot.qr.png              # Código QR generado
├── dashboard/                  # Dashboard Next.js
├── docker-compose.yml          # Configuración Docker
├── Caddyfile                   # Configuración Caddy
└── [Documentación]
```

## 🔌 Endpoints Disponibles

| Endpoint | Descripción |
|----------|-------------|
| `https://testbot.novapolointranet.xyz/` | 🖥️ Interfaz web para escanear QR |
| `https://testbot.novapolointranet.xyz/qr` | 📱 Imagen del código QR (PNG) |
| `https://testbot.novapolointranet.xyz/status` | ✅ Estado de autenticación (JSON) |
| `https://testbot.novapolointranet.xyz/conversations` | 💬 Conversaciones guardadas (JSON) |
| `https://testbot.novapolointranet.xyz/dashboard` | 📊 Dashboard de gestión |

## 🐳 Comandos Docker

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker logs -f bot_service

# Reiniciar
docker-compose restart bot

# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build
```

## 🔧 Comandos Caddy

```bash
# Validar configuración
sudo caddy validate --config /etc/caddy/Caddyfile

# Recargar sin downtime
sudo caddy reload --config /etc/caddy/Caddyfile

# Ver logs
sudo journalctl -u caddy -f

# Estado del servicio
sudo systemctl status caddy
```

## 🔍 Diagnóstico Rápido

```bash
# Ejecutar script de diagnóstico
chmod +x diagnostico-caddy.sh
./diagnostico-caddy.sh

# Verificar estado manualmente
curl https://testbot.novapolointranet.xyz/status
docker ps
docker logs bot_service
```

## 🆘 Solución de Problemas

### Error "ERROR AUTH"

```bash
# Limpiar y reiniciar
docker-compose down
rm -rf base-js-baileys-json/bot_sessions/*
rm -f base-js-baileys-json/bot.qr.png
docker-compose up -d
sleep 30
```

Luego accede a `https://testbot.novapolointranet.xyz` y escanea el QR **rápidamente**.

### Error 502 Bad Gateway

```bash
# Verificar contenedores
docker ps | grep bot_service
docker logs bot_service

# Reiniciar si es necesario
docker-compose restart bot
```

### El QR no aparece

```bash
# Esperar más tiempo
sleep 30

# Ver logs
docker logs bot_service | grep -i qr

# Verificar archivo
docker exec bot_service ls -la bot.qr.png
```

### Dominio no responde

```bash
# Verificar DNS
nslookup testbot.novapolointranet.xyz

# Verificar Caddy
sudo systemctl status caddy
sudo journalctl -u caddy -f

# Verificar puertos
sudo netstat -tuln | grep -E ":80|:443"
```

## 📊 Arquitectura

```
Internet
    ↓
  HTTPS (443) - Certificado SSL automático
    ↓
Caddy Reverse Proxy
    ↓
    ├─→ / → localhost:3009 (Interfaz web QR)
    ├─→ /qr → localhost:3009 (Imagen QR)
    ├─→ /status → localhost:3009 (Estado)
    ├─→ /conversations → localhost:3009 (Conversaciones)
    ├─→ /api/* → localhost:3009 (API)
    └─→ /dashboard* → localhost:3000 (Dashboard)
    
Docker Containers:
    ├─→ bot_service (Puerto 3009)
    │   ├─→ Express API Server
    │   └─→ WhatsApp Bot (Baileys)
    └─→ dashboard_service (Puerto 3000)
        └─→ Next.js Dashboard
```

## 🔒 Seguridad

- ✅ **SSL/TLS automático** - Caddy obtiene certificados de Let's Encrypt
- ✅ **Headers de seguridad** - CORS, X-Frame-Options, etc.
- ✅ **Sesiones persistentes** - Guardadas en volúmenes Docker
- ✅ **Proxy reverso** - Puertos internos no expuestos directamente

## 📝 Variables de Entorno

Crea un archivo `.env` en `base-js-baileys-json/`:

```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3001
```

## ✅ Checklist de Configuración

- [ ] Docker y Docker Compose instalados
- [ ] Caddy instalado y corriendo
- [ ] `Caddyfile` copiado a `/etc/caddy/`
- [ ] Configuración de Caddy validada
- [ ] Dominio apunta a la IP del servidor
- [ ] Puertos 80 y 443 abiertos en firewall
- [ ] Contenedores corriendo
- [ ] API responde en localhost:3009
- [ ] Dominio responde correctamente
- [ ] Certificado SSL obtenido
- [ ] QR visible en la interfaz web

## 🎉 Resultado Final

Una vez configurado:

1. ✅ Accedes a `https://testbot.novapolointranet.xyz`
2. ✅ Ves una interfaz web moderna con el QR
3. ✅ El QR se actualiza automáticamente
4. ✅ Escaneas con WhatsApp
5. ✅ El bot se autentica correctamente
6. ✅ La sesión se mantiene persistente
7. ✅ No más errores "ERROR AUTH"

## 📞 Soporte

- **Logs del bot:** `docker logs -f bot_service`
- **Logs de Caddy:** `sudo journalctl -u caddy -f`
- **Diagnóstico:** `./diagnostico-caddy.sh`
- **Documentación:** Revisa los archivos `.md` en este directorio

## 🛠️ Tecnologías

- **WhatsApp:** [Baileys](https://github.com/WhiskeySockets/Baileys)
- **Framework:** [BuilderBot](https://builderbot.vercel.app/)
- **Reverse Proxy:** [Caddy](https://caddyserver.com/)
- **Contenedores:** Docker & Docker Compose
- **Dashboard:** Next.js
- **Transcripción:** OpenAI Whisper

---

**¿Problemas?** Lee **[PASOS_CADDY.txt](PASOS_CADDY.txt)** o ejecuta `./diagnostico-caddy.sh`
