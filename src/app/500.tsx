import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex flex-col items-center justify-center">
      <div className="border border-gray-400 shadow-2xl rounded-2xl p-8 bg-white max-w-md text-center space-y-4 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-700">
          404 - Resource Not Found
        </h1>
        <p className="text-gray-600 text-base">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
