import { useState } from "react";
import { FaUpload, FaLightbulb, FaStar } from "react-icons/fa";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [strength, setStrength] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [insights, setInsights] = useState([]);

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    // PDF preview
    if (uploadedFile.type === "application/pdf") {
      setPdfURL(URL.createObjectURL(uploadedFile));
    } else {
      setPdfURL(null);
    }

    // Dummy AI analysis (replace with actual AI integration)
    const dummyStrength = Math.floor(Math.random() * 50 + 50); // 50-100%
    setStrength(dummyStrength);

    const dummySuggestions = [
      "Include more keywords related to your target job.",
      "Highlight relevant projects and internships.",
      "Keep your resume concise and structured.",
      "Add measurable achievements where possible.",
    ];
    setSuggestions(dummySuggestions);

    const dummySkills = ["JavaScript", "React", "Node.js", "MongoDB", "Teamwork"];
    setSkills(dummySkills);

    const dummyInsights = [
      "Certified AWS Solutions Architect",
      "Completed Google Data Analytics Certificate",
      "Participated in International Hackathon 2025",
    ];
    setInsights(dummyInsights);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">

      {/* 🔹 Left Panel: Upload + Analysis */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold mb-4">Resume Analyzer</h2>

        {/* Upload */}
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaUpload className="text-purple-500" />
          <span>{file ? file.name : "Choose a resume file (PDF only)"}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf"
          />
        </label>

        {/* Resume Strength */}
        {file && (
          <div>
            <p className="mb-2 font-semibold text-gray-700">
              Resume Strength:
            </p>
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
              <div
                className={`h-5 rounded-full text-white text-xs text-center flex items-center justify-center ${
                  strength > 75
                    ? "bg-green-500"
                    : strength > 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${strength}%` }}
              >
                {strength}%
              </div>
            </div>

            {/* Suggestions */}
            <h3 className="font-semibold mt-4 mb-2 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" /> Suggestions:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {suggestions.map((s, index) => (
                <li key={index}>{s}</li>
              ))}
            </ul>

            {/* Key Skills */}
            <h3 className="font-semibold mt-4 mb-2">Key Skills Detected:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Key Insights */}
            <h3 className="font-semibold mt-4 mb-2 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Key Insights:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔹 Right Panel: PDF Preview */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
        {pdfURL ? (
          <iframe
            src={pdfURL}
            title="Resume Preview"
            className="w-full h-[600px] border border-gray-300 rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border border-gray-300 rounded-lg text-gray-500">
            <span className="text-5xl mb-2">📄</span>
            <span>Preview available for PDF files only</span>
          </div>
        )}
      </div>
    </div>
  );
}