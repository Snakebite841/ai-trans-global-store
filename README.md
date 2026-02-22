# Premium SaaS E-Commerce

This is the boilerplate code for a premium, scalable, production-ready SaaS E-Commerce application.
It is built with React, Vite, Tailwind CSS (Glassmorphism), Node.js, Express, and Firebase.

## 🚀 Features

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, React Router, Context API
- **Backend**: Node.js, Express.js, Firebase Admin SDK
- **Database / Auth**: Firebase Firestore & Firebase Auth
- **Design**: Premium Glassmorphism UI (Dark overlay, indigo/cyan glow)

## 📦 Project Structure

```
WEB-TECK
│
├── frontend/             # React Vite App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/              # Node.js Express Server
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   ├── server.js
│   └── package.json
│
├── FIREBASE_SETUP.md     # Setup & Schema Guide
├── ROADMAP.md            # Actionable steps
└── README.md             # Detailed Instructions
```

## 🛠️ How to run locally

1. **Clone/Navigate** into `WEB-TECK` directory.
2. Setup environment variables:
   - Copy `frontend/.env.template` to `frontend/.env` and fill Firebase details.
   - Copy `backend/.env.template` to `backend/.env` and set PORT and Service Account.
3. Install dependencies:
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm install
   npm run dev
   ```
   ```bash
   # Terminal 2: Backend
   cd backend
   npm install
   npm run dev
   ```
4. Access the App:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 🌍 Deployment Instructions

### Frontend (Deploy on Vercel or Netlify)
1. Push your repository to GitHub.
2. Go to Vercel/Netlify.
3. Import the repository, select the `frontend` directory as the Root.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add your `.env` variables in their settings panel.
7. Deploy! ✨

### Backend (Deploy on Render or Heroku)
1. Go to Render.com.
2. Create a new Web Service.
3. Select the repository, set Root directory to `backend`.
4. Build command: `npm install`
5. Run command: `npm start`
6. Add your Environment variables (Set `PORT` to typical `10000` or auto, add Firebase Service Account vars).
7. Deploy! ✨
