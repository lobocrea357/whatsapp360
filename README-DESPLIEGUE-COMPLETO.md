# 🚀 Guía Completa de Despliegue - Sistema Multi-Bot WhatsApp

## 📋 Índice

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Preparación Inicial](#preparación-inicial)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Despliegue con Docker](#despliegue-con-docker)
5. [Verificación y Pruebas](#verificación-y-pruebas)
6. [Mantenimiento](#mantenimiento)

---

## 🎯 Resumen del Sistema

Sistema de 5 bots de WhatsApp completamente independientes que:

✅ **Funcionan simultáneamente** sin interferir entre sí
✅ **Sin duplicados** - cada bot tiene sus propias conversaciones
✅ **Persistencia** - las sesiones de WhatsApp se mantienen
✅ **Escalable** - fácil agregar más bots
✅ **Dashboard** - interfaz web para gestionar todos los bots

### Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Containers                     │
├─────────────────────────────────────────────────────────┤
│  Bot 1 → Conversaciones Bot 1 → Mensajes Bot 1         │
│  Bot 2 → Conversaciones Bot 2 → Mensajes Bot 2         │
│  Bot 3 → Conversaciones Bot 3 → Mensajes Bot 3         │
│  Bot 4 → Conversaciones Bot 4 → Mensajes Bot 4         │
│  Bot 5 → Conversaciones Bot 5 → Mensajes Bot 5         │
│  Dashboard → Vista de todos los bots                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Supabase    │
                    │   PostgreSQL  │
                    └───────────────┘
```

---

## 🛠️ Preparación Inicial

### Requisitos

- ✅ Docker y Docker Compose instalados
- ✅ Cuenta de Supabase
- ✅ API Key de OpenAI
- ✅ 5 números de WhatsApp diferentes (uno por bot)

### Archivos de Configuración

Cada bot necesita su archivo `.env`:

```
bot/
├── bot1/.env  ← BOT_IDENTIFIER=bot1
├── bot2/.env  ← BOT_IDENTIFIER=bot2
├── bot3/.env  ← BOT_IDENTIFIER=bot3
├── bot4/.env  ← BOT_IDENTIFIER=bot4
├── bot5/.env  ← BOT_IDENTIFIER=bot5
└── dashboard/.env.local
```

---

## 🗄️ Configuración de Base de Datos

### Paso 1: Ejecutar SQL en Supabase

1. Abre **Supabase Dashboard**
2. Ve a **SQL Editor**
3. Copia y ejecuta el siguiente SQL:

```sql
-- ⚠️ ADVERTENCIA: Esto eliminará todos los datos existentes

-- Eliminar tablas
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
-- ✅ UNIQUE (bot_id, remote_jid) permite que cada bot tenga sus propias conversaciones
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    remote_jid VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Crear índices
CREATE INDEX idx_bots_phone_number ON bots(phone_number);
CREATE INDEX idx_conversations_bot_id ON conversations(bot_id);
CREATE INDEX idx_conversations_remote_jid ON conversations(remote_jid);
CREATE INDEX idx_conversations_bot_remote ON conversations(bot_id, remote_jid);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);

-- Habilitar RLS
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Allow all access to authenticated users" ON bots
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users" ON conversations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to authenticated users" ON messages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_bots_updated_at
    BEFORE UPDATE ON bots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Paso 2: Verificar Tablas Creadas

En Supabase, ve a **Table Editor** y verifica que existan:
- ✅ `bots`
- ✅ `conversations`
- ✅ `messages`

---

## 🐳 Despliegue con Docker

### Paso 1: Configurar Variables de Entorno

Crea o actualiza los archivos `.env` para cada bot:

#### `bot1/.env`
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
PORT=3001
API_PORT=3009
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
BOT_NAME=Asesor 1
BOT_IDENTIFIER=bot1
```

#### `bot2/.env`
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
PORT=3002
API_PORT=3010
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
BOT_NAME=Asesor 2
BOT_IDENTIFIER=bot2
```

**Repite para bot3, bot4, bot5** cambiando:
- `PORT` (3003, 3004, 3005)
- `API_PORT` (3011, 3012, 3013)
- `BOT_NAME` (Asesor 3, 4, 5)
- `BOT_IDENTIFIER` (bot3, bot4, bot5)

#### `dashboard/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 2: Construir e Iniciar

#### Opción A: Script Automático (Linux/Mac)
```bash
chmod +x docker-start.sh
./docker-start.sh
```

#### Opción B: Comandos Manuales
```bash
# Construir imágenes
docker-compose build

# Iniciar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f
```

#### Opción C: Solo Bots (sin Dashboard)
```bash
docker-compose -f docker-compose.bots-only.yml up -d
```

### Paso 3: Verificar Estado

```bash
# Ver contenedores corriendo
docker-compose ps

# Debería mostrar:
# bot1_asesor1    running    0.0.0.0:3001->3001/tcp, 0.0.0.0:3009->3009/tcp
# bot2_asesor2    running    0.0.0.0:3002->3002/tcp, 0.0.0.0:3010->3010/tcp
# bot3_asesor3    running    0.0.0.0:3003->3003/tcp, 0.0.0.0:3011->3011/tcp
# bot4_asesor4    running    0.0.0.0:3004->3004/tcp, 0.0.0.0:3012->3012/tcp
# bot5_asesor5    running    0.0.0.0:3005->3005/tcp, 0.0.0.0:3013->3013/tcp
# dashboard       running    0.0.0.0:3100->3000/tcp
```

---

## ✅ Verificación y Pruebas

### 1. Escanear Códigos QR

Abre cada URL en tu navegador y escanea el QR con WhatsApp:

- **Bot 1:** http://localhost:3009
- **Bot 2:** http://localhost:3010
- **Bot 3:** http://localhost:3011
- **Bot 4:** http://localhost:3012
- **Bot 5:** http://localhost:3013

**Importante:** Cada bot debe usar un número de WhatsApp diferente.

### 2. Verificar en Supabase

Ve a **Supabase > Table Editor > bots**

Deberías ver 5 registros:

| name | phone_number | status |
|------|--------------|--------|
| Asesor 1 | bot1 | active |
| Asesor 2 | bot2 | active |
| Asesor 3 | bot3 | active |
| Asesor 4 | bot4 | active |
| Asesor 5 | bot5 | active |

### 3. Verificar Dashboard

Abre http://localhost:3100

Deberías ver:
- ✅ Lista de 5 bots
- ✅ Contador de conversaciones por bot
- ✅ Poder hacer clic en cada bot para ver sus conversaciones

### 4. Probar Envío de Mensajes

1. Envía un mensaje de WhatsApp a Bot 1
2. Ve al Dashboard → Bot 1
3. Deberías ver la conversación
4. Repite para los demás bots

### 5. Verificar Independencia

1. Envía un mensaje al mismo número desde Bot 1 y Bot 2
2. En Supabase, verifica que hay **2 conversaciones separadas**:
   - Una con `bot_id` de Bot 1
   - Otra con `bot_id` de Bot 2

---

## 🔧 Mantenimiento

### Ver Logs

```bash
# Todos los bots
docker-compose logs -f

# Un bot específico
docker-compose logs -f bot1

# Últimas 100 líneas
docker-compose logs --tail=100 bot1
```

### Reiniciar un Bot

```bash
# Reiniciar bot1
docker-compose restart bot1

# Reiniciar todos
docker-compose restart
```

### Detener el Sistema

```bash
# Detener sin eliminar datos
docker-compose stop

# Detener y eliminar contenedores (mantiene volúmenes)
docker-compose down

# Detener y eliminar TODO (incluyendo sesiones de WhatsApp)
docker-compose down -v
```

### Actualizar Código

```bash
# 1. Detener
docker-compose down

# 2. Reconstruir
docker-compose build

# 3. Iniciar
docker-compose up -d
```

### Limpiar Duplicados

Si aparecen duplicados en un bot:

```bash
# Ejecutar script de limpieza
docker-compose exec bot1 node cleanup-duplicates.js

# Ver resultado
docker-compose logs bot1
```

### Backup de Sesiones

```bash
# Backup de volúmenes
docker run --rm -v bot_bot1_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/bot1_backup.tar.gz /data

# Restaurar
docker run --rm -v bot_bot1_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/bot1_backup.tar.gz -C /
```

---

## 📊 Monitoreo

### Estado de Salud

```bash
# Ver healthcheck
docker-compose ps

# Inspeccionar contenedor
docker inspect bot1_asesor1 | grep -A 10 Health
```

### Uso de Recursos

```bash
# Ver uso de CPU/RAM
docker stats

# Ver espacio en disco
docker system df
```

### Logs de Errores

```bash
# Buscar errores en logs
docker-compose logs | grep -i error

# Logs de un bot específico con errores
docker-compose logs bot1 | grep -i error
```

---

## 🆘 Troubleshooting

### Problema: Puerto ya en uso

```bash
# Ver qué usa el puerto
netstat -ano | findstr "3009"

# Cambiar puerto en docker-compose.yml
ports:
  - "3019:3009"  # Puerto externo diferente
```

### Problema: Bot no se conecta a Supabase

```bash
# Verificar variables
docker-compose exec bot1 env | grep SUPABASE

# Probar conectividad
docker-compose exec bot1 ping supabase.co
```

### Problema: Sesión de WhatsApp perdida

```bash
# Verificar volumen
docker volume ls | grep bot1

# Si se perdió, escanear QR nuevamente
# http://localhost:3009
```

### Problema: Conversaciones duplicadas

```bash
# Limpiar duplicados
docker-compose exec bot1 node cleanup-duplicates.js

# Verificar
docker-compose exec bot1 node check-duplicates.js
```

---

## 📚 Documentación Adicional

- 📄 **SETUP-BOTS-INDEPENDIENTES.md** - Configuración detallada
- 📄 **DOCKER-DEPLOYMENT.md** - Guía completa de Docker
- 📄 **RESUMEN-SOLUCION.md** - Resumen de la solución
- 📄 **BOTS_CONFIG.md** - Configuración de puertos y variables
- 📄 **DOCKER_SETUP.md** - Setup original de Docker

---

## ✅ Checklist Final

- [ ] SQL ejecutado en Supabase
- [ ] Tablas `bots`, `conversations`, `messages` creadas
- [ ] Archivos `.env` configurados para cada bot
- [ ] `BOT_IDENTIFIER` único en cada bot (bot1-bot5)
- [ ] Docker Compose instalado
- [ ] Imágenes construidas: `docker-compose build`
- [ ] Contenedores corriendo: `docker-compose ps`
- [ ] QR codes escaneados para cada bot
- [ ] 5 bots visibles en Supabase
- [ ] Dashboard accesible en http://localhost:3100
- [ ] Mensajes de prueba enviados y recibidos
- [ ] Verificada independencia entre bots

---

## 🎉 ¡Listo!

Tu sistema de 5 bots independientes está corriendo con Docker:

✅ **Cada bot funciona independientemente**
✅ **Sin duplicados en la base de datos**
✅ **Sesiones persistentes en volúmenes Docker**
✅ **Dashboard para gestionar todos los bots**
✅ **Escalable a más bots si es necesario**

---

**Fecha:** 28 de octubre de 2025
**Versión:** 2.0 - Docker Multi-Bot System
**Estado:** ✅ Producción Ready
