# 🚀 Inicio Rápido - Sistema Multi-Bot WhatsApp

## 📋 Resumen

Sistema de 5 bots de WhatsApp independientes para Viajes Nova, cada uno con su propia conexión y base de datos.

## 🎯 Inicio Rápido (3 Opciones)

### Opción 1: Script Maestro (Recomendado) 🌟

Gestiona todos los bots desde un solo lugar:

```powershell
# Ver estado de todos los bots
.\gestionar-bots.ps1 -Accion estado

# Iniciar un bot específico
.\gestionar-bots.ps1 -Accion iniciar -Bot 1

# Iniciar todos los bots
.\gestionar-bots.ps1 -Accion iniciar -Bot todos

# Detener un bot específico
.\gestionar-bots.ps1 -Accion detener -Bot 1

# Detener todos los bots
.\gestionar-bots.ps1 -Accion detener -Bot todos

# Ver ayuda
.\gestionar-bots.ps1 -Accion ayuda
```

### Opción 2: Scripts Individuales

Cada bot tiene sus propios scripts:

```powershell
# Bot 1
cd bot1
.\start-bot1.ps1

# Bot 2
cd bot2
.\start-bot2.ps1

# ... y así sucesivamente
```

### Opción 3: Manual

```powershell
cd bot1
npm install  # Solo la primera vez
npm run dev
```

## 📱 URLs de Conexión

Después de iniciar cada bot, abre en tu navegador:

| Bot | Nombre | URL de Conexión |
|-----|--------|-----------------|
| Bot 1 | Asesor 1 | http://localhost:3009 |
| Bot 2 | Asesor 2 | http://localhost:3010 |
| Bot 3 | Asesor 3 | http://localhost:3011 |
| Bot 4 | Asesor 4 | http://localhost:3012 |
| Bot 5 | Asesor 5 | http://localhost:3013 |

## 🔧 Configuración de Puertos

| Bot | Puerto Bot | Puerto API |
|-----|-----------|-----------|
| Bot 1 | 3001 | 3009 |
| Bot 2 | 3002 | 3010 |
| Bot 3 | 3003 | 3011 |
| Bot 4 | 3004 | 3012 |
| Bot 5 | 3005 | 3013 |

## 📱 Conectar WhatsApp

1. Inicia el bot deseado
2. Abre la URL correspondiente en tu navegador
3. Escanea el código QR con WhatsApp:
   - Abre WhatsApp en tu teléfono
   - Ve a **Configuración** > **Dispositivos vinculados**
   - Toca **Vincular un dispositivo**
   - Escanea el código QR

## 🛑 Detener Bots

### Con el script maestro:
```powershell
.\gestionar-bots.ps1 -Accion detener -Bot todos
```

### Con scripts individuales:
```powershell
cd bot1
.\stop-bot1.ps1
```

### Manual:
Presiona `Ctrl + C` en la terminal del bot.

## 📊 Verificar Estado

### Ver estado de todos los bots:
```powershell
.\gestionar-bots.ps1 -Accion estado
```

### Ver conversaciones de un bot:
```
http://localhost:{API_PORT}/conversations
```

### Ver estado de autenticación:
```
http://localhost:{API_PORT}/status
```

## 🔍 Solución de Problemas

### El bot no inicia

1. Verifica que los puertos estén libres:
   ```powershell
   .\gestionar-bots.ps1 -Accion estado
   ```

2. Detén el bot y reinicia:
   ```powershell
   .\gestionar-bots.ps1 -Accion detener -Bot 1
   .\gestionar-bots.ps1 -Accion iniciar -Bot 1
   ```

### No aparece el código QR

- Espera 10-15 segundos
- Refresca la página en el navegador
- Verifica que el bot esté corriendo sin errores

### Error de conexión a Supabase

Verifica el archivo `.env` de cada bot:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📁 Estructura del Proyecto

```
bot/
├── gestionar-bots.ps1          # Script maestro
├── CAMBIOS-APLICADOS.md        # Documentación de cambios
├── README-INICIO-RAPIDO.md     # Esta guía
├── bot1/
│   ├── start-bot1.ps1          # Iniciar bot 1
│   ├── stop-bot1.ps1           # Detener bot 1
│   ├── INICIO-BOT1.md          # Guía completa bot 1
│   ├── .env                    # Configuración bot 1
│   └── src/
├── bot2/
│   ├── start-bot2.ps1
│   ├── stop-bot2.ps1
│   ├── INICIO-BOT2.md
│   └── ...
├── bot3/
├── bot4/
└── bot5/
```

## 🎯 Casos de Uso Comunes

### Iniciar solo el Bot 1 para pruebas:
```powershell
.\gestionar-bots.ps1 -Accion iniciar -Bot 1
```

### Iniciar todos los bots para producción:
```powershell
.\gestionar-bots.ps1 -Accion iniciar -Bot todos
```

### Ver qué bots están activos:
```powershell
.\gestionar-bots.ps1 -Accion estado
```

### Reiniciar un bot específico:
```powershell
.\gestionar-bots.ps1 -Accion detener -Bot 3
.\gestionar-bots.ps1 -Accion iniciar -Bot 3
```

## 📚 Documentación Adicional

- **CAMBIOS-APLICADOS.md** - Detalles de los cambios recientes
- **INICIO-BOT{N}.md** - Guía específica de cada bot
- **BOTS_CONFIG.md** - Configuración general del sistema
- **README_MULTI_BOTS.md** - Gestión avanzada de múltiples bots

## ✅ Checklist de Inicio

- [ ] Verificar que Node.js esté instalado (`node --version`)
- [ ] Verificar que los archivos `.env` estén configurados
- [ ] Ejecutar `npm install` en cada bot (solo la primera vez)
- [ ] Iniciar el bot deseado
- [ ] Abrir la URL en el navegador
- [ ] Escanear el código QR con WhatsApp
- [ ] Verificar que el bot esté conectado

## 🆘 Soporte

Si tienes problemas:

1. Revisa la documentación específica del bot en `INICIO-BOT{N}.md`
2. Verifica los logs en la terminal del bot
3. Consulta `CAMBIOS-APLICADOS.md` para ver los últimos cambios
4. Revisa que todas las dependencias estén instaladas

## 🎉 ¡Listo!

Ahora puedes gestionar fácilmente todos tus bots de WhatsApp. Cada bot es independiente y puede conectarse a un número de WhatsApp diferente.
