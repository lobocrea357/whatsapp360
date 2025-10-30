# 🔧 Cambios Aplicados a Todos los Bots

## 📅 Fecha: 29 de Octubre, 2025

## 🎯 Problema Identificado

Todos los bots (bot1, bot2, bot3, bot4, bot5) tenían el puerto **hardcodeado en 3001** en el archivo `src/bot.js`, lo que causaba conflictos al intentar conectarse, ya que no respetaban los puertos configurados en el archivo `.env`.

## ✅ Soluciones Implementadas

### 1. **Corrección del Puerto Hardcodeado**

**Archivos modificados:**
- `bot1/src/bot.js` - Línea 71
- `bot2/src/bot.js` - Línea 71
- `bot3/src/bot.js` - Línea 71
- `bot4/src/bot.js` - Línea 71
- `bot5/src/bot.js` - Línea 71

**Cambio realizado:**
```javascript
// ANTES (incorrecto):
port: 3001

// DESPUÉS (correcto):
port: PORT
```

Ahora cada bot usa correctamente su puerto configurado en `.env`:
- Bot 1: Puerto 3001
- Bot 2: Puerto 3002
- Bot 3: Puerto 3003
- Bot 4: Puerto 3004
- Bot 5: Puerto 3005

### 2. **Scripts de Inicio Automático**

Se crearon scripts PowerShell para cada bot que:
- ✅ Verifican dependencias
- ✅ Liberan puertos automáticamente si están ocupados
- ✅ Inician bot y API juntos
- ✅ Muestran la URL para conectar WhatsApp

**Archivos creados:**
- `bot1/start-bot1.ps1`
- `bot2/start-bot2.ps1`
- `bot3/start-bot3.ps1`
- `bot4/start-bot4.ps1`
- `bot5/start-bot5.ps1`

### 3. **Scripts de Detención**

Scripts para detener cada bot de forma limpia:

**Archivos creados:**
- `bot1/stop-bot1.ps1`
- `bot2/stop-bot2.ps1`
- `bot3/stop-bot3.ps1`
- `bot4/stop-bot4.ps1`
- `bot5/stop-bot5.ps1`

### 4. **Documentación Individual**

Guías de inicio rápido para cada bot:

**Archivos creados:**
- `bot1/INICIO-BOT1.md` (Guía completa con troubleshooting)
- `bot2/INICIO-BOT2.md`
- `bot3/INICIO-BOT3.md`
- `bot4/INICIO-BOT4.md`
- `bot5/INICIO-BOT5.md`

## 🚀 Cómo Usar los Bots Ahora

### Iniciar un Bot Individual

```powershell
# Bot 1
cd bot1
.\start-bot1.ps1

# Bot 2
cd bot2
.\start-bot2.ps1

# Bot 3
cd bot3
.\start-bot3.ps1

# Bot 4
cd bot4
.\start-bot4.ps1

# Bot 5
cd bot5
.\start-bot5.ps1
```

### URLs de Conexión

Después de iniciar cada bot, abre en tu navegador:

- **Bot 1:** http://localhost:3009
- **Bot 2:** http://localhost:3010
- **Bot 3:** http://localhost:3011
- **Bot 4:** http://localhost:3012
- **Bot 5:** http://localhost:3013

### Detener un Bot

```powershell
# Desde el directorio del bot
.\stop-bot{N}.ps1
```

## 📊 Configuración de Puertos

| Bot | Puerto Bot | Puerto API | URL Conexión |
|-----|-----------|-----------|--------------|
| Bot 1 | 3001 | 3009 | http://localhost:3009 |
| Bot 2 | 3002 | 3010 | http://localhost:3010 |
| Bot 3 | 3003 | 3011 | http://localhost:3011 |
| Bot 4 | 3004 | 3012 | http://localhost:3012 |
| Bot 5 | 3005 | 3013 | http://localhost:3013 |

## 🔍 Verificación de Estado

Para cada bot puedes verificar:

### Ver Conversaciones
```
http://localhost:{API_PORT}/conversations
```

### Ver Estado de Autenticación
```
http://localhost:{API_PORT}/status
```

### Ver QR Code
```
http://localhost:{API_PORT}/qr
```

## 🛠️ Solución de Problemas Comunes

### Error: Puerto en uso

Los scripts de inicio ahora liberan automáticamente los puertos. Si el problema persiste:

```powershell
.\stop-bot{N}.ps1
.\start-bot{N}.ps1
```

### No aparece el código QR

1. Espera 10-15 segundos
2. Refresca la página
3. Verifica que el bot esté corriendo sin errores

### Error de conexión a Supabase

Verifica que el archivo `.env` tenga las credenciales correctas:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Notas Importantes

1. **Cada bot debe iniciarse en su propio terminal** para ver los logs individuales
2. **No inicies el mismo bot dos veces** - causará conflictos de puerto
3. **Los scripts liberan puertos automáticamente** - no necesitas hacerlo manualmente
4. **Las sesiones de WhatsApp se guardan** en `bot_sessions/` - no necesitas reconectar cada vez

## 🎉 Beneficios de los Cambios

- ✅ **Inicio más fácil:** Un solo comando por bot
- ✅ **Sin conflictos de puerto:** Liberación automática
- ✅ **Mejor diagnóstico:** URLs claras y mensajes informativos
- ✅ **Documentación clara:** Guías específicas por bot
- ✅ **Configuración correcta:** Respeta variables de entorno

## 📚 Documentación Adicional

Para más información, consulta:
- `INICIO-BOT{N}.md` - Guía específica de cada bot
- `BOTS_CONFIG.md` - Configuración general
- `README_MULTI_BOTS.md` - Gestión de múltiples bots
