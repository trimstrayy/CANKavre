# Email Templates for CAN Kavre OTP Verification

## Setup Instructions

### 1. Configure Email Provider

Add these environment variables to your server:

```bash
# Gmail (recommended for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use Gmail App Password, not regular password

# Custom SMTP
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-username
EMAIL_PASS=your-password
EMAIL_FROM="CAN Kavre <noreply@cankavre.org.np>"
```

### 2. Gmail App Password Setup
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Create a new app password for "Mail"
5. Use this 16-character password as `EMAIL_PASS`

---

## Email Template Preview

The verification email looks like this:

```
┌─────────────────────────────────────────────────────────┐
│  [Gradient Header: Blue → Purple → Cyan]                │
│                                                         │
│     🛡️  CAN Kavre                                        │
│     Computer Association of Nepal - Kavrepalanchok      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Hello, [User Name]! 👋                                 │
│                                                         │
│  A verification code was requested to sign in to your   │
│  CAN Kavre account. Please use the security code below: │
│                                                         │
│  ┌─────────────────────────────────────────┐           │
│  │     YOUR VERIFICATION CODE              │           │
│  │                                         │           │
│  │        1 2 3 4 5 6                      │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  ⚠️ Important: This code will expire in 10 minutes.     │
│                                                         │
│  🔒 If you didn't request this code, please ignore      │
│     this email. Your account is safe.                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  CAN Kavre, Kavrepalanchok, Nepal                       │
│  © 2026 Computer Association of Nepal - Kavre Chapter   │
│  cankavre@gmail.com                                     │
└─────────────────────────────────────────────────────────┘
```

---

## HTML Email Template (English)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
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
                CAN Kavre
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
                Hello, {{USER_NAME}}! 👋
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                A verification code was requested to sign in to your CAN Kavre account. Please use the security code below:
              </p>
              
              <!-- OTP Code Box -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); border: 2px dashed #7c3aed; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e40af; font-family: 'Courier New', monospace;">
                  {{OTP_CODE}}
                </div>
              </div>
              
              <!-- Timer warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⏰ Important:</strong> 
                  This code will expire in 10 minutes. Please use it promptly.
                </p>
              </div>
              
              <!-- Security notice -->
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                🔒 If you didn't request this code, please ignore this email. Your account is safe.
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
                      CAN Kavre, Kavrepalanchok, Nepal
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © 2026 Computer Association of Nepal - Kavre Chapter
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
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## HTML Email Template (Nepali)

```html
<!DOCTYPE html>
<html lang="ne">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>इमेल प्रमाणीकरण</title>
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
                क्यान काभ्रे
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
                नमस्ते, {{USER_NAME}}! 👋
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                तपाईंको क्यान काभ्रे खातामा लगइन गर्न प्रमाणीकरण कोड अनुरोध गरियो। कृपया तलको सुरक्षा कोड प्रयोग गर्नुहोस्:
              </p>
              
              <!-- OTP Code Box -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); border: 2px dashed #7c3aed; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  तपाईंको प्रमाणीकरण कोड
                </p>
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e40af; font-family: 'Courier New', monospace;">
                  {{OTP_CODE}}
                </div>
              </div>
              
              <!-- Timer warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⏰ महत्त्वपूर्ण:</strong> 
                  यो कोड १० मिनेटमा समाप्त हुनेछ। कृपया तुरुन्तै प्रयोग गर्नुहोस्।
                </p>
              </div>
              
              <!-- Security notice -->
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                🔒 यदि तपाईंले यो अनुरोध गर्नुभएको छैन भने, कृपया यो इमेललाई बेवास्ता गर्नुहोस्। तपाईंको खाता सुरक्षित छ।
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
                      क्यान काभ्रे, काभ्रेपलाञ्चोक, नेपाल
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © २०२६ Computer Association of Nepal - Kavre Chapter
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
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Customization

Replace these placeholders in the templates:
- `{{USER_NAME}}` - User's full name
- `{{OTP_CODE}}` - 6-digit verification code

## Color Scheme

The email uses CAN Kavre's brand colors:
- Primary Blue: `#1e40af`
- Purple Accent: `#7c3aed`
- Cyan Accent: `#06b6d4`
- Warning Yellow: `#f59e0b`
