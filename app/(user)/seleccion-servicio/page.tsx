'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dumbbell,
  Apple,
  Sparkles,
  X,
  RefreshCw,
  CheckCircle2,
  Dot,
} from 'lucide-react';
import AlertModal from '../../components/AlertModal';
import ThemeToggle from '../../components/ThemeToggle';
import { gxFontClass } from '../../styles/fonts';

export default function SeleccionServicioPage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loadingConvocatoria, setLoadingConvocatoria] = useState(false);

  const router = useRouter();

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
    } catch {
      setAlertMessage('Error al verificar la convocatoria');
      setAlertOpen(true);
    } finally {
      setLoadingConvocatoria(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className={`gx-scope gx-app ${gxFontClass}`}>
      <header className="gx-app-topbar">
        <div className="gx-app-topbar-inner">
          <Link href="/" className="gx-brand">
            <span className="gx-brand-mark"><Dumbbell size={18} strokeWidth={2.4} /></span>
            <span className="gx-brand-name">SchedMaster</span>
          </Link>
          <div className="gx-app-topbar-actions">
            <ThemeToggle />
            <Link href="/login" className="gx-btn gx-btn--outline gx-btn--sm">Iniciar sesión</Link>
          </div>
        </div>
      </header>

      <section className="gx-app-hero">
        <span className="gx-eyebrow" style={{ margin: '0 auto 14px' }}><Sparkles size={13} /> Selección de servicio</span>
        <h1>Reserva tu <span className="gx-grad-text">bienestar</span></h1>
        <p>Elige el servicio que deseas y comienza tu experiencia saludable.</p>
      </section>

      <section className="gx-app-section">
        <div className="gx-service-grid">
          <button type="button" className="gx-card gx-card--hover gx-service-card" onClick={handleQuieroEntrenar} disabled={loadingConvocatoria}>
            <span className="gx-service-icon">
              {loadingConvocatoria ? <RefreshCw size={22} className="gx-spin" /> : <Dumbbell size={22} />}
            </span>
            <h3>Gimnasio</h3>
            <p>{loadingConvocatoria ? 'Verificando convocatoria...' : 'Reserva tu horario de entrenamiento'}</p>
          </button>

          <div className="gx-card gx-service-card is-disabled">
            <span className="gx-service-icon"><Apple size={22} /></span>
            <h3>Enfermería</h3>
            <p>Próximamente</p>
          </div>

          <div className="gx-card gx-service-card is-disabled">
            <span className="gx-service-icon"><Sparkles size={22} /></span>
            <h3>Próximamente</h3>
            <p>Nuevos talleres en camino</p>
          </div>
        </div>

        <div className="gx-app-section-label"><div><span>Consejos</span><h2>Para ti</h2></div></div>
        <div className="gx-tip-grid">
          <div className="gx-card gx-tip-card"><Dot size={16} style={{ verticalAlign: '-3px', color: 'var(--gx-blue-500)' }} />Mantente hidratado durante tu entrenamiento</div>
          <div className="gx-card gx-tip-card"><Dot size={16} style={{ verticalAlign: '-3px', color: 'var(--gx-blue-500)' }} />Incluye verduras en cada comida</div>
          <div className="gx-card gx-tip-card"><Dot size={16} style={{ verticalAlign: '-3px', color: 'var(--gx-blue-500)' }} />Dormir bien mejora tu rendimiento físico</div>
        </div>
      </section>

      {openModal && (
        <div className="gx-waitlist-overlay" onClick={closeModal}>
          <div className="gx-card gx-waitlist-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gx-waitlist-close" onClick={closeModal} title="Cerrar" aria-label="Cerrar">
              <X size={17} />
            </button>

            {sent ? (
              <div className="gx-waitlist-success">
                <div className="gx-waitlist-success-icon"><CheckCircle2 size={26} /></div>
                <h2 style={{ marginBottom: 0 }}>Registro confirmado</h2>
                <p style={{ marginBottom: 0 }}>Te notificaremos cuando se habilite la próxima convocatoria.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>Convocatoria cerrada</h2>
                <p>Déjanos tu correo y te avisaremos cuando se abra la próxima convocatoria.</p>

                <div className="gx-field">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tucorreo@uteq.edu.mx"
                    required
                    className="gx-input"
                  />
                </div>
                <button type="submit" className="gx-btn gx-btn--primary gx-btn--full gx-btn--lg">
                  Notificarme
                </button>
              </form>
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
