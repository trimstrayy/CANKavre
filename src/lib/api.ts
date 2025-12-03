export type User = {
  id: number;
  fullName?: string;
  email: string;
  role?: string;
};

const BASE = process.env.VITE_AUTH_URL || 'http://localhost:4000';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function registerUser(data: { fullName?: string; email: string; password: string; role?: string }) {
  return request<{ user: User; token: string }>('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: { email: string; password: string }) {
  return request<{ user: User; token: string }>('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getMe(token: string) {
  return request<{ user: User }>('/api/users/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function saveToken(token: string) {
  localStorage.setItem('cankavre_token', token);
}

export function getToken() {
  return localStorage.getItem('cankavre_token') || undefined;
}

export function clearToken() {
  localStorage.removeItem('cankavre_token');
}
