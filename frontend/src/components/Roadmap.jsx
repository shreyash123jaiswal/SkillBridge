import { FaBookOpen, FaCheckCircle, FaClipboardList, FaStar } from "react-icons/fa";

export default function Roadmap() {
  const roadmapData = [
    {
      step: "Start",
      title: "Identify Skill Gap",
      description: "AI analyzes your resume and identifies missing skills for your target company.",
      icon: <FaClipboardList className="text-white" />,
      status: "completed",
    },
    {
      step: "Step 1",
      title: "Learn React",
      description: "Follow tutorials, complete exercises, and understand React fundamentals.",
      icon: <FaBookOpen className="text-white" />,
      status: "in-progress",
    },
    {
      step: "Step 2",
      title: "Assignments",
      description: "Complete guided assignments to test your understanding.",
      icon: <FaCheckCircle className="text-white" />,
      status: "pending",
    },
    {
      step: "Step 3",
      title: "Mock Test",
      description: "Take a mock test to evaluate your readiness.",
      icon: <FaClipboardList className="text-white" />,
      status: "pending",
    },
    {
      step: "Final",
      title: "Scorecard & Performance",
      description: "AI evaluates your performance and provides insights for improvement.",
      icon: <FaStar className="text-white" />,
      status: "pending",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Your Learning Roadmap</h2>

      <div className="relative w-full flex flex-col items-start">
        {roadmapData.map((item, index) => (
          <div key={index} className="flex items-center mb-12 relative w-full">
            {/* Road line */}
            <div className="absolute left-5 top-0 w-1 h-full bg-purple-400 rounded-full z-0"></div>

            {/* Pin */}
            <div className="z-10 relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg
                  ${item.status === "completed"
                    ? "bg-green-500 animate-pulse"
                    : item.status === "in-progress"
                    ? "bg-yellow-500 animate-bounce"
                    : "bg-gray-400"
                  }`}
              >
                {item.icon}
              </div>
            </div>

            {/* Card */}
            <div className="ml-8 bg-white p-6 rounded-lg shadow hover:shadow-lg transition w-full">
              <h3 className="font-semibold text-xl">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
              {item.status !== "pending" && (
                <span className={`mt-2 inline-block px-2 py-1 text-sm rounded-full 
                  ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {item.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}