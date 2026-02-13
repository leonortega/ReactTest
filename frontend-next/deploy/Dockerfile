# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
ENV HUSKY=0
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


# =========================
# Runtime stage
# =========================
FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=80
ARG INTERNAL_API_BASE_URL
ENV INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL
WORKDIR /app

RUN apk add --no-cache wget

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-80}/" >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
