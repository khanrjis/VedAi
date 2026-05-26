import type { ApiEnvelope } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>): string => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as { message?: string; data?: T; errors?: unknown } | null;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? 'Request failed', response.status);
  }

  return (payload?.data ?? payload) as T;
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}, query?: Record<string, string | number | undefined>): Promise<T> => {
  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers ?? {})
    }
  });

  return parseResponse<T>(response);
};

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>) => apiRequest<T>(path, { method: 'GET' }, query),
  postJson: <T>(path: string, body: unknown) => apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: <T>(path: string, formData: FormData) => apiRequest<T>(path, { method: 'POST', body: formData })
};

export { ApiError };