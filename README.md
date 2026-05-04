<div align="center">
  <img src="client/public/hermes-logo.png" alt="Hermes AI Logo" width="80" />
  <h1>Hermes AI — Customer Support Platform</h1>
  <p>Deploy an AI-powered support agent on your website in minutes.<br/>Train it once from your docs and tickets. Let it handle the rest.</p>

  ![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
  ![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

</div>

---

## Introduction

**Hermes AI** is a full-stack, production-ready AI customer support platform. Businesses can sign up, configure a support bot with their FAQs, instructions, and PDF knowledge base, and embed a chat widget on any website with a single `<script>` tag.

The bot answers customer queries automatically using **Groq's LLaMA 3** model, retrieves relevant context from past resolved tickets via a **RAG (Retrieval-Augmented Generation)** pipeline, and escalates complex issues to a human agent in real time via **Socket.IO**.

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Bot** | Powered by LLaMA 3.1 via Groq API. Answers accurately from FAQs and knowledge base |
| 📄 **PDF Knowledge Base** | Upload PDF docs — the bot reads and uses them to answer questions |
| ❓ **FAQ Manager** | Add/edit structured Q&A pairs for instant, no-AI-call answers |
| 🎫 **Ticket System** | Auto-escalates frustrated users to human agents with a full ticket trail |
| 👤 **Human Takeover** | Dashboard agents can take over any live conversation in real time |
| 🧠 **RAG Pipeline** | Retrieves relevant past ticket resolutions to improve bot accuracy over time |
| 📦 **Embeddable Widget** | One `<script>` tag embed for any website — auto-detects business config |
| 🔐 **Auth** | Email/password + Google OAuth signup and login |
| 📧 **Contact Form** | Sends emails via Gmail SMTP directly to your inbox |
| ⚡ **Real-time** | Socket.IO for live message updates between customer and agent |
| 🎨 **Premium UI** | Dark-mode dashboard and landing page with GSAP animations |

---

## Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Tailwind CSS v4 | Utility-first styling |
| GSAP 3 | Animations (hero, page transitions, letter effects) |
| Redux Toolkit | Global auth and bot config state |
| React Router v7 | Client-side routing |
| Socket.IO Client | Real-time chat updates |
| `@react-oauth/google` | Google One-Tap OAuth |
| Axios | HTTP client with cookie support |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js 18+ + Express v5 | HTTP server and API |
| MongoDB + Mongoose | Primary database |
| Socket.IO | Real-time bidirectional events |
| Groq SDK (OpenAI-compatible) | LLaMA 3.1 AI completions |
| JWT + HttpOnly Cookies | Stateless authentication |
| Helmet + express-rate-limit | Security hardening |
| Multer | PDF file upload handling |
| pdf-parse | Extract text from uploaded PDFs |
| Nodemailer | Gmail SMTP email delivery |
| Google Auth Library | Server-side Google token verification |
| Zod | Request validation |

---

## Project Structure

```
AI-Customer-Support/
├── client/                  # React frontend (Vite)
│   ├── public/              # Static assets (logo, favicon)
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # Reusable UI components
│       ├── hooks/           # Custom React hooks
│       ├── pages/           # Route pages
│       ├── services/        # API call wrappers
│       ├── store/           # Redux slices
│       └── data/            # Static data (team info etc.)
├── server/                  # Express backend
│   ├── public/              # widget.js (served as static)
│   └── src/
│       ├── config/          # Environment config + DB connection
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Auth middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers
│       ├── services/        # AI, RAG, summarization logic
│       ├── utils/           # Async handler, helpers
│       └── validators/      # Zod schemas
├── package.json             # Root — orchestrates build + start for deployment
└── .gitignore
```

---

## Local Development Setup

### Prerequisites

- **Node.js** ≥ 18 ([download](https://nodejs.org))
- **MongoDB Atlas** account (free tier works) — [create cluster](https://cloud.mongodb.com)
- **Groq API key** — [console.groq.com](https://console.groq.com)
- **Google Cloud Console** project with OAuth 2.0 credentials (for Google login)
- **Gmail App Password** (for contact form emails) — [create one](https://myaccount.google.com/apppasswords)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/kaijin07/AI-Customer-Support.git
cd AI-Customer-Support
```

---

### Step 2 — Configure environment variables

**Server** — create `server/.env`:

```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/chatbot

# Auth
JWT_SECRET=your_long_random_secret_min_32_chars
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# AI
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com

# Email (contact form)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```

**Client** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

---

### Step 3 — Install dependencies

```bash
# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

### Step 4 — Run in development mode

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → Vite dev server on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

### Step 5 — Google OAuth setup (for local dev)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Open your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   http://localhost:5000
   ```
4. Save and wait ~2 minutes for changes to propagate

---

### Step 6 — Test the embed widget

Build the client once, then test the widget via the Express server:

```bash
cd client && npm run build
```

Now open `http://localhost:5000` — the Express server serves the built React app and the widget is accessible at:

```
http://localhost:5000/api/embed/script?businessId=<YOUR_BUSINESS_ID>
```

To test the widget on a third-party site, create a test HTML file **served via a local HTTP server** (not opened as a file):

```html
<!-- test-embed.html -->
<script src="http://localhost:5000/api/embed/script?businessId=YOUR_BUSINESS_ID"></script>
```

```bash
# Serve it over HTTP (not file://)
npx serve . -p 3001
# Open http://localhost:3001/test-embed.html
```

> ⚠️ **Never open test HTML files by double-clicking.** Chrome blocks `file://` → `http://` requests. Always use a local HTTP server.

---

## API Reference (Quick)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new business account |
| `POST` | `/api/auth/login` | Public | Login with email + password |
| `POST` | `/api/auth/google` | Public | Google OAuth login |
| `GET` | `/api/auth/logout` | Public | Clear auth cookie |
| `GET` | `/api/auth/me` | Private | Get current user |
| `GET` | `/api/bot-config` | Private | Get bot configuration |
| `POST` | `/api/bot-config` | Private | Update FAQs, instructions, PDF |
| `POST` | `/api/chat/send` | Private | Send message to bot (dashboard preview) |
| `POST` | `/api/embed/chat/send` | Public | Widget message send |
| `GET` | `/api/embed/script` | Public | Get embed script JS |
| `GET` | `/api/tickets` | Private | List all escalation tickets |
| `GET` | `/api/conversations` | Private | List all widget conversations |
| `POST` | `/api/contact` | Public | Send contact form email |

---

## Deployment (Render)

> Full step-by-step deployment guide is in [`deployment_guide.md`](deployment_guide.md)

**Quick overview:**

1. Push your code to GitHub (without `.env` files or `client/dist/`)
2. Create a **Render Web Service** pointing to your repo
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm start`
5. Add all environment variables from the server `.env` on the Render dashboard
6. Set `NODE_ENV=production`, `API_URL` and `CLIENT_URL` to your Render URL
7. In Google Cloud Console, add your Render URL as an authorized JavaScript origin

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Team

| Name | Role | GitHub | LinkedIn |
|---|---|---|---|
| **Abhinav Anand** | Team Lead — Backend & System Design | [kaijin07](https://github.com/kaijin07) | [Profile](https://www.linkedin.com/in/abhinava-anand) |
| **Pallav Shrivastava** | AI & MLOps | [Pallavxs](https://github.com/Pallavxs) | [Profile](https://www.linkedin.com/in/pallav-shrivastava-867b43263/) |
| **Milan Neupane** | Frontend & UI/UX | [MIlAN-JS](https://github.com/MIlAN-JS) | [Profile](https://www.linkedin.com/in/itsmilancodesu) |

---

## License

This project is licensed under the **ISC License**.
#   H e r m e s _ A I  
 