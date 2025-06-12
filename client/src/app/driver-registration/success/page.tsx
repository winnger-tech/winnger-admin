export default function DriverRegistrationSuccess() {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Registration Successful!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for registering as a driver. Your background check is being processed.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            You will receive an email once your application has been reviewed and approved.
          </p>
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block">
            Return to Home
          </a>
        </div>
      </div>
    );
  }