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
    <div className="min-h-screen" style={{ backgroundColor: "#FDFAF5" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white z-40" style={{ borderRight: "1px solid rgba(107,39,55,0.1)" }}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6" style={{ borderBottom: "1px solid rgba(107,39,55,0.1)" }}>
          <Image src="/logo.png" alt="UzaziCare" width={30} height={30} className="rounded" />
          <span className="ml-2.5 font-display font-bold text-xl tracking-tight" style={{ color: "#6B2737" }}>
            UzaziCare
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/dashboard"
            className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
            style={{ color: "#7A5C58" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          {/* Super Admin Only: Clinics / Hospitals Management */}
          {userRole === "SUPER_ADMIN" && (
            <>
              <Link
                href="/dashboard/hospitals"
                className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
                style={{ color: "#7A5C58" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
              >
                <Building2 className="h-5 w-5 mr-3" />
                <span className="font-medium">Clinics</span>
              </Link>
              <Link
                href="/dashboard/payments"
                className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
                style={{ color: "#7A5C58" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
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
              className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
              style={{ color: "#7A5C58" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
            >
              <Stethoscope className="h-5 w-5 mr-3" />
              <span className="font-medium">Care Providers</span>
            </Link>
          )}
          
          {/* Doctor & Hospital Admin: Patients */}
          {(userRole === "DOCTOR" || userRole === "HOSPITAL_ADMIN") && (
            <Link
              href="/dashboard/patients"
              className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
              style={{ color: "#7A5C58" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
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
                className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
                style={{ color: "#7A5C58" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span className="font-medium">Health Records</span>
              </Link>

              <Link
                href="/dashboard/chat"
                className="group flex items-center px-3 py-2.5 rounded-lg transition-all"
                style={{ color: "#7A5C58" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <span className="font-medium">AI Health Chat</span>
              </Link>
            </>
          )}
        </nav>

        {/* Health pillars reminder */}
        <div className="mx-4 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}>
          <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6B2737", letterSpacing: "0.14em" }}>Care Areas</p>
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">🌸</span> Menstrual Health</div>
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">🤰</span> Pregnancy Care</div>
            <div className="flex items-center text-xs text-gray-600"><span className="mr-2">👶</span> Postpartum</div>
          </div>
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white" style={{ borderTop: "1px solid rgba(107,39,55,0.1)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#6B2737" }}>
                <span className="text-white font-semibold text-sm">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#1C100F" }}>
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
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all"
              style={{ color: "#7A5C58" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor="#F5E4DC"; e.currentTarget.style.color="#6B2737"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor="transparent"; e.currentTarget.style.color="#7A5C58"; }}
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
        <header className="sticky top-0 z-30 h-16 bg-white" style={{ borderBottom: "1px solid rgba(107,39,55,0.1)" }}>
          <div className="h-full px-8 flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl" style={{ color: "#6B2737", letterSpacing: "-0.02em" }}>
                Women&apos;s Health Platform
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "#F5E4DC", color: "#6B2737" }}
              >
                🌸 AI-Powered Care
              </span>
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
