# frontend-next deploy

## Build
```
docker build -f deploy/Dockerfile -t frontend-next .
```

## Run
```
docker run --rm -p 3000:3000 frontend-next
```

## Notes
- Uses Next.js standalone output.
- Configure `NEXT_PUBLIC_API_BASE_URL` for upstream API calls.
