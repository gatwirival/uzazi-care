import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Users, FileText, MessageSquare, LogOut, Building2, DollarSign, Stethoscope } from "lucide-react";
import { checkSubscriptionAccess } from "@/lib/middleware/subscription-check";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userRole = session.user.role as "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | undefined;

  const subscriptionCheck = await checkSubscriptionAccess(session.user.id);
  const { hasAccess, hospitalName, subscriptionStatus } = subscriptionCheck;

  if (!hasAccess && userRole !== "SUPER_ADMIN") {
    redirect("/payment-required");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/30 to-purple-50/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-rose-100 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-rose-100">
          <Image src="/logo.png" alt="UzaziCare" width={32} height={32} className="rounded-lg" />
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            UzaziCare
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/dashboard"
            className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          {/* Super Admin Only: Clinics / Hospitals Management */}
          {userRole === "SUPER_ADMIN" && (
            <>
              <Link
                href="/dashboard/hospitals"
                className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Building2 className="h-5 w-5 mr-3" />
                <span className="font-medium">Clinics</span>
              </Link>
              <Link
                href="/dashboard/payments"
                className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <DollarSign className="h-5 w-5 mr-3" />
                <span className="font-medium">Payments</span>
              </Link>
            </>
          )}

          {/* Hospital Admin Only: Care Providers Management */}
          {userRole === "HOSPITAL_ADMIN" && (
            <Link
              href="/dashboard/doctors"
              className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <Stethoscope className="h-5 w-5 mr-3" />
              <span className="font-medium">Care Providers</span>
            </Link>
          )}
          
          {/* Doctor & Hospital Admin: Patients */}
          {(userRole === "DOCTOR" || userRole === "HOSPITAL_ADMIN") && (
            <Link
              href="/dashboard/patients"
              className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <Users className="h-5 w-5 mr-3" />
              <span className="font-medium">Patients</span>
            </Link>
          )}
          
          {/* Doctor Only: Health Records and AI Chat */}
          {userRole === "DOCTOR" && (
            <>
              <Link
                href="/dashboard/files"
                className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <FileText className="h-5 w-5 mr-3" />
                <span className="font-medium">Health Records</span>
              </Link>
              
              <Link
                href="/dashboard/chat"
                className="group flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <span className="font-medium">AI Health Chat</span>
              </Link>
            </>
          )}
        </nav>

        {/* Health pillars reminder */}
        <div className="mx-4 mb-4 p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
          <p className="text-xs font-semibold text-rose-600 mb-2">Care Areas</p>
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">🌸</span> Menstrual Health</div>
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">🤰</span> Pregnancy Care</div>
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">👶</span> Postpartum</div>
          </div>
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rose-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-rose-100">
          <div className="h-full px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-rose-700 bg-clip-text text-transparent">
                Women&apos;s Health Platform
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg blur opacity-25"></div>
                <div className="relative bg-white px-4 py-2 rounded-lg border border-rose-100">
                  <p className="text-sm font-medium text-rose-600">
                    AI-Powered Care 💜
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
