'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LogOut,
  Info,
  Clock,
  LifeBuoy,
  ChevronDown,
  Mail,
  Phone,
  Check,
  X
} from 'lucide-react';
import AlertModal from '../../components/AlertModal';
import ConfirmModal from '../../components/ConfirmModal';
import { gxFontClass } from '../../styles/fonts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const formatHora = (valor: string | undefined): string => {
  if (!valor) return '--:--';
  if (/^\d{2}:\d{2}/.test(valor)) return valor.substring(0, 5);
  try {
    return new Date(valor).toISOString().substring(11, 16);
  } catch {
    return valor;
  }
};

export default function PendingAccountPage() {
  const router = useRouter();

  const [user, setUser]                             = useState<any>(null);
  const [propuesta, setPropuesta]                   = useState<any>(null);
  const [loading, setLoading]                       = useState(true);
  const [alertOpen, setAlertOpen]                   = useState(false);
  const [alertTitle, setAlertTitle]                 = useState('Aviso');
  const [alertMessage, setAlertMessage]             = useState('');
  const [redirectAfterAlert, setRedirectAfterAlert] = useState(false);
  const [confirmRechazarOpen, setConfirmRechazarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const mostrarAlerta = (titulo: string, mensaje: string, redirigir = false) => {
    setAlertTitle(titulo);
    setAlertMessage(mensaje);
    setRedirectAfterAlert(redirigir);
    setAlertOpen(true);
  };

  const aceptarPropuesta = async () => {
    try {
      const res = await fetch(`${API_URL}/propuestas/aceptar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_propuesta: propuesta.id_propuesta })
      });

      if (res.ok) {
        localStorage.removeItem('user');
        mostrarAlerta(
          'Propuesta aceptada',
          'Propuesta aceptada correctamente. Inicia sesión nuevamente para continuar.',
          true
        );
      } else {
        mostrarAlerta('Error', 'No se pudo aceptar la propuesta.');
      }
    } catch {
      mostrarAlerta('Error de conexión', 'No fue posible conectar con el servidor.');
    }
  };

  const rechazarPropuesta = async () => {
    setConfirmRechazarOpen(false);
    try {
      const res = await fetch(`${API_URL}/propuestas/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_propuesta: propuesta.id_propuesta })
      });

      if (res.ok) {
        setPropuesta(null);
        mostrarAlerta(
          'Propuesta rechazada',
          'Has rechazado la propuesta. Tu solicitud ha sido cancelada. Puedes registrarte nuevamente cuando lo desees.'
        );
      } else {
        mostrarAlerta('Error', 'No se pudo rechazar la propuesta.');
      }
    } catch {
      mostrarAlerta('Error de conexión', 'No fue posible conectar con el servidor.');
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser?.id_usuario) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user?.id_usuario) return;

    const fetchPropuesta = async () => {
      try {
        const res  = await fetch(`${API_URL}/propuestas/usuario/${user.id_usuario}`);
        const data = await res.json();
        if (data) setPropuesta(data);
      } catch (error) {
        console.error('Error obteniendo propuesta', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropuesta();
  }, [user]);

  const nombresDias = (dias: any[]): string => {
    if (!dias?.length) return 'Sin días asignados';
    return dias
      .map(d => d?.dia?.nombre ?? d?.nombre ?? '')
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className={`gx-scope gx-status-page ${gxFontClass}`}>
      <div className="gx-status-bg">
        <div className="gx-hero-orb gx-hero-orb--1 gx-float-a" />
        <div className="gx-hero-orb gx-hero-orb--2 gx-float-b" />
      </div>

      <div className="gx-status-wrap">
        <div className="gx-status-top">
          <span className="gx-status-brand">SchedMaster</span>
        </div>

        <section className="gx-card gx-status-card">
          {!loading && propuesta && (
            <>
              <div className="gx-status-hero">
                <div className="gx-status-icon"><Info size={22} /></div>
                <div>
                  <h1>Nueva propuesta de horario</h1>
                  <p className="gx-status-message">
                    El administrador ha propuesto un horario alternativo para tu inscripción.
                    Revísalo y decide si lo aceptas o lo rechazas.
                  </p>
                </div>
              </div>

              <div className="gx-proposal-box">
                <div>
                  <strong>Horario:</strong>{' '}
                  {formatHora(propuesta.horario?.hora_inicio)} –{' '}
                  {formatHora(propuesta.horario?.hora_fin)}
                </div>
                <div>
                  <strong>Días:</strong>{' '}
                  {nombresDias(propuesta.dias)}
                </div>
              </div>
            </>
          )}

          {!loading && !propuesta && (
            <div className="gx-status-hero">
              <div className="gx-status-icon"><Info size={22} /></div>
              <div>
                <h1>Cuenta pendiente de aprobación</h1>
                <p className="gx-status-message">
                  Tu cuenta fue registrada correctamente. En cuanto el administrador
                  la apruebe, podrás acceder al sistema.
                </p>
                <div className="gx-status-badge">
                  <Clock size={14} /> Estado: Pendiente
                </div>
              </div>
            </div>
          )}

          <div className="gx-status-actions">
            {propuesta && (
              <div className="gx-status-actions-row">
                <button className="gx-btn gx-btn--primary gx-btn--lg" onClick={aceptarPropuesta}>
                  <Check size={17} /> Aceptar
                </button>

                <button className="gx-btn gx-btn--outline gx-btn--lg" onClick={() => setConfirmRechazarOpen(true)}>
                  <X size={17} /> Rechazar
                </button>
              </div>
            )}

            <button className="gx-btn gx-btn--outline gx-btn--full gx-btn--lg" onClick={handleLogout}>
              <LogOut size={17} /> Cerrar sesión
            </button>
          </div>

          <div className="gx-status-foot">
            Si tu cuenta ya fue aprobada y sigues viendo esta pantalla,
            cierra sesión e inicia nuevamente.
          </div>

          <div className="gx-support">
            <details>
              <summary>
                <span className="gx-support-sum-left"><LifeBuoy size={16} /> Soporte</span>
                <ChevronDown className="gx-support-chev" size={16} />
              </summary>
              <div className="gx-support-body">
                <div className="gx-support-item">
                  <Mail size={16} />
                  <div>
                    Correo:{' '}
                    <a href="mailto:soporte@schedmaster.uteq.mx">
                      soporte@schedmaster.uteq.mx
                    </a>
                    <small>Incluye tu matrícula y una breve descripción.</small>
                  </div>
                </div>

                <div className="gx-support-item">
                  <Phone size={16} />
                  <div>
                    Teléfono:{' '}
                    <a href="tel:+524421234567">
                      +52 442 123 4567
                    </a>
                    <small>Horario: Lunes a Viernes.</small>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>
      </div>

      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false);
          if (redirectAfterAlert) router.push('/login');
        }}
      />

      <ConfirmModal
        open={confirmRechazarOpen}
        title="Rechazar propuesta"
        message="¿Estás seguro? Tu solicitud de inscripción quedará cancelada y tendrás que registrarte nuevamente."
        confirmText="Sí, rechazar"
        cancelText="Cancelar"
        onConfirm={rechazarPropuesta}
        onCancel={() => setConfirmRechazarOpen(false)}
      />
    </div>
  );
}
