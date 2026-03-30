import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Profile from "../components/Profile";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import CompanyDetails from "../components/CompanyDetails";
import Roadmap from "../components/Roadmap";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("hero"); // default
  const [selectedCompany, setSelectedCompany] = useState(null); // store selected company

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50">

      {/* 🔹 SIDEBAR */}
      <Sidebar active={activeSection} setActive={setActiveSection} />

      {/* 🔹 MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 🔹 NAVBAR */}
        <Navbar
          setActiveSection={setActiveSection}
          setSelectedCompany={setSelectedCompany} // pass setter
        />

        {/* 🔹 MAIN CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          {activeSection === "profile" && <Profile />}
          {activeSection === "resume" && <ResumeAnalyzer />}
          {activeSection === "roadmap" && <Roadmap />}
          {activeSection === "hero" && (
            <Hero 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          )}
          {activeSection === "company" && selectedCompany && (
            <CompanyDetails selectedCompany={selectedCompany} />
          )}
        </div>

      </div>
    </div>
  );
}