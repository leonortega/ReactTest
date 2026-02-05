# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

ARG INTERNAL_API_BASE_URL
ENV INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL

COPY package*.json ./
ENV HUSKY=0
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


# =========================
# Runtime stage
# =========================
FROM node:20-alpine

ARG INTERNAL_API_BASE_URL
ENV INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL

ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache wget

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
