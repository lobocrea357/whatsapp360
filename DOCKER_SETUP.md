# 🐳 Configuración Docker - Sistema Multi-Bot WhatsApp

Guía completa para desplegar el sistema de 5 bots + dashboard usando Docker y Caddy.

## 📋 Requisitos Previos

- Docker instalado
- Docker Compose instalado
- Dominios configurados en tu DNS:
  - `bot-uno.novapolointranet.xyz`
  - `bot-dos.novapolointranet.xyz`
  - `bot-tres.novapolointranet.xyz`
  - `bot-cuatro.novapolointranet.xyz`
  - `bot-cinco.novapolointranet.xyz`
  - `dashboard.novapolointranet.xyz`

## 🏗️ Estructura de Contenedores

```
docker-compose.yml
├── bot1 (Asesor 1)     → Puertos 3001/3009
├── bot2 (Asesor 2)     → Puertos 3002/3010
├── bot3 (Asesor 3)     → Puertos 3003/3011
├── bot4 (Asesor 4)     → Puertos 3004/3012
├── bot5 (Asesor 5)     → Puertos 3005/3013
└── dashboard           → Puerto 3000
```

## 🚀 Paso 1: Configurar Variables de Entorno

### Bot 1 - bot1/.env
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3001
API_PORT=3009

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

### Bot 2 - bot2/.env
```env
OPENAI_API_KEY=tu_api_key
PORT=3002
API_PORT=3010
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
BOT_NAME=Asesor 2
BOT_IDENTIFIER=bot2
```

### Bot 3 - bot3/.env
```env
OPENAI_API_KEY=tu_api_key
PORT=3003
API_PORT=3011
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
BOT_NAME=Asesor 3
BOT_IDENTIFIER=bot3
```

### Bot 4 - bot4/.env
```env
OPENAI_API_KEY=tu_api_key
PORT=3004
API_PORT=3012
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
BOT_NAME=Asesor 4
BOT_IDENTIFIER=bot4
```

### Bot 5 - bot5/.env
```env
OPENAI_API_KEY=tu_api_key
PORT=3005
API_PORT=3013
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
BOT_NAME=Asesor 5
BOT_IDENTIFIER=bot5
```

### Dashboard - dashboard/.env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 🔨 Paso 2: Construir las Imágenes

```bash
# Construir todas las imágenes
docker-compose build

# O construir una específica
docker-compose build bot1
docker-compose build dashboard
```

## ▶️ Paso 3: Iniciar los Contenedores

### Iniciar todos los servicios
```bash
docker-compose up -d
```

### Iniciar servicios específicos
```bash
# Solo un bot
docker-compose up -d bot1

# Varios bots
docker-compose up -d bot1 bot2 bot3

# Dashboard
docker-compose up -d dashboard
```

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f bot1
docker-compose logs -f dashboard

# Últimas 100 líneas
docker-compose logs --tail=100 bot1
```

## 🔍 Paso 4: Verificar que Todo Funciona

### Verificar estado de los contenedores
```bash
docker-compose ps
```

Deberías ver algo como:
```
NAME                STATUS              PORTS
bot1_asesor1        Up 2 minutes        0.0.0.0:3001->3001/tcp, 0.0.0.0:3009->3009/tcp
bot2_asesor2        Up 2 minutes        0.0.0.0:3002->3002/tcp, 0.0.0.0:3010->3010/tcp
bot3_asesor3        Up 2 minutes        0.0.0.0:3003->3003/tcp, 0.0.0.0:3011->3011/tcp
bot4_asesor4        Up 2 minutes        0.0.0.0:3004->3004/tcp, 0.0.0.0:3012->3012/tcp
bot5_asesor5        Up 2 minutes        0.0.0.0:3005->3005/tcp, 0.0.0.0:3013->3013/tcp
dashboard_whatsapp  Up 2 minutes        0.0.0.0:3000->3000/tcp
```

### Verificar health checks
```bash
docker-compose ps
```

Todos los servicios deben mostrar `healthy` en el estado.

### Acceder a los QR codes
- Bot 1: http://localhost:3009
- Bot 2: http://localhost:3010
- Bot 3: http://localhost:3011
- Bot 4: http://localhost:3012
- Bot 5: http://localhost:3013

### Acceder al dashboard
- Dashboard: http://localhost:3000

## 🌐 Paso 5: Configurar Caddy (Reverse Proxy)

### Instalar Caddy en el servidor
```bash
# Ubuntu/Debian
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Copiar el Caddyfile
```bash
# Copiar el Caddyfile al servidor
sudo cp Caddyfile /etc/caddy/Caddyfile

# Verificar sintaxis
sudo caddy validate --config /etc/caddy/Caddyfile

# Recargar Caddy
sudo systemctl reload caddy
```

### Verificar que Caddy funciona
```bash
# Ver estado
sudo systemctl status caddy

# Ver logs
sudo journalctl -u caddy -f
```

## 🔗 URLs Finales

Una vez configurado Caddy, podrás acceder a:

- **Bot 1**: https://bot-uno.novapolointranet.xyz
- **Bot 2**: https://bot-dos.novapolointranet.xyz
- **Bot 3**: https://bot-tres.novapolointranet.xyz
- **Bot 4**: https://bot-cuatro.novapolointranet.xyz
- **Bot 5**: https://bot-cinco.novapolointranet.xyz
- **Dashboard**: https://dashboard.novapolointranet.xyz

