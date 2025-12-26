# 508 Ministry Dashboard - Deployment Guide

## Repository
GitHub: https://github.com/AiMagic5000/508ministry-dashboard

## Local Development
```bash
npm install
npm run dev
# Access at http://localhost:3000
```

## Deploy to Coolify (Recommended)

### Step 1: Add New Application in Coolify
1. Go to http://72.60.119.182:8000
2. Login to Coolify
3. Click **+ Add New Resource** → **Application**
4. Select **GitHub** as source
5. Connect repository: `AiMagic5000/508ministry-dashboard`
6. Branch: `main`

### Step 2: Configure Build Settings
- **Build Pack**: Nixpacks (auto-detected) or Dockerfile
- **Build Command**: `npm run build`
- **Start Command**: `node .next/standalone/server.js`
- **Port**: 3000

### Step 3: Environment Variables
Add these environment variables in Coolify:

```
NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-wo4k0wck8cg84c04gcc008sw.72.60.119.182.sslip.io
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjY2MzQ2MCwiZXhwIjo0OTIyMzM3MDYwLCJyb2xlIjoiYW5vbiJ9.fLfOPCCOzy_GCLEodievfvuLJlqGjmVUvYwlsdeoGjI
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjY2MzQ2MCwiZXhwIjo0OTIyMzM3MDYwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.7gWbmyxKPkqxziU-N-tsEFB6E6wHUpbAwq4F1Uzo1EY
NEXT_PUBLIC_APP_URL=https://508ministry-dashboard.72.60.119.182.sslip.io
```

### Step 4: Deploy
Click **Deploy** and wait for build to complete.

### Step 5: Setup Domain (Optional)
- Add custom domain in Coolify
- Or use auto-generated: `508ministry-dashboard.72.60.119.182.sslip.io`

## Database Setup

### Required Tables
Run the SQL migration in your Supabase SQL Editor:
- File: `supabase/migrations/001_initial_schema.sql`

### Existing Tables (from Cognabase):
- trust_data
- donations
- volunteers
- documents

### Tables to Create:
- partner_churches
- distributions
- farm_production
- schedule_events
- activity_log

## Docker Deployment (Alternative)

```bash
# Build
docker build -t 508ministry-dashboard .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-wo4k0wck8cg84c04gcc008sw.72.60.119.182.sslip.io \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  508ministry-dashboard
```

## Features

### All 16 Navigation Items:
1. **Dashboard** - Overview with stats and quick actions
2. **Trust Data** - Ministry legal entity information
3. **1000lbs of Food** - Food production goal tracker
4. **Farm Production** - Crop management and harvest tracking
5. **Donations** - Donation records with receipt tracking
6. **Partners** - Partner church management
7. **Distribution** - Food distribution records
8. **Volunteers** - Volunteer database and hours tracking
9. **Schedule** - Event calendar and scheduling
10. **AI Activity Log** - System activity and AI operations
11. **Meetings** - Board meeting management
12. **Documents** - Document library
13. **Tax Documents** - Tax-related file storage
14. **Compliance** - 508(c)(1)(A) compliance checklist
15. **Settings** - Application configuration
16. **Help** - Help and support resources

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom color palette)
- Supabase/Cognabase (database)
- Docker (containerization)

## Support
Contact: outreach@508ministry.com
