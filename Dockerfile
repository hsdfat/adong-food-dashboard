###############################################
# deps: install dependencies with pnpm (cached)
###############################################
FROM node:22-alpine AS deps
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Install only deps first for better layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile --prod=false

###############################################
# builder: build the Next.js app
###############################################
FROM node:22-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV ESLINT_NO_DEV_ERRORS=true
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build (linting is disabled via next.config.js)
RUN pnpm build

###############################################
# production-deps: install only production dependencies
###############################################
FROM node:22-alpine AS production-deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile --prod

###############################################
# runner: production image
###############################################
FROM node:22-alpine AS runner

ENV TZ=Asia/Ho_Chi_Minh
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install wget for healthcheck and dumb-init for proper signal handling
RUN apk add --no-cache wget dumb-init

# Create non-root user
RUN addgroup -g 1001 nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy only production dependencies (smaller size)
COPY --from=production-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy necessary files for running `next start`
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "server.js"]