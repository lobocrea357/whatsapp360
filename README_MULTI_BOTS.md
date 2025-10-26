# 🤖 Sistema Multi-Bot de WhatsApp con Dashboard

Sistema escalable de múltiples bots de WhatsApp que se ejecutan en paralelo, con sincronización a Supabase y dashboard centralizado.

## 📋 Estructura del Proyecto

```
bot/
├── bot1/          # Asesor 1 (Puertos: 3001/3009)
├── bot2/          # Asesor 2 (Puertos: 3002/3010)
├── bot3/          # Asesor 3 (Puertos: 3003/3011)
├── bot4/          # Asesor 4 (Puertos: 3004/3012)
├── bot5/          # Asesor 5 (Puertos: 3005/3013)
├── dashboard/     # Dashboard centralizado (Puerto: 3000)
├── start-all-bots.ps1    # Script para iniciar todos los bots
├── stop-all-bots.ps1     # Script para detener todos los bots
└── BOTS_CONFIG.md        # Configuración detallada
```

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Cada bot necesita su archivo `.env` configurado. Ejemplo para **bot1**:

```env
# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai

# Puertos
PORT=3001
API_PORT=3009

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_de_supabase

# Identificación del Bot
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

**Importante**: Cambia los puertos y el nombre para cada bot:
- **bot2**: PORT=3002, API_PORT=3010, BOT_NAME=Asesor 2, BOT_IDENTIFIER=bot2
- **bot3**: PORT=3003, API_PORT=3011, BOT_NAME=Asesor 3, BOT_IDENTIFIER=bot3
- **bot4**: PORT=3004, API_PORT=3012, BOT_NAME=Asesor 4, BOT_IDENTIFIER=bot4
- **bot5**: PORT=3005, API_PORT=3013, BOT_NAME=Asesor 5, BOT_IDENTIFIER=bot5

### 2. Iniciar Todos los Bots

**Opción A: Script Automático (Recomendado)**
```powershell
.\start-all-bots.ps1
```

Esto abrirá 5 ventanas de PowerShell, una para cada bot.

**Opción B: Manual (una terminal por bot)**
```bash
# Terminal 1
cd bot1
npm run dev

# Terminal 2
cd bot2
npm run dev

# Terminal 3
cd bot3
npm run dev

# Terminal 4
cd bot4
npm run dev

# Terminal 5
cd bot5
npm run dev
```

### 3. Escanear Códigos QR

Cada bot necesita su propio código QR de WhatsApp:

- **Asesor 1**: http://localhost:3009
- **Asesor 2**: http://localhost:3010
- **Asesor 3**: http://localhost:3011
- **Asesor 4**: http://localhost:3012
- **Asesor 5**: http://localhost:3013

Abre cada URL en tu navegador y escanea el QR con WhatsApp.

### 4. Iniciar el Dashboard

```bash
cd dashboard
npm run dev
```

Dashboard disponible en: http://localhost:3000

## 📊 Asignación de Puertos

| Bot | Nombre | Puerto Bot | Puerto API | URL QR |
|-----|--------|------------|------------|--------|
| bot1 | Asesor 1 | 3001 | 3009 | http://localhost:3009 |
| bot2 | Asesor 2 | 3002 | 3010 | http://localhost:3010 |
| bot3 | Asesor 3 | 3003 | 3011 | http://localhost:3011 |
| bot4 | Asesor 4 | 3004 | 3012 | http://localhost:3012 |
| bot5 | Asesor 5 | 3005 | 3013 | http://localhost:3013 |

## 🗄️ Estructura en Supabase

Todos los bots comparten la misma base de datos pero se identifican por su campo `phone_number`:

```sql
-- Tabla bots
id              | name      | phone_number | status
----------------|-----------|--------------|--------
uuid-1          | Asesor 1  | bot1         | active
uuid-2          | Asesor 2  | bot2         | active
uuid-3          | Asesor 3  | bot3         | active
uuid-4          | Asesor 4  | bot4         | active
uuid-5          | Asesor 5  | bot5         | active
```

Cada bot tiene sus propias conversaciones y mensajes asociados.

## 🎯 Funcionalidades

### Por Bot
- ✅ Conexión independiente a WhatsApp
- ✅ Sesión propia (archivos en `bot_sessions/`)
- ✅ Base de datos local (`db.json`)
- ✅ Sincronización automática a Supabase
- ✅ Transcripción de audios con Whisper
- ✅ API REST para acceder a conversaciones

### Dashboard
- ✅ Vista de todos los bots
- ✅ Estadísticas globales
- ✅ Conversaciones por bot
- ✅ Mensajes completos
- ✅ Descarga en TXT y Markdown
- ✅ Búsqueda de conversaciones
- ✅ Autenticación con Supabase

## 🔄 Flujo de Datos

```
Usuario WhatsApp
    ↓
