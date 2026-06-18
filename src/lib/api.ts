import { supabase } from './supabase';
import {
  registerForEvent,
  registerForEventDirect,
  verifyAttendance,
  verifyAttendanceDirect,
} from './registration';

const LOCAL_API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

export type User = {
  id: string;
  fullName?: string;
  email: string;
  role?: string;
};

function assertSupabase(): any {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase as any;
}

function mapProfileRole(role: string | null | undefined): string {
  if (role === 'committee' || role === 'subcommittee' || role === 'member') {
    return role;
  }
  return 'member';
}

function maskEmail(email: string): string {
  return email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
}

function isSupabaseToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || '')) as { iss?: string };
    return typeof payload.iss === 'string' && payload.iss.includes('supabase');
  } catch {
    return false;
  }
}

async function fetchLocalApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${LOCAL_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { error: data?.error || 'Request failed', status: response.status };
  }

  return data as T;
}

async function getCurrentUserFromSupabase(accessToken?: string): Promise<User> {
  const client = assertSupabase();
  const { data: userData, error: userError } = accessToken
    ? await client.auth.getUser(accessToken)
    : await client.auth.getUser();

  if (userError || !userData.user) {
    throw new Error(userError?.message || 'User not found');
  }

  const authUser = userData.user;

  const { data: profile } = await client
    .from('profiles')
    .select('full_name, role')
    .eq('id', authUser.id)
    .maybeSingle();

  const profileData = (profile || null) as { full_name?: string; role?: string } | null;

  return {
    id: authUser.id,
    fullName: profileData?.full_name || (authUser.user_metadata?.full_name as string | undefined),
    email: authUser.email || '',
    role: mapProfileRole(profileData?.role),
  };
}

// Register via Supabase Auth
export async function registerUser(data: {
  fullName?: string;
  email: string;
  password: string;
  role?: string;
  language?: string;
}) {
  if (supabase) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || '',
          role: mapProfileRole(data.role),
          language: data.language || 'en',
        },
      },
    });

    if (!error) {
      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        email: maskEmail(data.email),
      };
    }
  }

  const result = await fetchLocalApi<{ user: User; token: string }>('/api/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: data.fullName || '',
      email: data.email,
      password: data.password,
      role: mapProfileRole(data.role),
      language: data.language || 'en',
    }),
  });

  return {
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    email: maskEmail(data.email),
  };
}

// Verify email with token hash
export async function verifyEmail(token: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    });

    if (!error) {
      return {
        success: true,
        message: 'Email verified successfully! You can now log in.',
        email: data.user?.email || '',
      };
    }
  }

  const result = await fetchLocalApi<{ success: boolean; message: string; email: string }>(`/api/verify-email/${encodeURIComponent(token)}`);

  return {
    success: true,
    message: 'Email verified successfully! You can now log in.',
    email: result.email || '',
  };
}

export async function resendVerificationEmail(data: { email: string; language?: string }) {
  if (supabase) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: data.email,
    });

    if (!error) {
      return {
        success: true,
        message: 'Verification email resent',
      };
    }
  }

  await fetchLocalApi<{ success: boolean; message: string }>('/api/resend-verification', {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      language: data.language || 'en',
    }),
  });

  return {
    success: true,
    message: 'Verification email resent',
  };
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const local = await fetchLocalApi<{ user: User; token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { user: local.user, token: local.token };
  } catch {
    // Fall through to Supabase.
  }

  if (supabase) {
    try {
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (!error && loginData.session) {
        const user = await getCurrentUserFromSupabase(loginData.session.access_token);
        return { user, token: loginData.session.access_token };
      }
    } catch {
      // Final fallback below.
    }
  }

  throw { error: 'Login failed on both local server and Supabase.' };
}

