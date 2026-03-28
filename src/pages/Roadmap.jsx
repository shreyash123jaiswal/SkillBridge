export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Learning Roadmap</h1>

      <div className="space-y-6">

        {/* Step 1 */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Step 1: Learn HTML & CSS</h2>
          <p className="text-gray-400 mt-2">
            Understand structure and styling of web pages.
          </p>
          <span className="text-green-400">✔ Completed</span>
        </div>

        {/* Step 2 */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Step 2: JavaScript</h2>
          <p className="text-gray-400 mt-2">
            Learn DOM manipulation, ES6, and basics.
          </p>
          <span className="text-yellow-400">⏳ In Progress</span>
        </div>

        {/* Step 3 */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Step 3: React</h2>
          <p className="text-gray-400 mt-2">
            Build dynamic UI using components.
          </p>
          <span className="text-red-400">❌ Not Started</span>
        </div>

      </div>

    </div>
  );
}