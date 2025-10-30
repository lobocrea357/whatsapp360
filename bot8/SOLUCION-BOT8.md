# Solución para el problema del Bot 8

## Problema identificado
El bot8 estaba en un **bucle infinito** generando códigos QR cada 2 segundos y eventualmente fallaba con `ERROR AUTH undefined`. Esto indica:
1. Sesión de WhatsApp corrupta
2. Generación excesiva de QRs que no permite autenticación
3. Falta de manejo de errores de autenticación

## Correcciones aplicadas

### 1. api-server.js
**Cambios realizados:**
- ✅ Intervalo de copia de QR aumentado de **2 segundos a 5 segundos**
- ✅ Agregado contador de copias de QR con límite máximo de 30 intentos
- ✅ Logs reducidos (solo cada 10 copias) para evitar spam
- ✅ Auto-detención del watcher después de 30 intentos (2.5 minutos)

**Resultado:** Evita el bucle infinito y reduce la carga del sistema.

### 2. src/bot.js
**Cambios realizados:**
- ✅ Agregadas opciones de configuración de Baileys:
  - `retryRequestDelayMs: 350`
  - `maxMsgRetryCount: 3`
  - `connectTimeoutMs: 60000`
  - `keepAliveIntervalMs: 30000`
- ✅ Agregado manejador de evento `auth_failure`
- ✅ Limpieza automática de sesión corrupta cuando falla la autenticación
- ✅ Reinicio automático del bot después de limpiar sesión

**Resultado:** El bot ahora maneja errores de autenticación y se recupera automáticamente.

## Pasos para aplicar la solución

### Opción 1: Reconstruir contenedor (Recomendado)
```powershell
# Ir al directorio raíz
cd "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot"

# Detener y eliminar contenedor bot8
docker-compose stop bot8
docker-compose rm -f bot8

# Limpiar volumen de sesión corrupta
docker volume rm bot_bot8_sessions -f

# Reconstruir sin caché
docker-compose build --no-cache bot8

# Iniciar contenedor
docker-compose up -d bot8

# Ver logs
docker-compose logs -f bot8
```

### Opción 2: Usar script automatizado
```powershell
cd "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot\bot8"
.\rebuild-bot8.ps1
```

### Opción 3: Reinicio rápido (sin reconstruir)
```powershell
cd "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot"

# Reiniciar contenedor
docker-compose restart bot8

# Ver logs
docker-compose logs -f bot8
```

## Verificación

Después de aplicar la solución:

1. **Abrir el navegador:** http://localhost:3016
2. **Verificar que el QR se genera correctamente**
3. **Escanear el QR con WhatsApp**
4. **Verificar en los logs:**
   - ✅ Debe mostrar "Proveedor listo"
   - ✅ No debe haber bucle infinito de "QR copiado"
   - ✅ No debe mostrar "ERROR AUTH" repetidamente

## Logs esperados (correctos)

```
✅ QR copiado a: /app/bot_sessions/bot8.qr.png (10 veces)
⚡⚡ ACTION REQUIRED ⚡⚡
You must scan the QR Code
✅ QR copiado a: /app/bot_sessions/bot8.qr.png (20 veces)
Proveedor listo. Adjuntando listener de guardado robusto.
```

## Si el problema persiste

Si después de aplicar estas correcciones el bot8 sigue fallando:

1. **Verificar que el puerto 3016 no esté en uso:**
   ```powershell
   netstat -ano | findstr :3016
   ```

2. **Limpiar completamente Docker:**
   ```powershell
   docker-compose down
   docker system prune -a --volumes -f
   docker-compose up -d
   ```

3. **Verificar variables de entorno en .env:**
   - `PORT=3008`
   - `API_PORT=3016`
   - `BOT_IDENTIFIER=bot8`

4. **Revisar logs completos:**
   ```powershell
   docker-compose logs --tail=100 bot8
   ```

## Archivos modificados

- ✅ `bot8/api-server.js` - Intervalo de QR y límites
- ✅ `bot8/src/bot.js` - Manejo de errores de autenticación
- ✅ `bot8/rebuild-bot8.ps1` - Script de reconstrucción (nuevo)
- ✅ `bot8/SOLUCION-BOT8.md` - Esta documentación (nuevo)
