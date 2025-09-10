# 🚀 Quick Deployment Steps

## Step 1: Get Gemini API Key (FREE!)
1. Go to https://aistudio.google.com/ (already opened)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the API key

## Step 2: Deploy to Vercel
1. Complete the Vercel login in your terminal
2. Run: `npx vercel --prod`
3. Follow the prompts

## Step 3: Set Environment Variables in Vercel
After deployment, go to your Vercel dashboard and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://mlxytrccbfoggzgfiizx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTIyNjIsImV4cCI6MjA3MDY2ODI2Mn0.jCFgdsb-tsrqWLtbc0iBOSEf8lvgYwWRwQ0UJpRk7RM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA5MjI2MiwiZXhwIjoyMDcwNjY4MjYyfQ.YT1gSWzCCceFx7tQfciFTv8lvgYwWRwQ0UJpRk7RM
GOOGLE_AI_API_KEY=your_gemini_api_key_here
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=any_random_string_here
```

## Step 4: Test Your Live Site
Your site will be available at: `https://your-app-name.vercel.app`

## Cost: $0/month! 🎉
- Vercel: Free tier (100GB bandwidth, 1000 builds/month)
- Supabase: Free tier (500MB database, 50,000 requests/month)
- Gemini: Free tier (15 requests/minute, 1M tokens/day)
