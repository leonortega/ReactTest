export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, signal ? { signal } : undefined);
  if (!res.ok) throw new Error('Failed to fetch');
  return (await res.json()) as T;
}

export default fetchJson;
