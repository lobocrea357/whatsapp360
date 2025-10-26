# 🚀 Guía Completa de Despliegue - Sistema Multi-Bot WhatsApp

Sistema completo de 5 bots de WhatsApp con dashboard centralizado, Supabase y Caddy.

## 📋 Tabla de Contenidos

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Arquitectura](#arquitectura)
3. [Configuración de Dominios](#configuración-de-dominios)
4. [Despliegue con Docker](#despliegue-con-docker)
5. [Configuración de Caddy](#configuración-de-caddy)
6. [Verificación](#verificación)
7. [Mantenimiento](#mantenimiento)

## 🎯 Resumen del Sistema

### Componentes
- **5 Bots de WhatsApp** (Asesor 1-5)
- **Dashboard Next.js** con autenticación
- **Supabase** como base de datos
- **Caddy** como reverse proxy
- **Docker** para containerización

### URLs de Producción
- **Bot 1**: https://bot-uno.novapolointranet.xyz
- **Bot 2**: https://bot-dos.novapolointranet.xyz
- **Bot 3**: https://bot-tres.novapolointranet.xyz
- **Bot 4**: https://bot-cuatro.novapolointranet.xyz
- **Bot 5**: https://bot-cinco.novapolointranet.xyz
- **Dashboard**: https://dashboard.novapolointranet.xyz

### Puertos Internos
| Servicio | Puerto Bot | Puerto API |
|----------|------------|------------|
| Bot 1    | 3001       | 3009       |
| Bot 2    | 3002       | 3010       |
| Bot 3    | 3003       | 3011       |
| Bot 4    | 3004       | 3012       |
| Bot 5    | 3005       | 3013       |
| Dashboard| -          | 3000       |

## 🏗️ Arquitectura

```
Internet
    ↓
Caddy (80/443) - Reverse Proxy + SSL
    ↓
┌─────────────────────────────────────────┐
│  Docker Network (whatsapp_network)      │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │  Bot 1   │  │  Bot 2   │  ...       │
│  │ (3009)   │  │ (3010)   │            │
│  └──────────┘  └──────────┘            │
│                                          │
│  ┌──────────────────────────┐           │
│  │      Dashboard           │           │
│  │       (3000)             │           │
│  └──────────────────────────┘           │
└─────────────────────────────────────────┘
    ↓
Supabase (Cloud)
```

## 🌐 Configuración de Dominios

### Paso 1: Configurar DNS

En tu proveedor de DNS (Cloudflare, etc.), crea registros A:

```
bot-uno.novapolointranet.xyz      → IP_DEL_SERVIDOR
bot-dos.novapolointranet.xyz      → IP_DEL_SERVIDOR
bot-tres.novapolointranet.xyz     → IP_DEL_SERVIDOR
bot-cuatro.novapolointranet.xyz   → IP_DEL_SERVIDOR
bot-cinco.novapolointranet.xyz    → IP_DEL_SERVIDOR
dashboard.novapolointranet.xyz    → IP_DEL_SERVIDOR
```

### Paso 2: Verificar DNS

```bash
# Verificar que los dominios resuelven
nslookup bot-uno.novapolointranet.xyz
nslookup dashboard.novapolointranet.xyz
```

## 🐳 Despliegue con Docker

### Paso 1: Preparar el Servidor

```bash
# Conectar al servidor
ssh usuario@IP_DEL_SERVIDOR

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Paso 2: Clonar/Copiar el Proyecto

```bash
# Crear directorio
sudo mkdir -p /opt/whatsapp-bots
sudo chown $USER:$USER /opt/whatsapp-bots
cd /opt/whatsapp-bots

# Copiar archivos del proyecto
# (usar scp, rsync, git, etc.)
```

### Paso 3: Configurar Variables de Entorno

Edita cada archivo `.env`:

```bash
# Bot 1
nano bot1/.env
```

Contenido:
```env
OPENAI_API_KEY=sk-...
PORT=3001
API_PORT=3009
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

Repite para bot2, bot3, bot4, bot5 (cambiando puertos y nombres).

```bash
# Dashboard
nano dashboard/.env.local
```

Contenido:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 4: Construir e Iniciar

```bash
# Dar permisos a los scripts
chmod +x docker-start.sh docker-stop.sh

# Iniciar el sistema
./docker-start.sh

# O manualmente:
docker-compose build
docker-compose up -d
```

### Paso 5: Verificar Contenedores

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un bot específico
docker-compose logs -f bot1
```

## 🔧 Configuración de Caddy

### Paso 1: Instalar Caddy

```bash
# Ubuntu/Debian
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Paso 2: Configurar Caddyfile

```bash
# Copiar el Caddyfile
sudo cp Caddyfile /etc/caddy/Caddyfile

# Crear directorio de logs
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy

# Verificar sintaxis
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Paso 3: Iniciar Caddy

```bash
# Habilitar e iniciar Caddy
sudo systemctl enable caddy
sudo systemctl start caddy

# Ver estado
sudo systemctl status caddy

# Ver logs
sudo journalctl -u caddy -f
```

### Paso 4: Configurar Firewall

```bash
# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar
sudo ufw status
```

## ✅ Verificación

### 1. Verificar Contenedores

```bash
docker-compose ps
```

Todos deben estar `Up` y `healthy`.

### 2. Verificar Acceso Local

```bash
# Probar cada bot
curl http://localhost:3009
curl http://localhost:3010
curl http://localhost:3011
curl http://localhost:3012
curl http://localhost:3013

# Probar dashboard
curl http://localhost:3000
```

### 3. Verificar Dominios

```bash
# Probar desde fuera del servidor
curl https://bot-uno.novapolointranet.xyz
curl https://dashboard.novapolointranet.xyz
```

### 4. Escanear Códigos QR

Abre en tu navegador:
- https://bot-uno.novapolointranet.xyz
- https://bot-dos.novapolointranet.xyz
- https://bot-tres.novapolointranet.xyz
- https://bot-cuatro.novapolointranet.xyz
- https://bot-cinco.novapolointranet.xyz

Escanea cada QR con WhatsApp.

### 5. Verificar Dashboard

1. Abre https://dashboard.novapolointranet.xyz
2. Inicia sesión
3. Verifica que aparecen los 5 bots
4. Verifica que puedes ver conversaciones

## 🔄 Mantenimiento

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f bot1
docker-compose logs -f dashboard

# Logs de Caddy
sudo journalctl -u caddy -f
```

### Reiniciar Servicios

```bash
# Reiniciar un bot
docker-compose restart bot1

# Reiniciar todos
docker-compose restart

# Reiniciar Caddy
sudo systemctl restart caddy
```

### Actualizar Código

```bash
# Detener servicios
docker-compose down

# Actualizar código (git pull, rsync, etc.)
git pull

# Reconstruir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d
```

### Backup de Sesiones

```bash
# Crear backup
mkdir -p backups
for i in {1..5}; do
  docker run --rm \
    -v whatsapp-bots_bot${i}_sessions:/data \
    -v $(pwd)/backups:/backup \
    alpine tar czf /backup/bot${i}_sessions_$(date +%Y%m%d).tar.gz /data
done
```

### Restaurar Sesiones

```bash
# Restaurar bot1
docker run --rm \
  -v whatsapp-bots_bot1_sessions:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/bot1_sessions_20251025.tar.gz --strip 1"
```

### Monitoreo

```bash
# Uso de recursos
docker stats

# Espacio en disco
docker system df

# Ver volúmenes
docker volume ls
```

## 🚨 Solución de Problemas

### Bot no se conecta

```bash
# Ver logs
docker-compose logs -f bot1

# Reiniciar
docker-compose restart bot1

# Reconstruir
docker-compose build bot1
docker-compose up -d bot1
```

### Error de SSL en Caddy

```bash
# Ver logs de Caddy
sudo journalctl -u caddy -n 100

# Verificar que los dominios resuelven
nslookup bot-uno.novapolointranet.xyz

# Reiniciar Caddy
sudo systemctl restart caddy
```

### Dashboard no carga

```bash
# Ver logs
docker-compose logs -f dashboard

# Verificar variables de entorno
docker-compose exec dashboard env | grep SUPABASE

# Reconstruir
docker-compose build dashboard
docker-compose up -d dashboard
```

### Puerto en uso

```bash
# Ver qué está usando el puerto
sudo lsof -i :3009

# Detener todos los contenedores
docker-compose down

# Limpiar
docker system prune -a
```

## 📊 Checklist de Despliegue

### Pre-despliegue
- [ ] Servidor con Ubuntu/Debian
- [ ] Docker y Docker Compose instalados
- [ ] Dominios configurados en DNS
- [ ] Supabase configurado con tablas
- [ ] Usuario creado en Supabase Auth
- [ ] Credenciales de OpenAI disponibles

### Configuración
- [ ] Archivos `.env` de cada bot configurados
- [ ] Archivo `.env.local` del dashboard configurado
- [ ] Caddyfile copiado a `/etc/caddy/`
- [ ] Firewall configurado (puertos 80, 443)

### Despliegue
- [ ] Contenedores construidos (`docker-compose build`)
- [ ] Contenedores iniciados (`docker-compose up -d`)
- [ ] Todos los contenedores `healthy`
- [ ] Caddy instalado y corriendo
- [ ] SSL funcionando (HTTPS)

### Verificación
- [ ] QR codes accesibles en cada dominio
- [ ] Bots conectados a WhatsApp
- [ ] Dashboard accesible
- [ ] Login funciona en el dashboard
- [ ] Los 5 bots aparecen en el dashboard
- [ ] Conversaciones se sincronizan a Supabase

### Post-despliegue
- [ ] Backups configurados
- [ ] Monitoreo configurado
- [ ] Documentación actualizada
- [ ] Equipo capacitado

## 📞 URLs Finales

Una vez desplegado, el sistema estará disponible en:

- **Bot 1 (Asesor 1)**: https://bot-uno.novapolointranet.xyz
- **Bot 2 (Asesor 2)**: https://bot-dos.novapolointranet.xyz
- **Bot 3 (Asesor 3)**: https://bot-tres.novapolointranet.xyz
- **Bot 4 (Asesor 4)**: https://bot-cuatro.novapolointranet.xyz
- **Bot 5 (Asesor 5)**: https://bot-cinco.novapolointranet.xyz
- **Dashboard**: https://dashboard.novapolointranet.xyz

---

**Sistema Multi-Bot WhatsApp - Viajes Nova** 🚀
**Documentación completa en**: README_MULTI_BOTS.md, DOCKER_SETUP.md, BOTS_CONFIG.md
