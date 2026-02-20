// Registration API helpers — bridges frontend to Supabase Edge Functions
import { supabase } from './supabase'

// ── Types ──────────────────────────────────────────────────────

export interface RegistrationRequest {
  event_id?: number
  program_id?: number
  full_name: string
  full_name_ne?: string
  email: string
  phone?: string
  organization?: string
  designation?: string
  user_id?: string
}

export interface RegistrationResponse {
  success: boolean
  registration_code: string
  qr_code_url: string
  qr_data_url: string
  verify_url: string
  event_title: string
  event_date: string
  event_location: string
  email_sent: boolean
  registration_id: number
}

export interface RegistrationError {
  error: string
  already_registered?: boolean
  registration_code?: string
  qr_code_url?: string
}

export interface VerifyRequest {
  registration_code: string
}

export interface VerifyResponse {
  status: 'success' | 'duplicate' | 'invalid' | 'cancelled' | 'error'
  message: string
  attendee?: {
    name: string
    email: string
    phone?: string
    organization?: string
    registration_code: string
  }
  event?: {
    title: string
    title_ne: string
    date: string
    location: string
  }
  stats?: {
    total_registered: number
    total_attended: number
    attendance_rate: number
  }
  checked_in_at?: string
}

// ── Registration ───────────────────────────────────────────────

/**
 * Register for an event or program.
 * Calls the `generate-registration` Edge Function which:
 * 1. Validates the event/program
 * 2. Generates a unique registration code
 * 3. Creates a QR code image
 * 4. Sends a confirmation email with QR attached
 * 5. Returns the registration details
 */
export async function registerForEvent(
  data: RegistrationRequest
): Promise<RegistrationResponse> {
  const { data: result, error } = await supabase.functions.invoke(
    'generate-registration',
    {
      body: data,
    }
  )

  if (error) {
    throw new Error(error.message || 'Registration failed')
  }

  // Edge function returns error in body for business errors
  if (result?.error) {
    const err = result as RegistrationError
    if (err.already_registered) {
      throw Object.assign(new Error(err.error), {
        alreadyRegistered: true,
        registrationCode: err.registration_code,
        qrCodeUrl: err.qr_code_url,
      })
    }
    throw new Error(err.error)
  }

  return result as RegistrationResponse
}

// ── Verify / Check-in (Admin) ──────────────────────────────────

/**
 * Verify a registration code and mark attendance.
 * Called by the admin QR scanner.
 * Requires committee role.
 */
export async function verifyAttendance(
  registrationCode: string
): Promise<VerifyResponse> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('Authentication required')
  }

  const { data: result, error } = await supabase.functions.invoke(
    'verify-attendance',
    {
      body: { registration_code: registrationCode },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  )

  if (error) {
    throw new Error(error.message || 'Verification failed')
  }

  return result as VerifyResponse
}

// ── Client-side registration (fallback when Edge Functions aren't deployed) ──

/**
 * Generates a registration code client-side.
 * Used as a fallback before Edge Functions are deployed.
 */
