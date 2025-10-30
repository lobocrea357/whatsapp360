# 🐧 Configuración en Debian VM

## 📋 Guía para configurar los archivos .env en tu VM Debian

Se han creado dos scripts bash para facilitar la configuración de los archivos `.env` en tu VM Debian.

---

## 📁 Scripts Disponibles

### 1. **setup-env-files.sh** (Automático)
Script rápido con credenciales predefinidas.

### 2. **setup-env-interactive.sh** (Interactivo)
Script que te permite personalizar las credenciales.

---

## 🚀 Opción 1: Script Automático

### Paso 1: Transferir el script a tu VM

Desde tu máquina Windows, copia el script a la VM:

```bash
# Usando SCP
scp setup-env-files.sh root@tu-ip-vm:/root/

# O usando WinSCP, FileZilla, etc.
```

### Paso 2: Conectarse a la VM

```bash
ssh root@tu-ip-vm
```

### Paso 3: Dar permisos de ejecución

```bash
chmod +x setup-env-files.sh
```

### Paso 4: Ejecutar el script

```bash
./setup-env-files.sh
```

El script creará automáticamente los archivos `.env` para los 10 bots con las credenciales predefinidas.

---

## 🎯 Opción 2: Script Interactivo

### Paso 1: Transferir el script

```bash
scp setup-env-interactive.sh root@tu-ip-vm:/root/
```

### Paso 2: Conectarse y ejecutar

```bash
ssh root@tu-ip-vm
chmod +x setup-env-interactive.sh
./setup-env-interactive.sh
```

### Paso 3: Seguir las instrucciones

El script te preguntará:
1. **Directorio base** (por defecto: `/root/bot`)
2. **¿Usar credenciales por defecto?** (s/n)
3. Si eliges "n", te pedirá cada credencial

---

## 📊 Estructura que se creará

```
/root/bot/
├── bot1/
│   └── .env
├── bot2/
│   └── .env
├── bot3/
│   └── .env
├── bot4/
│   └── .env
├── bot5/
│   └── .env
├── bot6/
│   └── .env
├── bot7/
│   └── .env
├── bot8/
│   └── .env
├── bot9/
│   └── .env
└── bot10/
    └── .env
```

---

## 🔐 Contenido de cada archivo .env

Cada archivo `.env` contendrá:

```env
OPENAI_API_KEY=tu_api_key
PORT=300X
API_PORT=300X
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
BOT_NAME=Asesor X
BOT_IDENTIFIER=botX
```

---

## 🔍 Verificar la configuración

### Ver el contenido de un archivo .env:

```bash
cat /root/bot/bot1/.env
```

### Ver todos los archivos creados:

```bash
ls -la /root/bot/*/. env
```

### Verificar permisos:

```bash
ls -l /root/bot/bot1/.env
# Debería mostrar: -rw------- (600)
```

---

## 📋 Configuración de Puertos

| Bot | Puerto Bot | Puerto API | URL Conexión |
|-----|-----------|-----------|--------------|
| 1 | 3001 | 3009 | http://tu-ip:3009 |
| 2 | 3002 | 3010 | http://tu-ip:3010 |
| 3 | 3003 | 3011 | http://tu-ip:3011 |
| 4 | 3004 | 3012 | http://tu-ip:3012 |
| 5 | 3005 | 3013 | http://tu-ip:3013 |
| 6 | 3006 | 3014 | http://tu-ip:3014 |
| 7 | 3007 | 3015 | http://tu-ip:3015 |
| 8 | 3008 | 3016 | http://tu-ip:3016 |
| 9 | 3009 | 3017 | http://tu-ip:3017 |
| 10 | 3010 | 3018 | http://tu-ip:3018 |

---

## 🚀 Siguientes Pasos

### 1. Copiar los archivos del bot

Necesitas copiar los archivos de código de cada bot a su directorio:

```bash
# Desde Windows, usando SCP
scp -r bot1/* root@tu-ip-vm:/root/bot/bot1/
scp -r bot2/* root@tu-ip-vm:/root/bot/bot2/
# ... y así sucesivamente
```

O usar herramientas gráficas como:
- **WinSCP**
- **FileZilla**
- **VS Code Remote SSH**

### 2. Instalar Node.js (si no está instalado)

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 3. Instalar dependencias en cada bot

```bash
cd /root/bot/bot1
npm install

cd /root/bot/bot2
npm install

# ... repetir para cada bot
```

### 4. Iniciar un bot

```bash
cd /root/bot/bot1
npm run dev
```

---

## 🔧 Script para instalar dependencias en todos los bots

Puedes crear un script adicional:

```bash
#!/bin/bash
for i in {1..10}; do
    echo "Instalando dependencias en bot$i..."
    cd /root/bot/bot$i
    npm install
done
echo "✅ Dependencias instaladas en todos los bots"
```

Guárdalo como `install-all.sh`, dale permisos y ejecútalo:

```bash
chmod +x install-all.sh
./install-all.sh
```

---

## 🐳 Alternativa: Usar Docker

Si prefieres usar Docker, puedes crear un `docker-compose.yml` que levante todos los bots. Consulta `DOCKER-DEPLOYMENT.md` para más información.

---

## 🛠️ Solución de Problemas

### Error: "Permission denied"

```bash
chmod +x setup-env-files.sh
```

### Error: "Directory not found"

Verifica que el directorio base existe:

```bash
mkdir -p /root/bot
```

### Error: "Command not found"

Asegúrate de que bash está instalado:

```bash
apt install bash
```

### Los archivos .env no se crean

Verifica permisos de escritura:

```bash
ls -ld /root/bot
# Debería mostrar: drwxr-xr-x
```

---

## 📝 Notas Importantes

1. **Seguridad**: Los archivos `.env` contienen información sensible. Asegúrate de que tengan permisos `600`.

2. **Firewall**: Abre los puertos necesarios en tu VM:
   ```bash
   ufw allow 3009:3018/tcp
   ```

3. **Backup**: Haz backup de tus archivos `.env`:
   ```bash
   tar -czf env-backup.tar.gz /root/bot/*/.env
   ```

4. **Variables de entorno**: Puedes usar variables de entorno del sistema en lugar de archivos `.env` para mayor seguridad.

---

## 🎉 ¡Listo!

Ahora tienes todos los archivos `.env` configurados en tu VM Debian. Los bots están listos para iniciarse y conectarse a WhatsApp.

Para más información sobre cómo iniciar y gestionar los bots, consulta:
- `README-INICIO-RAPIDO.md`
- `CONFIGURACION-BOTS-6-10.md`
- `CAMBIOS-APLICADOS.md`
