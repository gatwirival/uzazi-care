"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/menstrual", label: "Menstrual", emoji: "🩸" },
  { href: "/pregnancy", label: "Pregnancy", emoji: "🤰" },
  { href: "/postpartum", label: "Postpartum", emoji: "👶" },
  { href: "/chat", label: "AI Chat", emoji: "💬" },
  { href: "/emergency", label: "Emergency", emoji: "🚨" },
  { href: "/education", label: "Education", emoji: "📚" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--brand)" }}>
            Uzazi Care
          </span>
          <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ background: "var(--brand)" }}>
            Women&apos;s Health
          </span>
        </div>
        <nav>
          <ul className="flex flex-wrap gap-1.5 text-sm">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium transition-all ${
                      isActive
                        ? "text-white shadow-sm"
                        : "border border-pink-100 bg-pink-50 text-pink-900 hover:bg-pink-100"
                    }`}
                    style={isActive ? { background: "var(--brand)" } : {}}
                  >
                    <span>{link.emoji}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
