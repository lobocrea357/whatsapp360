# 🤖 Setup de Bots Completamente Independientes

## 📋 Resumen

Este documento explica cómo configurar 5 bots de WhatsApp que funcionan **completamente independientes** entre sí, cada uno con sus propias conversaciones y mensajes.

## 🎯 Arquitectura

```
Supabase Database
├── bots (tabla compartida)
│   ├── Bot 1 (Asesor 1) - phone_number: bot1
│   ├── Bot 2 (Asesor 2) - phone_number: bot2
│   ├── Bot 3 (Asesor 3) - phone_number: bot3
│   ├── Bot 4 (Asesor 4) - phone_number: bot4
│   └── Bot 5 (Asesor 5) - phone_number: bot5
│
├── conversations (separadas por bot_id)
│   ├── Conversaciones de Bot 1
│   ├── Conversaciones de Bot 2
│   ├── Conversaciones de Bot 3
│   ├── Conversaciones de Bot 4
│   └── Conversaciones de Bot 5
│
└── messages (separados por conversation_id)
    ├── Mensajes de conversaciones de Bot 1
    ├── Mensajes de conversaciones de Bot 2
    ├── Mensajes de conversaciones de Bot 3
    ├── Mensajes de conversaciones de Bot 4
    └── Mensajes de conversaciones de Bot 5
```

## 🗄️ Paso 1: Configurar Base de Datos en Supabase

### 1.1 Ejecutar el SQL de Reset

Ve a **Supabase Dashboard > SQL Editor** y ejecuta:

```sql
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos existentes
-- Haz backup si es necesario

-- Eliminar tablas existentes
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS bots CASCADE;

-- Crear tabla de bots
CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de conversaciones
-- ✅ Cada bot tiene sus propias conversaciones independientes
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    remote_jid VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- ✅ Constraint único POR BOT
    -- Permite que diferentes bots tengan conversaciones con el mismo número
    CONSTRAINT unique_conversation_per_bot UNIQUE (bot_id, remote_jid)
);

-- Crear tabla de mensajes
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    from_me BOOLEAN NOT NULL DEFAULT false,
    message_type VARCHAR(50) DEFAULT 'text',
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para rendimiento
CREATE INDEX idx_bots_phone_number ON bots(phone_number);
CREATE INDEX idx_conversations_bot_id ON conversations(bot_id);
CREATE INDEX idx_conversations_remote_jid ON conversations(remote_jid);
CREATE INDEX idx_conversations_bot_remote ON conversations(bot_id, remote_jid);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX idx_messages_conversation_timestamp ON messages(conversation_id, timestamp);

-- Habilitar Row Level Security
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Allow all access to authenticated users" ON bots
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users" ON conversations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users" ON messages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_bots_updated_at
    BEFORE UPDATE ON bots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## ⚙️ Paso 2: Configurar Variables de Entorno

Cada bot debe tener su archivo `.env` con configuración única:

### Bot 1 - `.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos
PORT=3001
API_PORT=3009

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

### Bot 2 - `.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos
PORT=3002
API_PORT=3010

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 2
BOT_IDENTIFIER=bot2
```

### Bot 3 - `.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos
PORT=3003
API_PORT=3011

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 3
BOT_IDENTIFIER=bot3
```

### Bot 4 - `.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos
PORT=3004
API_PORT=3012

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 4
BOT_IDENTIFIER=bot4
```

### Bot 5 - `.env`
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Puertos
PORT=3005
API_PORT=3013

# Supabase
SUPABASE_URL=https://yibmuomckbaxdvawhdul.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Identificación del Bot (ÚNICO)
BOT_NAME=Asesor 5
BOT_IDENTIFIER=bot5
```

## 🚀 Paso 3: Iniciar los Bots

### Opción A: Usando el Script PowerShell (Recomendado)

```powershell
.\start-all-bots.ps1
```

Este script iniciará los 5 bots automáticamente en procesos separados.

### Opción B: Manualmente (5 terminales)

```bash
# Terminal 1
cd bot1
npm run dev

# Terminal 2
cd bot2
npm run dev

# Terminal 3
cd bot3
npm run dev

# Terminal 4
cd bot4
npm run dev

# Terminal 5
cd bot5
npm run dev
```

## 📱 Paso 4: Escanear Códigos QR

Cada bot necesita su propio código QR de WhatsApp:

