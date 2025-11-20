import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  from: {
    email: string;
    name: string;
  };
  subject: string;
  html: string;
  text?: string;
  replyTo?: {
    email: string;
    name: string;
  };
}

// Create reusable transporter using SMTP
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.mailersend.net';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPassword = process.env.SMTP_PASSWORD || '';
  const smtpFromEmail = process.env.SMTP_FROM_EMAIL || process.env.MAILERSEND_FROM_EMAIL || 'info@yourdomain.com';
  const smtpFromName = process.env.SMTP_FROM_NAME || process.env.MAILERSEND_FROM_NAME || 'Your Agency Team';

  console.log('🔧 Creating SMTP transporter...', {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser ? `${smtpUser.substring(0, 5)}...` : 'NOT SET',
    password: smtpPassword ? '***SET***' : 'NOT SET',
  });

  if (!smtpUser || !smtpPassword) {
    const error = new Error('SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASSWORD in environment variables.');
    console.error('❌ SMTP Configuration Error:', error.message);
    throw error;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
    requireTLS: true,
  });

  console.log('✅ SMTP transporter created successfully');

  return transporter;
}

/**
 * Send an email using SMTP
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    console.log('📧 Preparing to send email via SMTP...', {
      to: options.to,
      from: options.from.email,
      subject: options.subject,
    });

    const transporter = getTransporter();

    // Get sender email and name from options or environment
    const fromEmail = options.from.email || process.env.SMTP_FROM_EMAIL || process.env.MAILERSEND_FROM_EMAIL || 'info@yourdomain.com';
    const fromName = options.from.name || process.env.SMTP_FROM_NAME || process.env.MAILERSEND_FROM_NAME || 'Your Agency Team';
    const replyToEmail = options.replyTo?.email || fromEmail;
    const replyToName = options.replyTo?.name || fromName;

    // Format "Name <email>" for from and replyTo
    const fromAddress = `${fromName} <${fromEmail}>`;
    const replyToAddress = `${replyToName} <${replyToEmail}>`;

    // Handle multiple recipients
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

    // Generate plain text version if not provided
    const textContent = options.text || htmlToText(options.html);

    const mailOptions = {
      from: fromAddress,
      to: toAddresses.join(', '),
      replyTo: replyToAddress,
      subject: options.subject,
      text: textContent,
      html: options.html,
    };

    console.log('📧 Sending email via SMTP...', {
      from: fromAddress,
      to: toAddresses,
      subject: options.subject,
    });

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP server connection verified');
    } catch (verifyError: any) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      throw new Error(`SMTP connection failed: ${verifyError.message || 'Unknown error'}`);
    }

    const result = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully via SMTP', {
      messageId: result.messageId,
      response: result.response,
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error: any) {
    console.error('❌ Error sending email via SMTP:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Extract plain text from HTML (helper function)
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
