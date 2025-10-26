# Etapa 1: Build
# Usar una imagen completa de Debian para asegurar compatibilidad con la compilación nativa
FROM node:21-bookworm AS builder
WORKDIR /app

# Copiar archivos de manifiesto e instalar TODAS las dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Etapa 2: Producción
# Usar una imagen "slim" para reducir el tamaño final
FROM node:21-bookworm-slim AS production
# Instalar dependencias de sistema necesarias
RUN apt-get update && apt-get install -y \
    libvips \
    curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
# Copiar el código fuente de la aplicación
COPY --from=builder /app ./

# Exponer los puertos necesarios para Bot 5
EXPOSE 3005
EXPOSE 3013

# Variables de entorno por defecto
ENV PORT=3005
ENV API_PORT=3013
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