- **Bot 1:** http://localhost:3009
- **Bot 2:** http://localhost:3010
- **Bot 3:** http://localhost:3011
- **Bot 4:** http://localhost:3012
- **Bot 5:** http://localhost:3013

**Importante:** Cada bot debe estar vinculado a un número de WhatsApp diferente.

## ✅ Paso 5: Verificar que Funciona

### 5.1 Verificar Puertos
```powershell
netstat -ano | findstr "3001 3002 3003 3004 3005 3009 3010 3011 3012 3013"
```

Deberías ver 10 puertos en uso (5 para bots + 5 para APIs).

### 5.2 Verificar en Supabase

Ve a **Table Editor > bots** y verifica que existan 5 bots:
- Asesor 1 (phone_number: bot1)
- Asesor 2 (phone_number: bot2)
- Asesor 3 (phone_number: bot3)
- Asesor 4 (phone_number: bot4)
- Asesor 5 (phone_number: bot5)

### 5.3 Verificar Conversaciones

Cada bot debe tener sus propias conversaciones en la tabla `conversations`:

```sql
-- Ver conversaciones por bot
SELECT 
    b.name as bot_name,
    COUNT(c.id) as total_conversaciones
FROM bots b
LEFT JOIN conversations c ON b.id = c.bot_id
GROUP BY b.id, b.name
ORDER BY b.name;
```

## 🔧 Características Implementadas

### ✅ Prevención de Duplicados

1. **Constraint único por bot:**
   - Cada bot puede tener UNA conversación por `remote_jid`
   - Diferentes bots pueden tener conversaciones con el mismo número

2. **Verificación antes de insertar:**
   - `saveMessage()` verifica si el mensaje ya existe
   - `getOrCreateConversation()` verifica si la conversación ya existe

3. **Limpieza automática:**
   - Al iniciar, cada bot limpia sus propios duplicados
   - NO afecta las conversaciones de otros bots

### ✅ Independencia Total

- Cada bot tiene su propio `bot_id` único
- Las conversaciones están separadas por `bot_id`
- Los mensajes están asociados a conversaciones específicas
- Un bot NO puede ver ni modificar datos de otro bot

## 🛠️ Mantenimiento

### Detener Todos los Bots
```powershell
.\stop-all-bots.ps1
```

### Ver Logs de un Bot Específico
Los logs se guardan en la terminal donde se ejecutó cada bot.

### Limpiar Duplicados Manualmente

Si por alguna razón aparecen duplicados en un bot específico:

```bash
cd bot1
node cleanup-duplicates.js
```

Esto solo limpiará duplicados dentro de bot1, sin afectar a los demás.

## 📊 Dashboard

El dashboard mostrará todos los bots y permitirá:
- Ver estadísticas de cada bot por separado
- Seleccionar un bot específico
- Ver conversaciones de ese bot
- Descargar conversaciones por bot

## ⚠️ Notas Importantes

1. **Cada bot necesita su propio número de WhatsApp**
2. **No compartas el mismo QR entre bots**
3. **Los bots NO comparten conversaciones**
4. **Si un contacto escribe a Bot 1 y Bot 2, serán 2 conversaciones separadas**
5. **Esto es intencional para mantener independencia total**

## 🆘 Troubleshooting

### Problema: Aparecen conversaciones duplicadas

**Solución:**
```bash
cd bot1  # o el bot que tenga duplicados
node cleanup-duplicates.js
```

### Problema: Un bot no inicia

**Verificar:**
1. Puerto no esté en uso: `netstat -ano | findstr "3001"`
2. Variables de entorno correctas en `.env`
3. `BOT_IDENTIFIER` sea único

### Problema: Todos los bots muestran las mismas conversaciones

**Causa:** Probablemente todos tienen el mismo `BOT_IDENTIFIER`

**Solución:**
1. Verificar que cada `.env` tenga un `BOT_IDENTIFIER` diferente
2. Reiniciar los bots
3. Ejecutar el SQL de reset si es necesario

## 📈 Escalabilidad

Para agregar más bots:

1. Copia la carpeta `bot1` a `bot6`
2. Actualiza el `.env` con:
   - `PORT=3006`
   - `API_PORT=3014`
   - `BOT_IDENTIFIER=bot6`
   - `BOT_NAME=Asesor 6`
3. Inicia el bot: `cd bot6 && npm run dev`

---

**Fecha:** 28 de octubre de 2025
**Estado:** ✅ Configurado y probado
**Versión:** 2.0 - Bots Independientes
