'use client'

export default function ErrorCustom({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex flex-col items-center justify-center">
      <div className="border border-gray-400 shadow-2xl rounded-2xl p-8 bg-white max-w-md text-center space-y-4 animate-fadeIn">
        <h1>Error</h1>
        <div
          className="w-[600px] overflow-auto mt-10"
          dangerouslySetInnerHTML={{ __html: error.stack ?? error.message }}
        ></div>
      </div>
    </div>
  )
}
