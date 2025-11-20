# Database Setup Instructions

## Quick Setup for Development

### Option 1: Use Supabase (Recommended - Easy Setup)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database and copy your connection string
4. Update your `.env` file with:
```
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Option 2: Use Local Supabase
1. Install Supabase CLI:
```bash
bun add -g supabase
```

2. Initialize Supabase locally:
```bash
supabase init
supabase start
```

### After Setting Up Database:
1. Run the SQL schema in your Supabase dashboard
2. No additional setup needed - Supabase handles everything!

## Environment Variables Template

Create a `.env` file in the root directory with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Clerk Authentication (Get these from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/agency/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/agency/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/agency"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/agency"

# App URL
NEXT_PUBLIC_URL="http://localhost:3000"

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PLURA_PRODUCT_ID="prod_..."

# UploadThing (Optional - for file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

## Supabase Setup Steps

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com) and sign up
2. **Create New Project**: Click "New Project" and choose a name
3. **Get Database URL**: 
   - Go to Settings > Database
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
4. **Update .env**: Add the DATABASE_URL to your `.env` file
5. **Run Migrations**: Execute the commands below

## Quick Start Commands

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to Supabase
bunx prisma db push

# (Optional) Create migration files
bunx prisma migrate dev --name init
```

## Benefits of Supabase

- ✅ **Free tier** with generous limits
- ✅ **Built-in authentication** (can replace Clerk if needed)
- ✅ **Real-time subscriptions**
- ✅ **Automatic backups**
- ✅ **Web dashboard** for data management
- ✅ **Edge functions** for serverless functions
- ✅ **Storage** for file uploads
