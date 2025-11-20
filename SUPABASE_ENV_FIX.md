# 🔧 Supabase Environment Variables Fix

## 🚨 Current Issue
The error "supabaseKey is required" occurs because your Supabase environment variables are not configured. The funnel creation is failing because it can't connect to the database.

## 🎯 Root Cause
The `.env.local` file is missing or has placeholder values instead of real Supabase credentials.

## ✅ Solution Steps

### Step 1: Create/Update Your `.env.local` File

Create a `.env.local` file in your project root with these variables:

```env
# Clerk Authentication (Required - Get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/agency/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/agency/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/agency"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/agency"

# Supabase Configuration (Required - Get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="localhost:3000"

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
NEXT_PLURA_PRODUCT_ID="prod_your_product_id_here"

# UploadThing (Optional - for file uploads)
UPLOADTHING_SECRET="sk_live_your_uploadthing_key_here"
UPLOADTHING_APP_ID="your_uploadthing_app_id_here"
```

### Step 2: Get Your Supabase Credentials

1. **Go to [supabase.com](https://supabase.com)** and create a free account
2. **Create a new project**:
   - Click "New Project"
   - Choose a name (e.g., "plura-agency")
   - Choose a strong database password
   - Select a region close to you
   - Click "Create new project"

3. **Get your API keys**:
   - Go to **Settings** → **API**
   - Copy the **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - Copy the **anon public** key (starts with `eyJ...`)
   - Copy the **service_role** key (starts with `eyJ...`)

### Step 3: Update Your Environment Variables

Replace the placeholder values in your `.env.local` file:

```env
# Replace these with your actual Supabase values:
NEXT_PUBLIC_SUPABASE_URL="https://your-actual-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

### Step 4: Set Up Database Schema

1. **In your Supabase dashboard**, go to **SQL Editor**
2. **Copy the contents** of the `schema.sql` file from your project
3. **Paste and run** the SQL to create all necessary tables

### Step 5: Get Clerk Credentials (If Not Already Done)

1. **Go to [clerk.com](https://clerk.com)** and create a free account
2. **Create a new application**:
   - Click "Create Application"
   - Choose a name (e.g., "Plura Agency")
   - Click "Create Application"

3. **Get your API keys**:
   - Go to **API Keys** in the dashboard
   - Copy the **Publishable Key** (starts with `pk_test_`)
   - Copy the **Secret Key** (starts with `sk_test_`)

4. **Update your `.env.local` file**:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"
```

### Step 6: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
bun run dev
```

## 🔍 How to Verify It's Working

After setting up the environment variables:

1. **Check the console** - you should see no more "supabaseKey is required" errors
2. **Try creating a funnel** - it should work without crashing
3. **Check Supabase dashboard** - you should see data being saved to the database

## 🚨 Important Notes

- **Never commit** your `.env.local` file to version control
- **Use real API keys** - placeholder values won't work
- **Restart the server** after changing environment variables
- **Check the console** for any remaining errors

## 🎯 Expected Result

After following these steps:
- ✅ **No more "supabaseKey is required" errors**
- ✅ **Funnel creation works without crashing**
- ✅ **Data is saved to the database**
- ✅ **All subaccount features work properly**

The funnel creation process should now work perfectly with proper database connectivity!
