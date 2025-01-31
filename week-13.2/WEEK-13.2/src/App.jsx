function AgeVerification() {
  return (
    <div className="bg-blue-900 min-h-screen flex flex-col items-center justify-center text-white">
      <div className="text-center mb-8">
        {/* Logo */}
        <img
          src="https://th.bing.com/th/id/OIP.nKqO1pvgESaRQSj1FEr4ZgHaFO?w=232&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          alt="LOGO"
          className="mx-auto mb-4 rounded-full w-32 h-32"
        />
        {/* Header */}
        <h1 className="text-2xl font-bold">Webinar.gg</h1>

        {/* Subheader */}
        <h2 className="text-xl font-semibold mb-4">Verify Your Age</h2>
        <p className="text-sm text-gray-300 mb-6">
          Please confirm your birth year. This data will not be stored.
        </p>

        {/* Input field */}
        <input
          type="text"
          placeholder="Your birth year"
          className="w-64 px-4 py-2 mb-4 rounded bg-blue-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button className="w-64 px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded text-black font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
}

export default AgeVerification;
