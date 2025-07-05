# 🧠 StackFlow — A StackOverflow Clone with Next.js & Appwrite

**🌐 Live Demo:** [https://stackflow-appwrite-clone-fullstack-with-next-js-completed-dljt.vercel.app/](https://stackflow-appwrite-clone-fullstack-with-next-js-completed-dljt.vercel.app/)

A modern full-stack Question & Answer platform inspired by StackOverflow, built with **Next.js 14**, **Appwrite**, **Tailwind CSS**, and a clean, responsive UI. Supports user authentication, markdown-rich questions/answers, voting, comments, profiles, and more.

---

## 🚀 Features

✅ Ask and answer technical questions  
✅ Vote on answers & questions  
✅ Auth (Register/Login/Logout) via Appwrite  
✅ Markdown editor support for rich text  
✅ Edit/delete questions and answers  
✅ User profiles, activity, and contributions  
✅ Tooltips, toasts, animation effects  
✅ Responsive, dark-mode-friendly UI  
✅ Deployed on Vercel, server runtime via Node.js

---

## 🛠️ Tech Stack

| Layer       | Tools |
|------------|-------|
| Frontend   | **Next.js 14 App Router**, React 18, TailwindCSS 4, Framer Motion |
| Backend    | **Appwrite 17** (Auth, DB, Storage), `node-appwrite` SDK |
| UI/UX      | `@uiw/react-md-editor`, Lucide Icons, Radix UI, `clsx`, `tailwind-merge` |
| State Mgmt | Zustand |
| Animations | Framer Motion, tw-animate-css |
| Deploy     | Vercel + `.env` integration |
| Tooling    | ESLint, TypeScript, PostCSS, Autoprefixer |

---

## 📁 Project Structure

.
├── app/ # Next.js app router pages
│ ├── login, register # Auth routes
│ ├── questions/ # Question detail, edit, ask routes
│ └── users/ # User profile, votes, answers, etc.
├── components/ # UI and layout components
├── models/ # Appwrite config and helpers
├── public/ # Static assets
├── styles/ # Global CSS/Tailwind
├── .env.local # Environment variables
└── next.config.js # Next.js config

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/stackflow.git
cd stackflow
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment
Rename .env.sample → .env.local and add:

env
Copy
Edit
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_db_id
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
4. Start Dev Server
bash
Copy
Edit
npm run dev
Visit: http://localhost:3000

🧪 Scripts
Command	Action
npm run dev	Starts local dev server
npm run build	Builds for production
npm run lint	Lints code using ESLint
npm start	Starts Next.js in prod mode

🖼️ Screenshots
Login Page	Ask Question	Q&A Page

(Replace with real image links if needed)

📌 Todo / Improvements
 Add tags and related question suggestion

 Admin moderation panel

 Infinite scroll for answers

 Better error handling UI

 Upvote/downvote summary for users

 Social OAuth (Google, GitHub)

📜 License
MIT © 2024 Sayan Mallick
