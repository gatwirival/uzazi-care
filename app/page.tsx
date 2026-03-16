import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const MARQUEE_ITEMS = [
  "CYCLE HEALTH",
  "PREGNANCY CARE",
  "POSTPARTUM RECOVERY",
  "EMERGENCY TRIAGE",
  "AI CHAT",
  "HEALTH EDUCATION",
  "MENSTRUAL WELLNESS",
  "BIRTH SUPPORT",
];

export default function Home() {
  const allItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div style={{ backgroundColor: "#FDFAF5", color: "#1C100F" }}>
      {/* NAV */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: "rgba(253,250,245,0.96)",
          borderBottom: "1px solid rgba(107,39,55,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="UzaziCare" width={30} height={30} className="rounded" />
            <span className="font-display font-bold text-xl tracking-tight" style={{ color: "#6B2737" }}>
              UzaziCare
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#care" className="text-sm font-medium" style={{ color: "#7A5C58" }}>
              Care Areas
            </a>
            <Link href="/auth/login" className="text-sm font-medium" style={{ color: "#7A5C58" }}>
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity hover:opacity-85"
              style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
            >
              Begin <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: "100vh" }}>
        {/* Oversized UZAZI watermark */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden select-none pointer-events-none flex items-end"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          <span className="uzazi-watermark">UZAZI</span>
        </div>

        <div
          className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 items-center"
          style={{ minHeight: "calc(100vh - 4rem)", zIndex: 1 }}
        >
          {/* Left — editorial headline */}
          <div className="flex flex-col justify-center">
            <p
              className="anim-1 text-xs font-semibold uppercase mb-8"
              style={{ color: "#C1614A", letterSpacing: "0.22em" }}
            >
              Women&apos;s Health · AI Companion
            </p>

            <h1
              className="anim-2 font-display font-black leading-none mb-10"
              style={{
                fontSize: "clamp(3.75rem, 9.5vw, 8.5rem)",
                letterSpacing: "-0.035em",
                color: "#1C100F",
              }}
            >
              Know
              <br />
              <em style={{ color: "#6B2737", fontStyle: "italic" }}>your</em>
              <br />
              body.
            </h1>

            <p
              className="anim-3 text-lg leading-relaxed max-w-[38ch] mb-12"
              style={{ color: "#7A5C58", fontWeight: 300 }}
            >
              AI-powered guidance through every phase — your cycle, pregnancy,
              birth, and the recovery no one talks about enough.
            </p>

            <div className="anim-4 flex flex-wrap items-center gap-5">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#6B2737", color: "#FDFAF5" }}
              >
                Begin your journey
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#care"
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "#7A5C58" }}
              >
                How it works <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — stat orb + pills */}
          <div className="flex justify-center lg:justify-end items-center relative py-12">
            <div className="stat-orb">
              <span
                className="font-display font-black leading-none"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                12,400+
              </span>
              <span
                className="text-sm font-light mt-2 px-8 leading-snug"
                style={{ opacity: 0.85 }}
              >
                women guided through their health journey
              </span>
            </div>

            {/* Floating pills */}
            <div
              className="absolute flex flex-col gap-3"
              style={{ left: "-1rem", bottom: "3rem" }}
            >
              <span
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{ backgroundColor: "#F5E4DC", color: "#6B2737" }}
              >
                🌸 85k cycles tracked
              </span>
              <span
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{ backgroundColor: "#F5E4DC", color: "#6B2737" }}
              >
                👶 3,200 safe births
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden py-4" style={{ backgroundColor: "#6B2737" }}>
        <div className="marquee-track flex gap-14 w-max">
          {allItems.map((item, i) => (
            <span
              key={i}
              className="text-xs font-bold uppercase whitespace-nowrap"
              style={{ letterSpacing: "0.22em", color: "rgba(253,250,245,0.55)" }}
            >
              {item}
              <span className="mx-6 inline-block" style={{ color: "#C1614A" }} aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* CARE AREAS */}
      <section id="care" className="py-32 px-6 lg:px-10" style={{ maxWidth: "88rem", margin: "0 auto" }}>
        {/* Section header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8"
          style={{ borderBottom: "1px solid rgba(107,39,55,0.12)" }}
        >
          <h2
            className="font-display font-black leading-none"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
              letterSpacing: "-0.025em",
              color: "#1C100F",
            }}
          >
            Comprehensive
            <br />
            <em style={{ color: "#6B2737" }}>women&apos;s care</em>
          </h2>
          <Link
            href="/auth/register"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold mt-4"
            style={{ color: "#6B2737" }}
          >
            Start free <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 01 — Large feature */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-24 mb-24"
          style={{ borderBottom: "1px solid rgba(107,39,55,0.1)" }}
        >
          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "#C1614A", letterSpacing: "0.2em" }}>01</span>
            <h3
              className="font-display font-bold leading-tight mt-3 mb-6"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", color: "#1C100F" }}
            >
              Menstrual Health
              <br />& Cycle Intelligence
            </h3>
            <p className="text-base leading-relaxed mb-8 max-w-[42ch]" style={{ color: "#7A5C58", fontWeight: 300 }}>
              Track your cycle, understand hormonal patterns, manage PMS symptoms, and receive
              guidance aligned with each phase — follicular, ovulation, luteal, menstrual.
            </p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#6B2737" }}>
              Start tracking <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div
            className="flex items-center justify-center"
            style={{ backgroundColor: "#F5E4DC", height: "320px", borderRadius: "1rem" }}
          >
            <span style={{ fontSize: "7rem", lineHeight: 1 }}>🌸</span>
          </div>
        </div>

        {/* 02 + 03 */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-24 mb-24"
          style={{ borderBottom: "1px solid rgba(107,39,55,0.1)" }}
        >
          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "#C1614A", letterSpacing: "0.2em" }}>02</span>
            <h3
              className="font-display font-bold leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#1C100F" }}
            >
              Pregnancy Care
              <br />Companion
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#7A5C58", fontWeight: 300 }}>
              Week-by-week fetal development, nutrition guidance, danger sign detection, and
              birth preparation — from first heartbeat to delivery.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase" style={{ color: "#C1614A", letterSpacing: "0.2em" }}>03</span>
            <h3
              className="font-display font-bold leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#1C100F" }}
            >
              Postpartum
              <br />Recovery Guide
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#7A5C58", fontWeight: 300 }}>
              Physical healing, breastfeeding support, PPD screening, and newborn guidance —
              because the fourth trimester deserves real care.
            </p>
          </div>
        </div>

        {/* 04 + 05 — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-[44%_56%] gap-8 items-stretch">
          <div
            className="p-10 flex flex-col justify-between"
            style={{ backgroundColor: "#6B2737", borderRadius: "1.25rem", minHeight: "280px" }}
          >
            <span
              className="text-xs font-bold uppercase"
              style={{ color: "rgba(253,250,245,0.35)", letterSpacing: "0.2em" }}
            >
              04
            </span>
            <div>
              <h3
                className="font-display font-bold leading-tight mb-4"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#FDFAF5" }}
              >
                Emergency &<br />Safety Triage
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(253,250,245,0.6)", fontWeight: 300 }}>
                Instant RED·AMBER·GREEN assessment for danger signs. Know when to seek
                emergency care — immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between pl-4 py-2">
            <div>
              <span className="text-xs font-bold uppercase" style={{ color: "#C1614A", letterSpacing: "0.2em" }}>05</span>
              <h3
                className="font-display font-bold leading-tight mt-3 mb-5"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", letterSpacing: "-0.02em", color: "#1C100F" }}
              >
                24/7 AI
                <br />Health Chat
              </h3>
              <p className="text-sm leading-relaxed mb-8 max-w-[38ch]" style={{ color: "#7A5C58", fontWeight: 300 }}>
                Specialized AI assistants trained in women&apos;s health — empathetic, accurate,
                and available around the clock.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-semibold self-start"
              style={{ color: "#6B2737" }}
            >
              Access AI Chat <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center" style={{ backgroundColor: "#6B2737" }}>
        <p
          className="text-xs font-bold uppercase mb-10"
          style={{ color: "rgba(253,250,245,0.35)", letterSpacing: "0.25em" }}
        >
          You deserve to understand your body
        </p>
        <h2
          className="font-display font-black leading-none mx-auto mb-14"
          style={{
            fontSize: "clamp(3rem, 9vw, 8rem)",
            color: "#FDFAF5",
            letterSpacing: "-0.035em",
            maxWidth: "14ch",
          }}
        >
          Understand
          <br />
          <em>it fully.</em>
        </h2>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-lg transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#C1614A", color: "#FDFAF5" }}
        >
          Start your journey <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-6 text-sm" style={{ color: "rgba(253,250,245,0.3)" }}>
          Free to begin · No credit card required
        </p>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 lg:px-10" style={{ borderTop: "1px solid rgba(107,39,55,0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="UzaziCare" width={26} height={26} className="rounded" />
              <span className="font-display font-bold text-lg" style={{ color: "#6B2737" }}>UzaziCare</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#7A5C58", fontWeight: 300 }}>
              AI-powered women&apos;s health companion. Your cycle, pregnancy, and postpartum —
              guided with compassion and precision.
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase" style={{ color: "#1C100F", letterSpacing: "0.14em" }}>
                Health Areas
              </span>
              {["Menstrual Health", "Pregnancy Care", "Postpartum"].map((l) => (
                <a key={l} href="#care" style={{ color: "#7A5C58" }}>{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase" style={{ color: "#1C100F", letterSpacing: "0.14em" }}>
                Account
              </span>
              <Link href="/auth/login" style={{ color: "#7A5C58" }}>Sign In</Link>
              <Link href="/auth/register" style={{ color: "#7A5C58" }}>Register Clinic</Link>
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-12 pt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs"
          style={{ borderTop: "1px solid rgba(107,39,55,0.1)", color: "#7A5C58" }}
        >
          <span>© 2026 UzaziCare. All rights reserved.</span>
          <span>Medical Disclaimer · Privacy · Terms</span>
        </div>
      </footer>
    </div>
  );
}
