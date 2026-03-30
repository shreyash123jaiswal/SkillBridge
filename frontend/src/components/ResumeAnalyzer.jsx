import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { api } from "../api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [strength, setStrength] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    try {
      const result = await api.uploadResume(uploadedFile);
      
      // Assuming the API returns skills and recommended_roles
      // For now, calculate strength based on number of skills or something
      const skillsCount = result.skills?.length || 0;
      const strengthPercent = Math.min(100, skillsCount * 10 + 50); // Simple calculation
      setStrength(strengthPercent);

      // Generate suggestions based on recommendations
      const suggestions = [];
      if (result.recommended_roles && result.recommended_roles.length > 0) {
        suggestions.push(`Consider roles like: ${result.recommended_roles.slice(0, 3).map(r => r.role).join(', ')}`);
      }
      suggestions.push("Include more keywords related to your target job.");
      suggestions.push("Highlight relevant projects and internships.");
      suggestions.push("Keep your resume concise and structured.");
      suggestions.push("Add measurable achievements where possible.");
      
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Upload error:', error);
      setStrength(0);
      setSuggestions(["Error analyzing resume. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      
      {/* Left Panel: Resume Upload */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
        <label className={`flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <FaUpload className="text-purple-500" />
          <span>{loading ? 'Analyzing...' : file ? file.name : "Choose a resume file"}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
            disabled={loading}
          />
        </label>
        {file && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-purple-500 h-4 rounded-full text-white text-xs text-center"
              style={{ width: `${strength}%` }}
            >
              {strength}%
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: AI Analysis */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
        {file ? (
          <>
            <p className="mb-2">Resume Strength: <span className="font-bold">{strength}%</span></p>
            <h3 className="font-semibold mt-4 mb-2">Suggestions:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {suggestions.map((s, index) => (
                <li key={index}>{s}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500">Upload your resume to get AI analysis and suggestions.</p>
        )}
      </div>

    </div>
  );
}