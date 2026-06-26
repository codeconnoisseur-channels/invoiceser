import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-25 px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-primary-600">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
