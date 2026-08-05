# Every QRCode Generator Pro 🚀

A production-ready, feature-packed QR Code Generator and Analytics SaaS platform built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## 🌟 Key Features

- **Rich QR Code Generation**: Generate custom QR codes for URLs, WiFi, VCards, Text, Emails, SMS, WhatsApp, Dynamic QR codes, and more.
- **Advanced Customization**: Customize colors, gradients, eye shapes, center logos, error correction levels, and frames.
- **Analytics & Tracking**: Real-time scan counts, device distributions, geographic insights, and referral tracking for dynamic QR codes.
- **Folder & Organization System**: Group, tag, and manage QR codes effortlessly inside custom folders.
- **Preset Templates**: Apply professionally designed visual templates with one click.
- **Authentication & User Profiles**: Full user signup, signin, password reset, and profile management using Supabase Auth.
- **Built-in Billing Limits UI**: Subscription tier indicators and usage limit feedback.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS 4, Lucide Icons, Recharts
- **Backend / BaaS**: Supabase (Auth, Database, Storage)
- **Deployment**: Netlify

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/devvrushabh/every-qrcode-generator-pro.git
cd every-qrcode-generator-pro

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your Supabase details:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🌐 Deploying to Netlify

This project is pre-configured and optimized for seamless deployment on **Netlify**!

### Step 1: Connect GitHub Repository
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Choose **GitHub** and select `devvrushabh/every-qrcode-generator-pro`.

### Step 2: Build Settings
Netlify will automatically detect `netlify.toml` configuration:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 3: Configure Environment Variables
In the Netlify Site Configuration (under **Site settings** > **Environment variables**), add:
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Anon Key

### Step 4: Deploy
Click **Deploy site**. Netlify will build the static output and handle SPA route redirects automatically.

---

## 📜 Database Migrations

Supabase SQL migration files are included under `supabase/migrations/`:
- `20260806_init_supabase.sql`: Initial schema (profiles, folders, qr_codes, scan_analytics).
- `20260806_qr_image_storage.sql`: Storage bucket setup for QR code logo uploads.

To apply these to your Supabase project, execute the SQL files in your Supabase SQL Editor.

---

## 📄 License

ISC License.
