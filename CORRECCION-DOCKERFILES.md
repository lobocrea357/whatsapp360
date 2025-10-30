# 🔧 Corrección de Dockerfiles - Bots 6-10

## ✅ Problemas Encontrados y Corregidos

### **Bot 6**
- ❌ Puertos incorrectos (3005/3013 en lugar de 3006/3014)
- ✅ **Corregido**: Ahora expone 3006 y 3014

### **Bot 7**
- ❌ **No tenía Dockerfile**
- ❌ **Faltaban archivos críticos**: api-server.js, db.json, nodemon.json, .dockerignore, .gitignore, .npmrc, .eslintrc.json
- ✅ **Creado Dockerfile** con puertos 3007 y 3015
- ✅ **Creados todos los archivos faltantes**

### **Bot 8**
- ❌ Puertos incorrectos (3005/3013 en lugar de 3008/3016)
- ✅ **Corregido**: Ahora expone 3008 y 3016

### **Bot 9**
- ❌ Puertos incorrectos (3005/3013 en lugar de 3009/3017)
- ✅ **Corregido**: Ahora expone 3009 y 3017

### **Bot 10**
- ❌ Puertos incorrectos (3005/3013 en lugar de 3010/3018)
- ✅ **Corregido**: Ahora expone 3010 y 3018

---

## 📁 Archivos Creados para Bot 7

### 1. **Dockerfile**
```dockerfile
# Exponer los puertos necesarios para Bot 7
EXPOSE 3007
EXPOSE 3015

ENV PORT=3007
ENV API_PORT=3015
```

### 2. **api-server.js**
- Servidor API completo
- Puerto 3015
- Identificador bot7
- Endpoints: /conversations, /qr, /status, /
- Integración con Supabase

### 3. **db.json**
```json
[]
```

### 4. **nodemon.json**
```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.spec.js"],
  "exec": "node src/bot.js"
}
```

### 5. **.dockerignore**
```
node_modules
npm-debug.log
.git
.gitignore
```

### 6. **.gitignore**
```
node_modules
.env
bot_sessions
*.qr.png
db.json
*.log
```

### 7. **.npmrc**
```
legacy-peer-deps=true
save-exact=false
package-lock=true
audit=false
fund=false
```

### 8. **.eslintrc.json**
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:builderbot/recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {}
}
```

---

## 📊 Configuración Final de Dockerfiles

| Bot | Dockerfile | Puerto Bot | Puerto API | Estado |
|-----|-----------|-----------|-----------|--------|
| Bot 6 | ✅ | 3006 | 3014 | ✅ Corregido |
| Bot 7 | ✅ | 3007 | 3015 | ✅ Creado |
| Bot 8 | ✅ | 3008 | 3016 | ✅ Corregido |
| Bot 9 | ✅ | 3009 | 3017 | ✅ Corregido |
| Bot 10 | ✅ | 3010 | 3018 | ✅ Corregido |

---

## 🚀 Verificar la Configuración

### Construir las imágenes Docker:

```bash
# Construir todos los bots
docker-compose build

# O construir uno específico
docker-compose build bot7
```

### Iniciar los bots:

```bash
# Iniciar todos
docker-compose up -d

# O iniciar bots específicos
docker-compose up -d bot6 bot7 bot8 bot9 bot10
```

### Verificar que están corriendo:

```bash
docker-compose ps
```

### Ver logs:

```bash
# Ver logs de bot7
docker-compose logs -f bot7

# Ver logs de todos
docker-compose logs -f
```

---

## 🔍 Verificar Puertos

```bash
# Verificar que los puertos están expuestos correctamente
docker port bot6_asesor6
docker port bot7_asesor7
docker port bot8_asesor8
docker port bot9_asesor9
docker port bot10_asesor10
```

Salida esperada:
```
# Bot 6
3006/tcp -> 0.0.0.0:3006
3014/tcp -> 0.0.0.0:3014

# Bot 7
3007/tcp -> 0.0.0.0:3007
3015/tcp -> 0.0.0.0:3015

# ... y así sucesivamente
```

---

## 📱 URLs de Conexión

Después de iniciar los contenedores, puedes acceder a:

- **Bot 6**: http://localhost:3014
- **Bot 7**: http://localhost:3015
- **Bot 8**: http://localhost:3016
- **Bot 9**: http://localhost:3017
- **Bot 10**: http://localhost:3018

---

## ✅ Checklist de Verificación

- [x] Bot 6: Dockerfile con puertos correctos (3006/3014)
- [x] Bot 7: Dockerfile creado con puertos correctos (3007/3015)
- [x] Bot 7: api-server.js creado
- [x] Bot 7: db.json creado
- [x] Bot 7: nodemon.json creado
- [x] Bot 7: .dockerignore creado
- [x] Bot 7: .gitignore creado
- [x] Bot 7: .npmrc creado
- [x] Bot 7: .eslintrc.json creado
- [x] Bot 8: Dockerfile con puertos correctos (3008/3016)
- [x] Bot 9: Dockerfile con puertos correctos (3009/3017)
- [x] Bot 10: Dockerfile con puertos correctos (3010/3018)
- [x] docker-compose.yml actualizado con bots 6-10
- [x] docker-compose.bots-only.yml actualizado con bots 6-10

---

## 🎉 Resumen

✅ **Todos los Dockerfiles corregidos**
✅ **Bot 7 completamente configurado**
✅ **Puertos correctos para cada bot**
✅ **Archivos de configuración creados**
✅ **Listo para desplegar en Docker**

¡Todo está listo para usar Docker con los 10 bots!
