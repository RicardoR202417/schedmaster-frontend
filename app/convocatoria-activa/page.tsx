'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Info, Calendar, ChevronRight } from 'lucide-react';

export default function ConvocatoriaActivaPage() {
  const params = useSearchParams();
  const router = useRouter();

  const data    = params.get('data');
  const periodo = data ? JSON.parse(decodeURIComponent(data)) : null;

  return (
    <div className="page">
      <div className="wrap">

        <div className="top">
          <div className="brand">SchedMaster</div>
        </div>

        <div className="card">

          <div className="hero">
            <div className="state"><Info /></div>
            <div>
              <h1>Convocatoria activa</h1>
              <p className="message">
                Actualmente existe un periodo de inscripción abierto.
                Para participar debes registrarte dentro de las fechas establecidas.
              </p>
              {periodo && (
                <div className="status" style={{ marginTop: 12 }}>
                  <Calendar />
                  {periodo.nombre_periodo}
                </div>
              )}
            </div>
          </div>

          {periodo && (
            <div className="foot">
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

          <div className="actions">
            {/* btn--full + btn--lg reemplaza btn-primary */}
            <button className="btn btn--blue btn--full btn--lg" onClick={() => router.push('/register')}>
              Ir a registro <ChevronRight />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}