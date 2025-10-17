# Etapa 1: Build
# Usar una imagen completa de Debian para asegurar compatibilidad con la compilación nativa
FROM node:21-bookworm AS builder
WORKDIR /app

# Copiar archivos de manifiesto e instalar TODAS las dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Etapa 2: Producción
# Usar una imagen "slim" para reducir el tamaño final
FROM node:21-bookworm-slim AS production
# Instalar la dependencia de sistema necesaria para "sharp"
RUN apt-get update && apt-get install -y libvips && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
# Copiar el código fuente de la aplicación
COPY --from=builder /app ./

# Exponer los puertos necesarios
EXPOSE 3009
EXPOSE 3008

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
