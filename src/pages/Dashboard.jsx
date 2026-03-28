export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Profile */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold">Welcome, Shreyash 👋</h2>
        <p className="text-gray-400">Target Role: Frontend Developer</p>
      </div>

      {/* Skill Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="mb-4">HTML</h3>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-teal-500 h-3 rounded-full w-[80%]"></div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="mb-4">CSS</h3>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-teal-500 h-3 rounded-full w-[60%]"></div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="mb-4">JavaScript</h3>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-teal-500 h-3 rounded-full w-[40%]"></div>
          </div>
        </div>

      </div>

    </div>
  );
}