function generateClientRegistrationCode(prefix: string): string {
  const year = new Date().getFullYear()
  const rand5 = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let rand4 = ''
  for (let i = 0; i < 4; i++) {
    rand4 += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}-${year}-${rand5}-${rand4}`
}

/**
 * Client-side event registration directly via Supabase.
 * Falls back to this when Edge Functions are not yet deployed.
 * Note: No email is sent in this mode.
 */
export async function registerForEventDirect(
  data: RegistrationRequest
): Promise<{
  registration_code: string
  verify_url: string
  event_title: string
  event_date: string
  event_location: string
}> {
  const isEvent = !!data.event_id
  const prefix = isEvent ? 'EVT' : 'PRG'
  const tableName = isEvent ? 'event_registrations' : 'program_registrations'
  const idField = isEvent ? 'event_id' : 'program_id'
  const idValue = isEvent ? data.event_id : data.program_id

  // Fetch event/program details
  let title = ''
  let date = ''
  let location = ''

  if (isEvent) {
    const { data: event, error } = await supabase
      .from('events')
      .select('title, date, location, is_registration_open, max_attendees, registered_count, registration_deadline')
      .eq('id', data.event_id!)
      .single()

    if (error || !event) throw new Error('Event not found')
    if (event.is_registration_open === false) throw new Error('Registration is closed')
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
      throw new Error('Registration deadline has passed')
    }
    if (event.max_attendees && (event.registered_count || 0) >= event.max_attendees) {
      throw new Error('Event has reached maximum capacity')
    }
    title = event.title
    date = event.date || ''
    location = event.location || ''
  } else {
    const { data: program, error } = await supabase
      .from('upcoming_programs')
      .select('title, start_date, date, location, is_registration_open, max_participants, current_participants, deadline')
      .eq('id', data.program_id!)
      .single()

    if (error || !program) throw new Error('Program not found')
    if (program.is_registration_open === false) throw new Error('Registration is closed')
    if (program.deadline && new Date(program.deadline) < new Date()) {
      throw new Error('Registration deadline has passed')
    }
    if (program.max_participants && (program.current_participants || 0) >= program.max_participants) {
      throw new Error('Program has reached maximum capacity')
    }
    title = program.title
    date = program.start_date || program.date || ''
    location = program.location || ''
  }

  // Check duplicate
  const { data: existing } = await supabase
    .from(tableName)
    .select('registration_code')
    .eq(idField, idValue!)
    .eq('email', data.email)
    .single()

  if (existing) {
    throw Object.assign(new Error('You are already registered'), {
      alreadyRegistered: true,
      registrationCode: existing.registration_code,
    })
  }

  // Generate code & verify URL
  const regCode = generateClientRegistrationCode(prefix)
  const verifyUrl = `${window.location.origin}/verify/${regCode}`

  // Insert registration
  const insertData: Record<string, unknown> = {
    [idField]: idValue,
    user_id: data.user_id || null,
    full_name: data.full_name,
    full_name_ne: data.full_name_ne || null,
    email: data.email,
    phone: data.phone || null,
    organization: data.organization || null,
    registration_code: regCode,
    qr_data: verifyUrl,
    status: 'registered',
  }

  if (isEvent) {
    insertData.designation = data.designation || null
    insertData.check_in_method = 'qr'
    insertData.registration_source = 'web'
  }

  const { error: insertErr } = await supabase
    .from(tableName)
    .insert(insertData)

  if (insertErr) {
    throw new Error('Failed to register: ' + insertErr.message)
  }

  return {
    registration_code: regCode,
    verify_url: verifyUrl,
    event_title: title,
    event_date: date,
    event_location: location,
  }
}

/**
 * Client-side attendance verification directly via Supabase.
 * Falls back to this when Edge Functions are not yet deployed.
 */
export async function verifyAttendanceDirect(
  registrationCode: string
): Promise<VerifyResponse> {
  // Try event_registrations first
  let reg = null
  let tableName = 'event_registrations'
  let eventInfo: { title: string; title_ne: string; date: string; location: string } | null = null

  const { data: eventReg } = await supabase
    .from('event_registrations')
    .select('*, events(id, title, title_ne, date, location)')
    .eq('registration_code', registrationCode)
    .single()

  if (eventReg) {
    reg = eventReg
    eventInfo = eventReg.events as unknown as typeof eventInfo
  } else {
    tableName = 'program_registrations'
    const { data: progReg } = await supabase
      .from('program_registrations')
      .select('*, upcoming_programs(id, title, title_ne, start_date, location)')
      .eq('registration_code', registrationCode)
      .single()

    if (progReg) {
      reg = progReg
      const prog = progReg.upcoming_programs as unknown as { title: string; title_ne: string; start_date: string; location: string }
      eventInfo = prog ? { title: prog.title, title_ne: prog.title_ne, date: prog.start_date, location: prog.location } : null
    }
  }

  if (!reg) {
    return { status: 'invalid', message: 'Invalid ticket — registration not found' }
  }

  if (reg.status === 'cancelled') {
    return { status: 'cancelled', message: 'This registration was cancelled', attendee: { name: reg.full_name, email: reg.email, phone: reg.phone, organization: reg.organization, registration_code: reg.registration_code } }
  }

  if (reg.is_attended) {
    const t = new Date(reg.checked_in_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return { status: 'duplicate', message: `Already checked in at ${t}`, attendee: { name: reg.full_name, email: reg.email, phone: reg.phone, organization: reg.organization, registration_code: reg.registration_code }, checked_in_at: reg.checked_in_at }
  }

  // Mark attended
  const now = new Date().toISOString()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from(tableName)
    .update({
      is_attended: true,
      checked_in_at: now,
      checked_in_by: user?.id || null,
      status: 'attended',
    })
    .eq('id', reg.id)

  if (error) {
    return { status: 'error', message: 'Failed to check in: ' + error.message }
  }

  // Get updated counts
  const idField = tableName === 'event_registrations' ? 'event_id' : 'program_id'
  const parentId = reg[idField]
  const { data: allRegs } = await supabase
    .from(tableName)
    .select('is_attended, status')
    .eq(idField, parentId)
    .neq('status', 'cancelled')

  const totalRegistered = allRegs?.length || 0
  const totalAttended = allRegs?.filter(r => r.is_attended).length || 0

  return {
    status: 'success',
    message: `Welcome, ${reg.full_name}!`,
    attendee: {
      name: reg.full_name,
      email: reg.email,
      phone: reg.phone,
      organization: reg.organization,
      registration_code: reg.registration_code,
    },
    event: eventInfo ? {
      title: eventInfo.title,
      title_ne: eventInfo.title_ne,
      date: eventInfo.date,
      location: eventInfo.location,
    } : undefined,
    stats: {
      total_registered: totalRegistered,
      total_attended: totalAttended,
      attendance_rate: totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0,
    },
  }
}
