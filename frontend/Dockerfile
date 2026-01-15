# Build stage: use Node to build the production assets
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Production stage: use a small Node-based static server to serve the built assets
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=build /app/dist ./dist

# Install a lightweight static server and run on port 80
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]