# 🐳 Despliegue con Docker - Bots Independientes

## 📋 Requisitos Previos

1. ✅ Docker instalado
2. ✅ Docker Compose instalado
3. ✅ SQL ejecutado en Supabase (ver `SETUP-BOTS-INDEPENDIENTES.md`)
4. ✅ Variables de entorno configuradas en cada bot

---

## 🚀 Pasos de Despliegue

### Paso 1: Configurar Variables de Entorno

Cada bot necesita su archivo `.env` con configuración única:

#### Bot 1 - `bot1/.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos (se mapean internamente en Docker)
PORT=3001
API_PORT=3009

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

#### Bot 2 - `bot2/.env`
```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3002
API_PORT=3010
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
BOT_NAME=Asesor 2
BOT_IDENTIFIER=bot2
```

#### Bot 3 - `bot3/.env`
```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3003
API_PORT=3011
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
BOT_NAME=Asesor 3
BOT_IDENTIFIER=bot3
```

#### Bot 4 - `bot4/.env`
```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3004
API_PORT=3012
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
BOT_NAME=Asesor 4
BOT_IDENTIFIER=bot4
```

#### Bot 5 - `bot5/.env`
```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3005
API_PORT=3013
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
BOT_NAME=Asesor 5
BOT_IDENTIFIER=bot5
```

---

### Paso 2: Construir las Imágenes Docker

```bash
# Construir todas las imágenes
docker-compose build

# O construir una específica
docker-compose build bot1
```

---

### Paso 3: Iniciar los Contenedores

#### Opción A: Iniciar Todos los Bots + Dashboard
```bash
docker-compose up -d
```

#### Opción B: Solo Bots (sin Dashboard)
```bash
docker-compose -f docker-compose.bots-only.yml up -d
```

#### Opción C: Iniciar Bots Específicos
```bash
# Solo bot1 y bot2
docker-compose up -d bot1 bot2

# Solo bot3
docker-compose up -d bot3
```

---

### Paso 4: Verificar que Están Corriendo

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de todos los bots
docker-compose logs -f

# Ver logs de un bot específico
docker-compose logs -f bot1
```

---

### Paso 5: Escanear Códigos QR

Accede a cada bot para escanear su QR:

- **Bot 1:** http://localhost:3009
- **Bot 2:** http://localhost:3010
- **Bot 3:** http://localhost:3011
- **Bot 4:** http://localhost:3012
- **Bot 5:** http://localhost:3013

**Dashboard:** http://localhost:3100

---

## 📊 Arquitectura Docker

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                  (whatsapp_network)                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Bot 1      │  │   Bot 2      │  │   Bot 3      │ │
│  │  Asesor 1    │  │  Asesor 2    │  │  Asesor 3    │ │
│  │  :3001/:3009 │  │  :3002/:3010 │  │  :3003/:3011 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   Bot 4      │  │   Bot 5      │                    │
│  │  Asesor 4    │  │  Asesor 5    │                    │
│  │  :3004/:3012 │  │  :3005/:3013 │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Dashboard                            │  │
│  │              :3100                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Supabase    │
                    │   Database    │
                    └───────────────┘
```

---

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Detener todos los contenedores
docker-compose down

# Detener sin eliminar volúmenes (mantiene sesiones de WhatsApp)
docker-compose stop

# Reiniciar todos los contenedores
docker-compose restart

# Reiniciar un bot específico
docker-compose restart bot1

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

### Ver Logs

```bash
# Logs en tiempo real de todos los bots
docker-compose logs -f

# Logs de un bot específico
docker-compose logs -f bot1

# Últimas 100 líneas de logs
docker-compose logs --tail=100 bot1

# Logs desde hace 10 minutos
docker-compose logs --since 10m bot1
```

### Ejecutar Comandos Dentro de un Contenedor

```bash
# Acceder a la shell de un bot
docker-compose exec bot1 sh

# Ejecutar script de limpieza
docker-compose exec bot1 node cleanup-duplicates.js

# Ver archivos dentro del contenedor
docker-compose exec bot1 ls -la
```

### Verificar Estado

```bash
# Ver estado de salud de contenedores
docker-compose ps

# Ver uso de recursos
docker stats

# Ver volúmenes
docker volume ls
```

---

## 📦 Volúmenes (Persistencia de Datos)

Cada bot tiene su propio volumen para persistir las sesiones de WhatsApp:

```yaml
volumes:
  bot1_data:  # Sesiones de Bot 1
  bot2_data:  # Sesiones de Bot 2
  bot3_data:  # Sesiones de Bot 3
  bot4_data:  # Sesiones de Bot 4
  bot5_data:  # Sesiones de Bot 5
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Ver detalles de un volumen
docker volume inspect bot_bot1_data

# Eliminar volúmenes no usados
docker volume prune

# Eliminar volumen específico (CUIDADO: elimina sesión de WhatsApp)
docker volume rm bot_bot1_data
```

