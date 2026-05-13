# syntax=docker/dockerfile:1.7

# --- Build stage ---------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Proxy build args (declared so Docker auto-propagates them as env to RUN steps).
# Leave empty for direct internet; set via docker-compose build.args or
# `docker build --build-arg HTTPS_PROXY=http://127.0.0.1:1081 ...`.
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

# Install deps with reproducible lockfile (npm respects HTTPS_PROXY env).
COPY package.json package-lock.json* ./
RUN npm ci

# Build static assets (YAML→JSON content pipeline runs as part of `npm run build`).
COPY . .
RUN npm run build

# --- Runtime stage -------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (try_files fallback to index.html)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Tini-less; nginx handles signals fine. Default CMD inherited from base image.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
