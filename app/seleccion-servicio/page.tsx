'use client';

import './seleccion.css';
import Link from 'next/link';
import { Dumbbell, Apple, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo.png" alt="logo" />
          <span>SchedMaster</span>
        </div>

        <Link href="/login" className="btn-login">
          Iniciar sesión
        </Link>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <h1>
          Reserva tu <span className="highlight">bienestar</span>
        </h1>
        <p>
          Elige el servicio que deseas y comienza tu experiencia saludable.
        </p>
      </section>

      {/* SERVICIOS */}
      <section className="services-section">
        <strong>Servicios</strong> <h2>Selecciona un servicio</h2>

        <div className="services-grid">

          {/* GIMNASIO */}
          <Link href="/reservas" className="service-card">
            <div className="service-icon">
              <Dumbbell size={28} />
            </div>
            <h3>Gimnasio</h3>
            <p>Reserva tu horario de entrenamiento</p>
          </Link>

          {/* NUTRICION */}
          <Link href="/nutricion" className="service-card">
            <div className="service-icon">
              <Apple size={28} />
            </div>
            <h3>Nutrición</h3>
            <p>Agenda tu asesoría nutricional</p>
          </Link>

          {/* PROXIMAMENTE */}
          <div className="service-card disabled">
            <div className="service-icon">
              <Sparkles size={28} />
            </div>
            <h3>Próximamente</h3>
            <p>Nuevos talleres en camino</p>
          </div>

        </div>
      </section>

      {/* TIPS */}
      <section className="tips-section">
        <strong>Consejos para ti</strong>

        <div className="tips-grid">
          <div className="tip-card">
             Mantente hidratado durante tu entrenamiento
          </div>

          <div className="tip-card">
             Incluye verduras en cada comida
          </div>

          <div className="tip-card">
             Dormir bien mejora tu rendimiento físico
          </div>
        </div>
      </section>

    </div>
  );
}