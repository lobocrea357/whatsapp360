# Usa una imagen base de Node.js
FROM node:18-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de manifiesto del paquete
COPY package.json ./
COPY package-lock.json ./

# --- Dependencias ---
FROM base AS deps
# Instala las dependencias
RUN npm install

# --- Builder ---
FROM base AS builder
# Copia las dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
# Copia el resto de los archivos de la aplicación
COPY . .
# Construye la aplicación
RUN npm run build

# --- Runner ---
FROM base AS runner
# Establece el directorio de trabajo
WORKDIR /app

# Copia los artefactos de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
