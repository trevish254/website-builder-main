# 🚀 Quick Setup Guide - Fix Supabase Error

## 🚨 Current Error
```
Error: supabaseKey is required.
```

This error occurs because your Supabase environment variables are not configured.

## ⚡ Quick Fix (5 minutes)

### Step 1: Create Environment File
Create a `.env.local` file in your project root:

```bash
# In your project root directory
touch .env.local
```

### Step 2: Get Supabase Credentials (2 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login (free)
3. Click "New Project"
4. Choose a name: "plura-agency"
5. Set a strong password
6. Click "Create new project"
7. Wait for project to be ready (1-2 minutes)

### Step 3: Copy Your Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these 3 values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

### Step 4: Update Your `.env.local` File
Replace the placeholder values with your actual keys:

```env
# Supabase Configuration (Replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL="https://your-actual-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Clerk Authentication (Get from clerk.com if not already done)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/agency/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/agency/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/agency"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/agency"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="localhost:3000"
```

### Step 5: Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `schema.sql` from your project
3. Paste and click "Run"

### Step 6: Restart Server
```bash
# Stop current server (Ctrl+C)
bun run dev
```

## ✅ Verify It's Working

1. **Check console** - no more "supabaseKey is required" errors
2. **Try creating a funnel** - should work without crashing
3. **Check Supabase dashboard** - you should see data being saved

## 🎯 Expected Result

After following these steps:
- ✅ **No more Supabase errors**
- ✅ **Funnel creation works**
- ✅ **All database operations work**
- ✅ **Subaccount features work properly**

## 🆘 Still Having Issues?

If you're still getting errors:
1. **Check your `.env.local` file** - make sure it's in the project root
2. **Restart your development server** after making changes
3. **Check the console** for any error messages
4. **Verify your Supabase keys** are correct

The funnel creation should now work perfectly! 🎉
