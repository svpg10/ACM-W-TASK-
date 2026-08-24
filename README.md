# ACM × AI Intelligence Benchmark Quiz

&gt; An interactive, highly-stylized benchmark quiz covering ACM history, Turing Awards, and core Artificial Intelligence concepts with real-time leaderboard and live scoring.

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?logo=express)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.18.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel)](https://acm-w-task.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Question Bank](#question-bank)
- [Rank System](#rank-system)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

The **ACM × AI Intelligence Benchmark Quiz** is a full-stack interactive web application designed to test and benchmark knowledge across two domains:

1. **ACM Heritage** — Turing Awards, SIGs (SIGGRAPH, SIGAI), ACM Digital Library, Code of Ethics, and computing history
2. **AI & Machine Learning** — Neural networks, backpropagation, transformers, supervised/unsupervised learning, reinforcement learning, and computer vision

The app features a dark, warm-minimalist aesthetic inspired by premium agency design, with real-time scoring, a persistent leaderboard, printable certificates, and immersive audio feedback.

**Live Demo:** [acm-w-task.vercel.app](https://acm-w-task.vercel.app)

---

## Features

### Quiz Modes
| Mode | Description | Questions | Timer |
|------|-------------|-----------|-------|
| **Standard Benchmark** | Balanced mix of ACM + AI questions | 10 | Free |
| **ACM Heritage Focus** | Pure ACM history, SIGs, ethics, Turing Awards | 10 | Free |
| **AI & ML Essentials** | Neural nets, transformers, RL, vision | 10 | Free |
| **Speedrun Blitz** | High-intensity 60-second countdown challenge | 10 | 60s |

### Core Features
- **Instant Feedback** — Real-time correct/incorrect indicators with detailed explanations and fun facts
- **Keyboard Shortcuts** — Answer with `[A/B/C/D]` or `[1/2/3/4]`, navigate with arrow keys, submit with Enter
- **Audio Engine** — Custom Web Audio API synthesizer for clicks, correct/wrong chimes, and celebration fanfare
- **Confetti Celebration** — Canvas-confetti burst on high scores (60%+)
- **Printable Certificates** — Generate and print official-looking benchmark certificates
- **Persistent Leaderboard** — Dual persistence: Firebase Firestore (real-time) + Express JSON file fallback
- **Study Vault** — Browse all questions with search, filter, and expandable explanations
- **Player Registration** — Name modal with quick pioneer suggestions (Ada, Alan, Turing, etc.)
- **Responsive Design** — Fully responsive from mobile to desktop with custom scrollbar styling

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.0.1 | UI framework with StrictMode |
| TypeScript | ~5.8.2 | Type-safe development |
| Vite | 6.2.3 | Build tool & dev server |
| Tailwind CSS | v4.1.14 | Utility-first styling |
| Lucide React | 0.546.0 | Icon library |
| Motion | 12.23.24 | Animation library |
| Canvas Confetti | 1.9.4 | Celebration effects |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 4.21.2 | REST API server |
| Node.js | 20+ | Runtime |
| tsx | 4.21.0 | TypeScript execution |
| esbuild | 0.25.0 | Production bundling |

### External Services
| Service | Purpose |
|---------|---------|
| **Firebase Firestore** | Real-time leaderboard database |
| **Firebase Auth** | Google OAuth provider (ready) |
| **Google Fonts** | Clash Display, Cabinet Grotesk, Space Grotesk |
| **Google GenAI SDK** | AI integration capability (@google/genai) |
| **Vercel** | Production hosting |

---


### Data Flow
1. **User** opens the app in a browser → Vite serves the React SPA
2. **React App** (`App.tsx`) manages view state: `home` → `quiz` → `results` → `leaderboard` → `study`
3. **QuizCard** handles question rendering, timer, keyboard input, and instant feedback
4. **ScoreBoard** submits results via `POST /api/quiz/submit` and `POST /api/leaderboard`
5. **Server** validates answers, computes scores, ranks, and persists to both:
   - **Firebase Firestore** (primary, real-time)
   - **JSON file** (`leaderboard_db.json`) as server-side fallback
6. **Leaderboard** subscribes to Firestore for live updates and fetches from REST API as fallback

---

| Method | Endpoint                     | Description                                                       |
| ------ | ---------------------------- | ----------------------------------------------------------------- |
| `GET`  | `/api/health`                | Health check — returns server status                              |
| `GET`  | `/api/questions?category=`   | Fetch questions (optional category filter: `all`, `acm`, `ai`)    |
| `POST` | `/api/quiz/submit`           | Submit quiz answers for validation & scoring                      |
| `GET`  | `/api/leaderboard?category=` | Get leaderboard entries (optional category filter)                |
| `POST` | `/api/leaderboard`           | Save a new leaderboard entry                                      |
| `GET`  | `/api/stats`                 | Get community statistics (total quizzes, avg accuracy, top score) |