## 🛑 Detener los Contenedores

```bash
# Detener todos
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina sesiones de WhatsApp)
docker-compose down -v

# Detener un servicio específico
docker-compose stop bot1
```

## 🔄 Reiniciar Servicios

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno específico
docker-compose restart bot1
docker-compose restart dashboard
```

## 📊 Monitoreo

### Ver uso de recursos
```bash
docker stats
```

### Ver logs de un bot específico
```bash
# Últimas 50 líneas
docker-compose logs --tail=50 bot1

# Seguir logs en tiempo real
docker-compose logs -f bot1

# Logs de todos los bots
docker-compose logs -f bot1 bot2 bot3 bot4 bot5
```

### Ejecutar comandos dentro de un contenedor
```bash
# Abrir shell en bot1
docker-compose exec bot1 sh

# Ver archivos
docker-compose exec bot1 ls -la

# Ver db.json
docker-compose exec bot1 cat db.json
```

## 🔧 Solución de Problemas

### Bot no se conecta a WhatsApp
```bash
# Ver logs del bot
docker-compose logs -f bot1

# Reiniciar el bot
docker-compose restart bot1

# Reconstruir la imagen
docker-compose build bot1
docker-compose up -d bot1
```

### Error de puerto en uso
```bash
# Ver qué está usando el puerto
sudo lsof -i :3009

# Detener todos los contenedores
docker-compose down

# Limpiar todo
docker-compose down -v
docker system prune -a
```

### Dashboard no carga
```bash
# Ver logs
docker-compose logs -f dashboard

# Reconstruir
docker-compose build dashboard
docker-compose up -d dashboard

# Verificar variables de entorno
docker-compose exec dashboard env | grep SUPABASE
```

### Sesiones de WhatsApp se pierden
Las sesiones se guardan en volúmenes de Docker. Para verificar:
```bash
# Listar volúmenes
docker volume ls

# Inspeccionar un volumen
docker volume inspect bot_bot1_sessions

# Backup de un volumen
docker run --rm -v bot_bot1_sessions:/data -v $(pwd):/backup alpine tar czf /backup/bot1_backup.tar.gz /data
```

## 🔐 Seguridad

### Mejores prácticas
1. **No exponer puertos innecesarios**: Solo Caddy debe estar expuesto (80/443)
2. **Usar HTTPS**: Caddy lo maneja automáticamente
3. **Variables de entorno**: Nunca subir archivos `.env` a Git
4. **Actualizar imágenes**: Mantener Node.js actualizado
5. **Limitar recursos**: Configurar límites de CPU/memoria si es necesario

### Configurar límites de recursos (opcional)
Edita `docker-compose.yml`:
```yaml
bot1:
  # ... configuración existente ...
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M
```

## 📦 Backup y Restauración

### Backup de sesiones
```bash
# Crear directorio de backups
mkdir -p backups

# Backup de todas las sesiones
for i in {1..5}; do
  docker run --rm \
    -v bot_bot${i}_sessions:/data \
    -v $(pwd)/backups:/backup \
    alpine tar czf /backup/bot${i}_sessions_$(date +%Y%m%d).tar.gz /data
done
```

### Restaurar sesiones
```bash
# Restaurar bot1
docker run --rm \
  -v bot_bot1_sessions:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/bot1_sessions_20251025.tar.gz --strip 1"
```

## 🚀 Despliegue en Producción

### Checklist
- [ ] Todos los archivos `.env` configurados
- [ ] Dominios apuntando al servidor
- [ ] Docker y Docker Compose instalados
- [ ] Caddy instalado y configurado
- [ ] Firewall configurado (puertos 80, 443)
- [ ] Supabase configurado con tablas
- [ ] Usuario creado en Supabase Auth
- [ ] Backups configurados

### Comandos de despliegue
```bash
# 1. Clonar/copiar el proyecto al servidor
cd /opt/whatsapp-bots

# 2. Configurar variables de entorno
# Editar cada archivo .env

# 3. Construir imágenes
docker-compose build

# 4. Iniciar servicios
docker-compose up -d

# 5. Verificar logs
docker-compose logs -f

# 6. Configurar Caddy
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy

# 7. Escanear QR codes
# Abrir cada URL en el navegador
```

## 📝 Comandos Útiles

```bash
# Ver todos los contenedores
docker ps -a

# Ver imágenes
docker images

# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune -a

# Limpiar todo (⚠️ cuidado)
docker system prune -a --volumes

# Ver uso de disco
docker system df

# Actualizar un bot
docker-compose build bot1
docker-compose up -d bot1

# Ver variables de entorno de un contenedor
docker-compose exec bot1 env
```

## ✅ Verificación Final

1. **Contenedores corriendo**: `docker-compose ps` muestra todos como `Up`
2. **Health checks**: Todos muestran `healthy`
3. **QR codes accesibles**: Puedes ver los QR en cada URL
4. **Dashboard accesible**: http://localhost:3000 carga correctamente
5. **Caddy funcionando**: `sudo systemctl status caddy` muestra `active`
6. **Dominios resuelven**: `nslookup bot-uno.novapolointranet.xyz`
7. **HTTPS funciona**: https://bot-uno.novapolointranet.xyz carga con certificado válido

---

**Sistema Multi-Bot WhatsApp con Docker + Caddy** 🐳🚀
