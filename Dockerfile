# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install system dependencies including FFmpeg
RUN apk add --no-cache \
    ffmpeg \
    libc6-compat \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV YTDL_NO_UPDATE=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy any additional files needed for production
COPY --from=builder /app/watermarks ./watermarks
COPY --from=builder /app/uploads ./uploads

# Create uploads directory with proper permissions
RUN mkdir -p uploads/clips uploads/cache uploads/temp_frames && \
    chown -R nextjs:nodejs uploads

USER nextjs

EXPOSE 5000

ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"] 