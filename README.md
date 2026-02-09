Overview

This repository contains two projects (backend and frontend-next) used for a small stocks demo and tooling to run them locally or in Docker.

Projects

- `backend/StocksApi` - .NET 10 Web API that implements a vertical-slice style with MediatR. It exposes a stocks endpoint:
  - `GET /api/stocks/{companyId}?date={YYYY-MM-DD}` — returns an array of stock points for the requested company and date.

- `frontend-next` - Next.js application that visualizes stock data. The app reads `NEXT_PUBLIC_API_BASE_URL` to determine the backend base URL at runtime/build time.

Why frontend-next replace frontend?

The previous `frontend` project was replaced to standardize on Next.js for a single, modern frontend stack. `frontend-next` offers built-in routing, server-side rendering and static generation options, and a streamlined production build output for container deployments.

Local development

Backend

- Open `backend/StocksApi` in Visual Studio / VS Code or run from the terminal:

```bash
cd backend/StocksApi
dotnet run
```

- By default `dotnet run` may start with HTTPS in development. For quick local testing you can configure the launch settings in the project or use HTTP URLs.

Frontend-Next (Next.js)

- Run the frontend dev server:

```bash
cd frontend-next
npm install
npm run dev
```

- The client uses the Next API proxy (`/api/stocks/...`) so you do not normally need to set a public API base URL for the browser bundle. The server-side proxy uses the `INTERNAL_API_BASE_URL` environment variable to reach the backend API (for example when running in Docker or Azure).

Environment

- For local development you can keep an `.env` or `.env.local` containing the internal backend host used by the server route. Example `.env`:

```
INTERNAL_API_BASE_URL=http://stocksapi/api
```
Note: the browser-side code calls `/api/stocks/...` (Next proxy) — do not rely on exposing internal hostnames in client env values.

Tests

Backend

- Unit tests:

```bash
dotnet test backend/StocksApi.Tests
```

- Integration tests:

```bash
dotnet test backend/StocksApi.IntegrationTests
```

Frontend-Next (Next.js)

- Unit tests:

```bash
cd frontend-next
npm install
npm test
```

- Integration (end-to-end) tests:

```bash
cd frontend-next
npm install
npm run test:e2e
```

Docker deployment

This repository already includes Dockerfiles and a `docker-compose.yml` to build and run the backend and frontend-next together.

To build and start both services with the provided compose file:

```bash
# using Docker Compose V2
docker compose up --build

# or with the legacy docker-compose
docker-compose up --build
```

The compose file builds the frontend-next container and exposes the configured ports. Check `docker-compose.yml` for the exact ports and service names used in this workspace.

If you prefer to build and run images manually you can still use the individual `Dockerfile`s in `backend/StocksApi` and `frontend-next` — the compose setup is provided for convenience and reproducibility.
