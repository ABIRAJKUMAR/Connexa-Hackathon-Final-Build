🚀 Connexa - AI-Powered Peer Learning Platform
Connexa is a dynamic full-stack ecosystem designed to bridge the gap between learners and mentors through AI-driven matchmaking and real-time collaboration. Built during a 24-hour hackathon and reached the Finals.

🌐 Live Demo
https://connexa-nu.vercel.app/dashboard

✨ Key Features
AI Matchmaking: Uses Google Gemini (Antigravity) to pair students with mentors based on specific skill gaps.

Skill Verification: An automated MCQ-based technical review system to ensure mentor quality.

Real-time Sessions: Seamlessly integrated Jitsi Meet SDK for live P2P video teaching.

Interactive AI Chatbot: Context-aware assistant to resolve quick coding and conceptual doubts.

Token Economy: A built-in credit system to gamify the learning process.

🛠️ Tech Stack
Frontend: Next.js 14, Tailwind CSS, Lucide Icons

Backend: Node.js, Next.js API Routes

Database: MongoDB Atlas (Cloud)

AI Integration: Google Gemini 1.5 Flash

Deployment: Vercel & GitHub

🛡️ Hackathon "Pivot" & Problem Solving
During the final hours of the hackathon, our authentication system hit a critical bottleneck. Instead of stalling the project, we implemented a Seamless Guest Access flow.

The Challenge: Auth crash preventing dashboard access.

The Solution: Refactored middleware and state management to bypass the login block while maintaining a "Mocked" user session for the demo.

The Result: This allowed us to successfully present our core AI and Live-session features, leading us to the Hackathon Finals.

🚀 How to Run Locally
Clone the repo: git clone https://github.com/ABIRAJKUMAR/Connexa-Hackathon-Final-Build

Install dependencies: npm install

Set up .env.local with your MONGODB_URI and GEMINI_API_KEY.

Run the dev server: npm run dev
