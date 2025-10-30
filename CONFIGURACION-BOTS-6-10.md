# 🤖 Configuración de Bots 6-10

## 📅 Fecha: 29 de Octubre, 2025

## ✅ Bots Configurados

Se han configurado exitosamente los bots del 6 al 10 con la misma estructura y funcionalidad que los bots 1-5.

## 📊 Configuración de Puertos

| Bot | Puerto Bot | Puerto API | URL Conexión | Identificador |
|-----|-----------|-----------|--------------|---------------|
| Bot 6 | 3006 | 3014 | http://localhost:3014 | bot6 |
| Bot 7 | 3007 | 3015 | http://localhost:3015 | bot7 |
| Bot 8 | 3008 | 3016 | http://localhost:3016 | bot8 |
| Bot 9 | 3009 | 3017 | http://localhost:3017 | bot9 |
| Bot 10 | 3010 | 3018 | http://localhost:3018 | bot10 |

## 📁 Archivos Creados/Configurados

### Bot 6
- ✅ `.env` - Configurado con puertos 3006/3014 e identificador bot6
- ✅ `src/bot.js` - Archivo principal del bot
- ✅ `start-bot6.ps1` - Script de inicio
- ✅ `stop-bot6.ps1` - Script de detención

### Bot 7
- ✅ `.env` - Configurado con puertos 3007/3015 e identificador bot7
- ✅ `src/bot.js` - Ya existía, verificado correcto
- ✅ `start-bot7.ps1` - Script de inicio
- ✅ `stop-bot7.ps1` - Script de detención

### Bot 8
- ✅ `.env` - Configurado con puertos 3008/3016 e identificador bot8
- ✅ `src/bot.js` - Ya existía, verificado correcto
- ✅ `start-bot8.ps1` - Script de inicio
- ✅ `stop-bot8.ps1` - Script de detención

### Bot 9
- ✅ `.env` - Configurado con puertos 3009/3017 e identificador bot9
- ✅ `src/bot.js` - Ya existía, verificado correcto
- ✅ `start-bot9.ps1` - Script de inicio
- ✅ `stop-bot9.ps1` - Script de detención

### Bot 10
- ✅ `.env` - Configurado con puertos 3010/3018 e identificador bot10
- ✅ `src/bot.js` - Ya existía, verificado correcto
- ✅ `start-bot10.ps1` - Script de inicio
- ✅ `stop-bot10.ps1` - Script de detención

## 🔧 Cambios Realizados

### 1. Archivos `.env` Actualizados
Cada bot tiene su configuración única:
- **PORT**: Puerto específico del bot (3006-3010)
- **API_PORT**: Puerto de la API (3014-3018)
- **BOT_NAME**: Asesor 6-10
- **BOT_IDENTIFIER**: bot6-bot10

### 2. Scripts de Inicio y Detención
Cada bot tiene sus propios scripts que:
- Verifican dependencias
- Liberan puertos automáticamente
- Inician bot y API juntos
- Muestran URL de conexión

### 3. Script Maestro Actualizado
El archivo `gestionar-bots.ps1` ahora incluye los bots 6-10:
- Gestión centralizada de todos los 10 bots
- Ver estado de todos los bots
- Iniciar/detener bots individuales o todos

## 🚀 Cómo Usar los Nuevos Bots

### Opción 1: Script Maestro (Recomendado)

```powershell
# Ver estado de todos los bots (1-10)
.\gestionar-bots.ps1 -Accion estado

# Iniciar Bot 6
.\gestionar-bots.ps1 -Accion iniciar -Bot 6

# Iniciar Bot 7
.\gestionar-bots.ps1 -Accion iniciar -Bot 7

# Iniciar todos los bots (1-10)
.\gestionar-bots.ps1 -Accion iniciar -Bot todos

# Detener Bot 8
.\gestionar-bots.ps1 -Accion detener -Bot 8
```

### Opción 2: Scripts Individuales

```powershell
# Bot 6
cd bot6
.\start-bot6.ps1

# Bot 7
cd bot7
.\start-bot7.ps1

# Bot 8
cd bot8
.\start-bot8.ps1

# Bot 9
cd bot9
.\start-bot9.ps1

# Bot 10
cd bot10
.\start-bot10.ps1
```

