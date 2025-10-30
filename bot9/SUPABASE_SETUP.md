# 🗄️ Configuración de Supabase para WhatsApp Bot

Este documento explica cómo configurar Supabase para almacenar permanentemente las conversaciones y mensajes del bot de WhatsApp.

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Node.js instalado
- Bot de WhatsApp funcionando

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: WhatsApp Bot - Viajes Nova
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a tu ubicación
5. Espera a que el proyecto se cree (1-2 minutos)

### 2. Ejecutar el Script SQL

1. En tu proyecto de Supabase, ve al menú lateral izquierdo
2. Haz clic en **SQL Editor**
3. Haz clic en **New Query**
4. Copia todo el contenido del archivo `supabase-schema.sql`
5. Pégalo en el editor SQL
6. Haz clic en **Run** (o presiona Ctrl+Enter)
7. Verifica que aparezca el mensaje de éxito

Esto creará las siguientes tablas:
- **bots**: Almacena las instancias del bot
- **conversations**: Almacena las conversaciones (chats)
- **messages**: Almacena todos los mensajes

### 3. Obtener las Credenciales de API

1. En el menú lateral, ve a **Settings** (⚙️)
2. Haz clic en **API**
3. Copia los siguientes valores:

   - **Project URL**: 
     ```
     https://tuproyecto.supabase.co
     ```
   
   - **anon public key** (en la sección "Project API keys"):
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

### 4. Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega las siguientes líneas (si no existen):

```env
# Configuración de Supabase
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Reemplaza los valores con tus credenciales reales
4. Guarda el archivo

### 5. Verificar la Instalación

El paquete `@supabase/supabase-js` ya está instalado. Si necesitas reinstalarlo:

```bash
npm install @supabase/supabase-js
```

### 6. Reiniciar los Servicios

```bash
# Detener los servicios actuales (Ctrl+C)

# Iniciar nuevamente
npm run dev
```

## 🔍 Verificar que Funciona

### Opción 1: Verificar en Supabase Dashboard

1. Ve a tu proyecto en Supabase
2. Haz clic en **Table Editor** en el menú lateral
3. Selecciona la tabla **bots**
   - Deberías ver un bot creado automáticamente
4. Envía un mensaje de prueba al bot de WhatsApp
5. Refresca la tabla **conversations**
   - Deberías ver la conversación creada
6. Refresca la tabla **messages**
   - Deberías ver los mensajes guardados

### Opción 2: Verificar en la Consola

Cuando inicies el API server, deberías ver:

```
✅ Servidor de API escuchando en http://localhost:3009
📱 Para escanear el QR, abre: http://localhost:3009
🔄 Iniciando sincronización con Supabase...
🚀 Iniciando servicio de sincronización de mensajes...
✅ Bot inicializado en Supabase: WhatsApp Bot - Viajes Nova (ID: ...)
👀 Observando cambios en db.json...
```

## 📊 Estructura de Datos

### Jerarquía

```
Bot (WhatsApp Bot - Viajes Nova)
└── Conversaciones
    ├── Conversación con Juan (5491112345678@s.whatsapp.net)
    │   ├── Mensaje 1: "Hola"
    │   ├── Mensaje 2: "¿Cómo estás?"
    │   └── Mensaje 3: "Bien, gracias"
    │
    └── Conversación con María (5491187654321@s.whatsapp.net)
        ├── Mensaje 1: "Buenos días"
        └── Mensaje 2: "¿Tienes disponibilidad?"
```

### Tablas

#### `bots`
- `id`: UUID único del bot
- `name`: Nombre del bot
- `phone_number`: Número de teléfono (opcional)
- `status`: Estado (active/inactive)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

#### `conversations`
- `id`: UUID único de la conversación
- `bot_id`: Referencia al bot
- `remote_jid`: ID de WhatsApp del contacto
- `contact_name`: Nombre del contacto
- `last_message_at`: Timestamp del último mensaje
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

#### `messages`
- `id`: UUID único del mensaje
- `conversation_id`: Referencia a la conversación
- `body`: Contenido del mensaje
- `from_me`: Boolean (true = mensaje del bot, false = mensaje del usuario)
- `message_type`: Tipo de mensaje (text, audio, image, etc.)
- `timestamp`: Timestamp del mensaje
- `created_at`: Fecha de creación

## 🔄 Cómo Funciona la Sincronización

1. El bot de WhatsApp guarda mensajes en `db.json` (comportamiento actual)
2. El servicio `message-sync.js` observa cambios en `db.json`
3. Cuando detecta cambios, sincroniza automáticamente a Supabase
4. El API server lee datos desde Supabase
5. Si Supabase falla, hace fallback a `db.json`

## 🛡️ Seguridad (Opcional)

Para habilitar Row Level Security (RLS):

1. Ve a **Authentication** > **Policies** en Supabase
2. Habilita RLS para cada tabla
3. Crea políticas según tus necesidades

Por ahora, las políticas están comentadas en el schema para facilitar el desarrollo.

## 🐛 Solución de Problemas

### Error: "SUPABASE_URL no está configurada"

- Verifica que el archivo `.env` existe
- Verifica que las variables están correctamente escritas
- Reinicia el servidor después de modificar `.env`

### No se guardan mensajes en Supabase

- Verifica que el script SQL se ejecutó correctamente
- Revisa la consola para ver errores
- Verifica las credenciales en `.env`
- Verifica que el servicio de sincronización está corriendo

### Error de conexión a Supabase

- Verifica tu conexión a internet
- Verifica que la URL de Supabase es correcta
- Verifica que la API key es correcta (anon public key)

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en la consola
2. Verifica la tabla **messages** en Supabase
3. Verifica que `db.json` se está creando correctamente

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Script SQL ejecutado correctamente
- [ ] Variables de entorno configuradas en `.env`
- [ ] Paquete `@supabase/supabase-js` instalado
- [ ] Servicios reiniciados
- [ ] Bot creado en tabla `bots`
- [ ] Mensajes de prueba guardados correctamente
