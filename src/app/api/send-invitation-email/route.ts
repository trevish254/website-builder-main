import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail, htmlToText } from '@/lib/mailersend'

export async function POST(request: NextRequest) {
  console.log('📬 POST /api/send-invitation-email called')
  try {
    const body = await request.json()
    console.log('📬 Request body received:', { email: body.email, invitationId: body.invitationId, agencyId: body.agencyId, role: body.role })

    const { email, invitationId, agencyId, role } = body

    if (!email || !invitationId || !agencyId) {
      console.error('❌ Missing required fields:', { email: !!email, invitationId: !!invitationId, agencyId: !!agencyId })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get agency details for email
    const { data: agency, error: agencyError } = await supabase
      .from('Agency')
      .select('name')
      .eq('id', agencyId)
      .single()

    if (agencyError || !agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      )
    }

    // Generate invitation link
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const invitationLink = `${baseUrl}/agency/sign-up?email=${encodeURIComponent(email)}&invitation=${invitationId}`

    // Email content - Simple and clear invitation
    const emailSubject = `You've been invited to join Chapabiz`
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 20px; background-color: #ffffff; }
            .content { background-color: #f9fafb; padding: 40px 30px; border-radius: 8px; }
            .button { display: inline-block; background-color: #4F46E5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 30px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
            .link-text { word-break: break-all; color: #4F46E5; margin: 20px 0; padding: 10px; background-color: #f3f4f6; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello ${email.split('@')[0]},</p>
              <p style="font-size: 16px; margin-bottom: 20px;">You have been invited by the agency admin in <strong>Chapabiz</strong>.</p>
              <p style="font-size: 16px; margin-bottom: 30px;">Click this link to get started:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" class="button">Get Started</a>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">Or copy and paste this link into your browser:</p>
              <p class="link-text">${invitationLink}</p>
            </div>
            <div class="footer">
              <p>If you didn't request this invitation, you can safely ignore this email.</p>
              <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Chapabiz. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Generate plain text version of the email
    const emailText = htmlToText(emailBody)

    // Get sender email and name from environment or use defaults
    const senderEmail = process.env.SMTP_FROM_EMAIL || process.env.MAILERSEND_FROM_EMAIL || process.env.FROM_EMAIL || 'info@yourdomain.com'
    const senderName = process.env.SMTP_FROM_NAME || process.env.MAILERSEND_FROM_NAME || process.env.FROM_NAME || 'Chapabiz'

    // Send email using SMTP
    console.log('📧 Attempting to send email via SMTP...', {
      to: email,
      from: senderEmail,
      subject: emailSubject,
    })
    try {
      const result = await sendEmail({
        to: email,
        from: {
          email: senderEmail,
          name: senderName,
        },
        subject: emailSubject,
        html: emailBody,
        text: emailText,
        replyTo: {
          email: senderEmail,
          name: senderName,
        },
      })

      console.log('✅ Invitation email sent successfully to:', email)
      console.log('📧 Message ID:', result.messageId)

      return NextResponse.json({
        success: true,
        message: 'Invitation email sent successfully',
        messageId: result.messageId,
      })
    } catch (emailError: any) {
      console.error('❌ Error sending invitation email:', emailError)

      // Return error but don't fail the invitation creation
      // The invitation is already saved in the database
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send invitation email',
          details: emailError.message || 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending invitation email:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation email' },
      { status: 500 }
    )
  }
}

