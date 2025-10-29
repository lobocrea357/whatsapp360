# Solución al Problema de Conversaciones y Mensajes Duplicados

## 🔍 Problema Identificado

Se detectaron **dos causas principales** de duplicación:

### 1. **Múltiples Bots Sincronizando las Mismas Conversaciones**
- Hay **5 instancias de bot** (bot1, bot2, bot3, bot4, bot5) corriendo simultáneamente
- Cada bot crea su propio registro en la tabla `bots`
- Cuando llega un mensaje, TODOS los bots lo procesan y crean conversaciones separadas
- Resultado: El mismo contacto aparece 5 veces en la base de datos

### 2. **Sin Verificación de Duplicados al Guardar**
- La función `saveMessage()` no verificaba si un mensaje ya existía
- Cada sincronización insertaba TODOS los mensajes nuevamente
- Resultado: Miles de mensajes duplicados

## ✅ Soluciones Implementadas

### 1. **Verificación de Duplicados en `saveMessage()`**
**Archivo:** `bot1/src/supabase.js`

- Ahora verifica si un mensaje ya existe antes de insertarlo
- Usa: `conversation_id + timestamp + body + from_me` como clave única
- Si el mensaje existe, lo retorna sin insertar
- Maneja errores de duplicado (código 23505)

### 2. **Mejora en `getOrCreateConversation()`**
**Archivo:** `bot1/src/supabase.js`

- Usa `.maybeSingle()` en lugar de `.limit(1)` para mejor manejo
- Actualiza el nombre del contacto si cambió
- Maneja errores de duplicado y reintenta obtener la conversación existente

### 3. **Limpieza Automática al Iniciar**
**Archivo:** `bot1/src/message-sync.js`

- Al iniciar el servicio, ejecuta limpieza de duplicados
- Elimina conversaciones duplicadas
- Elimina mensajes duplicados
- Actualiza `last_message_at` correctamente

### 4. **Scripts de Limpieza Manual**

#### `cleanup-duplicates.js`
Limpia duplicados dentro del mismo bot:
```bash
node cleanup-duplicates.js
```

#### `cleanup-all-duplicates.js` ⭐ **RECOMENDADO**
Limpia duplicados entre TODOS los bots:
```bash
node cleanup-all-duplicates.js
```

#### `check-duplicates.js`
Verifica si hay duplicados sin eliminar nada:
```bash
node check-duplicates.js
```

## 📊 Resultados de la Limpieza

### Primera Ejecución (cleanup-duplicates.js)
- ✅ Mensajes duplicados eliminados: **990**
- ✅ Conversaciones únicas: **7**

### Segunda Ejecución (cleanup-all-duplicates.js)
- ✅ Conversaciones duplicadas eliminadas: **7**
- ✅ Mensajes migrados: **5,843**
- ✅ Mensajes duplicados adicionales: **339**
- ✅ Conversaciones únicas finales: **86**

### Verificación Final
- ✅ **0 conversaciones duplicadas**
- ✅ Base de datos limpia

## ⚠️ Problema Pendiente: Múltiples Bots

Actualmente hay **5 bots** corriendo simultáneamente:
- Bot 8808a011... (7 conversaciones)
- Bot 40487723... (24 conversaciones)
- Bot 2d80c7b3... (29 conversaciones)
- Bot 74077739... (10 conversaciones)
- Bot 7867b702... (16 conversaciones)

### Recomendaciones:

#### Opción 1: Usar Solo UN Bot (RECOMENDADO)
1. Detener bot2, bot3, bot4, bot5
2. Mantener solo bot1 corriendo
3. Esto evitará duplicados futuros

#### Opción 2: Configurar Bots con Identificadores Únicos
Si necesitas múltiples bots, cada uno debe tener:
- `BOT_IDENTIFIER` único en el `.env`
- Número de WhatsApp diferente
- Propósito específico (ej: ventas, soporte, etc.)

#### Opción 3: Agregar Constraint Único en la Base de Datos
Ejecutar en Supabase:
```sql
-- Evitar conversaciones duplicadas por remote_jid
ALTER TABLE conversations 
ADD CONSTRAINT unique_remote_jid_per_bot 
UNIQUE (bot_id, remote_jid);

-- Evitar mensajes duplicados
ALTER TABLE messages 
ADD CONSTRAINT unique_message 
UNIQUE (conversation_id, timestamp, body, from_me);
```

## 🚀 Cómo Prevenir Duplicados en el Futuro

### 1. Ejecutar Solo UN Bot
```bash
# Detener todos los bots
# Luego iniciar solo uno:
cd bot1
npm start
```

### 2. Monitorear Duplicados Regularmente
```bash
node check-duplicates.js
```

### 3. Limpieza Automática
El sistema ahora limpia automáticamente al iniciar, pero puedes ejecutar manualmente:
```bash
node cleanup-all-duplicates.js
```

## 📝 Archivos Modificados

1. ✅ `bot1/src/supabase.js` - Agregadas verificaciones de duplicados
2. ✅ `bot1/src/message-sync.js` - Limpieza automática al iniciar
3. ✅ `bot1/cleanup-duplicates.js` - Script de limpieza por bot
4. ✅ `bot1/cleanup-all-duplicates.js` - Script de limpieza global
5. ✅ `bot1/check-duplicates.js` - Script de verificación

## 🔧 Próximos Pasos Recomendados

1. **Decidir estrategia de bots**: ¿Uno solo o múltiples con propósitos específicos?
2. **Agregar constraints únicos** en la base de datos (SQL arriba)
3. **Monitorear** los logs para detectar intentos de duplicación
4. **Documentar** qué bot debe manejar qué tipo de conversaciones

## 📞 Soporte

Si los duplicados vuelven a aparecer:
1. Ejecutar `node check-duplicates.js` para diagnosticar
2. Ejecutar `node cleanup-all-duplicates.js` para limpiar
3. Verificar que solo un bot esté corriendo
4. Revisar los logs del bot para errores

---

**Fecha de implementación:** 28 de octubre de 2025
**Estado:** ✅ Completado y verificado
