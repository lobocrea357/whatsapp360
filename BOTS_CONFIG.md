# 🤖 Configuración de Bots en Paralelo

## Asignación de Puertos

| Bot | Nombre | Puerto Bot | Puerto API | Identificador |
|-----|--------|------------|------------|---------------|
| bot1 | Asesor 1 | 3001 | 3009 | bot1 |
| bot2 | Asesor 2 | 3002 | 3010 | bot2 |
| bot3 | Asesor 3 | 3003 | 3011 | bot3 |
| bot4 | Asesor 4 | 3004 | 3012 | bot4 |
| bot5 | Asesor 5 | 3005 | 3013 | bot5 |

## Configuración de Variables de Entorno

Cada bot debe tener su archivo `.env` configurado con:

### Bot 1 (.env)
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3001
API_PORT=3009

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

### Bot 2 (.env)
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3002
API_PORT=3010

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 2
BOT_IDENTIFIER=bot2
```

### Bot 3 (.env)
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3003
API_PORT=3011

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 3
BOT_IDENTIFIER=bot3
```

### Bot 4 (.env)
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3004
API_PORT=3012

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 4
BOT_IDENTIFIER=bot4
```

### Bot 5 (.env)
```env
# OpenAI
OPENAI_API_KEY=tu_api_key

# Puertos
PORT=3005
API_PORT=3013

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key

# Identificación del Bot
BOT_NAME=Asesor 5
BOT_IDENTIFIER=bot5
```

## Iniciar Todos los Bots

### Opción 1: Manualmente (en terminales separadas)
```bash
# Terminal 1 - Bot 1
cd bot1
npm run dev

# Terminal 2 - Bot 2
cd bot2
npm run dev

# Terminal 3 - Bot 3
cd bot3
npm run dev

# Terminal 4 - Bot 4
cd bot4
npm run dev

# Terminal 5 - Bot 5
cd bot5
npm run dev
```

### Opción 2: Con script (todos a la vez)
Usa el archivo `start-all-bots.ps1` (PowerShell) o `start-all-bots.sh` (Bash)

## Verificar que Funcionan

1. **Verificar puertos en uso**:
   ```powershell
   netstat -ano | findstr "3001 3002 3003 3004 3005 3009 3010 3011 3012 3013"
   ```

2. **Verificar en Supabase**:
   - Ve a Table Editor > bots
   - Deberías ver 5 bots: Asesor 1, Asesor 2, Asesor 3, Asesor 4, Asesor 5

3. **Verificar QR codes**:
   - Bot 1: http://localhost:3009
   - Bot 2: http://localhost:3010
   - Bot 3: http://localhost:3011
   - Bot 4: http://localhost:3012
   - Bot 5: http://localhost:3013

## Estructura en Supabase

Todos los bots comparten las mismas tablas pero se diferencian por su `phone_number` (identificador único):

```
bots
├── Asesor 1 (phone_number: bot1)
│   └── conversations
│       └── messages
├── Asesor 2 (phone_number: bot2)
│   └── conversations
│       └── messages
├── Asesor 3 (phone_number: bot3)
│   └── conversations
│       └── messages
├── Asesor 4 (phone_number: bot4)
│   └── conversations
│       └── messages
└── Asesor 5 (phone_number: bot5)
    └── conversations
        └── messages
```

## Dashboard

El dashboard mostrará todos los 5 bots y podrás:
- Ver estadísticas de todos los bots
- Seleccionar cada bot individualmente
- Ver conversaciones de cada bot
- Descargar conversaciones por bot

## Notas Importantes

1. **Cada bot necesita su propio QR de WhatsApp**
2. **Cada bot tendrá su propia sesión de WhatsApp**
3. **Los datos se guardan en la misma base de datos pero separados por bot**
4. **Puedes escalar a más bots simplemente creando bot6, bot7, etc.**
