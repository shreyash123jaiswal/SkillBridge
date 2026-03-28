import { useState } from "react";
import Auth from "./Auth";

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">

      {/* MAIN CONTENT */}
      <div className={`${showAuth ? "blur-sm" : ""} transition duration-300`}>

        {/* NAVBAR */}
        <nav className="flex justify-between items-center px-12 py-6">
          <h1 className="text-3xl font-bold text-purple-700">SkillBridge</h1>

          <div className="flex gap-4">
            
          </div>
        </nav>

        {/* HERO */}
        <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
          <h1 className="text-5xl font-bold text-gray-800">
            Unlock Your Dream Job with{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              AI Guidance
            </span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-xl">
            Identify your skill gaps, get personalized roadmaps, and accelerate your career.
          </p>

          <button
            onClick={() => setShowAuth(true)}
            className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
          >
            Get Started
          </button>
        </section>

        {/* FEATURES */}
      <section className="mt-28 px-12 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600">AI Skill Analysis</h3>
          <p className="text-gray-500 mt-2">Identify your strengths instantly.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600">Personalized Roadmaps</h3>
          <p className="text-gray-500 mt-2">Step-by-step learning paths.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600">Smart Recommendations</h3>
          <p className="text-gray-500 mt-2">AI suggestions to grow faster.</p>
        </div>
      </section>

      </div>

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">

          <div className="relative">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl z-50"
            >
              ✕
            </button>

            <Auth />
          </div>

        </div>
      )}

    </div>
  );
}