export async function getMe(token: string) {
  if (supabase) {
    try {
      const user = await getCurrentUserFromSupabase(token);
      return { user };
    } catch {
      // Fall through to local backend.
    }
  }

  const result = await fetchLocalApi<{ user: User }>('/api/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { user: result.user };
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

// Program CRUD
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

export interface ProgramWrite {
  title: string;
  titleNe?: string;
  description?: string;
  descriptionNe?: string;
  deadline?: string;
  category?: string;
}

export async function getPrograms() {
  if (supabase) {
    try {
      const client = assertSupabase();
      const { data, error } = await client
        .from('upcoming_programs')
        .select('*')
        .eq('is_active', true)
        .order('deadline', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (!error) {
        const programs: Program[] = (data || []).map((row) => ({
          id: row.id,
          title: row.title,
          titleNe: row.title_ne,
          description: row.description || '',
          descriptionNe: row.description_ne || row.description || '',
          deadline: row.deadline || '',
          category: row.category || 'general',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return { programs };
      }
    } catch {
      // Fall through to local backend.
    }
  }

  const local = await fetchLocalApi<{ programs: any[] }>('/api/programs');
  const programs: Program[] = (local.programs || []).map((row) => ({
    id: row.id,
    title: row.title,
    titleNe: row.titleNe ?? row.title_ne ?? row.title,
    description: row.description || '',
    descriptionNe: (row.descriptionNe ?? row.description_ne ?? row.description) || '',
    deadline: row.deadline || '',
    category: row.category || 'general',
    createdAt: row.createdAt || row.created_at,
    updatedAt: row.updatedAt || row.updated_at,
  }));

  return { programs };
}

export async function createProgram(_token: string, data: ProgramWrite) {
  const preferLocalFirst = !isSupabaseToken(_token);

  if (preferLocalFirst) {
    const local = await fetchLocalApi<{ program: any }>('/api/programs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const inserted = local.program;
    return {
      program: {
        id: inserted.id,
        title: inserted.title,
        titleNe: inserted.titleNe ?? inserted.title_ne ?? inserted.title,
        description: inserted.description || '',
        descriptionNe: (inserted.descriptionNe ?? inserted.description_ne ?? inserted.description) || '',
        deadline: inserted.deadline || '',
        category: inserted.category || 'general',
        createdAt: inserted.createdAt || inserted.created_at,
        updatedAt: inserted.updatedAt || inserted.updated_at,
      },
    };
  }

  if (supabase) {
    try {
      const client = supabase as any;
      const payload = {
        title: data.title,
        title_ne: data.titleNe || data.title,
        description: data.description || '',
        description_ne: data.descriptionNe || data.description || '',
        deadline: data.deadline || null,
        category: data.category || 'general',
        is_active: true,
        is_registration_open: true,
      };

      const { data: inserted, error } = await client
        .from('upcoming_programs')
        .insert(payload)
        .select('*')
        .single();

      if (!error && inserted) {
        return {
          program: {
            id: inserted.id,
            title: inserted.title,
            titleNe: inserted.title_ne,
            description: inserted.description || '',
            descriptionNe: inserted.description_ne || inserted.description || '',
            deadline: inserted.deadline || '',
            category: inserted.category || 'general',
            createdAt: inserted.created_at,
            updatedAt: inserted.updated_at,
          },
        };
      }
    } catch {
      // Fall through to local backend.
    }
  }

  const result = await fetchLocalApi<{ program: any }>('/api/programs', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${_token}`,
    },
    body: JSON.stringify(data),
  });

  const inserted = result.program;

  return {
    program: {
      id: inserted.id,
      title: inserted.title,
      titleNe: inserted.titleNe ?? inserted.title_ne ?? inserted.title,
      description: inserted.description || '',
      descriptionNe: (inserted.descriptionNe ?? inserted.description_ne ?? inserted.description) || '',
      deadline: inserted.deadline || '',
      category: inserted.category || 'general',
      createdAt: inserted.createdAt || inserted.created_at,
      updatedAt: inserted.updatedAt || inserted.updated_at,
    },
  };
}

export async function updateProgram(_token: string, id: number, data: Partial<ProgramWrite>) {
  const preferLocalFirst = !isSupabaseToken(_token);

  if (preferLocalFirst) {
    const local = await fetchLocalApi<{ program: any }>(`/api/programs/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(data),
    });

    const updated = local.program;
    return {
      program: {
        id: updated.id,
        title: updated.title,
        titleNe: updated.titleNe ?? updated.title_ne ?? updated.title,
        description: updated.description || '',
        descriptionNe: (updated.descriptionNe ?? updated.description_ne ?? updated.description) || '',
        deadline: updated.deadline || '',
        category: updated.category || 'general',
        createdAt: updated.createdAt || updated.created_at,
        updatedAt: updated.updatedAt || updated.updated_at,
      },
    };
  }

  if (supabase) {
    try {
      const client = supabase as any;
      const payload: Record<string, unknown> = {};

      if (data.title !== undefined) payload.title = data.title;
      if (data.titleNe !== undefined) payload.title_ne = data.titleNe || data.title || '';
      if (data.description !== undefined) payload.description = data.description;
      if (data.descriptionNe !== undefined) payload.description_ne = data.descriptionNe || data.description || '';
      if (data.deadline !== undefined) payload.deadline = data.deadline || null;
      if (data.category !== undefined) payload.category = data.category;

      const { data: updated, error } = await client
        .from('upcoming_programs')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && updated) {
        return {
          program: {
            id: updated.id,
            title: updated.title,
            titleNe: updated.title_ne,
            description: updated.description || '',
            descriptionNe: updated.description_ne || updated.description || '',
            deadline: updated.deadline || '',
            category: updated.category || 'general',
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
          },
        };
      }
    } catch {
      // Fall through to local backend.
    }
  }

  const result = await fetchLocalApi<{ program: any }>(`/api/programs/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${_token}`,
    },
    body: JSON.stringify(data),
  });

  const updated = result.program;

  return {
    program: {
      id: updated.id,
      title: updated.title,
      titleNe: updated.titleNe ?? updated.title_ne ?? updated.title,
      description: updated.description || '',
      descriptionNe: (updated.descriptionNe ?? updated.description_ne ?? updated.description) || '',
      deadline: updated.deadline || '',
      category: updated.category || 'general',
      createdAt: updated.createdAt || updated.created_at,
      updatedAt: updated.updatedAt || updated.updated_at,
    },
  };
}

export async function deleteProgram(_token: string, id: number) {
  const preferLocalFirst = !isSupabaseToken(_token);

  if (preferLocalFirst) {
    await fetchLocalApi<{ success: boolean }>(`/api/programs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    });

    return { success: true };
  }

  if (supabase) {
    try {
      const client = supabase as any;
      const { error } = await client
        .from('upcoming_programs')
        .update({ is_active: false })
        .eq('id', id);

      if (!error) {
        return { success: true };
      }
    } catch {
      // Fall through to local backend.
    }
  }

  await fetchLocalApi<{ success: boolean }>(`/api/programs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${_token}`,
    },
  });

  return { success: true };
}

export async function registerForProgram(data: {
  programId: number;
  name: string;
  email: string;
  location?: string;
  language?: string;
}) {
  try {
    const result = await registerForEvent({
      program_id: data.programId,
      full_name: data.name,
      email: data.email,
      organization: data.location,
    });
    return {
      success: true,
      message: 'Registered and confirmation sent.',
      registrationCode: result.registration_code,
    };
  } catch {
    try {
      const direct = await registerForEventDirect({
        program_id: data.programId,
        full_name: data.name,
        email: data.email,
        organization: data.location,
      });
      return {
        success: true,
        message: 'Registered successfully.',
        registrationCode: direct.registration_code,
      };
    } catch {
      const local = await fetchLocalApi<{ success: boolean; message: string; registrationCode: string }>('/api/programs/register', {
        method: 'POST',
        body: JSON.stringify({
          programId: data.programId,
          name: data.name,
          email: data.email,
          location: data.location || '',
          language: data.language || 'en',
        }),
      });

      return {
        success: local.success,
        message: local.message,
        registrationCode: local.registrationCode,
      };
    }
  }
}

export async function checkInProgram(_token: string, registrationCode: string) {
  try {
    const result = await verifyAttendance(registrationCode);
    return {
      success: result.status === 'success',
      status: result.status,
      message: result.message,
      attendee: result.attendee
        ? {
            name: result.attendee.name,
            email: result.attendee.email,
            registrationCode: result.attendee.registration_code,
          }
        : undefined,
      program: result.event
        ? {
            id: 0,
            title: result.event.title,
          }
        : undefined,
      counts: result.stats
        ? {
            total: result.stats.total_registered,
            attended: result.stats.total_attended,
          }
        : undefined,
    };
  } catch {
    try {
      const result = await verifyAttendanceDirect(registrationCode);
      return {
        success: result.status === 'success',
        status: result.status,
        message: result.message,
        attendee: result.attendee
          ? {
              name: result.attendee.name,
              email: result.attendee.email,
              registrationCode: result.attendee.registration_code,
            }
          : undefined,
        program: result.event
          ? {
              id: 0,
              title: result.event.title,
            }
          : undefined,
        counts: result.stats
          ? {
              total: result.stats.total_registered,
              attended: result.stats.total_attended,
            }
          : undefined,
      };
    } catch {
      const local = await fetchLocalApi<{
        success: boolean;
        status: string;
        message: string;
        attendee?: { name: string; email: string; registrationCode: string };
        program?: { id: number; title: string };
        counts?: { total: number; attended: number };
      }>('/api/programs/checkin', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify({ registrationCode }),
      });

      return {
        success: local.success,
        status: local.status,
        message: local.message,
        attendee: local.attendee,
        program: local.program,
        counts: local.counts,
      };
    }
  }
}

export async function getRegistrations(_token: string, programId: number) {
  const preferLocalFirst = !isSupabaseToken(_token);

  if (!preferLocalFirst && supabase) {
    try {
      const client = assertSupabase();
      const { data, error } = await client
        .from('program_registrations')
        .select('*')
        .eq('program_id', programId)
        .order('created_at', { ascending: false });

      if (!error) {
        return {
          registrations: (data || []).map((row) => ({
            id: row.id,
            programId: row.program_id,
            name: row.full_name,
            email: row.email,
            location: row.organization || '',
            registrationCode: row.registration_code,
            isAttended: row.is_attended ? 1 : 0,
            attendanceStatus: row.is_attended ? 'Present' : 'Absent',
            attendedAt: row.checked_in_at,
            createdAt: row.created_at,
          })),
        };
      }
    } catch {
      // Fall through to local backend.
    }
  }

  const local = await fetchLocalApi<{ registrations: any[] }>(`/api/programs/registrations/${programId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${_token}`,
    },
  });

  return {
    registrations: (local.registrations || []).map((row) => ({
      id: row.id,
      programId: row.programId ?? row.program_id,
      name: row.name ?? row.full_name,
      email: row.email,
      location: row.organization || '',
      registrationCode: row.registrationCode ?? row.registration_code,
      isAttended: row.isAttended ?? (row.is_attended ? 1 : 0),
      attendanceStatus: row.attendanceStatus ?? (row.isAttended || row.is_attended ? 'Present' : 'Absent'),
      attendedAt: row.attendedAt ?? row.checked_in_at,
      createdAt: row.createdAt ?? row.created_at,
    })),
  };
}

// Generic content CRUD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

type TableAdapter = {
  table: 'committee_members' | 'notices' | 'events' | 'press_releases';
  toDb: (data: AnyRecord) => AnyRecord;
  fromDb: (row: AnyRecord) => AnyRecord;
};

const TABLE_ADAPTERS: Record<string, TableAdapter> = {
  committee_members: {
    table: 'committee_members',
    toDb: (data) => ({
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.nameNe !== undefined ? { name_ne: data.nameNe } : {}),
      ...(data.position !== undefined ? { position: data.position } : {}),
      ...(data.positionNe !== undefined ? { position_ne: data.positionNe } : {}),
      ...(data.contact !== undefined ? { contact: data.contact } : {}),
      ...(data.photo !== undefined ? { photo_url: data.photo } : {}),
      ...(data.sortOrder !== undefined ? { sort_order: data.sortOrder } : {}),
      is_active: true,
    }),
    fromDb: (row) => ({
      id: row.id,
      name: row.name,
      nameNe: row.nameNe ?? row.name_ne ?? row.name,
      position: row.position,
      positionNe: row.positionNe ?? row.position_ne ?? row.position,
      contact: row.contact || '',
      photo: row.photo ?? row.photo_url ?? '',
      sortOrder: row.sortOrder ?? row.sort_order ?? 0,
    }),
  },
  notices: {
    table: 'notices',
    toDb: (data) => ({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.titleNe !== undefined ? { title_ne: data.titleNe } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.contentNe !== undefined ? { content_ne: data.contentNe } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      is_published: true,
    }),
    fromDb: (row) => ({
      id: row.id,
      title: row.title,
      titleNe: row.titleNe ?? row.title_ne ?? row.title,
      content: row.content || '',
      contentNe: row.contentNe ?? row.content_ne ?? row.content ?? '',
      date: row.date || '',
      priority: row.priority,
      type: row.type,
    }),
  },
  events: {
    table: 'events',
    toDb: (data) => ({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.titleNe !== undefined ? { title_ne: data.titleNe } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.time !== undefined ? { time: data.time } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.locationNe !== undefined ? { location_ne: data.locationNe } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.descriptionNe !== undefined ? { description_ne: data.descriptionNe } : {}),
      ...(data.attendees !== undefined ? { attendees: data.attendees } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.image !== undefined ? { image_url: data.image } : {}),
      is_published: true,
      organizer: 'CAN Federation Kavre',
      organizer_ne: 'क्यान महासंघ काभ्रे',
    }),
    fromDb: (row) => ({
      id: row.id,
      title: row.title,
      titleNe: row.titleNe ?? row.title_ne ?? row.title,
      date: row.date || '',
      time: row.time || '',
      location: row.location || '',
      locationNe: row.locationNe ?? row.location_ne ?? row.location ?? '',
      description: row.description || '',
      descriptionNe: row.descriptionNe ?? row.description_ne ?? row.description ?? '',
      attendees: row.attendees || 0,
      status: row.status,
      image: row.image ?? row.image_url ?? '',
    }),
  },
  press_releases: {
    table: 'press_releases',
    toDb: (data) => ({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.titleNe !== undefined ? { title_ne: data.titleNe } : {}),
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
      ...(data.excerptNe !== undefined ? { excerpt_ne: data.excerptNe } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.link !== undefined ? { link: data.link } : {}),
      is_published: true,
    }),
    fromDb: (row) => ({
      id: row.id,
      title: row.title,
      titleNe: row.titleNe ?? row.title_ne ?? row.title,
      excerpt: row.excerpt || '',
      excerptNe: row.excerptNe ?? row.excerpt_ne ?? row.excerpt ?? '',
      date: row.date || '',
      category: row.category ?? 'News',
      categoryNe: row.categoryNe ?? row.category_ne ?? 'समाचार',
      link: row.link || '#',
    }),
  },
};

function contentApi<T extends AnyRecord>(table: string) {
  const adapter = TABLE_ADAPTERS[table];
  if (!adapter) {
    throw new Error(`No adapter found for table: ${table}`);
  }

  return {
    getAll: async () => {
      if (supabase) {
        try {
          const client = assertSupabase();
          const { data, error } = await client
            .from(adapter.table)
            .select('*')
            .order('id', { ascending: false });

          if (!error && data) {
            return (data || []).map((row) => adapter.fromDb(row)) as T[];
          }
        } catch {
          // Fall through to local backend.
        }
      }

      // Local backend fallback
      const local = await fetchLocalApi<any>(`/api/${adapter.table}`);
      const list = local[adapter.table] || [];
      return list.map((row: any) => adapter.fromDb(row)) as T[];
    },
    create: async (_token: string, data: Partial<T>) => {
      const preferLocalFirst = !isSupabaseToken(_token);

      if (preferLocalFirst) {
        const local = await fetchLocalApi<{ item: any }>(`/api/${adapter.table}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify(data),
        });
        return adapter.fromDb(local.item) as T;
      }

      if (supabase) {
        try {
          const client = assertSupabase();
          const dbData = adapter.toDb(data as AnyRecord);
          const { data: created, error } = await client
            .from(adapter.table)
            .insert(dbData)
            .select('*')
            .single();

          if (!error && created) {
            return adapter.fromDb(created) as T;
          }
        } catch {
          // Fall through to local backend.
        }
      }

      const local = await fetchLocalApi<{ item: any }>(`/api/${adapter.table}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(data),
      });
      return adapter.fromDb(local.item) as T;
    },
    update: async (_token: string, id: number, data: Partial<T>) => {
      const preferLocalFirst = !isSupabaseToken(_token);

      if (preferLocalFirst) {
        const local = await fetchLocalApi<{ item: any }>(`/api/${adapter.table}/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify(data),
        });
        return adapter.fromDb(local.item) as T;
      }

      if (supabase) {
        try {
          const client = assertSupabase();
          const dbData = adapter.toDb(data as AnyRecord);
          const { data: updated, error } = await client
            .from(adapter.table)
            .update(dbData)
            .eq('id', id)
            .select('*')
            .single();

          if (!error && updated) {
            return adapter.fromDb(updated) as T;
          }
        } catch {
          // Fall through to local backend.
        }
      }

      const local = await fetchLocalApi<{ item: any }>(`/api/${adapter.table}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(data),
      });
      return adapter.fromDb(local.item) as T;
    },
    remove: async (_token: string, id: number) => {
      const preferLocalFirst = !isSupabaseToken(_token);

      if (preferLocalFirst) {
        await fetchLocalApi<{ success: boolean }>(`/api/${adapter.table}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${_token}`,
          },
        });
        return { success: true };
      }

      if (supabase) {
        try {
          const client = assertSupabase();
          const { error } = await client
            .from(adapter.table)
            .delete()
            .eq('id', id);

          if (!error) {
            return { success: true };
          }
        } catch {
          // Fall through to local backend.
        }
      }

      await fetchLocalApi<{ success: boolean }>(`/api/${adapter.table}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      });
      return { success: true };
    },
  };
}

// Committee Members
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

// Notices
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

// Events
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

// Press Releases
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
