// supabase/functions/verify-attendance/index.ts
// QR-based check-in handler for event attendance
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify admin JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user: authUser } } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (!authUser) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify committee role
    const { data: admin } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', authUser.id)
      .single()

    if (!admin || admin.role !== 'committee') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Committee access required for check-in' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { registration_code } = await req.json()

    if (!registration_code) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'registration_code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Try event_registrations first
    let reg = null
    let tableName = 'event_registrations'
    let eventInfo = null

    const { data: eventReg } = await supabase
      .from('event_registrations')
      .select('*, events(id, title, title_ne, date, location)')
      .eq('registration_code', registration_code)
      .single()

    if (eventReg) {
      reg = eventReg
      eventInfo = eventReg.events
    } else {
      // Try program_registrations
      tableName = 'program_registrations'
      const { data: progReg } = await supabase
        .from('program_registrations')
        .select('*, upcoming_programs(id, title, title_ne, start_date, location)')
        .eq('registration_code', registration_code)
        .single()

      if (progReg) {
        reg = progReg
        eventInfo = progReg.upcoming_programs
      }
    }

    if (!reg) {
      return new Response(
        JSON.stringify({
          status: 'invalid',
          message: 'Invalid ticket — registration not found',
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if cancelled
    if (reg.status === 'cancelled') {
      return new Response(
        JSON.stringify({
          status: 'cancelled',
          message: 'This registration was cancelled',
          attendee: reg.full_name,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already checked in
    if (reg.is_attended) {
      const checkedInTime = new Date(reg.checked_in_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
      return new Response(
        JSON.stringify({
          status: 'duplicate',
          message: `Already checked in at ${checkedInTime}`,
          attendee: reg.full_name,
          checked_in_at: reg.checked_in_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark as attended
    const now = new Date().toISOString()
    const { error: updateErr } = await supabase
      .from(tableName)
      .update({
        is_attended: true,
        checked_in_at: now,
        checked_in_by: authUser.id,
        check_in_method: 'qr',
        status: 'attended',
      })
      .eq('id', reg.id)

    if (updateErr) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Failed to update: ' + updateErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get updated attendance stats
    const idField = tableName === 'event_registrations' ? 'event_id' : 'program_id'
    const parentId = reg[idField]

    const { data: allRegs } = await supabase
      .from(tableName)
      .select('is_attended, status')
      .eq(idField, parentId)
      .neq('status', 'cancelled')

    const totalRegistered = allRegs?.length || 0
    const totalAttended = allRegs?.filter(r => r.is_attended).length || 0

    // Audit log
    await supabase.from('audit_log').insert({
      user_id: authUser.id,
      user_email: authUser.email,
      action: 'check_in',
      table_name: tableName,
      record_id: reg.id,
      new_data: { is_attended: true, checked_in_at: now },
      description: `Checked in ${reg.full_name} for ${eventInfo?.title || 'event'}`,
    }).catch(() => { /* non-critical */ })

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `Welcome, ${reg.full_name}!`,
        attendee: {
          name: reg.full_name,
          email: reg.email,
          phone: reg.phone,
          organization: reg.organization,
          registration_code: reg.registration_code,
        },
        event: {
          title: eventInfo?.title || '',
          title_ne: eventInfo?.title_ne || '',
          date: eventInfo?.date || eventInfo?.start_date || '',
          location: eventInfo?.location || '',
        },
        stats: {
          total_registered: totalRegistered,
          total_attended: totalAttended,
          attendance_rate: totalRegistered > 0
            ? Math.round((totalAttended / totalRegistered) * 100)
            : 0,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Verify attendance error:', err)
    return new Response(
      JSON.stringify({ status: 'error', message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
