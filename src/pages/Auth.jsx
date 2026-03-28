import { useState } from "react";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="relative w-[850px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      
      {/* SIGN IN FORM (Left Side) */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
          isSignup ? "opacity-0 pointer-events-none translate-x-[-20%]" : "opacity-100 z-10 translate-x-0"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl hover:scale-105 transition shadow-md font-semibold">
          Sign In
        </button>
      </div>

      {/* SIGN UP FORM (Right Side) */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
          isSignup ? "opacity-100 z-10 translate-x-0" : "opacity-0 pointer-events-none translate-x-[20%]"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className="mb-4 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl hover:scale-105 transition shadow-md font-semibold">
          Sign Up
        </button>
      </div>

      {/* SLIDING OVERLAY PANEL */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full z-20 flex flex-col justify-center items-center text-white text-center transition-all duration-700 ease-in-out overflow-hidden ${
          isSignup
            ? "translate-x-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-[100px]"
            : "translate-x-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-l-[100px]"
        }`}
      >
        {/* Overlay Content: Welcome Back (Visible when isSignup is true) */}
        <div
          className={`absolute flex flex-col justify-center items-center w-full h-full p-10 transition-all duration-700 ease-in-out ${
            isSignup ? "opacity-100 translate-x-0 z-10" : "opacity-0 -translate-x-full pointer-events-none"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-6 opacity-90">Already have an account?</p>
          <button
            onClick={() => setIsSignup(false)}
            className="border-2 border-white px-8 py-2 rounded-full hover:bg-white hover:text-blue-600 transition font-semibold"
          >
            Sign In
          </button>
        </div>

        {/* Overlay Content: Hello Friend (Visible when isSignup is false) */}
        <div
          className={`absolute flex flex-col justify-center items-center w-full h-full p-10 transition-all duration-700 ease-in-out ${
            isSignup ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0 z-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
          <p className="mb-6 opacity-90">Don't have an account?</p>
          <button
            onClick={() => setIsSignup(true)}
            className="border-2 border-white px-8 py-2 rounded-full hover:bg-white hover:text-purple-600 transition font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
      
    </div>
  );
}