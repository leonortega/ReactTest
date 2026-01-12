This workspace contains two new projects added by the assistant:

- `backend/StocksApi` - .NET 7 Web API implementing a vertical-slice pattern using MediatR. Exposes `GET /api/stocks/{companyId}?dateTime=...` to return stock values.
- `frontend` - React 19.2 application (Vite) that calls the backend API.

To run the backend:

- Open `backend/StocksApi` in Visual Studio or run `dotnet run` in that directory.
- The API runs on https by default; for local quick testing you may want to configure launch settings or use http.

To run the frontend:

- `cd frontend` and run `npm install` then `npm run dev`.

Note: The frontend expects backend at http://localhost:5000; adjust as needed.
