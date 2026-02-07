# Team Invitation System Guide

## Overview

Your application has a **complete invitation system** that allows agency admins to invite teammates/employees to join and manage the agency dashboard.

## ✅ What's Already Working

### 1. **Invitation Form**
- Location: `src/components/forms/send-invitation.tsx`
- Agency admins can enter an email and select a role (AGENCY_ADMIN, SUBACCOUNT_USER, or SUBACCOUNT_GUEST)
- Form validates email and role

### 2. **Database Storage**
- Invitations are saved in the `Invitation` table with:
  - `email`: The invited user's email
  - `agencyId`: The agency they're being invited to
  - `role`: Their assigned role
  - `status`: PENDING, ACCEPTED, or REVOKED

### 3. **Automatic Invitation Acceptance**
- When a user signs up or logs in with an email that has a pending invitation, the system automatically:
  1. Detects the pending invitation
  2. Creates a `User` record linked to the agency
  3. Assigns the role from the invitation
  4. Updates the invitation status to ACCEPTED
  5. Redirects them to the agency dashboard

### 4. **Employee Assignment to Subaccounts**
- Once team members are in the system, they can be assigned to specific subaccounts
- Location: `src/app/(main)/agency/[agencyId]/all-subaccounts/_components/create-employee-form.tsx`

## 🔄 How It Works

### Step 1: Agency Admin Sends Invitation

1. **Admin navigates to Team/Settings page**
2. **Fills out invitation form:**
   - Enters teammate's email
   - Selects role (AGENCY_ADMIN, SUBACCOUNT_USER, or SUBACCOUNT_GUEST)
   - Clicks "Send Invitation"

3. **System saves invitation:**
   - Creates invitation record in database
   - Attempts to send email (see Email Setup below)

### Step 2: Teammate Receives Invitation

**Current State:** The invitation is saved in the database. An email API route exists at `/api/send-invitation-email` but needs an email service integration.

**Email Link Format:**
```
/agency/sign-up?email={user-email}&invitation={invitation-id}
```

### Step 3: Teammate Signs Up

1. **User clicks invitation link** → Goes to Clerk sign-up page
2. **User signs up with the invited email** → Clerk handles authentication
3. **After sign-up, user is redirected** → `/agency` page
4. **System automatically:**
   - Checks for pending invitation matching their email
   - Creates User record linked to agency
   - Assigns the role from invitation
   - Redirects to agency dashboard: `/agency/{agencyId}`

### Step 4: Access Granted

Once the invitation is accepted, the teammate:
- ✅ Has access to the agency dashboard
- ✅ Can view and manage based on their assigned role
- ✅ Can be assigned to specific subaccounts if needed

## 📧 Email Setup (Completed)

### Current Status
- ✅ Email API route created: `src/app/api/send-invitation-email/route.ts`
- ✅ Email template with invitation link ready
- ✅ **Email service integration completed (Resend)**

### Configuration
- Provider: **Resend**
- API Key: Configured in `.env`
- Utility: `src/lib/resend.ts`

### How it works
The `send-invitation-email` API route uses the `src/lib/resend.ts` utility to send emails via Resend.
It automatically handles:
- HTML content (invitation template)
- Plain text generation
- Sending to the recipient

### Environment Variables
The `RESEND_API_KEY` is already set in your `.env` file.
You can optionally configure:
- `SMTP_FROM_EMAIL` or `FROM_EMAIL`: The sender email address (default: `onboarding@resend.dev`)
- `SMTP_FROM_NAME` or `FROM_NAME`: The sender name (default: `Chapabiz`)


## 🎯 Where to Use the Invitation Form

### Option 1: Team Management Page
The team page at `src/app/(main)/agency/[agencyId]/team/page.tsx` currently shows mock data. You can integrate the `SendInvitation` component there:

```tsx
import SendInvitation from '@/components/forms/send-invitation'

// Add in the page
<SendInvitation agencyId={params.agencyId} />
```

### Option 2: Settings Page
Add invitation functionality to your agency settings page.

### Option 3: Custom Modal
The form can be opened in a modal from anywhere in the dashboard.

## 🔍 Code Locations

### Key Files:
- **Invitation Form**: `src/components/forms/send-invitation.tsx`
- **Invitation Logic**: `src/lib/queries.ts` → `sendInvitation()` function
- **Email API Route**: `src/app/api/send-invitation-email/route.ts`
- **Invitation Acceptance**: `src/lib/queries.ts` → `verifyAndAcceptInvitation()` function
- **Auto-accept on Login**: `src/app/(main)/agency/page.tsx` (updated to call `verifyAndAcceptInvitation()`)

### Database Tables:
- **Invitation**: Stores pending/accepted invitations
- **User**: Stores team members with their agencyId and role
- **SubAccountEmployee**: Links users to specific subaccounts

## 🚀 Quick Test Flow

### Without Email (Testing):
1. Admin manually creates invitation in database or uses form
2. Teammate signs up with that email at `/agency/sign-up`
3. System automatically links them to agency
4. They're redirected to `/agency/{agencyId}`

### With Email (Production):
1. Admin uses invitation form → Email sent automatically
2. Teammate receives email → Clicks invitation link
3. Teammate signs up → Automatically linked → Redirected to dashboard

## 📝 Roles Explained

- **AGENCY_ADMIN**: Full agency management access
- **SUBACCOUNT_USER**: Can work on assigned subaccounts
- **SUBACCOUNT_GUEST**: Limited access to specific subaccounts

## ✅ Summary

**Yes, employees are addable!** The system is ready - you just need to:
1. ✅ Integrate an email service (Resend recommended)
2. ✅ Optionally add SendInvitation form to team/settings page
3. ✅ Test the flow

The invitation acceptance happens automatically when users sign up with the invited email - no manual steps needed!