---

## 🔄 Actualizar el Código

Cuando hagas cambios en el código:

```bash
# 1. Detener contenedores
docker-compose down

# 2. Reconstruir imágenes
docker-compose build

# 3. Iniciar de nuevo
docker-compose up -d

# O todo en un comando:
docker-compose up -d --build
```

---

## 🆘 Troubleshooting

### Problema: Un bot no inicia

```bash
# Ver logs del bot
docker-compose logs bot1

# Verificar variables de entorno
docker-compose exec bot1 env | grep BOT

# Reiniciar el bot
docker-compose restart bot1
```

### Problema: Puerto ya en uso

```bash
# Ver qué está usando el puerto
netstat -ano | findstr "3009"

# Cambiar el puerto en docker-compose.yml
# De: "3009:3009"
# A:  "3019:3009"  # Puerto externo diferente
```

### Problema: Sesión de WhatsApp perdida

```bash
# Verificar que el volumen existe
docker volume ls | findstr bot1

# Si se perdió, necesitas escanear el QR nuevamente
# Accede a: http://localhost:3009
```

### Problema: Conversaciones duplicadas

```bash
# Ejecutar limpieza dentro del contenedor
docker-compose exec bot1 node cleanup-duplicates.js

# Ver logs para confirmar
docker-compose logs bot1
```

### Problema: No se conecta a Supabase

```bash
# Verificar variables de entorno
docker-compose exec bot1 env | grep SUPABASE

# Verificar conectividad
docker-compose exec bot1 ping supabase.co

# Revisar logs
docker-compose logs bot1 | grep Supabase
```

---

## 🚀 Despliegue en Producción

### Opción 1: VM con Docker

```bash
# 1. Clonar repositorio en la VM
git clone tu-repo.git
cd bot

# 2. Configurar .env para cada bot
nano bot1/.env
nano bot2/.env
# ... etc

# 3. Iniciar con docker-compose
docker-compose up -d

# 4. Configurar Caddy (reverse proxy)
# Ver Caddyfile para configuración
```

### Opción 2: Docker Swarm (Múltiples Servidores)

```bash
# Inicializar swarm
docker swarm init

# Desplegar stack
docker stack deploy -c docker-compose.yml whatsapp-bots

# Ver servicios
docker service ls

# Escalar un servicio
docker service scale whatsapp-bots_bot1=2
```

### Opción 3: Kubernetes (Avanzado)

Convertir docker-compose a Kubernetes:
```bash
kompose convert -f docker-compose.yml
kubectl apply -f .
```

---

## 📊 Monitoreo

### Ver Estado en Tiempo Real

```bash
# Dashboard interactivo
docker-compose top

# Uso de recursos
docker stats

# Logs en tiempo real
docker-compose logs -f --tail=50
```

### Healthchecks

Cada bot tiene un healthcheck configurado:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3009/status"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Verificar estado:
```bash
docker-compose ps
# Verás "healthy" o "unhealthy" en la columna Status
```

---

## 🔐 Seguridad

### Variables de Entorno Sensibles

**NO subas archivos `.env` a Git**

```bash
# Asegúrate de que .gitignore incluya:
*.env
.env.*
```

### Limitar Acceso a Puertos

En producción, usa un reverse proxy (Caddy/Nginx):

```yaml
# docker-compose.yml
services:
  bot1:
    ports:
      - "127.0.0.1:3009:3009"  # Solo localhost
```

---

## 📝 Checklist de Despliegue

- [ ] SQL ejecutado en Supabase
- [ ] Archivos `.env` configurados para cada bot
- [ ] Variables `BOT_IDENTIFIER` únicas (bot1, bot2, bot3, bot4, bot5)
- [ ] Docker y Docker Compose instalados
- [ ] Puertos disponibles (3001-3005, 3009-3013)
- [ ] Imágenes construidas: `docker-compose build`
- [ ] Contenedores iniciados: `docker-compose up -d`
- [ ] Logs verificados: `docker-compose logs`
- [ ] QR codes escaneados para cada bot
- [ ] Dashboard accesible en http://localhost:3100
- [ ] Bots aparecen en Supabase (tabla `bots`)

---

## 🎉 Resultado Final

Después del despliegue tendrás:

✅ **5 bots independientes** corriendo en contenedores Docker
✅ **Cada bot con su propia sesión** de WhatsApp persistente
✅ **Sin duplicados** gracias a los constraints y verificaciones
✅ **Dashboard** para gestionar todos los bots
✅ **Escalable** - fácil agregar más bots
✅ **Resiliente** - restart automático si un bot falla
✅ **Aislado** - cada bot en su propio contenedor

---

**Fecha:** 28 de octubre de 2025
**Versión:** 2.0 - Docker Deployment
