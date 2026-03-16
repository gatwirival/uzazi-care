import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, FileText, MessageSquare, TrendingUp, Clock, ArrowRight, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const [patientCount, fileCount, inferenceCount] = await Promise.all([
    prisma.patient.count({ where: { doctorId: session.user.id } }),
    prisma.file.count({ where: { doctorId: session.user.id } }),
    prisma.inference.count({
      where: { File: { doctorId: session.user.id } },
    }),
  ]);

  const recentPatients = await prisma.patient.findMany({
    where: { doctorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-10" style={{ color: "#1C100F" }}>

      {/* Welcome */}
      <div
        className="rounded-2xl p-8"
        style={{ backgroundColor: "#F5E4DC", border: "1px solid rgba(107,39,55,0.12)" }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: "#C1614A", letterSpacing: "0.2em" }}
            >
              Welcome back
            </p>
            <h1
              className="font-display font-black leading-none mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", color: "#1C100F" }}
            >
              {session.user.name?.split(" ")[0]}
            </h1>
            <p style={{ color: "#7A5C58", fontWeight: 300 }}>
              Here&apos;s an overview of your patients and care activity today.
            </p>
          </div>
          <div
            className="hidden lg:flex items-center justify-center flex-shrink-0 rounded-2xl font-display font-black"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#6B2737",
              color: "#FDFAF5",
              fontSize: "2rem",
              letterSpacing: "-0.03em",
            }}
          >
            {session.user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "Total Patients",
            value: patientCount,
            sub: "Under your care",
            icon: "👩‍⚕️",
            accent: "#6B2737",
            bg: "#F5E4DC",
          },
          {
            label: "Health Records",
            value: fileCount,
            sub: "Files uploaded",
            icon: "📋",
            accent: "#C1614A",
            bg: "#FDF3EE",
          },
          {
            label: "AI Analyses",
            value: inferenceCount,
            sub: "Insights generated",
            icon: "✨",
            accent: "#6B2737",
            bg: "#F5E4DC",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-6"
            style={{ backgroundColor: stat.bg, border: "1px solid rgba(107,39,55,0.1)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <TrendingUp className="h-4 w-4" style={{ color: stat.accent }} />
            </div>
            <p
              className="font-black leading-none mb-1"
              style={{ fontSize: "2.5rem", color: stat.accent, fontFamily: "'Playfair Display', serif" }}
            >
              {stat.value}
            </p>
            <p className="text-sm font-semibold" style={{ color: "#1C100F" }}>{stat.label}</p>
            <p className="text-xs" style={{ color: "#7A5C58" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <p
          className="text-xs font-bold uppercase mb-5"
          style={{ color: "#7A5C58", letterSpacing: "0.18em" }}
        >
          Quick actions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/patients/new"
            className="group flex items-center justify-between p-5 rounded-xl transition-all hover:shadow-sm"
            style={{ backgroundColor: "#FDFAF5", border: "1px solid rgba(107,39,55,0.12)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl text-xl"
                style={{ backgroundColor: "#F5E4DC" }}
              >
                👤
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1C100F" }}>Add Patient</p>
                <p className="text-xs" style={{ color: "#7A5C58" }}>Create new record</p>
              </div>
            </div>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              style={{ color: "#6B2737" }}
            />
          </Link>

          <Link
            href="/dashboard/files/upload"
            className="group flex items-center justify-between p-5 rounded-xl transition-all hover:shadow-sm"
            style={{ backgroundColor: "#FDFAF5", border: "1px solid rgba(107,39,55,0.12)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl text-xl"
                style={{ backgroundColor: "#F5E4DC" }}
              >
                📁
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1C100F" }}>Upload Record</p>
                <p className="text-xs" style={{ color: "#7A5C58" }}>Add health file</p>
              </div>
            </div>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              style={{ color: "#6B2737" }}
            />
          </Link>

          <Link
            href="/dashboard/chat"
            className="group flex items-center justify-between p-5 rounded-xl transition-all hover:shadow-sm"
            style={{ backgroundColor: "#6B2737", border: "1px solid #6B2737" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl text-xl"
                style={{ backgroundColor: "rgba(253,250,245,0.15)" }}
              >
                💬
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#FDFAF5" }}>AI Health Chat</p>
                <p className="text-xs" style={{ color: "rgba(253,250,245,0.6)" }}>Ask your AI assistant</p>
              </div>
            </div>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              style={{ color: "rgba(253,250,245,0.7)" }}
            />
          </Link>
        </div>
      </div>

      {/* Recent Patients */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(107,39,55,0.12)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(107,39,55,0.1)", backgroundColor: "#FDFAF5" }}
        >
          <div>
            <p
              className="text-xs font-bold uppercase mb-1"
              style={{ color: "#C1614A", letterSpacing: "0.18em" }}
            >
              Recent
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "1.35rem", color: "#1C100F", letterSpacing: "-0.02em" }}
            >
              Patients
            </h2>
          </div>
          <Link
            href="/dashboard/patients"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "#6B2737" }}
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* List */}
        <div style={{ backgroundColor: "#FDFAF5" }}>
          {recentPatients.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: "#F5E4DC" }}
              >
                👩‍⚕️
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "#1C100F" }}>
                No patients yet
              </h3>
              <p className="text-sm mb-6" style={{ color: "#7A5C58" }}>
                Get started by adding your first patient
              </p>
              <Link
                href="/dashboard/patients/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
              >
                <Users className="h-4 w-4" />
                Add Patient
              </Link>
            </div>
          ) : (
            recentPatients.map((patient, i) => (
              <Link
                key={patient.id}
                href={`/dashboard/patients/${patient.id}`}
                className="group flex items-center justify-between px-6 py-4 transition-colors"
                style={{
                  borderBottom: i < recentPatients.length - 1 ? "1px solid rgba(107,39,55,0.08)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FDF5F0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-sm flex-shrink-0"
                    style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
                  >
                    {patient.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#1C100F" }}>
                      {patient.name}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "#7A5C58" }}>
                      <Clock className="h-3 w-3" />
                      Added {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  style={{ color: "#C1614A" }}
                />
              </Link>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
