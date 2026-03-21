"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";

export const dynamic = "force-dynamic";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Please contact support.",
    AccessDenied: "You do not have permission to access this resource.",
    Verification: "The verification link has expired or is invalid.",
    Default: "An authentication error occurred. Please try again.",
  };

  const message = errorMessages[error as string] || errorMessages.Default;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-md px-4 py-16 sm:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <div className="text-center">
            <p className="text-4xl">⚠️</p>
            <h1 className="mt-4 text-2xl font-bold text-red-900">Authentication Error</h1>
            <p className="mt-2 text-sm text-red-700">{message}</p>
            {error && <p className="mt-4 text-xs text-red-600">Error code: {error}</p>}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="rounded-lg border border-rose-300 bg-rose-600 py-2 px-4 text-center font-medium text-white transition-all hover:bg-rose-700"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-rose-200 bg-rose-50 py-2 px-4 text-center font-medium text-rose-800 transition-all hover:bg-rose-100"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
