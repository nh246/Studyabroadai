# StudyAbroadAi - Frontend

# StudyAbroadAi - Backend Repo - https://github.com/nh246/StudyAbroadAiBackend

AI-powered study abroad consultation platform built with **Vite + React + TypeScript**.

---

## 🚀 Tech Stack

- ⚛️ React 18
- ⚡ Vite
- 📘 TypeScript
- 🎨 TailwindCSS
- 🔀 React Router

---

## 📋 Prerequisites

- Node.js 18+
- Backend API running (see backend repo)

---

## 🛠️ Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🏗️ Build for Production

```bash
npm run build
```

Output → `dist/` folder

---

## 🌐 Deploy to Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - **Framework**: Vite
   - Click **Deploy**

3. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `your-backend-url`
   - Redeploy

### Using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   └── ProfileForm.tsx
│   └── pages/
│       ├── Home.tsx
│       └── Profile.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── vercel.json          # Vercel config
```

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` or `https://your-backend.workers.dev` |

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

---

## 🆘 Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API not connecting:**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check CORS settings in backend

---

## 📄 License

MIT
