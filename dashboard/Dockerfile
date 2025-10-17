# Etapa 1: Instalación de dependencias
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Etapa 2: Construcción de la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: Imagen final de producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crear un usuario y grupo no-root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar los artefactos de la compilación standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

EXPOSE 3000
ENV PORT 3000

# El comando para iniciar el servidor de producción de Next.js
CMD ["node", "server.js"]
