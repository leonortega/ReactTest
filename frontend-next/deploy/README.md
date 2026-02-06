# frontend-next deploy

## Build
```
docker build -f deploy/Dockerfile -t frontend-next .
```

## Run

```bash
# Run container exposing container's internal port (the image listens on PORT or 3000)
docker run --rm -p 3000:3000 frontend-next
```

Notes
- Uses Next.js standalone output.
- The containerized server accepts requests on the container port defined by the `PORT` environment variable (falling back to 3000). Map host ports to the container port as needed (example above maps host 3000 to container 3000).
- The frontend browser bundle calls the Next API proxy (`/api/stocks/...`). The server-side proxy forwards to the internal backend configured via the `INTERNAL_API_BASE_URL` environment variable inside the container.
