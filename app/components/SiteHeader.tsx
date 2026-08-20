'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Dumbbell, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/#instalaciones', label: 'Instalaciones' },
  { href: '/#beneficios', label: 'Beneficios' },
  { href: '/ejercicios', label: 'Ejercicios' },
  { href: '/#contacto', label: 'Contacto' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('gx-lock-scroll', menuOpen);
    return () => document.documentElement.classList.remove('gx-lock-scroll');
  }, [menuOpen]);

  return (
    <header className={`gx-site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="gx-site-header-inner">
        <Link href="/" className="gx-brand" onClick={() => setMenuOpen(false)}>
          <span className="gx-brand-mark"><Dumbbell size={19} strokeWidth={2.4} /></span>
          <span className="gx-brand-name">SchedMaster</span>
        </Link>

        <nav className="gx-site-nav" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>

        <div className="gx-site-header-actions">
          <ThemeToggle className="gx-hide-mobile" />
          <Link href="/login" className="gx-btn gx-btn--ghost gx-btn--sm gx-hide-mobile">Iniciar sesión</Link>
          <Link href="/seleccion-servicio" className="gx-btn gx-btn--primary gx-btn--sm gx-hide-mobile">
            Quiero entrenar
          </Link>
          <button
            type="button"
            className="gx-menu-toggle gx-hide-desktop"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`gx-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <nav className="gx-mobile-nav" aria-label="Navegación móvil">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </nav>
        <div className="gx-mobile-menu-actions">
          <ThemeToggle />
          <Link href="/login" className="gx-btn gx-btn--outline gx-btn--full" onClick={() => setMenuOpen(false)}>
            Iniciar sesión
          </Link>
        </div>
        <div className="gx-mobile-menu-actions" style={{ paddingTop: 0 }}>
          <Link href="/seleccion-servicio" className="gx-btn gx-btn--primary gx-btn--full" onClick={() => setMenuOpen(false)}>
            Quiero entrenar
          </Link>
        </div>
      </div>
    </header>
  );
}
