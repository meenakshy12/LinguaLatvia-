import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2647] to-[#144272]">
      <div className="w-[300px] p-6">
        <h1 className="text-white text-2xl font-bold text-center mb-8">LinguaLatvia</h1>
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm block mb-1">Student Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-sm bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Student Id</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-sm bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-sm bg-white focus:outline-none"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-900"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
