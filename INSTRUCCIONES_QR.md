# 📱 Instrucciones para Escanear el Código QR en Google Cloud VM

## 🔧 Problema Resuelto

El bot de WhatsApp necesita ser autenticado mediante un código QR. En un entorno Docker dentro de una VM de Google Cloud, no puedes ver el QR en la consola. Esta solución proporciona una interfaz web para visualizar y escanear el código QR.

## 🚀 Pasos para Autenticar el Bot

### 1. Configurar el Firewall en Google Cloud

Primero, necesitas abrir el puerto 3009 en tu VM de Google Cloud:

```bash
# En Google Cloud Console, ve a:
# VPC Network > Firewall > Create Firewall Rule

# O usa este comando en Cloud Shell:
gcloud compute firewall-rules create allow-bot-qr \
    --allow tcp:3009 \
    --source-ranges 0.0.0.0/0 \
    --description "Permitir acceso al QR del bot de WhatsApp"
```

### 2. Iniciar los Contenedores Docker

En tu VM de Google Cloud, ejecuta:

```bash
cd /ruta/a/tu/proyecto/bot
docker-compose up -d
```

### 3. Obtener la IP Externa de tu VM

```bash
# Obtener la IP externa de tu VM
curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip

# O en Google Cloud Console:
# Compute Engine > VM instances > [Tu VM] > External IP
```

### 4. Acceder a la Interfaz Web del QR

Abre tu navegador web y visita:

```
http://[IP_EXTERNA_DE_TU_VM]:3009
```

Por ejemplo: `http://34.123.45.67:3009`

Verás una página web con:
- ✅ El código QR actualizado en tiempo real
- 📊 Estado de autenticación del bot
- 📱 Instrucciones paso a paso

### 5. Escanear el Código QR

1. Abre **WhatsApp** en tu teléfono
2. Ve a **Configuración** > **Dispositivos vinculados**
3. Toca en **Vincular un dispositivo**
4. Escanea el código QR que aparece en la página web
5. ¡Listo! El bot estará autenticado

## 🔍 Endpoints Disponibles

Una vez que el bot esté corriendo, tienes acceso a estos endpoints:

| Endpoint | Descripción |
|----------|-------------|
| `http://[IP]:3009/` | Interfaz web visual para escanear el QR |
| `http://[IP]:3009/qr` | Imagen del código QR (PNG) |
| `http://[IP]:3009/status` | Estado de autenticación (JSON) |
| `http://[IP]:3009/conversations` | Conversaciones guardadas (JSON) |

## 🛠️ Solución de Problemas

### El QR no aparece

1. Verifica que el contenedor esté corriendo:
   ```bash
   docker ps
   ```

2. Revisa los logs del contenedor:
   ```bash
   docker logs bot_service
   ```

3. Verifica que el puerto esté abierto:
   ```bash
   netstat -tuln | grep 3009
   ```

### Error de Firewall

Si no puedes acceder a `http://[IP]:3009`, verifica:

1. Que la regla de firewall esté creada en Google Cloud
2. Que tu VM tenga una IP externa asignada
3. Que el puerto 3009 esté en la lista de puertos permitidos

### El QR expira muy rápido

El código QR de WhatsApp expira cada 60 segundos. La página web se actualiza automáticamente cada 30 segundos. Si el QR expira:

1. Espera a que se genere uno nuevo (aparecerá automáticamente)
2. Escanéalo rápidamente con tu teléfono

### Error AUTH después de múltiples intentos

Si ves "ERROR AUTH" después de muchos intentos:

1. Detén los contenedores:
   ```bash
   docker-compose down
   ```

2. Elimina la carpeta de sesiones:
   ```bash
   rm -rf base-js-baileys-json/bot_sessions/*
   ```

3. Reinicia los contenedores:
   ```bash
   docker-compose up -d
   ```

4. Vuelve a escanear el QR

## 🔒 Seguridad

**⚠️ IMPORTANTE:** El puerto 3009 está abierto a internet. Para mayor seguridad:

1. **Opción 1 - Restringir por IP:**
   ```bash
   gcloud compute firewall-rules update allow-bot-qr \
       --source-ranges [TU_IP]/32
   ```

2. **Opción 2 - Usar SSH Tunnel:**
   ```bash
   # En tu máquina local:
   ssh -L 3009:localhost:3009 usuario@[IP_VM]
   
   # Luego accede a: http://localhost:3009
   ```

3. **Opción 3 - Cerrar el puerto después de autenticar:**
   ```bash
   # Una vez autenticado, elimina la regla de firewall:
   gcloud compute firewall-rules delete allow-bot-qr
   ```

## 📝 Notas Adicionales

- Una vez autenticado, el bot guardará la sesión en `bot_sessions/`
- No necesitarás escanear el QR nuevamente a menos que:
  - Elimines la carpeta `bot_sessions/`
  - Desvincules el dispositivo desde WhatsApp
  - El contenedor se reinicie sin volúmenes persistentes

- Los volúmenes de Docker están configurados para persistir la sesión:
  ```yaml
  volumes:
    - ./base-js-baileys-json:/app
  ```

## 🎯 Verificación Final

Para verificar que todo funciona:

1. Accede a `http://[IP]:3009/status`
2. Deberías ver:
   ```json
   {
     "qrAvailable": true,
     "authenticated": false,
     "message": "Esperando escaneo del código QR"
   }
   ```

3. Después de escanear el QR:
   ```json
   {
     "qrAvailable": false,
     "authenticated": true,
     "message": "Bot autenticado correctamente"
   }
   ```

## 📞 Soporte

Si sigues teniendo problemas, revisa:
- Los logs del contenedor: `docker logs -f bot_service`
- La documentación de BuilderBot: https://builderbot.vercel.app/
- La documentación de Baileys: https://github.com/WhiskeySockets/Baileys
