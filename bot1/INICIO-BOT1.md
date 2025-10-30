# 🤖 Guía de Inicio - Bot 1

## 📋 Información del Bot

- **Nombre:** Asesor 1
- **Identificador:** bot1
- **Puerto Bot:** 3001
- **Puerto API:** 3009
- **URL de conexión:** http://localhost:3009

## 🚀 Inicio Rápido

### Opción 1: Usar el script de PowerShell (Recomendado)

```powershell
.\start-bot1.ps1
```

Este script:
- ✅ Verifica las dependencias
- ✅ Libera los puertos si están ocupados
- ✅ Inicia el bot y la API automáticamente
- ✅ Muestra la URL para conectar WhatsApp

### Opción 2: Inicio manual

```powershell
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar bot y API juntos
npm run dev
```

## 📱 Conectar WhatsApp

1. Una vez iniciado el bot, abre en tu navegador:
   ```
   http://localhost:3009
   ```

2. Verás una página con el código QR

3. En tu teléfono:
   - Abre WhatsApp
   - Ve a **Configuración** > **Dispositivos vinculados**
   - Toca **Vincular un dispositivo**
   - Escanea el código QR

4. ¡Listo! El bot estará conectado

## 🛑 Detener el Bot

### Opción 1: Usar el script de PowerShell

```powershell
.\stop-bot1.ps1
```

### Opción 2: Detener manualmente

Presiona `Ctrl + C` en la terminal donde está corriendo el bot.

## 🔧 Solución de Problemas

### El bot no inicia

1. **Verificar que los puertos estén libres:**
   ```powershell
   netstat -ano | findstr "3001"
   netstat -ano | findstr "3009"
   ```

2. **Si hay procesos usando los puertos, detenerlos:**
   ```powershell
   .\stop-bot1.ps1
   ```

3. **Reintentar el inicio:**
   ```powershell
   .\start-bot1.ps1
   ```

### No aparece el código QR

1. Espera unos segundos (puede tardar 10-15 segundos en generarse)
2. Refresca la página en el navegador
3. Verifica que el bot esté corriendo sin errores en la terminal

### Error de conexión a Supabase

1. Verifica que el archivo `.env` tenga las credenciales correctas:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Verifica que tengas conexión a internet

### El bot se desconecta constantemente

1. Verifica que no haya otro bot usando el mismo número
2. Asegúrate de que el teléfono tenga conexión estable
3. Revisa los logs en la terminal para ver errores específicos

## 📊 Verificar Estado

### Ver conversaciones guardadas

Abre en tu navegador:
```
http://localhost:3009/conversations
```

Verás un JSON con todas las conversaciones guardadas.

### Ver estado de autenticación

Abre en tu navegador:
```
http://localhost:3009/status
```

## 📁 Archivos Importantes

- **`.env`** - Configuración y credenciales
- **`src/bot.js`** - Lógica principal del bot
- **`api-server.js`** - Servidor API para el dashboard
- **`db.json`** - Base de datos local de conversaciones
- **`bot_sessions/`** - Sesiones de WhatsApp guardadas

## 🔑 Variables de Entorno

El archivo `.env` debe contener:

```env
OPENAI_API_KEY=tu_api_key_de_openai
PORT=3001
API_PORT=3009
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

## 📝 Logs

Los logs del bot se guardan en:
- **`baileys.log`** - Logs de la librería Baileys (WhatsApp)
- **`core.class.log`** - Logs del core del bot
- **`queue.class.log`** - Logs de la cola de mensajes

## 🆘 Ayuda Adicional

Si sigues teniendo problemas:

1. Revisa los logs en la terminal
2. Verifica que todas las dependencias estén instaladas: `npm install`
3. Asegúrate de tener Node.js v18 o superior: `node --version`
4. Consulta la documentación principal en el directorio raíz del proyecto
