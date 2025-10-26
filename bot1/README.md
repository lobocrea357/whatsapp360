<p align="center">
  <a href="https://builderbot.vercel.app/">
    <picture>
      <img src="https://builderbot.vercel.app/assets/thumbnail-vector.png" height="80">
    </picture>
    <h2 align="center">BuilderBot - WhatsApp Bot</h2>
  </a>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@builderbot/bot">
    <img alt="" src="https://img.shields.io/npm/v/@builderbot/bot?color=%2300c200&label=%40bot-whatsapp">
  </a>
  <a aria-label="Join the community on GitHub" href="https://link.codigoencasa.com/DISCORD">
    <img alt="" src="https://img.shields.io/discord/915193197645402142?logo=discord">
  </a>
</p>

---

## 🚀 Inicio Rápido en Google Cloud VM

### ⚡ Solución al Error de Autenticación QR

Si estás viendo el error **"ERROR AUTH"** o mensajes repetidos de **"You must scan the QR Code"**, sigue estos pasos:

#### 1. Configurar Firewall
```bash
gcloud compute firewall-rules create allow-bot-qr \
    --allow tcp:3009 \
    --source-ranges 0.0.0.0/0
```

#### 2. Iniciar Contenedores
```bash
docker-compose up -d
```

#### 3. Obtener IP Externa
```bash
curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip
```

#### 4. Acceder al QR
Abre tu navegador en: **`http://[TU_IP_EXTERNA]:3009`**

#### 5. Escanear con WhatsApp
- Abre WhatsApp → **Configuración** → **Dispositivos vinculados**
- Toca **Vincular un dispositivo**
- Escanea el código QR de la página web

### 📚 Documentación Completa

- **[SOLUCION_RAPIDA.md](../SOLUCION_RAPIDA.md)** - Resumen ejecutivo del problema
- **[INSTRUCCIONES_QR.md](../INSTRUCCIONES_QR.md)** - Guía paso a paso completa
- **[COMANDOS_UTILES.txt](../COMANDOS_UTILES.txt)** - Comandos para copiar y pegar

### 🔌 Endpoints Disponibles

| Endpoint | Descripción |
|----------|-------------|
| `http://[IP]:3009/` | 🖥️ Interfaz web para escanear QR |
| `http://[IP]:3009/qr` | 📱 Imagen del código QR |
| `http://[IP]:3009/status` | ✅ Estado de autenticación |
| `http://[IP]:3009/conversations` | 💬 Conversaciones guardadas |

---

## 📦 Características

- ✅ **Autenticación visual con QR** - Interfaz web para escanear el código
- ✅ **Transcripción de audios** - Convierte mensajes de voz a texto con OpenAI Whisper
- ✅ **Persistencia de datos** - Guarda conversaciones en JSON
- ✅ **API REST** - Accede a conversaciones y estado del bot
- ✅ **Docker Ready** - Listo para desplegar en cualquier VM

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```bash
cp env.example .env
```

Edita `.env` y agrega tu API Key de OpenAI:

```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=3001
```

### Estructura del Proyecto

```
base-js-baileys-json/
├── src/
│   └── bot.js              # Lógica principal del bot
├── api-server.js           # Servidor API con endpoints
├── bot_sessions/           # Sesiones de WhatsApp (persistente)
├── db.json                 # Base de datos de conversaciones
├── bot.qr.png              # Código QR generado
├── Dockerfile              # Configuración de Docker
└── package.json            # Dependencias
```

## 🐳 Docker

### Iniciar
```bash
docker-compose up -d
```

### Ver Logs
```bash
docker logs -f bot_service
```

### Reiniciar
```bash
docker-compose restart bot
```

### Detener
```bash
docker-compose down
```

## 🔧 Solución de Problemas

### El QR no aparece
```bash
# Ver logs
docker logs bot_service

# Reiniciar contenedor
docker-compose restart bot
```

### Error de autenticación
```bash
# Limpiar sesiones
docker-compose down
rm -rf bot_sessions/*
docker-compose up -d
```

### Puerto no accesible
```bash
# Verificar firewall en Google Cloud
gcloud compute firewall-rules list

# Verificar que el contenedor esté corriendo
docker ps | grep bot_service
```

## 📖 Documentación Original

Visit [builderbot](https://builderbot.vercel.app/) to view the full documentation.

## 🎓 Official Course

If you want to discover all the functions and features offered by the library you can take the course.
[View Course](https://app.codigoencasa.com/courses/builderbot?refCode=LEIFER)

## 📞 Contact Us
- [💻 Discord](https://link.codigoencasa.com/DISCORD)
- [👌 𝕏 (Twitter)](https://twitter.com/leifermendez)