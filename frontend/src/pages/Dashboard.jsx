import { useState } from "react";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("hero"); // default to Hero

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50">

      {/* 🔹 SIDEBAR */}
      <Sidebar active={activeSection} setActive={setActiveSection} />

      {/* 🔹 MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 🔹 NAVBAR */}
        <Navbar />

        {/* 🔹 MAIN CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "profile" && <Profile />}
          {activeSection === "resume" && <ResumeAnalyzer />}
          {activeSection === "hero" && (
            <Hero 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} // ✅ pass setter to Hero
            />
          )}
        </div>

      </div>
    </div>
  );
}