Bot (1-5) recibe mensaje
    ↓
Guarda en db.json
    ↓
message-sync.js detecta cambio
    ↓
Sincroniza a Supabase
    ↓
Dashboard lee desde Supabase
    ↓
Usuario visualiza en navegador
```

## 🛑 Detener los Bots

**Opción A: Script Automático**
```powershell
.\stop-all-bots.ps1
```

**Opción B: Manual**
- Cierra cada ventana de PowerShell
- O presiona `Ctrl+C` en cada terminal

## 🔍 Verificar que Todo Funciona

### 1. Verificar Puertos en Uso
```powershell
netstat -ano | findstr "3001 3002 3003 3004 3005 3009 3010 3011 3012 3013"
```

Deberías ver todos los puertos en estado `LISTENING`.

### 2. Verificar en Supabase
1. Ve a tu proyecto en Supabase
2. Abre **Table Editor** > **bots**
3. Deberías ver 5 bots: Asesor 1, Asesor 2, Asesor 3, Asesor 4, Asesor 5

### 3. Verificar Dashboard
1. Abre http://localhost:3000
2. Inicia sesión
3. Deberías ver los 5 bots en el dashboard

## 📝 Logs y Debugging

Cada bot genera sus propios logs en su carpeta:
- `baileys.log` - Logs de la conexión de WhatsApp
- `core.class.log` - Logs del core del bot
- `db.json` - Base de datos local

Para ver logs en tiempo real, observa la terminal de cada bot.

## 🚨 Solución de Problemas

### Error: Puerto ya en uso
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solución**: Ejecuta `stop-all-bots.ps1` o mata el proceso manualmente:
```powershell
# Encontrar el PID
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número real)
taskkill /PID <PID> /F
```

### Bot no se conecta a WhatsApp
1. Verifica que el QR esté visible en la URL del API
2. Escanea el QR con WhatsApp
3. Espera unos segundos a que se conecte
4. Revisa los logs en la terminal del bot

### No aparecen bots en el dashboard
1. Verifica que Supabase esté configurado correctamente
2. Verifica las variables de entorno en cada bot
3. Revisa que los bots estén corriendo
4. Verifica que el servicio de sincronización esté activo

### Mensajes no se guardan en Supabase
1. Verifica las credenciales de Supabase en `.env`
2. Verifica que las tablas existan en Supabase
3. Revisa los logs del servicio de sincronización
4. Verifica que `db.json` se esté actualizando

## 📈 Escalar a Más Bots

Para agregar más bots (bot6, bot7, etc.):

1. **Copia una carpeta de bot existente**:
   ```powershell
   Copy-Item -Recurse bot1 bot6
   ```

2. **Actualiza el `.env`**:
   ```env
   PORT=3006
   API_PORT=3014
   BOT_NAME=Asesor 6
   BOT_IDENTIFIER=bot6
   ```

3. **Actualiza `src/supabase.js`**:
   ```javascript
   const BOT_NAME = process.env.BOT_NAME || 'Asesor 6'
   const BOT_IDENTIFIER = process.env.BOT_IDENTIFIER || 'bot6'
   ```

4. **Actualiza `api-server.js`**:
   ```javascript
   const PORT = process.env.API_PORT || 3014;
   ```

5. **Inicia el nuevo bot**:
   ```bash
   cd bot6
   npm run dev
   ```

## 🔐 Seguridad

- ✅ Cada bot tiene su propia sesión de WhatsApp
- ✅ Los datos se almacenan en Supabase con autenticación
- ✅ El dashboard requiere login
- ✅ Las credenciales están en archivos `.env` (no en Git)
- ✅ CORS configurado para permitir acceso desde el dashboard

## 📚 Documentación Adicional

- **BOTS_CONFIG.md** - Configuración detallada de cada bot
- **dashboard/DASHBOARD_SETUP.md** - Configuración del dashboard
- **dashboard/CREATE_USER.md** - Cómo crear usuarios para el dashboard

## ✅ Checklist de Configuración

- [ ] Supabase configurado con tablas creadas
- [ ] Variables de entorno configuradas en cada bot
- [ ] Todos los bots iniciados correctamente
- [ ] Códigos QR escaneados para cada bot
- [ ] Bots conectados a WhatsApp
- [ ] Dashboard iniciado
- [ ] Usuario creado en Supabase Auth
- [ ] Login exitoso en el dashboard
- [ ] Los 5 bots visibles en el dashboard

## 🎉 ¡Listo!

Tu sistema multi-bot está configurado y funcionando. Ahora puedes:
- Gestionar 5 bots de WhatsApp simultáneamente
- Ver todas las conversaciones en un dashboard centralizado
- Descargar conversaciones en múltiples formatos
- Escalar a más bots cuando lo necesites

---

**Desarrollado para Viajes Nova** 🚀
**Sistema Multi-Bot WhatsApp + Supabase + Dashboard**
