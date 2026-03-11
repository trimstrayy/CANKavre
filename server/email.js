const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email configuration - use environment variables in production
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || ''; // Use App Password for Gmail
const EMAIL_FROM = process.env.EMAIL_FROM || 'CAN Kavre <noreply@cankavre.org.np>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate secure verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Verification link email template
function getVerificationLinkEmailTemplate(verificationUrl, userName, language = 'en') {
  const isNepali = language === 'ne';
  
  return `
<!DOCTYPE html>
<html lang="${isNepali ? 'ne' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isNepali ? 'इमेल प्रमाणीकरण' : 'Verify Your Email'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #06b6d4 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${isNepali ? 'क्यान काभ्रे' : 'CAN Kavre'}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Computer Association of Nepal - Kavrepalanchok
              </p>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                ${isNepali ? 'स्वागत छ' : 'Welcome'}${userName ? `, ${userName}` : ''}! 🎉
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${isNepali 
                  ? 'क्यान काभ्रे सदस्य पोर्टलमा दर्ता गर्नुभएकोमा धन्यवाद! तपाईंको इमेल ठेगाना प्रमाणित गर्न कृपया तलको बटनमा क्लिक गर्नुहोस्।'
                  : 'Thank you for registering at CAN Kavre Member Portal! Please click the button below to verify your email address and activate your account.'
                }
              </p>
              
              <!-- Verify Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
                  ${isNepali ? '✓ इमेल प्रमाणित गर्नुहोस्' : '✓ Verify My Email'}
                </a>
              </div>
              
              <!-- Alternative link -->
              <p style="margin: 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${isNepali 
                  ? 'बटनले काम गरेन भने, यो लिंक तपाईंको ब्राउजरमा कपी गर्नुहोस्:'
                  : "If the button doesn't work, copy and paste this link into your browser:"
                }
              </p>
              <div style="background-color: #f3f4f6; padding: 12px; border-radius: 8px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #7c3aed; font-size: 12px; text-decoration: none;">${verificationUrl}</a>
              </div>
              
              <!-- Timer warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⏰ ${isNepali ? 'महत्त्वपूर्ण:' : 'Important:'}</strong> 
                  ${isNepali 
                    ? 'यो लिंक २४ घण्टामा समाप्त हुनेछ।'
                    : 'This link will expire in 24 hours.'
                  }
                </p>
              </div>
              
              <!-- Security notice -->
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                🔒 ${isNepali 
                  ? 'यदि तपाईंले यो खाता सिर्जना गर्नुभएको छैन भने, कृपया यो इमेल बेवास्ता गर्नुहोस्।'
                  : "If you didn't create this account, please ignore this email."
                }
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                      ${isNepali 
                        ? 'क्यान काभ्रे, काभ्रेपलाञ्चोक, नेपाल'
                        : 'CAN Kavre, Kavrepalanchok, Nepal'
                      }
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Computer Association of Nepal - Kavre Chapter
                    </p>
                    <p style="margin: 8px 0 0 0;">
                      <a href="mailto:cankavre@gmail.com" style="color: #7c3aed; text-decoration: none; font-size: 12px;">cankavre@gmail.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Unsubscribe text -->
        <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
          ${isNepali 
            ? 'यो इमेल तपाईंको खाता दर्ताको कारण पठाइएको हो।'
            : 'This email was sent because you registered for an account.'
          }
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Send verification email with link
async function sendVerificationEmail(email, token, userName, language = 'en') {
  const isNepali = language === 'ne';
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  // Check if email credentials are configured
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('⚠️  Email not configured. Verification link:');
    console.log(`   ${verificationUrl}`);
    console.log('   To enable email, set EMAIL_USER and EMAIL_PASS environment variables.');
    return { success: true, mock: true, verificationUrl }; // Return URL for development
  }
  
  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: isNepali 
      ? 'क्यान काभ्रे - तपाईंको इमेल प्रमाणित गर्नुहोस्'
      : 'CAN Kavre - Verify Your Email Address',
    html: getVerificationLinkEmailTemplate(verificationUrl, userName, language),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw new Error('Failed to send verification email');
  }
}

// Program registration confirmation email template
function getProgramRegistrationEmailTemplate(program, userName, userEmail, registrationCode, language = 'en', programUrl = '') {
  const isNepali = language === 'ne';
  const deadlineDisplay = program.deadline
    ? new Date(program.deadline).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return `
<!DOCTYPE html>
<html lang="${isNepali ? 'ne' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isNepali ? 'कार्यक्रम दर्ता पुष्टिकरण' : 'Program Registration Confirmation'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">CAN Kavre</h1>
              <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">
                Computer Association of Nepal — Kavrepalanchok
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">

              <p style="margin: 0 0 4px 0; font-size: 13px; color: #16a34a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">
                ${isNepali ? 'दर्ता सफल' : 'Registration Confirmed'}
              </p>
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827;">
                ${isNepali ? `नमस्ते, ${userName || 'तपाईं'}!` : `Hello, ${userName || 'there'}!`}
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                ${isNepali
                  ? `तपाईंले <strong>${program.titleNe || program.title}</strong> कार्यक्रममा सफलतापूर्वक दर्ता गर्नुभयो।`
                  : `You have successfully registered for <strong>${program.title}</strong>.`}
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px 0;">

              <!-- Registrant details -->
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.07em;">
                ${isNepali ? 'दर्ताकर्ता विवरण' : 'Registrant Details'}
              </p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 0 0 28px 0;">
                <tr>
                  <td style="padding: 5px 0; color: #6b7280; width: 140px;">${isNepali ? 'नाम' : 'Name'}</td>
                  <td style="padding: 5px 0; color: #111827; font-weight: 600;">${userName || '—'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">${isNepali ? 'इमेल' : 'Email'}</td>
                  <td style="padding: 5px 0; color: #111827; font-weight: 600;">${userEmail || '—'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">${isNepali ? 'दर्ता कोड' : 'Registration Code'}</td>
                  <td style="padding: 5px 0; color: #111827; font-weight: 600; font-family: monospace;">${registrationCode}</td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px 0;">

              <!-- Program details -->
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.07em;">
                ${isNepali ? 'कार्यक्रम विवरण' : 'Program Details'}
              </p>
              <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #111827;">
                ${isNepali ? program.titleNe || program.title : program.title}
              </p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; line-height: 1.7;">
                ${isNepali ? program.descriptionNe || program.description : program.description}
              </p>
              ${program.category ? `
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;">
                <span style="color: #6b7280;">${isNepali ? 'वर्ग:' : 'Category:'}</span>&nbsp;${program.category}
              </p>` : ''}
              ${deadlineDisplay ? `
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;">
                <span style="color: #6b7280;">${isNepali ? 'म्याद:' : 'Deadline:'}</span>&nbsp;${deadlineDisplay}
              </p>` : ''}
              ${programUrl ? `
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #374151;">
                <span style="color: #6b7280;">${isNepali ? 'विवरण:' : 'Details:'}</span>&nbsp;
                <a href="${programUrl}" style="color: #1e3a5f; font-weight: 600; text-decoration: underline;">${programUrl}</a>
              </p>` : ''}

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

              <!-- QR Code section -->
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.07em;">
                ${isNepali ? 'उपस्थिति QR कोड' : 'Attendance QR Code'}
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151; line-height: 1.7;">
                ${isNepali
                  ? 'कृपया तलको QR कोड कार्यक्रममा आउँदा ल्याउनुहोस्। कार्यक्रम स्थलमा स्टाफले यो स्क्यान गरेर तपाईंको उपस्थिति दर्ता गर्नेछन्। <strong>यो QR कोड प्रवेशका लागि अनिवार्य छ।</strong>'
                  : 'Please bring this QR code to the program venue. Staff will scan it at the entrance to record your attendance. <strong>This QR code is required for entry.</strong>'}
              </p>
              <div style="text-align: center; margin: 0 0 12px 0;">
                <img src="cid:qrcode" alt="Attendance QR Code" width="200" height="200"
                  style="display: block; margin: 0 auto; border: 1px solid #e5e7eb; padding: 8px;">
              </div>
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center; font-family: monospace;">
                ${registrationCode}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">CAN Kavre, Kavrepalanchok, Nepal</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Computer Association of Nepal — Kavre Chapter
              </p>
              <p style="margin: 0;">
                <a href="mailto:cankavre@gmail.com" style="font-size: 12px; color: #6b7280; text-decoration: none;">cankavre@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
        <p style="margin: 16px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">
          ${isNepali ? 'यो इमेल तपाईंले कार्यक्रम दर्ता गर्दा पठाइएको हो। यसको जवाफ नदिनुहोस्।' : 'This email was sent because you registered for a program at CAN Kavre. Please do not reply to this email.'}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;}

// Send program registration confirmation email
async function sendProgramRegistrationEmail(email, program, userName, language = 'en', qrBuffer = null, registrationCode = '') {
  const isNepali = language === 'ne';
  const programUrl = `${FRONTEND_URL}/programs`;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('⚠️  Email not configured. Registration confirmation for:', program.title);
    console.log(`   Registrant: ${userName} <${email}> | Code: ${registrationCode}`);
    return { success: true, mock: true };
  }

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: isNepali
      ? `${program.titleNe || program.title} कार्यक्रममा दर्ता पुष्टिकरण`
      : `Registration Confirmation — ${program.title} | CAN Kavre`,
    html: getProgramRegistrationEmailTemplate(program, userName, email, registrationCode, language, programUrl),
    attachments: qrBuffer ? [{
      filename: `qr-${registrationCode}.png`,
      content: qrBuffer,
      cid: 'qrcode',
    }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration confirmation email sent to ${email} (code: ${registrationCode})`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send registration confirmation email:', error.message);
    throw new Error('Failed to send registration confirmation email');
  }
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  getVerificationLinkEmailTemplate,
  sendProgramRegistrationEmail,
  getProgramRegistrationEmailTemplate,
  FRONTEND_URL,
};
