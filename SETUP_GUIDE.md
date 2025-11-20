# 🚀 Quick Setup Guide for Plura Website Builder

## ⚡ Using Bun (Recommended)

This project uses **Bun** as the package manager. Make sure you have Bun installed:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server
bun run dev
```

## 🔑 Required Environment Setup

### 1. Create Environment File
Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

### 2. Get Your API Keys

#### Clerk Authentication (Required)
1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Go to "API Keys" in the dashboard
4. Copy your **Publishable Key** and **Secret Key**
5. Update your `.env.local` file

#### Supabase Database (Required)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public** key
5. Go to Settings > Database and copy your **service_role** key
6. Update your `.env.local` file

### 3. Database Schema Setup
After setting up Supabase:
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire content from `schema.sql` file
3. Paste and run it in the SQL Editor

## 🎯 Environment Variables Template

Your `.env.local` file should look like this:

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

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables** (see above)

3. **Start the development server:**
   ```bash
   bun run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Subaccount Sidebar Fix

The subaccount sidebar navigation has been fixed to work even without proper authentication setup. The sidebar will show fallback navigation links when authentication is not available.

### Available Subaccount Pages:
- **Overview** (`/subaccount/{id}`)
- **Funnels** (`/subaccount/{id}/funnels`)
- **Pipelines** (`/subaccount/{id}/pipelines`)
- **Contacts** (`/subaccount/{id}/contacts`)
- **Media** (`/subaccount/{id}/media`)
- **Automations** (`/subaccount/{id}/automations`)
- **Settings** (`/subaccount/{id}/settings`)

## 🐛 Troubleshooting

### If you see Clerk authentication errors:
1. Make sure your `.env.local` file has the correct Clerk keys
2. Check that your Clerk application is properly configured
3. The sidebar will still work with fallback data even if authentication fails

### If you see Supabase connection errors:
1. Make sure your `.env.local` file has the correct Supabase keys
2. Check that your Supabase project is active
3. The sidebar will still work with fallback data even if database connection fails

## 📝 Notes

- The project is designed to work with fallback data when authentication/database is not available
- All subaccount sidebar navigation links are now visible and functional
- You can test the application by navigating to any subaccount URL (e.g., `/subaccount/test-id`)
