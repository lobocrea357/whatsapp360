# 🐳 Docker - 10 Bots WhatsApp

## ✅ Configuración Actualizada

Los archivos Docker han sido actualizados para incluir los **10 bots** (bot1 - bot10).

---

## 📁 Archivos Docker Actualizados

### 1. **docker-compose.yml**
Incluye los 10 bots + Dashboard

### 2. **docker-compose.bots-only.yml**
Solo los 10 bots (sin dashboard)

---

## 🚀 Uso con Docker

### **Opción 1: Iniciar todos los bots + Dashboard**

```bash
docker-compose up -d
```

Esto iniciará:
- ✅ Bot 1-10 (10 contenedores)
- ✅ Dashboard (1 contenedor)
- **Total: 11 contenedores**

### **Opción 2: Solo los bots (sin dashboard)**

```bash
docker-compose -f docker-compose.bots-only.yml up -d
```

Esto iniciará:
- ✅ Bot 1-10 (10 contenedores)
- **Total: 10 contenedores**

### **Opción 3: Iniciar bots específicos**

```bash
# Solo bot 1 y bot 2
docker-compose up -d bot1 bot2

# Solo bots 6-10
docker-compose up -d bot6 bot7 bot8 bot9 bot10
```

---

## 📊 Configuración de Contenedores

| Bot | Contenedor | Puerto Bot | Puerto API | URL |
|-----|-----------|-----------|-----------|-----|
| 1 | bot1_asesor1 | 3001 | 3009 | http://localhost:3009 |
| 2 | bot2_asesor2 | 3002 | 3010 | http://localhost:3010 |
| 3 | bot3_asesor3 | 3003 | 3011 | http://localhost:3011 |
| 4 | bot4_asesor4 | 3004 | 3012 | http://localhost:3012 |
| 5 | bot5_asesor5 | 3005 | 3013 | http://localhost:3013 |
| 6 | bot6_asesor6 | 3006 | 3014 | http://localhost:3014 |
| 7 | bot7_asesor7 | 3007 | 3015 | http://localhost:3015 |
| 8 | bot8_asesor8 | 3008 | 3016 | http://localhost:3016 |
| 9 | bot9_asesor9 | 3009 | 3017 | http://localhost:3017 |
| 10 | bot10_asesor10 | 3010 | 3018 | http://localhost:3018 |

---

## 🔧 Comandos Útiles

### Ver estado de los contenedores

```bash
docker-compose ps
```

### Ver logs de un bot específico

```bash
# Ver logs del bot 6
docker-compose logs -f bot6

# Ver logs de todos los bots
docker-compose logs -f
```

### Detener todos los bots

```bash
docker-compose down
```

### Detener un bot específico

```bash
docker-compose stop bot6
```

### Reiniciar un bot

```bash
docker-compose restart bot6
```

### Reconstruir un bot

```bash
# Reconstruir bot 6
docker-compose build bot6

# Reconstruir y reiniciar
docker-compose up -d --build bot6
```

### Ver recursos utilizados

```bash
docker stats
```

---

## 📦 Volúmenes (Persistencia de Datos)

Cada bot tiene su propio volumen para guardar las sesiones de WhatsApp:

```yaml
volumes:
  bot1_data:    # Sesiones del bot 1
  bot2_data:    # Sesiones del bot 2
  bot3_data:    # Sesiones del bot 3
  bot4_data:    # Sesiones del bot 4
  bot5_data:    # Sesiones del bot 5
  bot6_data:    # Sesiones del bot 6
  bot7_data:    # Sesiones del bot 7
  bot8_data:    # Sesiones del bot 8
  bot9_data:    # Sesiones del bot 9
  bot10_data:   # Sesiones del bot 10
```

### Ver volúmenes

```bash
docker volume ls | grep bot
```

### Hacer backup de un volumen

```bash
# Backup del bot 6
docker run --rm -v bot_bot6_data:/data -v $(pwd):/backup alpine tar czf /backup/bot6-backup.tar.gz /data
```

### Restaurar un volumen

```bash
# Restaurar bot 6
docker run --rm -v bot_bot6_data:/data -v $(pwd):/backup alpine tar xzf /backup/bot6-backup.tar.gz -C /
```

---

## 🌐 Red Docker

