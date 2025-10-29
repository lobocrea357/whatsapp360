# ⚡ Inicio Rápido - Despliegue con Docker

## 🎯 3 Pasos para Desplegar

### 1️⃣ Ejecutar SQL en Supabase (5 minutos)

```
1. Abre https://supabase.com/dashboard
2. Ve a SQL Editor
3. Copia el SQL de: SETUP-BOTS-INDEPENDIENTES.md (líneas 17-119)
4. Ejecuta el script
```

### 2️⃣ Configurar Variables de Entorno (10 minutos)

Crea/actualiza estos archivos con tus credenciales:

```
bot1/.env  → BOT_IDENTIFIER=bot1, PORT=3001, API_PORT=3009
bot2/.env  → BOT_IDENTIFIER=bot2, PORT=3002, API_PORT=3010
bot3/.env  → BOT_IDENTIFIER=bot3, PORT=3003, API_PORT=3011
bot4/.env  → BOT_IDENTIFIER=bot4, PORT=3004, API_PORT=3012
bot5/.env  → BOT_IDENTIFIER=bot5, PORT=3005, API_PORT=3013
dashboard/.env.local → Credenciales de Supabase
```

**Plantilla `.env` para cada bot:**
```env
OPENAI_API_KEY=sk-tu-key-aqui
PORT=300X
API_PORT=300X
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
BOT_NAME=Asesor X
BOT_IDENTIFIER=botX
```

### 3️⃣ Iniciar con Docker (2 minutos)

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

---

## 📱 Escanear QR Codes

Abre cada URL y escanea con WhatsApp:

- Bot 1: http://localhost:3009
- Bot 2: http://localhost:3010
- Bot 3: http://localhost:3011
- Bot 4: http://localhost:3012
- Bot 5: http://localhost:3013

**Dashboard:** http://localhost:3100

---

## ✅ Verificar que Funciona

### En Supabase
```
Table Editor > bots → Deberías ver 5 bots
```

### En Docker
```bash
docker-compose ps
# Todos deben estar "Up" y "healthy"
```

### En Dashboard
```
http://localhost:3100 → Ver 5 bots con sus conversaciones
```

---

## 🔧 Comandos Útiles

```bash
# Ver logs de un bot
docker-compose logs -f bot1

# Reiniciar un bot
docker-compose restart bot1

# Detener todo
docker-compose down

# Limpiar duplicados
docker-compose exec bot1 node cleanup-duplicates.js
```

---

## 🆘 Problemas Comunes

### "Puerto ya en uso"
```bash
# Ver qué usa el puerto
netstat -ano | findstr "3009"

# Matar el proceso o cambiar puerto en docker-compose.yml
```

### "No se conecta a Supabase"
```bash
# Verificar variables
docker-compose exec bot1 env | grep SUPABASE

# Revisar .env tiene las credenciales correctas
```

### "Sesión de WhatsApp perdida"
```bash
# Escanear QR nuevamente
# http://localhost:3009
```

---

## 📚 Documentación Completa

- **README-DESPLIEGUE-COMPLETO.md** - Guía paso a paso detallada
- **DOCKER-DEPLOYMENT.md** - Todo sobre Docker
- **SETUP-BOTS-INDEPENDIENTES.md** - SQL y configuración
- **RESUMEN-SOLUCION.md** - Arquitectura y solución

---

## ✨ Características

✅ 5 bots independientes
✅ Sin duplicados
✅ Persistencia de sesiones
✅ Dashboard web
✅ Escalable
✅ Auto-restart

---

**Tiempo total de setup:** ~20 minutos
**Estado:** ✅ Listo para producción
