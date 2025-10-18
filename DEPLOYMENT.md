# Deployment Guide

## 1. Deploy Backend to Render

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Web Service:**
   - Go to render.com → New → Web Service
   - Connect your GitHub repo
   - Root Directory: `careeropath/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables in Render:**
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_KEY`: Your Supabase anon key

4. **Copy the Render URL** (e.g., `https://your-app.onrender.com`)

## 2. Update Frontend for Production

1. **Update `.env.production`:**
   ```
   VITE_BACKEND_URL=https://your-render-backend-url.onrender.com
   ```

2. **Deploy to Vercel:**
   ```bash
   cd careeropath/frontend
   vercel --prod
   ```

## 3. Test Production

- Visit your Vercel URL
- Login and test the complete flow
- Check browser console for any errors