Todos los bots están en la misma red: `whatsapp_network`

Esto permite:
- ✅ Comunicación entre bots
- ✅ Aislamiento de otros contenedores
- ✅ Gestión centralizada

---

## 🏥 Health Checks

Cada bot tiene un health check que verifica su estado cada 30 segundos:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3014/status"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Ver estado de salud:

```bash
docker-compose ps
```

---

## 🚀 Despliegue en VM Debian

### Paso 1: Instalar Docker

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose -y

# Verificar instalación
docker --version
docker-compose --version
```

### Paso 2: Transferir archivos

```bash
# Desde Windows
scp -r "c:\Users\loboc\OneDrive\Documents\proyectos\VIAJES NOVA\bot" root@tu-ip:/root/
```

### Paso 3: Construir e iniciar

```bash
cd /root/bot

# Construir imágenes
docker-compose build

# Iniciar todos los bots
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 📱 Conectar WhatsApp

Para cada bot, abre en tu navegador:

```
http://tu-ip-vm:3009   # Bot 1
http://tu-ip-vm:3010   # Bot 2
http://tu-ip-vm:3011   # Bot 3
...
http://tu-ip-vm:3018   # Bot 10
```

Escanea el código QR con WhatsApp.

---

## 🔥 Firewall (UFW)

Abrir puertos necesarios:

```bash
# Puertos de los bots (3001-3010)
ufw allow 3001:3010/tcp

# Puertos de las APIs (3009-3018)
ufw allow 3009:3018/tcp

# Dashboard (si lo usas)
ufw allow 3100/tcp

# Verificar
ufw status
```

---

## 🛠️ Solución de Problemas

### Bot no inicia

```bash
# Ver logs
docker-compose logs bot6

# Verificar que el archivo .env existe
ls -la bot6/.env

# Reconstruir
docker-compose build bot6
docker-compose up -d bot6
```

### Puerto en uso

```bash
# Ver qué está usando el puerto
netstat -tulpn | grep 3014

# Detener el contenedor
docker-compose stop bot6

# Reiniciar
docker-compose up -d bot6
```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar volúmenes (¡CUIDADO! Perderás las sesiones)
docker-compose down -v

# Reconstruir todo
docker-compose build
docker-compose up -d
```

### Ver uso de recursos

```bash
# Recursos por contenedor
docker stats

# Espacio en disco
docker system df

# Limpiar recursos no usados
docker system prune -a
```

---

## 📊 Monitoreo

### Ver todos los contenedores

```bash
docker ps -a
```

### Ver logs en tiempo real

```bash
# Todos los bots
docker-compose logs -f

# Solo bot 6
docker-compose logs -f bot6

# Últimas 100 líneas
docker-compose logs --tail=100 bot6
```

### Entrar a un contenedor

```bash
# Acceder al shell del bot 6
docker-compose exec bot6 /bin/bash

# Ver archivos
ls -la

# Ver procesos
ps aux
```

---

## 🎯 Mejores Prácticas

1. **Backups regulares**: Haz backup de los volúmenes periódicamente
2. **Monitoreo**: Usa `docker stats` para ver el uso de recursos
3. **Logs**: Revisa los logs regularmente con `docker-compose logs`
4. **Actualizaciones**: Reconstruye las imágenes cuando actualices el código
5. **Recursos**: Asegúrate de tener suficiente RAM (mínimo 2GB por bot)

---

## 📝 Notas Importantes

- ⚠️ Cada bot necesita aproximadamente **200-300MB de RAM**
- ⚠️ Para 10 bots necesitas al menos **4GB de RAM** en tu VM
- ⚠️ Los volúmenes persisten las sesiones de WhatsApp
- ⚠️ No elimines los volúmenes a menos que quieras reconectar WhatsApp
- ⚠️ Usa `docker-compose down` (sin `-v`) para mantener las sesiones

---

## ✅ Resumen

- ✅ **10 bots configurados** en Docker
- ✅ **Volúmenes persistentes** para cada bot
- ✅ **Health checks** automáticos
- ✅ **Red aislada** para comunicación
- ✅ **Fácil escalabilidad** y gestión
- ✅ **Compatible con Debian/Ubuntu**

¡Todo listo para desplegar en tu VM!
