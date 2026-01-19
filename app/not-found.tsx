import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900">404 – Page not found</h1>
        <p className="text-gray-600 mt-2">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
