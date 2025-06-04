'use client'

import { AlertTriangle } from 'lucide-react'

export default function ErrorCustom({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full min-h-screen bg-gradient-to-br from-red-100 to-orange-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-xl rounded-lg max-w-2xl w-full p-6 border border-red-300">
            <div className="flex items-center space-x-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-red-600">
                Oops! Something went wrong
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              We're sorry, but an unexpected error has occurred. You can try
              again by clicking the button below.
            </p>
            <div
              className="bg-gray-100 rounded-md p-3 text-sm text-red-800 overflow-auto max-h-60"
              dangerouslySetInnerHTML={{ __html: error.stack ?? error.message }}
            ></div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={reset}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
