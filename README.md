Overview

This repository contains two projects (backend and frontend) used for a small stocks demo and tooling to run them locally or in Docker.

Projects

- `backend/StocksApi` - .NET 10 Web API that implements a vertical-slice style with MediatR. It exposes a stocks endpoint:
  - `GET /api/stocks/{companyId}?date={YYYY-MM-DD}` — returns an array of stock points for the requested company and date.

- `frontend` - React (Vite) application that visualizes stock data. The frontend reads an environment variable `VITE_API_BASE_URL` to determine the backend base URL at runtime/build time.

Local development

Backend

- Open `backend/StocksApi` in Visual Studio / VS Code or run from the terminal:

```bash
cd backend/StocksApi
dotnet run
```

- By default `dotnet run` may start with HTTPS in development. For quick local testing you can configure the launch settings in the project or use HTTP URLs.

Frontend

- Run the frontend dev server:

```bash
cd frontend
npm install
npm run dev
```

- Dev proxy: the frontend Vite config supports a proxy to the API when `VITE_API_BASE_URL` is set in the environment or `.env` file. The project currently uses `VITE_API_BASE_URL` in `frontend/.env` to point the dev server to the backend.

Environment

- Frontend reads `VITE_API_BASE_URL` to configure the API base URL. Example `.env`:

```
VITE_API_BASE_URL=http://localhost:60480/api
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

Frontend

- Unit tests:

```bash
cd frontend
npm install
npm test
```

- Integration (end-to-end) tests:

```bash
cd frontend
npm install
npm run test:e2e
```

Docker deployment

This repository already includes Dockerfiles and a `docker-compose.yml` to build and run the backend and frontend together.

To build and start both services with the provided compose file:

```bash
# using Docker Compose V2
docker compose up --build

# or with the legacy docker-compose
docker-compose up --build
```

The compose file builds the frontend with `VITE_API_BASE_URL` and exposes the configured ports. Check `docker-compose.yml` for the exact ports and service names used in this workspace.

If you prefer to build and run images manually you can still use the individual `Dockerfile`s in `backend/StocksApi` and `frontend` — the compose setup is provided for convenience and reproducibility.
