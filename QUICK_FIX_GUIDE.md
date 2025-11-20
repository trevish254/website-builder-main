# Quick Fix Guide - Agency Login Issues

## Issues Fixed ✅

1. **Database Schema Issue**: Fixed `SidebarOption` references to use correct table names (`AgencySidebarOption` and `SubAccountSidebarOption`)
2. **User Creation Issue**: Fixed null constraint violation by providing complete user data from Clerk
3. **Stripe Configuration**: Added graceful fallback when Stripe is not configured

## Required Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with these values:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/agency/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/agency/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/agency"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/agency"

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="localhost:3000"

# Stripe (Optional - will use fallback if not configured)
STRIPE_SECRET_KEY="sk_test_your_stripe_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
NEXT_PLURA_PRODUCT_ID="prod_your_product_id_here"

# UploadThing (Optional)
UPLOADTHING_SECRET="sk_live_your_uploadthing_key_here"
UPLOADTHING_APP_ID="your_uploadthing_app_id_here"
```

### 2. Get Your API Keys

#### Clerk Setup (Required)
1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Go to "API Keys" in the dashboard
4. Copy your **Publishable Key** and **Secret Key**
5. Update your `.env.local` file

#### Supabase Setup (Required)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public** key
5. Go to Settings > Database and copy your **service_role** key
6. Go to the SQL Editor in your Supabase dashboard
7. Copy the entire content from `schema.sql` file and run it
8. Update your `.env.local` file

### 3. Restart the Development Server
```bash
bun dev
```

## What's Fixed

- ✅ Database queries now use correct table names
- ✅ User creation provides all required fields
- ✅ Stripe errors are handled gracefully with fallbacks
- ✅ Application will work even without Stripe configuration

## Testing

1. Navigate to `http://localhost:3000`
2. Try to sign up/sign in
3. The authentication should work without database errors
4. Agency creation should work properly

## Notes

- The application will show "Stripe not configured" messages in the console, but this is normal if you haven't set up Stripe yet
- All core functionality (authentication, agency creation, user management) should work without Stripe
- You can add Stripe later for payment functionality
