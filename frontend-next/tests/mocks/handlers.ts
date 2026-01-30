import { http, HttpResponse } from 'msw';

const defaultStocks = [
  { companyId: 'ABC', dateTime: '2024-01-01T10:00:00Z', price: 100.5 },
  { companyId: 'ABC', dateTime: '2024-01-01T11:00:00Z', price: 101.2 },
];

export const handlers = [
  http.get('*/api/stocks', ({ request }) => {
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    const date = url.searchParams.get('date');

    if (!companyId || !date) {
      return HttpResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    return HttpResponse.json(
      defaultStocks.map((item) => ({
        ...item,
        companyId,
      })),
    );
  }),
];
