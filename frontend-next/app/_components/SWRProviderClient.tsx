"use client";

import { SWRConfig } from 'swr';
import fetchJson from '../_lib/fetcher';

export default function SWRProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetchJson(url),
        refreshInterval: 5000,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
