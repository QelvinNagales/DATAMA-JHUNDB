const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ApiError {
  status: number;
  message: string;
}

export async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body && typeof body.message === 'string') message = body.message;
    } catch {
      // ignore
    }
    const err: ApiError = { status: res.status, message };
    throw err;
  }

  return res.json();
}
