import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (userEmail: string, resetToken: string): Promise<boolean> => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || '"Gona Hotel Concierge" <noreply@gonahotel.com>';
  const frontendUrl = process.env.FRONTEND_URL || 'https://gona-hotel.vercel.app';

  const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

  console.log(`=======================================================`);
  console.log(`[PASSWORD RESET REQUESTED]`);
  console.log(`Recipient Email: ${userEmail}`);
  console.log(`Reset Token Link: ${resetLink}`);
  console.log(`=======================================================`);

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('⚠️ SMTP server configuration missing. Email dispatch skipped in local/dev mode.');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #F7F4EB; border: 2px solid #D4AF37; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0D3B29; padding: 32px 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">GONA HOTEL & RESORT</h1>
          <p style="color: #F3E5AB; font-size: 12px; margin-top: 6px; letter-spacing: 1px;">ROYAL CONCIERGE SECURITY ASSISTANCE</p>
        </div>
        <div style="padding: 32px 24px; color: #1E293B;">
          <h2 style="color: #0D3B29; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            We received a request to reset the password for your Gona Hotel account associated with <strong>${userEmail}</strong>.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Please click the official button below to set a new password for your account:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #D4AF37; color: #0D3B29; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 12px; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #64748B; background-color: #FFFFFF; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
            ⏳ <strong>Notice:</strong> This password reset link is valid for <strong>30 minutes</strong> and can only be used once.
          </p>
          <p style="font-size: 12px; color: #64748B; margin-top: 16px;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="background-color: #0D3B29; padding: 16px 24px; text-align: center; font-size: 11px; color: #94A3B8;">
          <p style="margin: 0; color: #D4AF37;">Gona Hotel, Restaurant & Farm Estate</p>
          <p style="margin: 4px 0 0 0;">Chunar Road, Sarso, Rajgarh, Mirzapur, UP - 231201</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: userEmail,
      subject: 'Gona Hotel - Password Reset Request',
      html: htmlContent
    });

    console.log(`✅ Password reset email successfully dispatched to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to dispatch password reset email via SMTP:', error);
    return false;
  }
};
