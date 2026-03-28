export default function SkillGap() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Skill Gap Analysis</h1>

      {/* Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter target job (e.g., Frontend Developer)"
          className="w-full p-3 rounded-lg bg-gray-800 outline-none"
        />
      </div>

      {/* Skills */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Required Skills */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4 text-green-400">Required Skills</h2>
          <ul className="space-y-2">
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>React</li>
          </ul>
        </div>

        {/* Your Skills */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4 text-blue-400">Your Skills</h2>
          <ul className="space-y-2">
            <li>HTML</li>
            <li>CSS</li>
          </ul>
        </div>

        {/* Missing Skills */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4 text-red-400">Missing Skills</h2>
          <ul className="space-y-2">
            <li>JavaScript</li>
            <li>React</li>
          </ul>
        </div>

      </div>

    </div>
  );
}