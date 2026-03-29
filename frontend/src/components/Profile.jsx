import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function Profile() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">

      {/* 🔹 LEFT PANEL: User Info */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> Shreyash</p>
          <p><span className="font-semibold">Age:</span> 20</p>
          <p><span className="font-semibold">Education:</span> B.Tech, Computer Science</p>
          <p><span className="font-semibold">Email:</span> shreyash@example.com</p>
          <p><span className="font-semibold">Phone:</span> +91 98765 43210</p>
          <p><span className="font-semibold">Address:</span> Chennai, India</p>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <FaUpload className="text-purple-500" />
            <span>{file ? file.name : "Upload Resume"}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept=".pdf,.doc,.docx"
            />
          </label>
        </div>
      </div>

      {/* 🔹 RIGHT PANEL: Resume Preview / Analysis */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4">Resume</h2>

        {file ? (
          <div className="border border-gray-300 rounded-lg p-4 h-full overflow-auto">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Uploaded Resume:</span> {file.name}
            </p>
            <p className="text-gray-500 text-sm">You can integrate a PDF viewer here to show the full resume content.</p>
          </div>
        ) : (
          <p className="text-gray-500">No resume uploaded. Upload a resume on the left panel to view it here.</p>
        )}
      </div>

    </div>
  );
}