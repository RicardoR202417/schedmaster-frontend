'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const TABS = [
  { href: '/anuncios', label: 'Anuncios' },
  { href: '/biblioteca-ejercicios', label: 'Ejercicios' },
  { href: '/rutinas', label: 'Rutinas' },
  { href: '/mis-rutinas', label: 'Mis rutinas' },
];

export default function StudentShell() {
  const pathname = usePathname();

  return (
    <header className="gx-app-topbar">
      <div className="gx-app-topbar-inner">
        <Link href="/anuncios" className="gx-brand">
          <span className="gx-brand-mark"><Dumbbell size={18} strokeWidth={2.4} /></span>
          <span className="gx-brand-name">SchedMaster</span>
        </Link>
        <div className="gx-app-topbar-actions">
          <ThemeToggle />
          <Link href="/perfil" className="gx-btn gx-btn--icon gx-btn--outline" aria-label="Mi perfil">
            <User size={18} />
          </Link>
        </div>
      </div>

      <nav className="gx-app-tabs" aria-label="Secciones de alumno">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`gx-app-tab ${pathname === tab.href ? 'is-active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
