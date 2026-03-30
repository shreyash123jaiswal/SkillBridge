import { useState } from "react";
import { FaUpload, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";

export default function Profile() {
  const [file, setFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      if (uploadedFile.type === "application/pdf") {
        setPdfURL(URL.createObjectURL(uploadedFile));
      } else {
        setPdfURL(null);
        alert("Preview is available only for PDF files.");
      }
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">

      {/* 🔹 LEFT PANEL: User Info */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-3xl font-bold">
            S
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Shreyash</h2>
            <p className="text-gray-500">B.Tech, Computer Science</p>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3">
          <p className="flex items-center gap-3 text-gray-700">
            <FaUser className="text-purple-500" /> <span>Name:</span> Shreyash
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaGraduationCap className="text-purple-500" /> <span>Education:</span> B.Tech, Computer Science
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-purple-500" /> <span>Email:</span> shreyash@example.com
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-purple-500" /> <span>Phone:</span> +91 98765 43210
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <FaMapMarkerAlt className="text-purple-500" /> <span>Location:</span> Chennai, India
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <span className="font-semibold">Age:</span> 20
          </p>
        </div>

        {/* Resume Upload */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <FaUpload className="text-purple-500" />
            <span>{file ? file.name : "Upload Resume (PDF only)"}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept=".pdf"
            />
          </label>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* 🔹 RIGHT PANEL: Resume Preview */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4">Resume</h2>

        {pdfURL ? (
          <iframe
            src={pdfURL}
            title="Resume Preview"
            className="w-full h-[600px] border border-gray-300 rounded-lg"
          />
        ) : (
          <p className="text-gray-500">No resume uploaded. Upload a PDF resume on the left panel to preview it here.</p>
        )}
      </div>
    </div>
  );
}