# frontend-next deploy

## Build
```
docker build -f deploy/Dockerfile -t frontend-next .
```

## Run

```bash
# Run container with host 3000 mapped to container 80 (default PORT in this image)
docker run --rm -p 3000:80 frontend-next
```

Notes
- Uses Next.js standalone output.
- The containerized server accepts requests on the container port defined by the `PORT` environment variable (default `80` in this image). Map host ports to the container port as needed (example above maps host `3000` to container `80`).
- The frontend browser bundle calls the Next API proxy (`/api/stocks/...`). The server-side proxy forwards to the internal backend configured via the `INTERNAL_API_BASE_URL` environment variable inside the container.
  - Docker Compose example: `INTERNAL_API_BASE_URL=http://stocksapi:8080/api`
  - Azure App Service sidecar example in this repo: `INTERNAL_API_BASE_URL=http://localhost:8080/api`
