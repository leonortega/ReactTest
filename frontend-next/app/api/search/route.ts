const results = [
  { symbol: 'ABC', name: 'Alpha Beta Corp' },
  { symbol: 'XYZ', name: 'Xylon Yield Zone' },
  { symbol: 'MKT', name: 'MarketPulse Index' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').toUpperCase();

  const filtered = query
    ? results.filter(
        (item) => item.symbol.includes(query) || item.name.toUpperCase().includes(query),
      )
    : results;

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
