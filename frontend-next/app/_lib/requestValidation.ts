const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function parseCompanyId(raw: string | null | undefined): string | null {
  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw).trim().toUpperCase();
    return decoded || null;
  } catch {
    return null;
  }
}

export function parseIsoDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!isoDatePattern.test(raw)) return null;

  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10) === raw ? raw : null;
}

export function parseIsoDateParam(raw: string | string[] | undefined): string | null {
  if (Array.isArray(raw)) return null;
  return parseIsoDate(raw);
}
