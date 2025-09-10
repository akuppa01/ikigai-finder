#!/bin/bash

echo "🚀 Deploying Ikigai App to Vercel"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo "Please login to Vercel..."
vercel login

# Deploy to production
echo "Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "Your app will be available at the URL provided above."
echo ""
echo "Next steps:"
echo "1. Get your Gemini API key from https://aistudio.google.com/"
echo "2. Add environment variables in Vercel dashboard:"
echo "   - GOOGLE_AI_API_KEY=your_gemini_key"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://mlxytrccbfoggzgfiizx.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTIyNjIsImV4cCI6MjA3MDY2ODI2Mn0.jCFgdsb-tsrqWLtbc0iBOSEf8lvgYwWRwQ0UJpRk7RM"
echo "   - SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA5MjI2MiwiZXhwIjoyMDcwNjY4MjYyfQ.YT1gSWzCCceFx7tQfciFTv8lvgYwWRwQ0UJpRk7RM"
echo "3. Redeploy to apply environment variables"
