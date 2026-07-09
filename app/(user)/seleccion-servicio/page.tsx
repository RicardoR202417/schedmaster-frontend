'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Apple, Sparkles, X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import AlertModal from '../../components/AlertModal';
import { useDarkMode } from '../../hooks/useDarkMode';
import ChatBot from '../../components/ChatBot'; // 🔥 AQUÍ IMPORTAMOS EL BOT

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingConvocatoria, setLoadingConvocatoria] = useState(false);

  const { darkMode, toggle } = useDarkMode();
  const router = useRouter();

  const images = [
    '/gimnasio1.jpeg',
    '/gimnasio2.jpeg',
    '/gimnasio3.jpeg',
    '/gimnasio4.jpeg',
    '/gimnasio5.jpeg',
  ];

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  // 🔥 VALIDAR CONVOCATORIA
  const handleQuieroEntrenar = async () => {
    if (loadingConvocatoria) return;

    setLoadingConvocatoria(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lista-espera/convocatoria-activa`
      );

      const data = await res.json();

      if (res.ok && data.activa) {
        router.push(
          `/convocatoria-activa?data=${encodeURIComponent(JSON.stringify(data.periodo))}`
        );
        return;
      }

      setOpenModal(true);

    } catch (error) {
      setAlertMessage('Error al verificar la convocatoria');
      setAlertOpen(true);
    } finally {
      setLoadingConvocatoria(false);
    }
  };

  // 👉 REGISTRO LISTA DE ESPERA
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lista-espera`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: email }),
        }
      );

      const data = await res.json();

      // 🔥 si justo se activó convocatoria
      if (res.status === 409 && data.message === 'convocatoria_activa') {
        router.push(
          `/convocatoria-activa?data=${encodeURIComponent(JSON.stringify(data.periodo))}`
        );
        return;
      }

      if (!res.ok) {
        setAlertMessage(data.message || 'Error');
        setAlertOpen(true);
        return;
      }

      setSent(true);

    } catch {
      setAlertMessage('Error de conexión');
      setAlertOpen(true);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setSent(false);
    setEmail('');
  };

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo.png" alt="logo" />
          <span>SchedMaster</span>
        </div>
        <Link href="/login" className="btn btn--dark">Iniciar sesión</Link>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand-logo">
            <Dumbbell />
          </div>

          <h1 className="hero-title">
            Transforma tu <span className="highlight">cuerpo y mente</span>
          </h1>

          <p className="hero-subtitle">
            Accede al gimnasio universitario y mejora tu bienestar cada día.
          </p>

          <button type="button"
            className="btn btn--blue btn--lg"
            onClick={handleQuieroEntrenar}
            disabled={loadingConvocatoria}
          >
            {loadingConvocatoria ? 'Cargando...' : 'Quiero entrenar'}
          </button>
        </div>
      </section>

      {/* INFO */}
      <section className="services-section">
        <strong>Sobre el gimnasio</strong>
        <h2>Gimnasio universitario</h2>
        <p className="muted">
          Nuestras instalaciones están diseñadas para brindarte un espacio completo de entrenamiento.
          Las convocatorias se abren cada cuatrimestre para que puedas formar parte.
        </p>
      </section>

      {/* BENEFICIOS */}
      <section className="services-section">
        <strong>Beneficios</strong>
        <h2>¿Por qué entrenar aqui?</h2>

        <div className="services-grid">
          <div className="service-card">Aquí Mejora tu condición fisica</div>
          <div className="service-card">Reduce el estres</div>
          <div className="service-card">Aumenta tu energia</div>
          <div className="service-card">Instalaciones universitarias</div>
        </div>
      </section>

      {/* CARRUSEL */}
      <section className="services-section">
        <strong>Instalaciones</strong>
        <h2>Conoce el gimnasio</h2>

        <div className="card--glass">
          <div className="carousel">

            <button type="button" className="carousel-btn left" onClick={prevImg} title="Imagen anterior">
              <ChevronLeft size={22} />
            </button>

            <div className="carousel-wrapper">
              <img src={images[currentImg]} className="carousel-img" alt={`Imagen de instalaciones ${currentImg + 1}`} />
            </div>

            <button type="button" className="carousel-btn right" onClick={nextImg} title="Siguiente imagen">
              <ChevronRight size={22} />
            </button>

            {/* DOTS */}
            <div className="carousel-dots">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={`dot ${index === currentImg ? 'active' : ''}`}
                  onClick={() => setCurrentImg(index)}
                  aria-label={`Mostrar imagen ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="services-section">
        <strong>Servicios</strong>
        <h2>Selecciona un servicio</h2>

        <div className="services-grid">
          <button type="button" className="service-card" onClick={() => setOpenModal(true)}>
            <div className="service-icon"><Dumbbell size={28} /></div>
            <h3>Gimnasio</h3>
            <p>Reserva tu horario</p>
          </button>

          <Link href="/nutricion" className="service-card disabled">
            <div className="service-icon"><Apple size={28} /></div>
            <h3>Enfermería</h3>
            <p>Próximamente</p>
          </Link>

          <div className="service-card disabled">
            <div className="service-icon"><Sparkles size={28} /></div>
            <h3>Próximamente</h3>
            <p>Nuevos talleres en camino</p>
          </div>
        </div>
      </section>

      {/* MODAL LISTA DE ESPERA */}
      {openModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button type="button" className="modal-close" onClick={closeModal} title="Cerrar modal">
              <X size={20} />
            </button>

            {sent ? (
              <div className="modal-success">
                <div className="success-icon">OK</div>
                <h3>Registro confirmado</h3>
                <p>Te notificaremos cuando se habilite.</p>
              </div>
            ) : (
              <>
                <h2>Convocatoria cerrada</h2>
                <p>Dejanos tu correo y te avisaremos cuando se abra.</p>

                <form className="modal-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tucorreo@uteq.edu.mx"
                    required
                  />

                  <button type="submit" className="btn btn--blue btn--full btn--lg">
                    Notificarme
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      <AlertModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <ChatBot />

    </div>
  );
}