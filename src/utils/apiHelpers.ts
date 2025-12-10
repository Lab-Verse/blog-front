export function extractArrayFromResponse<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object' && 'data' in res) {
    const data = (res as { data: unknown }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

export function extractObjectFromResponse<T>(res: unknown): T | null {
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}
