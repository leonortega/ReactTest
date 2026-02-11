"use client";

import { SWRConfig } from 'swr';

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return (await response.json()) as T;
}

export default function SWRProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
