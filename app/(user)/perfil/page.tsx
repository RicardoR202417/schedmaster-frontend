'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Calendar, Clock, Home, LogOut, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../../components/ThemeToggle';
import AvisoPrivacidadModal from "@/app/components/AvisoPrivacidadModal";
import { gxFontClass } from '../../styles/fonts';

interface User {
  id_usuario?: number;
  id_rol?: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  estadoInscripcion?: string;

  carrera?: {
    nombre_carrera: string;
  };

  division?: {
    nombre_division: string;
  };

  ultimaInscripcion?: {
    horario?: {
      hora_inicio: string;
      hora_fin: string;
      periodo?: {
        nombre_periodo: string;
      };
      horarioDias?: {
        dia: {
          nombre: string;
        };
      }[];
    };
  };
}

export default function PerfilPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [showAviso, setShowAviso] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return <div className={`gx-scope ${gxFontClass}`}><p className="loader">Cargando perfil...</p></div>;
  }

  const inscripcion = user.ultimaInscripcion;
  const horario = inscripcion?.horario;

  const dias = horario?.horarioDias
    ?.map(hd => hd.dia.nombre)
    .join(', ');

  return (
    <div className={`gx-scope gx-app ${gxFontClass}`}>
      <header className="gx-app-topbar">
        <div className="gx-app-topbar-inner">
          <Link href="/anuncios" className="gx-brand">
            <span className="gx-brand-mark"><Dumbbell size={18} strokeWidth={2.4} /></span>
            <span className="gx-brand-name">SchedMaster</span>
          </Link>
          <div className="gx-app-topbar-actions">
            <ThemeToggle />
            <Link href="/anuncios" className="gx-btn gx-btn--outline gx-btn--sm">
              <Home size={16} /> Inicio
            </Link>
          </div>
        </div>
      </header>

      <section className="gx-app-hero">
        <h1>Mi <span className="gx-grad-text">perfil</span></h1>
        <p>Consulta tu información y tu inscripción actual</p>
      </section>

      <section className="gx-app-section">
        <div className="gx-profile-grid">
          <div className="gx-card gx-profile-card">
            <div className="gx-profile-card-head"><UserIcon size={18} /> Información personal</div>

            <div className="gx-profile-field">
              <span>Nombre</span>
              <p>{`${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`}</p>
            </div>
            <div className="gx-profile-field">
              <span>Correo</span>
              <p>{user.correo}</p>
            </div>
            <div className="gx-profile-field">
              <span>Carrera</span>
              <p>{user.carrera?.nombre_carrera || 'No asignada'}</p>
            </div>
            <div className="gx-profile-field">
              <span>División</span>
              <p>{user.division?.nombre_division || 'No asignada'}</p>
            </div>
          </div>

          <div className="gx-card gx-profile-card">
            <div className="gx-profile-card-head"><Calendar size={18} /> Periodo inscrito</div>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: 'var(--gx-text-dim)' }}>
              {horario?.periodo?.nombre_periodo || 'Sin periodo'}
            </p>
            <span className="gx-status-badge" style={{ width: 'fit-content' }}>
              {user.estadoInscripcion === 'aprobado' ? 'Activo' : 'Pendiente'}
            </span>
          </div>

          <div className="gx-card gx-profile-card">
            <div className="gx-profile-card-head"><Clock size={18} /> Horario asignado</div>
            <div className="gx-profile-field">
              <span>Día</span>
              <p>{dias || 'No disponible'}</p>
            </div>
            <div className="gx-profile-field">
              <span>Hora</span>
              <p>{horario ? `${horario.hora_inicio} - ${horario.hora_fin}` : 'No disponible'}</p>
            </div>
          </div>
        </div>

        <div className="gx-profile-actions">
          <button className="gx-btn gx-btn--outline" onClick={() => setShowAviso(true)}>
            Aviso de privacidad
          </button>
          <button className="gx-btn gx-btn--outline" onClick={handleLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </section>

      <AvisoPrivacidadModal
        open={showAviso}
        onClose={() => setShowAviso(false)}
      />
    </div>
  );
}
