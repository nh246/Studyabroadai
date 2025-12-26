import ChatInterface from "../components/ChatInterface";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              GoAbroadAI
            </h1>
            <p className="text-gray-600 mt-2">
              Your Personal AI Study Abroad Consultant
            </p>
          </div>
          <Link to="/profile">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-800 font-medium transition">
              Update Profile
            </button>
          </Link>
        </header>

        <ChatInterface />
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
           Deployed on Vercel (React SPA)
        </footer>
      </div>
    </main>
  );
}
