'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Info, Calendar, ChevronRight } from 'lucide-react';
import { gxFontClass } from '../../styles/fonts';

export default function ConvocatoriaActivaPage() {
  const params = useSearchParams();
  const router = useRouter();

  const data    = params.get('data');
  const periodo = data ? JSON.parse(decodeURIComponent(data)) : null;

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
          <div className="gx-status-hero">
            <div className="gx-status-icon"><Info size={22} /></div>
            <div>
              <h1>Convocatoria activa</h1>
              <p className="gx-status-message">
                Actualmente existe un periodo de inscripción abierto.
                Para participar debes registrarte dentro de las fechas establecidas.
              </p>
              {periodo && (
                <div className="gx-status-badge">
                  <Calendar size={14} />
                  {periodo.nombre_periodo}
                </div>
              )}
            </div>
          </div>

          {periodo && (
            <div className="gx-status-foot" style={{ marginTop: 18, paddingTop: 0, borderTop: 'none' }}>
              <p>
                <strong>Inscripciones:</strong><br />
                {new Date(periodo.fecha_inicio_inscripcion).toLocaleDateString()} —{' '}
                {new Date(periodo.fecha_fin_inscripcion).toLocaleDateString()}
              </p>
              <p style={{ marginTop: 10 }}>
                <strong>Actividades:</strong><br />
                {new Date(periodo.fecha_inicio_actividades).toLocaleDateString()} —{' '}
                {new Date(periodo.fecha_fin_periodo).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="gx-status-actions">
            <button className="gx-btn gx-btn--primary gx-btn--full gx-btn--lg" onClick={() => router.push('/register')}>
              Ir a registro <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
