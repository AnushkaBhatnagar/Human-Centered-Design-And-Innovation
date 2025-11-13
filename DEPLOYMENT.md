# Deployment Guide - All 3 Prototypes on Vercel

This guide will help you deploy all three prototypes (Aspire, Wardrobe, and Thrift) to Vercel for free hosting with secure API key management.

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com - free)
- Your Anthropic Claude API key

## 🚀 Deployment Steps

### Step 1: Push to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   cd c:\Users\anush\Downloads\HCDI
   git init
   git add .
   git commit -m "Initial commit: All 3 prototypes with Vercel configuration"
   ```

2. **Connect to your GitHub repository:**
   ```bash
   git remote add origin https://github.com/AnushkaBhatnagar/Human-Centered-Design-And-Innovation.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" and connect with your GitHub account

2. **Import Your Project:**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose: `Human-Centered-Design-And-Innovation`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Leave as "Other"
   - **Root Directory:** Leave as `./`
   - **Build Command:** Leave blank
   - **Output Directory:** Leave blank
   - Click "Deploy"

### Step 3: Add Environment Variables

**IMPORTANT:** After first deployment, you need to add your API key:

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add the following variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Claude API key (starts with `sk-ant-api03-...`)
   - **Environment:** Select all (Production, Preview, Development)
5. Click "Save"
6. Go to "Deployments" tab and click "Redeploy" on the latest deployment

### Step 4: Access Your Deployed Sites

After successful deployment, your sites will be available at:

- **Prototype 1 (Aspire):** `https://your-project.vercel.app/prototype1-aspire/`
- **Prototype 2 (Wardrobe):** `https://your-project.vercel.app/prototype2-wardrobe/`
- **Prototype 3 (Thrift):** `https://your-project.vercel.app/prototype3-thrift/`

**Note:** Replace `your-project` with your actual Vercel project URL.

## 🔒 Security Features

✅ **API Key Protection:**
- Your API key is stored securely in Vercel's environment variables
- Never exposed to the browser or client-side code
- Never committed to GitHub

✅ **Serverless Functions:**
- `/api/aspire-ai` - Handles all AI requests for Prototype 1
- `/api/wardrobe-ai` - Handles all AI requests for Prototype 2
- `/api/test` - Test endpoint to verify API is working

## 📁 Project Structure

```
Human-Centered-Design-And-Innovation/
├── prototype1-aspire/          # Aspire app (AI-powered style evolution)
├── prototype2-wardrobe/        # Wardrobe app (outfit tracking & recommendations)
├── prototype3-thrift/          # Thrift & Swap app (no backend needed)
├── api/                        # Serverless functions (secure backend)
│   ├── aspire-ai.js           # API proxy for Prototype 1
│   ├── wardrobe-ai.js         # API proxy for Prototype 2
│   └── test.js                # Test endpoint
├── vercel.json                # Vercel configuration
├── .gitignore                 # Git ignore rules
└── DEPLOYMENT.md              # This file
```

## 🧪 Testing Your Deployment

1. **Test the API endpoint:**
   - Visit: `https://your-project.vercel.app/api/test`
   - You should see: `{"status":"ok","message":"API is working!",...}`

2. **Test Prototype 1 (Aspire):**
   - Visit: `https://your-project.vercel.app/prototype1-aspire/`
   - Enter your name
   - Add some aspirations and wardrobe items
   - Try the "Magic Match" or "Style Guide" AI features

3. **Test Prototype 2 (Wardrobe):**
   - Visit: `https://your-project.vercel.app/prototype2-wardrobe/`
   - Complete onboarding
   - Add outfit items
   - Try AI recommendations

4. **Test Prototype 3 (Thrift):**
   - Visit: `https://your-project.vercel.app/prototype3-thrift/`
   - Works without backend - fully static!

## 🔧 Troubleshooting

### Issue: AI features not working

**Solution:**
1. Check that environment variable is set correctly in Vercel
2. Redeploy after adding environment variables
3. Check browser console (F12) for error messages
4. Visit `/api/test` to verify API is working

### Issue: 404 errors on page refresh

**Solution:**
- This is normal for single-page apps
- The `vercel.json` configuration handles routing
- Make sure `vercel.json` was committed and deployed

### Issue: Changes not showing after push

**Solution:**
1. Vercel auto-deploys on push to main branch
2. Check "Deployments" tab in Vercel dashboard
3. Wait for deployment to complete (usually 1-2 minutes)
4. Clear browser cache (Ctrl+Shift+R)

## 📝 Making Updates

Whenever you make changes to your code:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically detect the push and deploy your changes!

## 💰 Vercel Free Tier Limits

✅ **Included in Free Tier:**
- 100 GB bandwidth per month
- Serverless function executions: 100 GB-hours
- Perfect for personal projects and prototypes
- Custom domain support
- Automatic HTTPS

## 🎉 Success!

Your 3 prototypes are now hosted for free with:
- ✅ Single repository
- ✅ Secure API keys
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ HTTPS enabled

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

## 🆘 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs in the dashboard
2. Verify environment variables are set correctly
3. Check browser console for errors (F12)
4. Ensure your API key is valid and has credits

---

**Created:** November 2025
**Last Updated:** November 13, 2025
