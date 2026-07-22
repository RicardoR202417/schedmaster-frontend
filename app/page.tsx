'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  Flame,
  ArrowRight,
  Users,
  ChevronRight,
  Star,
  Clock,
  Award
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* ── Header ─────────────────────────────── */}
      <header className={`home-header ${scrolled ? 'home-header--scrolled' : ''}`}>
        <div className="home-header-inner">
          <div className="logo-section">
            <div className="logo-icon">
              <Dumbbell size={24} />
            </div>
            <span className="logo-text">SchedMaster</span>
          </div>
          <nav className="home-nav">
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/beneficios">Beneficios</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="home-header-actions">
            <Link href="/login" className="btn btn--blue">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn--outline hide-mobile">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section className="hero-modern">
        <div className="hero-modern-bg">
          <div className="hero-blob hero-blob--1" />
          <div className="hero-blob hero-blob--2" />
          <div className="hero-blob hero-blob--3" />
        </div>
        <div className="hero-modern-content">
          <div className="hero-modern-text">
            <div className="hero-badge">
              <Star size={14} />
              <span>Gimnasio Universitario UTEQ</span>
            </div>
            <h1 className="hero-modern-title">
              Transforma tu{' '}
              <span className="hero-gradient-text">cuerpo y mente</span>
            </h1>
            <p className="hero-modern-subtitle">
              Accede al gimnasio universitario de primera clase y mejora tu bienestar cada día.
              Entrena con los mejores equipos y guía profesional.
            </p>
            <div className="hero-modern-actions">
              <Link
                href="/seleccion-servicio"
                className="btn btn--yellow btn--lg hero-cta"
              >
                Quiero Entrenar
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/nosotros"
                className="btn btn--outline btn--lg"
              >
                Conócenos
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">1,247+</span>
                <span className="hero-stat-label">Estudiantes activos</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">89+</span>
                <span className="hero-stat-label">Horarios</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">12K+</span>
                <span className="hero-stat-label">Horas entrenadas</span>
              </div>
            </div>
          </div>
          <div className="hero-modern-visual">
            <div className="hero-image-frame">
              <div className="hero-image-glow" />
              <img
                src="/gimnasio1.jpeg"
                alt="Gimnasio universitario moderno"
                className="hero-image"
              />
              <div className="hero-image-badge hero-image-badge--1">
                <div className="hib-icon"><Users size={18} /></div>
                <div>
                  <strong>Comunidad</strong>
                  <span>+1,200 miembros</span>
                </div>
              </div>
              <div className="hero-image-badge hero-image-badge--2">
                <div className="hib-icon"><Award size={18} /></div>
                <div>
                  <strong>Certificado</strong>
                  <span>Equipo profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-label">
            <span>¿Por qué elegirnos?</span>
          </div>
          <h2 className="section-title">
            Todo lo que necesitas para <span className="highlight">alcanzar tus metas</span>
          </h2>
          <p className="section-desc">
            Instalaciones de primer nivel con programas diseñados para la comunidad universitaria.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">
                <Users size={24} />
              </div>
              <h3>Comunidad Universitaria</h3>
              <p>
                Entrena junto a otros estudiantes motivados y crea conexiones que trascienden el gimnasio.
              </p>
              <Link href="/beneficios" className="feature-card-link">
                Conoce más <ChevronRight size={14} />
              </Link>
            </div>
            <div className="feature-card feature-card--accent">
              <div className="feature-card-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>Seguridad y Higiene</h3>
              <p>
                Instalaciones impecables con protocolos de limpieza rigurosos y equipos desinfectados continuamente.
              </p>
              <Link href="/beneficios" className="feature-card-link">
                Conoce más <ChevronRight size={14} />
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <Flame size={24} />
              </div>
              <h3>Resultados Comprobados</h3>
              <p>
                Programas diseñados por profesionales que se adaptan a todos los niveles, desde principiante hasta avanzado.
              </p>
              <Link href="/beneficios" className="feature-card-link">
                Conoce más <ChevronRight size={14} />
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">
                <Clock size={24} />
              </div>
              <h3>Horarios Flexibles</h3>
              <p>
                Accede al gimnasio en los horarios que mejor se adapten a tu carga académica y actividades.
              </p>
              <Link href="/beneficios" className="feature-card-link">
                Conoce más <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────── */}
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="section-label">
            <span>Nuestras Instalaciones</span>
          </div>
          <h2 className="section-title">
            Un espacio diseñado para <span className="highlight">ti</span>
          </h2>
          <div className="gallery-grid">
            <div className="gallery-item gallery-item--large">
              <img src="/gimnasio2.jpeg" alt="Área de pesas" />
              <div className="gallery-overlay">
                <span>Área de Pesas</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gimnasio3.jpeg" alt="Cardio" />
              <div className="gallery-overlay">
                <span>Cardio</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gimnasio4.jpeg" alt="Clases grupales" />
              <div className="gallery-overlay">
                <span>Clases Grupales</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gimnasio5.jpeg" alt="Vestidores" />
              <div className="gallery-overlay">
                <span>Vestidores</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-bg-pattern" />
        <div className="cta-container">
          <div className="cta-content">
            <h2>¿Listo para comenzar tu transformación?</h2>
            <p>
              Únete a nuestra comunidad y descubre la mejor versión de ti mismo.
              Las próximas convocatorias se abren pronto.
            </p>
            <Link
              href="/seleccion-servicio"
              className="btn btn--yellow btn--lg cta-btn"
            >
              Quiero Entrenar
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo-section">
              <div className="logo-icon">
                <Dumbbell size={20} />
              </div>
              <span className="logo-text">SchedMaster</span>
            </div>
            <p>Gestión inteligente de horarios UTEQ.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Plataforma</h4>
              <Link href="/login">Iniciar Sesión</Link>
              <Link href="/register">Registrarse</Link>
              <Link href="/seleccion-servicio">Servicios</Link>
            </div>
            <div className="footer-col">
              <h4>Compañía</h4>
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/beneficios">Beneficios</Link>
              <Link href="/contacto">Contacto</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/terminos">Términos</Link>
              <Link href="/privacidad">Privacidad</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SchedMaster. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}