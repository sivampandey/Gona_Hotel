import { Resend } from 'resend';

export const sendPasswordResetEmail = async (userEmail: string, resetToken: string): Promise<boolean> => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Gona Hotel Concierge <onboarding@resend.dev>';
  const frontendUrl = process.env.FRONTEND_URL || 'https://gona-hotel.vercel.app';

  if (!resendApiKey || !resendApiKey.trim()) {
    console.warn('⚠️ [RESEND CONFIG] RESEND_API_KEY is not configured in environment variables. Email dispatch skipped.');
    return false;
  }

  const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

  try {
    const resend = new Resend(resendApiKey);

    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #F7F4EB; border: 2px solid #D4AF37; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #0D3B29; padding: 32px 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">GONA HOTEL & RESORT</h1>
          <p style="color: #F3E5AB; font-size: 12px; margin-top: 6px; letter-spacing: 1px;">ROYAL CONCIERGE SECURITY ASSISTANCE</p>
        </div>
        <div style="padding: 32px 24px; color: #1E293B;">
          <h2 style="color: #0D3B29; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            We received a request to reset the password for your Gona Hotel account.
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

    const { data, error } = await resend.emails.send({
      from: resendFromEmail,
      to: [userEmail],
      subject: 'Gona Hotel - Password Reset Request',
      html: htmlContent
    });

    if (error) {
      console.error('❌ Resend API Email Delivery Error:', error.message || error);
      return false;
    }

    console.log(`✅ Password reset email successfully dispatched via Resend API (ID: ${data?.id || 'ok'})`);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to dispatch password reset email via Resend API:', error?.message || error);
    return false;
  }
};
