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

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  getVerificationLinkEmailTemplate,
  FRONTEND_URL,
};
