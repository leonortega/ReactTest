import { http, HttpResponse } from 'msw';

const defaultStocks = [
  { companyId: 'ABC', dateTime: '2024-01-01T10:00:00Z', price: 100.5 },
  { companyId: 'ABC', dateTime: '2024-01-01T11:00:00Z', price: 101.2 },
];

export const handlers = [
  http.get('*/api/stocks/:companyId', ({ params, request }) => {
    const companyId = params.companyId as string;
    const url = new URL(request.url);
    if (!url.searchParams.get('date')) {
      return HttpResponse.json({ error: 'Missing required query parameter "date"' }, { status: 400 });
    }

    return HttpResponse.json(
      defaultStocks.map((item) => ({
        ...item,
        companyId,
      }))
    );
  }),
  http.get('*/stocks/:companyId', ({ params, request }) => {
    const companyId = params.companyId as string;
    const url = new URL(request.url);
    if (!url.searchParams.get('date')) {
      return HttpResponse.json({ error: 'Missing required query parameter "date"' }, { status: 400 });
    }

    return HttpResponse.json(
      defaultStocks.map((item) => ({
        ...item,
        companyId,
      }))
    );
  }),
];
