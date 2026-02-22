// supabase/functions/generate-registration/index.ts
// Handles event/program registration, generates QR code, sends confirmation email via SMTP
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import QRCode from 'https://esm.sh/qrcode@1.5.3'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function generateRegistrationCode(prefix: string): string {
  const year = new Date().getFullYear()
  const rand5 = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
  const rand4 = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${year}-${rand5}-${rand4}`
}

async function sendConfirmationEmail(
  to: string,
  fullName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  registrationCode: string,
  qrDataUrl: string
) {
  const smtpHost = Deno.env.get('SMTP_HOST')
  const smtpPort = Number(Deno.env.get('SMTP_PORT') || '587')
  const smtpUser = Deno.env.get('SMTP_USER')
  const smtpPass = Deno.env.get('SMTP_PASS')
  const fromEmail = Deno.env.get('SMTP_FROM') || 'cankavre@gmail.com'
  const fromName = Deno.env.get('SMTP_FROM_NAME') || 'CAN Federation Kavre'

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured — skipping email send')
    return { sent: false, reason: 'SMTP not configured' }
  }

  // Extract base64 from data URL for attachment
  const base64Data = qrDataUrl.split(',')[1]
  const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

  const client = new SMTPClient({
    connection: {
      hostname: smtpHost,
      port: smtpPort,
      tls: true,
      auth: {
        username: smtpUser,
        password: smtpPass,
      },
    },
  })

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0 0 5px 0; font-size: 22px; }
    .header p { margin: 0; opacity: 0.85; font-size: 14px; }
    .content { padding: 30px; }
    .greeting { font-size: 18px; color: #1a365d; margin-bottom: 16px; }
    .success-badge { background: #dcfce7; color: #166534; padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 600; margin: 16px 0; }
    .details { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .details h3 { margin: 0 0 12px 0; color: #1a365d; font-size: 16px; }
    .detail-row { display: flex; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .detail-label { color: #64748b; width: 140px; font-size: 13px; }
    .detail-value { color: #1e293b; font-weight: 500; font-size: 13px; }
    .qr-section { text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px; margin: 20px 0; }
    .qr-section img { width: 250px; height: 250px; }
    .qr-section p { color: #0369a1; font-size: 13px; margin-top: 10px; }
    .reg-code { font-family: monospace; background: #1a365d; color: white; padding: 10px 20px; border-radius: 6px; display: inline-block; font-size: 16px; letter-spacing: 2px; margin: 10px 0; }
    .instructions { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .instructions h4 { color: #92400e; margin: 0 0 8px 0; font-size: 14px; }
    .instructions ul { margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; }
    .instructions li { margin: 4px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CAN Federation Kavre</h1>
      <p>क्यान महासंघ काभ्रे</p>
    </div>
    <div class="content">
      <p class="greeting">Dear ${fullName},</p>
      <div class="success-badge">✅ Registration Confirmed / दर्ता पक्का भयो</div>
      
      <p>Your registration for the following event has been successfully completed:</p>
      
      <div class="details">
        <h3>📋 Event Details / कार्यक्रम विवरण</h3>
        <div class="detail-row">
          <span class="detail-label">Event / कार्यक्रम:</span>
          <span class="detail-value">${eventTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date / मिति:</span>
          <span class="detail-value">${eventDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue / स्थान:</span>
          <span class="detail-value">${eventLocation}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Reg. Code / कोड:</span>
          <span class="detail-value"><code>${registrationCode}</code></span>
        </div>
      </div>

      <div class="qr-section">
        <h3>🎫 Your QR Code / तपाईंको QR कोड</h3>
        <img src="cid:qrcode" alt="QR Code for attendance" />
        <p>Show this QR code at the event entrance for check-in<br/>
        चेक-इनको लागि कार्यक्रम प्रवेशद्वारमा यो QR कोड देखाउनुहोस्</p>
        <div class="reg-code">${registrationCode}</div>
      </div>

      <div class="instructions">
        <h4>📌 Important Instructions / महत्त्वपूर्ण निर्देशनहरू</h4>
        <ul>
          <li>Save this QR code on your phone / यो QR कोड फोनमा सुरक्षित गर्नुहोस्</li>
          <li>Arrive 15 minutes before the event / कार्यक्रम भन्दा १५ मिनेट अगाडि आउनुहोस्</li>
          <li>Bring a valid ID for verification / प्रमाणीकरणको लागि वैध परिचयपत्र ल्याउनुहोस्</li>
          <li>For queries, contact cankavre@gmail.com / प्रश्नहरूको लागि सम्पर्क गर्नुहोस्</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} CAN Federation Kavre | Banepa, Kavrepalanchok, Nepal</p>
      <p>This is an automated message. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>`

  try {
    await client.send({
      from: `${fromName} <${fromEmail}>`,
      to: to,
      subject: `✅ Registration Confirmed: ${eventTitle} — CAN Kavre`,
      content: `Your registration for "${eventTitle}" is confirmed.\nRegistration Code: ${registrationCode}\nDate: ${eventDate}\nVenue: ${eventLocation}\n\nPlease show your QR code at the entrance for check-in.`,
      html: htmlBody,
      attachments: [
        {
          filename: `qr-${registrationCode}.png`,
          content: qrBytes,
          contentType: 'image/png',
          encoding: 'binary',
          contentId: 'qrcode',
        },
      ],
    })
    await client.close()
    return { sent: true }
  } catch (err) {
    console.error('Email send error:', err)
    await client.close().catch(() => {})
    return { sent: false, reason: String(err) }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const body = await req.json()
    const {
      event_id,
      program_id,
      full_name,
      full_name_ne,
      email,
      phone,
      organization,
      designation,
      user_id,
    } = body

    // Determine if event or program registration
    const isEvent = !!event_id
    const isProgram = !!program_id
    if (!isEvent && !isProgram) {
      return new Response(
        JSON.stringify({ error: 'Either event_id or program_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!full_name || !email) {
      return new Response(
        JSON.stringify({ error: 'full_name and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let eventTitle = ''
    let eventDate = ''
    let eventLocation = ''
    let regCodePrefix = 'EVT'
    let tableName = 'event_registrations'
    let idField = 'event_id'
    let idValue = event_id

    if (isEvent) {
      // Validate event
      const { data: event } = await supabase
        .from('events').select('*').eq('id', event_id).single()
      if (!event) {
        return new Response(
          JSON.stringify({ error: 'Event not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (event.is_registration_open === false) {
        return new Response(
          JSON.stringify({ error: 'Registration is closed for this event' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Registration deadline has passed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (event.max_attendees && event.registered_count >= event.max_attendees) {
        return new Response(
          JSON.stringify({ error: 'Event has reached maximum capacity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      eventTitle = event.title
      eventDate = event.date || ''
      eventLocation = event.location || ''
    } else {
      // Validate program
      regCodePrefix = 'PRG'
      tableName = 'program_registrations'
      idField = 'program_id'
      idValue = program_id

      const { data: program } = await supabase
        .from('upcoming_programs').select('*').eq('id', program_id).single()
      if (!program) {
        return new Response(
          JSON.stringify({ error: 'Program not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (program.is_registration_open === false) {
        return new Response(
          JSON.stringify({ error: 'Registration is closed for this program' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (program.deadline && new Date(program.deadline) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Registration deadline has passed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (program.max_participants && program.current_participants >= program.max_participants) {
        return new Response(
          JSON.stringify({ error: 'Program has reached maximum capacity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      eventTitle = program.title
      eventDate = program.start_date || program.date || ''
      eventLocation = program.location || ''
    }

    // Check duplicate registration
    const { data: existing } = await supabase
      .from(tableName)
      .select('id, registration_code, qr_code_url')
      .eq(idField, idValue)
      .eq('email', email)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({
          error: 'You are already registered for this event/program',
          registration_code: existing.registration_code,
          qr_code_url: existing.qr_code_url,
          already_registered: true,
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique registration code
    const regCode = generateRegistrationCode(regCodePrefix)

    // Generate QR code as base64 data URL
    const siteUrl = Deno.env.get('SITE_URL') || 'https://cankavre.org.np'
    const verifyUrl = `${siteUrl}/verify/${regCode}`
    const qrDataUrl: string = await QRCode.toDataURL(verifyUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#1a365d', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })

    // Upload QR image to Supabase Storage
    const qrBase64 = qrDataUrl.split(',')[1]
    const qrBuffer = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0))
    const qrPath = `${isEvent ? 'events' : 'programs'}/${idValue}/${regCode}.png`

    const { error: uploadErr } = await supabase.storage
      .from('qr-codes')
      .upload(qrPath, qrBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    let qrPublicUrl = qrDataUrl // fallback to data URL if storage upload fails
    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from('qr-codes').getPublicUrl(qrPath)
      qrPublicUrl = urlData.publicUrl
    } else {
      console.warn('QR upload to storage failed, using data URL:', uploadErr.message)
    }

    // Insert registration record
    const insertData: Record<string, unknown> = {
      [idField]: idValue,
      user_id: user_id || null,
      full_name,
      full_name_ne: full_name_ne || null,
      email,
      phone: phone || null,
      organization: organization || null,
      registration_code: regCode,
      qr_code_url: qrPublicUrl,
      qr_data: verifyUrl,
      status: 'registered',
    }

    if (isEvent) {
      insertData.designation = designation || null
      insertData.check_in_method = 'qr'
      insertData.registration_source = 'web'
    }

    const { data: registration, error: insertErr } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()
      .single()

    if (insertErr) {
      return new Response(
        JSON.stringify({ error: 'Failed to create registration: ' + insertErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Audit log
    await supabase.from('audit_log').insert({
      user_id: user_id || null,
      action: 'create',
      table_name: tableName,
      record_id: registration.id,
      new_data: { [idField]: idValue, full_name, email, registration_code: regCode },
      description: `Registered for ${isEvent ? 'event' : 'program'}: ${eventTitle}`,
    }).catch(() => { /* non-critical */ })

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(
      email,
      full_name,
      eventTitle,
      eventDate,
      eventLocation,
      regCode,
      qrDataUrl, // Send data URL for email attachment
    )

    return new Response(
      JSON.stringify({
        success: true,
        registration_code: regCode,
        qr_code_url: qrPublicUrl,
        qr_data_url: qrDataUrl,
        verify_url: verifyUrl,
        event_title: eventTitle,
        event_date: eventDate,
        event_location: eventLocation,
        email_sent: emailResult.sent,
        registration_id: registration.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Registration error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
