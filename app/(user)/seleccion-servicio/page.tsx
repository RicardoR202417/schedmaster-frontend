'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dumbbell, Apple, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AlertModal from '../../components/AlertModal';

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const router = useRouter();

  const images = [
    '/gimnasio1.jpeg',
    '/gimnasio2.jpeg',
    '/gimnasio3.jpeg',
    '/gimnasio4.jpeg',
    '/gimnasio5.jpeg',
  ];

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lista-espera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });

      const data = await res.json();

      if (res.status === 409 && data.message === 'convocatoria_activa') {
        router.push(`/convocatoria-activa?data=${encodeURIComponent(JSON.stringify(data.periodo))}`);
        return;
      }

      if (!res.ok) {
        setAlertMessage(data.message || 'Error');
        setAlertOpen(true);
        return;
      }

      setSent(true);
    } catch {
      setAlertMessage('Error de conexiÃ³n');
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
        <Link href="/login" className="btn btn--dark">Iniciar sesiÃ³n</Link>
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
            Accede al gimnasio universitario y mejora tu bienestar cada dÃ­a.
          </p>

          <button type="button"
            className="btn btn--blue btn--lg"
            onClick={() => setOpenModal(true)}
          >
            Quiero entrenar
          </button>
        </div>
      </section>

      {/* INFO */}
      <section className="services-section">
        <strong>Sobre el gimnasio</strong>
        <h2>Gimnasio universitario</h2>
        <p className="muted">
          Nuestras instalaciones estÃ¡n diseÃ±adas para brindarte un espacio completo de entrenamiento.
          Las convocatorias se abren cada cuatrimestre para que puedas formar parte.
        </p>
      </section>

      {/* BENEFICIOS */}
      <section className="services-section">
        <strong>Beneficios</strong>
        <h2>Â¿Por quÃ© entrenar aquÃ­?</h2>

        <div className="services-grid">
          <div className="service-card">ðŸ’ª Mejora tu condiciÃ³n fÃ­sica</div>
          <div className="service-card">ðŸ§  Reduce el estrÃ©s</div>
          <div className="service-card">âš¡ Aumenta tu energÃ­a</div>
          <div className="service-card">ðŸ« Instalaciones universitarias</div>
        </div>
      </section>

      {/* CARRUSEL PRO */}
      <section className="services-section">
        <strong>Instalaciones</strong>
        <h2>Conoce el gimnasio</h2>

        <div className="card--glass">
          <div className="carousel">

            <button type="button" className="carousel-btn left" onClick={prevImg} title="Imagen anterior">
              <ChevronLeft size={22} />
            </button>

            <div className="carousel-wrapper">
              <img src={images[currentImg]} className="carousel-img" alt="Instalaciones del gimnasio" />
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
            <p>Reserva tu horario de entrenamiento</p>
          </button>

          <Link href="/nutricion" className="service-card disabled">
            <div className="service-icon"><Apple size={28} /></div>
            <h3>EnfermerÃ­a</h3>
            <p>PrÃ³ximamente</p>
          </Link>

          <div className="service-card disabled">
            <div className="service-icon"><Sparkles size={28} /></div>
            <h3>PrÃ³ximamente</h3>
            <p>Nuevos talleres en camino</p>
          </div>
        </div>
      </section>

      {/* MODAL */}
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

                <form onSubmit={handleSubmit} className="modal-form">
                  <input
                    type="email"
                    placeholder="tucorreo@uteq.edu.mx"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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

    </div>
  );
}
