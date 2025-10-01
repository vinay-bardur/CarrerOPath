CareerOPath Frontend
Installation & Setup
Install Dependencies
npm install
Development Server
npm run dev
Build for Production
npm run build
Preview Production Build
npm run preview
Linting
npm run lint
Package Dependencies
Core Framework
npm install react react-dom
npm install @vitejs/plugin-react
npm install vite
Styling & UI
npm install tailwindcss postcss autoprefixer
npm install framer-motion
Authentication & Database
npm install @supabase/supabase-js
Audio & Utilities
npm install howler
npm install @types/howler
npm install axios
Development Dependencies
npm install --save-dev eslint
npm install --save-dev @eslint/js
npm install --save-dev eslint-plugin-react
npm install --save-dev eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-refresh
npm install --save-dev globals
Environment Setup
Create .env file
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Available Scripts
├── main.jsx # React entry point ├── index.css # Global styles ├── components/ # React components │ ├── Auth.jsx # Authentication │ ├── Home.jsx # Landing page │ ├── Quiz.jsx # Assessment quiz


## Deployment to Vercel

- **Monorepo root directory**
  - If your repo contains both backend and frontend, set Vercel Project → Settings → General → Root Directory to `careeropath/frontend`.

- **Framework & Build**
  - Framework preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`

- **Environment Variables (Vercel → Settings → Environment Variables)**
  - `VITE_SUPABASE_URL` = your Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
  - Add to Preview and Production environments.

- **SPA Routing**
  - `vercel.json` at `careeropath/frontend/vercel.json` includes:
    - `rewrites` to send all routes to `/index.html` so deep links like `/quiz` or `/results` work.

- **Supabase Auth**
  - Supabase Dashboard → Authentication → URL Configuration
    - Site URL: `https://YOUR_APP.vercel.app`
    - Additional redirect: `https://*-YOUR_APP.vercel.app` (for preview)
    - Local dev: `http://localhost:5173`

- **Deploy**
  - Commit and push; Vercel auto-builds.
  - Or trigger a manual deploy from Vercel.

- **Troubleshooting**
  - 404 on client routes → ensure `vercel.json` rewrite exists.
  - Supabase errors → confirm env vars exist in the deployment environment and match `.env.example`.
  - Check Vercel build and runtime logs for details.
