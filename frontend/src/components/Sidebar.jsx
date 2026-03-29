import { useState } from "react";
import {
    FaUser,
    FaFileAlt,
    FaBook,
    FaLayerGroup,
    FaBars,
} from "react-icons/fa";

export default function Sidebar({ active, setActive }) {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "resume", label: "Resume Analyzer", icon: <FaFileAlt /> },
        { id: "enrolled", label: "Enrolled Courses", icon: <FaBook /> },
        { id: "allCourses", label: "All Courses", icon: <FaLayerGroup /> },
    ];

    return (
        <div
            className={`h-screen ${collapsed ? "w-20" : "w-64"
                } bg-gradient-to-b from-purple-600 to-blue-500 text-white flex flex-col transition-all duration-300 shadow-lg`}
        >
            {/* 🔹 TOP SECTION */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
  {!collapsed && (
    <button
      onClick={() => setActive("hero")} // <-- set to "hero" to render Hero.jsx
      className="text-xl font-bold tracking-wide hover:text-gray-200 transition"
    >
      Dashboard
    </button>
  )}

  <FaBars
    className="cursor-pointer"
    onClick={() => setCollapsed(!collapsed)}
  />
</div>

            {/* 🔹 PROFILE CARD */}
            <div className="flex flex-col items-center py-6 border-b border-white/20">
                <img
                    src="/src/assets/img.webp"
                    alt="profile"
                    className="w-40 h-40 rounded-full border-2 border-white shadow-md"
                />

                {!collapsed && (
                    <>
                        <h3 className="mt-2 font-semibold">Shreyash</h3>
                        <p className="text-sm text-white/80">Student</p>
                    </>
                )}
            </div>

            {/* 🔹 MENU ITEMS */}
            <div className="flex-1 mt-4 space-y-2 px-2">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all
                ${active === item.id
                                ? "bg-white text-purple-600 shadow-md"
                                : "hover:bg-white/20"
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>

                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                ))}
            </div>

            {/* 🔹 FOOTER (OPTIONAL FUTURE USE) */}
            <div className="p-4 border-t border-white/20 text-sm text-center text-white/70">
                {!collapsed && "SkillBridge © 2026"}
            </div>
        </div>
    );
}