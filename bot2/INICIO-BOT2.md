# 🤖 Guía de Inicio - Bot 2

## 📋 Información del Bot

- **Nombre:** Asesor 2
- **Identificador:** bot2
- **Puerto Bot:** 3002
- **Puerto API:** 3010
- **URL de conexión:** http://localhost:3010

## 🚀 Inicio Rápido

### Opción 1: Usar el script de PowerShell (Recomendado)

```powershell
.\start-bot2.ps1
```

### Opción 2: Inicio manual

```powershell
npm install  # Solo la primera vez
npm run dev
```

## 📱 Conectar WhatsApp

Abre en tu navegador: **http://localhost:3010** y escanea el código QR.

## 🛑 Detener el Bot

```powershell
.\stop-bot2.ps1
```

## 📊 Endpoints

- **QR Code:** http://localhost:3010
- **Conversaciones:** http://localhost:3010/conversations
- **Estado:** http://localhost:3010/status
