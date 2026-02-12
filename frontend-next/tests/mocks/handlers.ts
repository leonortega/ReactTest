import { http, HttpResponse } from 'msw';

const defaultStocks = [
  { dateTime: '2024-01-01T10:00:00Z', price: 100.5 },
  { dateTime: '2024-01-01T11:00:00Z', price: 101.2 },
];

export const handlers = [
  http.get('*/api/stocks/:companyId', ({ params, request }) => {
    const url = new URL(request.url);
    const companyId = String(params.companyId ?? '')
      .trim()
      .toUpperCase();
    const date = url.searchParams.get('date');

    if (!companyId || !date) {
      return HttpResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    return HttpResponse.json(defaultStocks);
  }),
];
