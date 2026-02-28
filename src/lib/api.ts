export type User = {
  id: number;
  fullName?: string;
  email: string;
  role?: string;
};

const BASE = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

// Register - creates account and sends verification email
export async function registerUser(data: { 
  fullName?: string; 
  email: string; 
  password: string; 
  role?: string;
  language?: string;
}) {
  return request<{ 
    success: boolean; 
    message: string; 
    email: string;
    verificationUrl?: string; // Only in dev mode
  }>('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Verify email with token (called when user clicks verification link)
export async function verifyEmail(token: string) {
  return request<{ 
    success: boolean; 
    message: string; 
    email: string;
  }>(`/api/verify-email/${token}`, {
    method: 'GET',
  });
}

// Resend verification email
export async function resendVerificationEmail(data: { email: string; language?: string }) {
  return request<{ 
    success: boolean; 
    message: string;
    verificationUrl?: string; // Only in dev mode
  }>('/api/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Login - only works for verified accounts
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

// ── Program CRUD ────────────────────────────────────────────────

export interface Program {
  id: number;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  deadline: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Fetch all programs (public). */
export async function getPrograms() {
  return request<{ programs: Program[] }>('/api/programs');
}

/** Create a new program (committee-only). */
export async function createProgram(
  token: string,
  data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>
) {
  return request<{ program: Program }>('/api/programs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/** Update an existing program (committee-only). */
export async function updateProgram(
  token: string,
  id: number,
  data: Partial<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>
) {
  return request<{ program: Program }>(`/api/programs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/** Delete a program (committee-only). */
export async function deleteProgram(token: string, id: number) {
  return request<{ success: boolean }>(`/api/programs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── Generic content CRUD ─────────────────────────────────────────

/** Generic type for all DB content items. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function contentApi<T extends AnyRecord>(table: string) {
  return {
    getAll: () => request<{ [k: string]: T[] }>(`/api/${table}`).then(r => (r as AnyRecord)[table] as T[]),
    create: (token: string, data: Partial<T>) =>
      request<{ item: T }>(`/api/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }).then(r => r.item),
    update: (token: string, id: number, data: Partial<T>) =>
      request<{ item: T }>(`/api/${table}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }).then(r => r.item),
    remove: (token: string, id: number) =>
      request<{ success: boolean }>(`/api/${table}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
  };
}

// ── Committee Members ────────────────────────────────────────────
export interface CommitteeMemberRecord {
  id: number;
  name: string;
  nameNe: string;
  position: string;
  positionNe: string;
  contact: string;
  photo: string;
  sortOrder: number;
}
export const committeeMembersApi = contentApi<CommitteeMemberRecord>('committee_members');

// ── Notices ──────────────────────────────────────────────────────
export interface NoticeRecord {
  id: number;
  title: string;
  titleNe: string;
  content: string;
  contentNe: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  type: 'announcement' | 'deadline' | 'info';
}
export const noticesApi = contentApi<NoticeRecord>('notices');

// ── Events ───────────────────────────────────────────────────────
export interface EventRecord {
  id: number;
  title: string;
  titleNe: string;
  date: string;
  time: string;
  location: string;
  locationNe: string;
  description: string;
  descriptionNe: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
}
export const eventsApi = contentApi<EventRecord>('events');

// ── Press Releases ───────────────────────────────────────────────
export interface PressReleaseRecord {
  id: number;
  title: string;
  titleNe: string;
  excerpt: string;
  excerptNe: string;
  date: string;
  category: string;
  categoryNe: string;
  link: string;
}
export const pressReleasesApi = contentApi<PressReleaseRecord>('press_releases');
