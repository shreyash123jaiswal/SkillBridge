import { useState } from "react";
import { FaUpload, FaLightbulb, FaStar } from "react-icons/fa";
import { api } from "../api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [strength, setStrength] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    // ✅ PDF preview
    if (uploadedFile.type === "application/pdf") {
      setPdfURL(URL.createObjectURL(uploadedFile));
    } else {
      setPdfURL(null);
    }

    try {
      const result = await api.uploadResume(uploadedFile);

      // ✅ Strength logic
      const skillsCount = result.skills?.length || 0;
      const strengthPercent = Math.min(100, skillsCount * 10 + 50);
      setStrength(strengthPercent);

      // ✅ Suggestions
      const suggestionsArr = [];
      if (result.recommended_roles?.length > 0) {
        suggestionsArr.push(
          `Consider roles like: ${result.recommended_roles
            .slice(0, 3)
            .map((r) => r.role)
            .join(", ")}`
        );
      }
      suggestionsArr.push(
        "Include more keywords related to your target job.",
        "Highlight relevant projects and internships.",
        "Keep your resume concise and structured.",
        "Add measurable achievements where possible."
      );

      setSuggestions(suggestionsArr);

      // ✅ NEW: set skills & insights from API
      setSkills(result.skills || []);
      setInsights(result.insights || []);

    } catch (error) {
      console.error("Upload error:", error);
      setStrength(0);
      setSuggestions(["Error analyzing resume. Please try again."]);
      setSkills([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">

      {/* 🔹 Left Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold mb-4">Resume Analyzer</h2>

        {/* Upload */}
        <label className={`flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <FaUpload className="text-purple-500" />
          <span>{loading ? "Analyzing..." : file ? file.name : "Choose a resume file"}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
            disabled={loading}
          />
        </label>

        {/* Results */}
        {file && (
          <div>
            {/* Strength */}
            <p className="mb-2 font-semibold text-gray-700">
              Resume Strength:
            </p>
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
              <div
                className={`h-5 rounded-full text-white text-xs flex items-center justify-center ${
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
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {/* Skills */}
            <h3 className="font-semibold mt-4 mb-2">Key Skills Detected:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Insights */}
            <h3 className="font-semibold mt-4 mb-2 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Key Insights:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔹 Right Panel */}
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