import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, otp: string) {
  // Use Ethereal fake SMTP for development if real credentials are not provided
  // In production, configure SMTP host, port, user, and pass in environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER || 'test@ethereal.email',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Connexa" <noreply@connexa.com>',
    to,
    subject: 'Your Connexa Login OTP',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Connexa Login Verification</h2>
        <p>Your One-Time Password (OTP) for logging in is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e293b; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    // In dev, log the preview URL if we're using Ethereal
    if (!process.env.SMTP_HOST) {
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // If we fail because of bogus ethereal credentials, let's just log the OTP 
    // to the console for a smoother development process if the user hasn't set up SMTP.
    console.warn(`[DEV MODE] Failed to send email. Assuming dev mode. Here is the OTP: ${otp}`);
  }
}
