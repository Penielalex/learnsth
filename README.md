# LearnSth - AI-Powered Learning & Personal Knowledge Base

**LearnSth** is an AI-driven learning platform designed to help users manage study paths and a structured "Second Brain." It uses **Google Gemini AI** and gamification to make learning more organized and engaging.

🚀 **Live Demo**: [https://learnsth.vercel.app](https://learnsth.vercel.app)

---

## ✨ Key Features

### 🧠 AI Learning Path Generator
Enter any topic you want to learn, and LearnSth uses **Google Gemini Pro** to generate a structured learning path. It includes topics, estimated timeframes, and curated external resources tailored to your goals.

### 🏛️ The Brain (Second Brain)
A dedicated space to organize your notes and knowledge.
- **Auto-Categorization**: AI scans your topic titles to categorize them automatically.
- **Hierarchical Structure**: Break down major topics into detailed **Subtopics**.
- **Rich Text Editing**: Clean study note editing with a Tiptap-based interface.

### 🎮 Gamification System
LearnSth features a progression layer to keep users motivated:
- **XP & Leveling**: Earn XP for actions like starting goals, completing topics, and writing notes.
- **Daily Streaks**: Track consistency with streaks and visual progress indicators.
- **Achievement Engine**: Unlock milestones as you reach learning goals.
- **Mastery Dashboard**: Track your progress and identify areas that need more focus.

### 💎 Design & UX
- **Modern UI**: A dark-themed interface with gold accents, designed for a focused experience.
- **Smooth Animations**: Built with **Framer Motion** for interactive feedback.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Google OAuth
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Penielalex/learnsth.git
   cd learnsth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root and add the following:
   ```env
   DATABASE_URL="your_postgresql_url"
   DIRECT_URL="your_direct_postgresql_url"
   BETTER_AUTH_SECRET="your_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed-achievements.ts
   ```

5. **Run locally**:
   ```bash
   npm run dev
   ```

---

## 📈 Roadmap
- [ ] AI-Generated Quizzes for every topic.
- [ ] Knowledge Graph visualization for "The Brain".
- [ ] Collaborative learning groups.
- [ ] PDF & Resource upload for AI-assisted note-taking.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed by Penielalex
