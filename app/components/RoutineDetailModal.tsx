'use client';

import { X, Calendar, User as UserIcon, Dumbbell, Repeat, Clock, StickyNote, Download } from 'lucide-react';

export interface RoutineExercise {
  id_rutina_ejercicio: number;
  nombre_ejercicio: string;
  series: number | null;
  repeticiones: string | null;
  descanso_segundos: number | null;
  notas: string | null;
  orden: number;
}

export interface RoutineDetail {
  id_rutina: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string;
  id_rutina_origen?: number | null;
  usuario: { id_usuario: number; nombre: string; apellido_paterno: string; apellido_materno: string };
  origen?: { usuario: { nombre: string; apellido_paterno: string } } | null;
  ejercicios: RoutineExercise[];
  _count?: { copias?: number };
}

function nombreCompleto(u: { nombre: string; apellido_paterno: string; apellido_materno?: string }) {
  return `${u.nombre} ${u.apellido_paterno}${u.apellido_materno ? ` ${u.apellido_materno}` : ''}`;
}

interface RoutineDetailModalProps {
  routine: RoutineDetail | null;
  onClose: () => void;
  onTake?: (routine: RoutineDetail) => void;
  taking?: boolean;
  showTakeAction?: boolean;
  onDownload?: (routine: RoutineDetail) => void;
}

export default function RoutineDetailModal({
  routine,
  onClose,
  onTake,
  taking = false,
  showTakeAction = false,
  onDownload,
}: Readonly<RoutineDetailModalProps>) {
  if (!routine) return null;

  return (
    <div className="gx-modal-overlay" onClick={onClose}>
      <div className="gx-card gx-routine-detail" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gx-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="gx-routine-detail-head">
          <span className="gx-service-icon"><Dumbbell size={20} /></span>
          <div>
            <h2>{routine.nombre}</h2>
            <div className="gx-routine-detail-meta">
              <span><UserIcon size={13} /> {nombreCompleto(routine.usuario)}</span>
              <span><Calendar size={13} /> {new Date(routine.fecha_creacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {routine.origen?.usuario && (
              <span className="gx-chip" style={{ marginTop: 8 }}>
                Tomada de {nombreCompleto(routine.origen.usuario)}
              </span>
            )}
          </div>
        </div>

        {routine.descripcion && <p className="gx-routine-detail-desc">{routine.descripcion}</p>}

        <div className="gx-routine-exercise-table">
          {routine.ejercicios.map((ej, i) => (
            <div className="gx-routine-exercise-item" key={ej.id_rutina_ejercicio ?? i}>
              <span className="gx-exercise-index">{i + 1}</span>
              <div className="gx-routine-exercise-info">
                <strong>{ej.nombre_ejercicio}</strong>
                <div className="gx-routine-exercise-tags">
                  {ej.series != null && <span className="gx-chip"><Repeat size={11} /> {ej.series} series</span>}
                  {ej.repeticiones && <span className="gx-chip">{ej.repeticiones} reps</span>}
                  {ej.descanso_segundos != null && <span className="gx-chip"><Clock size={11} /> {ej.descanso_segundos}s descanso</span>}
                </div>
                {ej.notas && <p className="gx-routine-exercise-notes"><StickyNote size={12} /> {ej.notas}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="gx-routine-detail-footer">
          {onDownload && (
            <button type="button" className="gx-btn gx-btn--outline" onClick={() => onDownload(routine)}>
              <Download size={16} /> Descargar PDF
            </button>
          )}
          {showTakeAction && onTake && (
            <button
              type="button"
              className="gx-btn gx-btn--primary gx-btn--full"
              onClick={() => onTake(routine)}
              disabled={taking}
            >
              {taking ? 'Guardando...' : 'Tomar rutina'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
