import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string | string[]; // Resend supports string or array of strings
}

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
    from = 'Chapabiz <onboarding@resend.dev>', // Default sender, user should configure domain
    replyTo,
}: SendEmailProps) => {
    try {
        const response = await resend.emails.send({
            from,
            to,
            subject,
            html,
            text,
            reply_to: replyTo,
        });

        return response;
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        throw error;
    }
};

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
