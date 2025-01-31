import React, { useState } from "react";

const VerificationScreen = () => {
  const [code, setCode] = useState(new Array(6).fill("")); // Array to hold the code
  const handleInputChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input
      if (value && index < code.length - 1) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="bg-blue-900 h-screen flex items-center justify-center text-white">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Webinar.gg</h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4">Check Your Email For A Code</h2>

        {/* Subheading */}
        <p className="text-sm mb-8">
          Please enter the verification code sent to your email id <br />
          <span className="font-medium">prabhleen@gmail.com</span>
        </p>

        {/* Code Input */}
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Timer */}
        <p className="text-gray-300 mb-6">⏱ 09:32</p>

        {/* Verify Button */}
        <button
          className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onClick={() => alert("Code Verified!")}
        >
          Verify
        </button>

        {/* Resend Link */}
        <p className="text-sm">
          Can’t find the email? Click{" "}
          <button className="text-blue-400 underline hover:text-blue-500">
            here
          </button>{" "}
          to resend.
        </p>
      </div>
    </div>
  );
};

export default VerificationScreen;
