'use client';

import { useState } from 'react';
import './seleccion.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Apple, Sparkles, X } from 'lucide-react';

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:3001/api/lista-espera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email })
    });

    const data = await res.json();

    // 👉 si hay convocatoria activa
    if (res.status === 409 && data.message === 'convocatoria_activa') {
      const periodo = encodeURIComponent(JSON.stringify(data.periodo));
      router.push(`/convocatoria-activa?data=${periodo}`);
      return;
    }

    if (!res.ok) {
      alert(data.message || 'Error');
      return;
    }

    setSent(true);

  } catch (error) {
    console.error(error);
    alert('Error de conexión');
  }
};
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
          <button className="service-card" onClick={() => setOpenModal(true)}>
            <div className="service-icon">
              <Dumbbell size={28} />
            </div>
            <h3>Gimnasio</h3>
            <p>Reserva tu horario de entrenamiento</p>
          </button>

          {/* ENFERMERIA */}
          <Link href="/nutricion" className="service-card disabled">
            <div className="service-icon">
              <Apple size={28} />
            </div>
            <h3>Enfermería</h3>
            <p>Próximamente</p>
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

      {/* MODAL */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal">

            <button className="modal-close" onClick={() => {
              setOpenModal(false);
              setSent(false);
              setEmail('');
            }}>
              <X size={20} />
            </button>

            {!sent ? (
              <>
                <h2>Convocatoria cerrada</h2>
                <p>
                  Actualmente no hay convocatoria abierta para el gimnasio.
                  Déjanos tu correo y te avisaremos cuando se habilite.
                </p>

                <form onSubmit={handleSubmit} className="modal-form">
                  <input
                    type="email"
                    placeholder="tucorreo@uteq.edu.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <button type="submit" className="btn-primary">
                    Notificarme
                  </button>
                </form>
              </>
            ) : (
              <div className="modal-success">
  <div className="success-icon">
    ✓
  </div>

  <h3>Registro en lista de interesados confirmado</h3>

  <p>
    Te notificaremos en cuanto se habilite la próxima convocatoria
    para que puedas completar tu inscripción.
  </p>
</div>
            )}

          </div>
        </div>
      )}

      {/* TIPS */}
      <section className="tips-section">
        <strong>Consejos para ti</strong>

        <div className="tips-grid">
          <div className="tip-card">Mantente hidratado durante tu entrenamiento</div>
          <div className="tip-card">Incluye verduras en cada comida</div>
          <div className="tip-card">Dormir bien mejora tu rendimiento físico</div>
        </div>
      </section>

    </div>
  );
}