import Link from "next/link";
import Image from "next/image";
import { Shield, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { AppNav } from "@/components/app-nav";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <AppNav />
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-8">
        <section className="w-full rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/logo.png" alt="UzaziCare" width={36} height={36} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Authentication</h1>
              <p className="text-sm text-gray-600">Access your Uzazi Care account</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/auth/login"
              className="group rounded-2xl border border-rose-200 bg-rose-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white">
                <LogIn className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Sign in</h2>
              <p className="mt-1 text-sm text-gray-600">
                For existing doctors, hospital admins, and super admins.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-rose-700">
                Continue to login
                <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/auth/register"
              className="group rounded-2xl border border-pink-200 bg-pink-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 text-white">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Register clinic</h2>
              <p className="mt-1 text-sm text-gray-600">
                Create a new hospital account and start onboarding your care team.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-pink-700">
                Go to registration
                <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 text-amber-700" />
              <p className="text-sm text-amber-800">
                Safety note: Uzazi Care provides educational support and does not replace emergency or in-person clinical care.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
