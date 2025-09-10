# 🚀 Quick Deploy to Vercel (FREE!)

## Method 1: Vercel Web Interface (Easiest)

1. **Go to Vercel**: https://vercel.com/new (already opened)
2. **Sign up/Login** with GitHub, Google, or email
3. **Import Project**:
   - Click "Import Git Repository"
   - Connect your GitHub account
   - Select this repository
4. **Deploy**: Click "Deploy" (takes 2-3 minutes)

## Method 2: Command Line

```bash
# Run this in your terminal:
./deploy.sh
```

## Method 3: Manual Steps

1. **Get Gemini API Key** (FREE):
   - Go to https://aistudio.google.com/
   - Sign in with Google
   - Click "Get API Key"
   - Copy the key

2. **Deploy to Vercel**:

   ```bash
   npx vercel login
   npx vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add these variables:
   ```
   GOOGLE_AI_API_KEY=your_gemini_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://mlxytrccbfoggzgfiizx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTIyNjIsImV4cCI6MjA3MDY2ODI2Mn0.jCFgdsb-tsrqWLtbc0iBOSEf8lvgYwWRwQ0UJpRk7RM
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA5MjI2MiwiZXhwIjoyMDcwNjY4MjYyfQ.YT1gSWzCCceFx7tQfciFTv8lvgYwWRwQ0UJpRk7RM
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=any_random_string
   ```

## 🎉 You'll Get:

- **Free hosting** on Vercel
- **Free domain** like `your-app.vercel.app`
- **Free SSL certificate**
- **Global CDN**
- **Automatic deployments**

## 💰 Total Cost: $0/month!

Your Ikigai app is ready to go live! 🚀
