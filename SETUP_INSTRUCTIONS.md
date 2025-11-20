# Complete Setup Instructions for Plura Website Builder

## 🚨 Current Issue
The application is failing because the environment variables contain placeholder values instead of real API keys. You need to set up the following services:

## 📋 Required Services Setup

### 1. Clerk Authentication Setup
1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Go to "API Keys" in the dashboard
4. Copy your **Publishable Key** and **Secret Key**
5. Update your `.env.local` file with these values

### 2. Supabase Database Setup
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public** key
5. Go to Settings > Database and copy your **service_role** key
6. Update your `.env.local` file with these values

### 3. Database Schema Setup
After setting up Supabase:
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire content from `schema.sql` file
3. Paste and run it in the SQL Editor

### 4. Stripe Setup (Optional - for payments)
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the dashboard
3. Update your `.env.local` file with these values

### 5. UploadThing Setup (Optional - for file uploads)
1. Go to [uploadthing.com](https://uploadthing.com) and create an account
2. Get your API keys from the dashboard
3. Update your `.env.local` file with these values

## 🔧 Environment Variables Template

Your `.env.local` file should look like this with REAL values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_51Abc123..."  # Real key from Clerk
CLERK_SECRET_KEY="sk_test_51Abc123..."                   # Real key from Clerk

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/agency/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/agency/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/agency"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/agency"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://abcdefgh.supabase.co"     # Real URL from Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."    # Real key from Supabase
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIs..."        # Real key from Supabase

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="localhost:3000"

# Stripe (Optional)
STRIPE_SECRET_KEY="sk_test_51Abc123..."                     # Real key from Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51Abc123..."   # Real key from Stripe
STRIPE_WEBHOOK_SECRET="whsec_51Abc123..."                   # Real webhook secret
NEXT_PLURA_PRODUCT_ID="prod_51Abc123..."                    # Real product ID

# UploadThing (Optional)
UPLOADTHING_SECRET="sk_live_51Abc123..."                    # Real key from UploadThing
UPLOADTHING_APP_ID="your-app-id"                            # Real app ID
```

## 🚀 Quick Start Steps

1. **Set up Clerk** (Required)
   - Create account at clerk.com
   - Create new application
   - Copy publishable and secret keys
   - Update `.env.local`

2. **Set up Supabase** (Required)
   - Create account at supabase.com
   - Create new project
   - Copy URL and keys
   - Run the SQL schema from `schema.sql`
   - Update `.env.local`

3. **Restart the development server**
   ```bash
   bun dev
   ```

4. **Test the application**
   - Navigate to `http://localhost:3000`
   - Try to sign up/sign in
   - Check if the authentication works

## 🔍 Troubleshooting

### Clerk Errors
- Make sure your publishable key starts with `pk_test_` or `pk_live_`
- Make sure your secret key starts with `sk_test_` or `sk_live_`
- Ensure the keys are from the same Clerk application

### Supabase Errors
- Make sure your URL is correct and accessible
- Verify the anon key and service role key are correct
- Check that the database schema has been applied

### Database Connection Issues
- Verify your Supabase project is active
- Check that the schema.sql has been executed
- Ensure your service role key has proper permissions

## 📝 Next Steps After Setup

1. Create your first agency account
2. Set up your first subaccount
3. Configure your dashboard settings
4. Test the full authentication flow

## 🆘 Need Help?

If you're still having issues:
1. Check the terminal for specific error messages
2. Verify all environment variables are set correctly
3. Ensure all services (Clerk, Supabase) are properly configured
4. Check that the database schema has been applied

The application should work perfectly once you have real API keys in your `.env.local` file!
