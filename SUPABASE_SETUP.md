# 🚀 Supabase Setup Instructions

## Current Issue
Your Supabase environment variables are still using placeholder values, which is why no data is being saved to the database. The app is working with fallback/mock data instead of real database operations.

## 🔧 How to Fix This

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `plura-agency` (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

### Step 2: Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 3: Update Your Environment Variables
Replace the placeholder values in your `.env.local` file:

```env
# Supabase Configuration (Replace with your real values)
NEXT_PUBLIC_SUPABASE_URL="https://your-actual-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"
```

### Step 4: Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `schema.sql` (from your project)
3. Click "Run" to create all the necessary tables

### Step 5: Restart Your Development Server
```bash
bun dev
```

## 🔍 How to Verify It's Working

After setting up Supabase properly:

1. **Create an agency** using the form
2. **Check Supabase dashboard** → **Table Editor** → **Agency** table
3. **You should see your agency data** saved in the database
4. **Check the terminal** - you should see no more "TypeError: fetch failed" errors

## 🚨 Important Notes

- **Never commit real API keys** to version control
- **Use environment variables** for all sensitive data
- **Test locally first** before deploying
- **Keep your service role key secure** - it has admin access

## 📊 What Gets Saved

When Supabase is properly configured, the following data will be saved:
- ✅ **User profiles** and authentication data
- ✅ **Agency information** (name, email, address, etc.)
- ✅ **Logo uploads** (when UploadThing is configured)
- ✅ **Sub-accounts** and team members
- ✅ **Notifications** and activity logs
- ✅ **Funnel data** and pages

## 🆘 If You Need Help

If you're having trouble with Supabase setup:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Verify your environment variables are correct
3. Make sure your database schema is properly set up
4. Check the terminal for any error messages

## 🎯 Next Steps

Once Supabase is configured:
1. Your data will be **actually saved** to the database
2. You'll have **full functionality** instead of mock data
3. You can **manage your data** through the Supabase dashboard
4. The app will work **exactly as intended**
