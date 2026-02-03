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

- Set `NEXT_PUBLIC_API_BASE_URL` in the environment or `.env.local` to point the app to the backend.

Environment

- Frontend reads `NEXT_PUBLIC_API_BASE_URL` to configure the API base URL. Example `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:60480/api
```

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
