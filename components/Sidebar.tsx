'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/pre-traitement", label: "Pré-traitement", icon: "⚙️" },
  { href: "/reacteur", label: "Réacteur", icon: "🔥" },
  { href: "/emissions", label: "Émissions", icon: "🌿" },
  { href: "/rapports", label: "Rapports", icon: "📋" },
  { href: "/fiches-csr", label: "Fiches CSR", icon: "📄" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-circle">CSR</div>
        <div className="logo-text">
          <h1>CSR Pilot</h1>
          <span>Pyro-gazéification</span>
        </div>
      </div>

      <nav className="side-nav">
        {navItems.map(item => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`side-nav-item${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
