export function extractArrayFromResponse<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object') {
    if ('data' in res) {
      const data = (res as { data: unknown }).data;
      if (Array.isArray(data)) return data;
    }
    if ('items' in res) {
      const items = (res as { items: unknown }).items;
      if (Array.isArray(items)) return items;
    }
  }
  return [];
}

export function extractObjectFromResponse<T>(res: unknown): T | null {
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}
