# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN --mount=type=bind,target=/app,rw \
    --mount=type=cache,target=/root/.npm \
    npm run build && cp -r /app /tmp/

# ============================================
# Stage 2: Runtime Stage
# ============================================
FROM node:22-alpine

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create app user for security (non-root)
RUN addgroup -g 1001 nodejs && \
    adduser -S nextjs -u 1001

    
# Set working directory

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /tmp/app /
WORKDIR /app


# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s \
    --timeout=10s \
    --start-period=5s \
    --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run the application
CMD ["npm", "run", "start"]