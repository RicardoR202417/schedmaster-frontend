'use client';

import Link from 'next/link';
import { Dumbbell, Apple, Sparkles, User } from 'lucide-react';

export default function HomeUserPage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo.png" alt="logo" />
          <span>SchedMaster</span>
        </div>
        <Link href="/perfil" className="btn-login" style={{ padding: '10px 14px' }}>
          <User size={22} />
        </Link>
      </header>

      <section className="home-hero">
        <h1>Reserva tu <span className="highlight">bienestar</span></h1>
        <p>Elige el servicio que deseas y comienza tu experiencia saludable.</p>
      </section>

      <section className="services-section">
        <strong>Servicios</strong>
        <h2>Selecciona un servicio</h2>
        <div className="services-grid">
          <button className="service-card">
            <div className="service-icon"><Dumbbell size={28} /></div>
            <h3>Gimnasio</h3>
            <p>Reserva tu horario de entrenamiento</p>
          </button>
          <div className="service-card disabled">
            <div className="service-icon"><Apple size={28} /></div>
            <h3>Enfermería</h3>
            <p>Próximamente</p>
          </div>
          <div className="service-card disabled">
            <div className="service-icon"><Sparkles size={28} /></div>
            <h3>Próximamente</h3>
            <p>Nuevos talleres en camino</p>
          </div>
        </div>
      </section>

      <section className="tips-section">
        <strong>Consejos para ti</strong>
        <div className="tips-grid">
          <div className="tip-card">Mantente hidratado durante tu entrenamiento</div>
          <div className="tip-card">Incluye verduras en cada comida</div>
          <div className="tip-card">Dormir bien mejora tu rendimiento físico</div>
        </div>
      </section>

      <section className="tips-section">
        <strong>Anuncios</strong>
        <h2>Tablón del gimnasio</h2>
        <div className="tips-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

          <div className="card">
            <div className="support-item" style={{ marginBottom: '16px' }}>
              <div className="state">SM</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--blue-900)', margin: 0 }}>
                  Administración Gimnasio
                </p>
                <small style={{ fontSize: '12px', color: 'var(--gray)' }}>15 Feb 2026</small>
              </div>
            </div>
            <p className="message">
              Ya se encuentra disponible el registro para el nuevo periodo.
              Recuerda completar tu inscripción antes de la fecha límite.
            </p>
            <img src="/demo-convocatoria.jpg" alt="anuncio"
              style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

          <div className="card">
            <div className="support-item" style={{ marginBottom: '16px' }}>
              <div className="state">SM</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--blue-900)', margin: 0 }}>
                  Administración Gimnasio
                </p>
                <small style={{ fontSize: '12px', color: 'var(--gray)' }}>10 Feb 2026</small>
              </div>
            </div>
            <p className="message">
              El gimnasio permanecerá cerrado el sábado por mantenimiento.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}