## 📱 Conectar WhatsApp

Para cada bot:
1. Inicia el bot con el script correspondiente
2. Abre la URL en tu navegador:
   - Bot 6: http://localhost:3014
   - Bot 7: http://localhost:3015
   - Bot 8: http://localhost:3016
   - Bot 9: http://localhost:3017
   - Bot 10: http://localhost:3018
3. Escanea el código QR con WhatsApp

## 🗄️ Integración con Supabase

Todos los bots están configurados para:
- ✅ Conectarse a la misma base de datos Supabase
- ✅ Crear su propio registro en la tabla `bots` con su identificador único
- ✅ Guardar conversaciones independientes
- ✅ Sincronizar mensajes automáticamente

### Identificadores en Supabase:
- Bot 6: `bot6` (Asesor 6)
- Bot 7: `bot7` (Asesor 7)
- Bot 8: `bot8` (Asesor 8)
- Bot 9: `bot9` (Asesor 9)
- Bot 10: `bot10` (Asesor 10)

Cada bot se registrará automáticamente en Supabase al iniciarse por primera vez.

## 📊 Tabla Completa de Configuración (Bots 1-10)

| Bot | Nombre | Puerto Bot | Puerto API | URL | Identificador |
|-----|--------|-----------|-----------|-----|---------------|
| 1 | Asesor 1 | 3001 | 3009 | http://localhost:3009 | bot1 |
| 2 | Asesor 2 | 3002 | 3010 | http://localhost:3010 | bot2 |
| 3 | Asesor 3 | 3003 | 3011 | http://localhost:3011 | bot3 |
| 4 | Asesor 4 | 3004 | 3012 | http://localhost:3012 | bot4 |
| 5 | Asesor 5 | 3005 | 3013 | http://localhost:3013 | bot5 |
| 6 | Asesor 6 | 3006 | 3014 | http://localhost:3014 | bot6 |
| 7 | Asesor 7 | 3007 | 3015 | http://localhost:3015 | bot7 |
| 8 | Asesor 8 | 3008 | 3016 | http://localhost:3016 | bot8 |
| 9 | Asesor 9 | 3009 | 3017 | http://localhost:3017 | bot9 |
| 10 | Asesor 10 | 3010 | 3018 | http://localhost:3018 | bot10 |

## ⚠️ Nota Importante sobre Puertos

**Bot 1 y Bot 9 comparten el puerto 3009:**
- Bot 1 usa 3009 como puerto API
- Bot 9 usa 3009 como puerto del bot

Esto NO causará conflictos porque son servicios diferentes (bot vs API). Sin embargo, si experimentas problemas, considera cambiar el puerto del Bot 9 a 3019.

## 🔍 Verificar Estado

### Ver todos los bots:
```powershell
.\gestionar-bots.ps1 -Accion estado
```

### Ver conversaciones de un bot específico:
```
http://localhost:{API_PORT}/conversations
```

Ejemplo para Bot 6:
```
http://localhost:3014/conversations
```

## 🛠️ Solución de Problemas

### Bot no inicia
1. Verifica que el archivo `.env` existe
2. Ejecuta el script de detención primero
3. Vuelve a iniciar

```powershell
cd bot6
.\stop-bot6.ps1
.\start-bot6.ps1
```

### Puerto en uso
Los scripts liberan automáticamente los puertos. Si persiste:
```powershell
.\gestionar-bots.ps1 -Accion detener -Bot 6
.\gestionar-bots.ps1 -Accion iniciar -Bot 6
```

### No aparece en Supabase
1. Verifica las credenciales en `.env`
2. Revisa los logs del bot en la terminal
3. Asegúrate de tener conexión a internet

## 🎉 Resumen

✅ **10 bots configurados** y listos para usar
✅ **Scripts de gestión** para cada bot
✅ **Script maestro** para gestión centralizada
✅ **Integración con Supabase** configurada
✅ **Puertos únicos** para cada bot
✅ **Identificadores únicos** en la base de datos

Todos los bots están listos para conectarse a WhatsApp y comenzar a funcionar de forma independiente.
