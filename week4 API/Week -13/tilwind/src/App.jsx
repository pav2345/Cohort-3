import { useState } from "react";

function AgeVerification() {
  const [birthYear, setBirthYear] = useState("");

  const handleContinue = () => {
    if (birthYear) {
      console.log(`Birth Year Entered: ${birthYear}`);
      alert(`Your birth year is: ${birthYear}`);
    } else {
      alert("Please enter your birth year.");
    }
  };

  return (
    <div className="bg-blue-900 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Header with logo and text */}
      <div className="text-center mb-8">
        <img
          src="https://th.bing.com/th?id=OIP.nVE_lCFp3U6MK-j5sCTrIgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" 
          alt="Logo"
          className="mx-auto mb-2   rounded-full border-2 border - white"
        />
        <h1 className="text-2xl font-bold">Webinar.gg</h1>
      </div>

      {/* Main heading */}
      <h2 className="text-xl font-semibold mb-4">Let's Get Started </h2>


      {/* Input box */}
      <input
        type="text"
        placeholder="Email id"
        className="w-64 px-4 py-2 mb-4 rounded bg-blue-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={birthYear}
        onChange={(e) => setBirthYear(e.target.value)} // Update state on input change
      />

      {/* Continue button */}
      <button
        onClick={handleContinue} // Attach onClick handler
        className="w-64 px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded text-black font-semibold"
      >
        Continue
      </button>
    </div>
  );
}

export default AgeVerification;
