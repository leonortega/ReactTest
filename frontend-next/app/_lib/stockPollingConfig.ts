const FALLBACK_AUTO_REFRESH_SECONDS = 5;

export const STOCK_AUTO_REFRESH_MIN_SECONDS = 5;
export const STOCK_AUTO_REFRESH_MAX_SECONDS = 120;
export const STOCK_AUTO_REFRESH_PRESET_SECONDS = [5, 10, 15, 30, 60, 120] as const;

function parseRefreshSeconds(rawValue: string | undefined): number | null {
  if (!rawValue) return null;

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return null;
  return parsed;
}

export function clampStockAutoRefreshSeconds(seconds: number): number {
  return Math.max(
    STOCK_AUTO_REFRESH_MIN_SECONDS,
    Math.min(STOCK_AUTO_REFRESH_MAX_SECONDS, Math.round(seconds)),
  );
}

const envDefault = parseRefreshSeconds(process.env.NEXT_PUBLIC_STOCKS_AUTO_REFRESH_SECONDS);

export const DEFAULT_STOCK_AUTO_REFRESH_SECONDS = clampStockAutoRefreshSeconds(
  envDefault ?? FALLBACK_AUTO_REFRESH_SECONDS,
);
