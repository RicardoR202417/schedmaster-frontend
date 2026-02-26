'use client';

import { useState } from 'react';
import './anuncios.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Apple, Sparkles, X, User, Megaphone } from 'lucide-react';

export default function HomeUserPage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo.png" alt="logo" />
          <span>SchedMaster</span>
        </div>

        {/* ICONO PERFIL */}
        <Link href="/perfil" className="profile-btn">
          <User size={22} />
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
        <strong>Servicios</strong>
        <h2>Selecciona un servicio</h2>

        <div className="services-grid">

          <button className="service-card">
            <div className="service-icon">
              <Dumbbell size={28} />
            </div>
            <h3>Gimnasio</h3>
            <p>Reserva tu horario de entrenamiento</p>
          </button>

          <div className="service-card disabled">
            <div className="service-icon">
              <Apple size={28} />
            </div>
            <h3>Enfermería</h3>
            <p>Próximamente</p>
          </div>

          <div className="service-card disabled">
            <div className="service-icon">
              <Sparkles size={28} />
            </div>
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

      {/* ANUNCIOS */}
     {/* ANUNCIOS FEED */}
<section className="feed-section">
  <strong>Anuncios</strong>
  <h2>Tablón del gimnasio</h2>

  <div className="feed">

    {/* ANUNCIO */}
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">SM</div>
        <div>
          <p className="post-author">Administración Gimnasio</p>
          <span className="post-date">15 Feb 2026</span>
        </div>
      </div>

      <p className="post-text">
        Ya se encuentra disponible el registro para el nuevo periodo.
        Recuerda completar tu inscripción antes de la fecha límite.
      </p>

      <img
        src="/demo-convocatoria.jpg"
        alt="anuncio"
        className="post-image"
      />
    </div>

    {/* ANUNCIO */}
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">SM</div>
        <div>
          <p className="post-author">Administración Gimnasio</p>
          <span className="post-date">10 Feb 2026</span>
        </div>
      </div>

      <p className="post-text">
        El gimnasio permanecerá cerrado el sábado por mantenimiento.
      </p>
    </div>

  </div>
</section>
    </div>
  );
}