'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, X, Dumbbell } from 'lucide-react';
import { loadExerciseIndex, normalize, type ExerciseEntry } from '../lib/exerciseSearch';

export type ExerciseDraft = {
  key: string;
  nombre_ejercicio: string;
  series: string;
  repeticiones: string;
  descanso_segundos: string;
  notas: string;
};

export type RoutineDraft = {
  nombre: string;
  descripcion: string;
  ejercicios: ExerciseDraft[];
};

function newExerciseDraft(): ExerciseDraft {
  return {
    key: Math.random().toString(36).slice(2),
    nombre_ejercicio: '',
    series: '',
    repeticiones: '',
    descanso_segundos: '',
    notas: '',
  };
}

export function emptyRoutineDraft(): RoutineDraft {
  return { nombre: '', descripcion: '', ejercicios: [newExerciseDraft()] };
}

interface ExerciseNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  catalog: ExerciseEntry[];
}

function ExerciseNameField({ value, onChange, catalog }: Readonly<ExerciseNameFieldProps>) {
  const [suggestions, setSuggestions] = useState<ExerciseEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (next: string) => {
    onChange(next);

    const query = normalize(next);
    if (!query || catalog.length === 0) {
      setSuggestions([]);
      return;
    }

    const matches = catalog
      .filter((ex) => normalize(ex.name).includes(query))
      .slice(0, 6);

    setSuggestions(matches);
    setShowSuggestions(true);
  };

  return (
    <div className="gx-exercise-autocomplete" ref={wrapRef}>
      <input
        type="text"
        className="gx-input"
        placeholder="Nombre del ejercicio (ej. Press de banca)"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => value && setShowSuggestions(true)}
        required
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="gx-exercise-suggestions">
          {suggestions.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(ex.name);
                  setShowSuggestions(false);
                }}
              >
                <Dumbbell size={13} />
                <span>{ex.name}</span>
                <small>{ex.bodyPart}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface RoutineFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  draft: RoutineDraft;
  onChange: (draft: RoutineDraft) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

export default function RoutineFormModal({
  open,
  mode,
  draft,
  onChange,
  onClose,
  onSubmit,
  submitting = false,
}: Readonly<RoutineFormModalProps>) {
  const [catalog, setCatalog] = useState<ExerciseEntry[]>([]);

  useEffect(() => {
    if (open && catalog.length === 0) {
      loadExerciseIndex().then(setCatalog);
    }
  }, [open, catalog.length]);

  if (!open) return null;

  const updateExercise = (key: string, patch: Partial<ExerciseDraft>) => {
    onChange({
      ...draft,
      ejercicios: draft.ejercicios.map((ej) => (ej.key === key ? { ...ej, ...patch } : ej)),
    });
  };

  const addExercise = () => {
    onChange({ ...draft, ejercicios: [...draft.ejercicios, newExerciseDraft()] });
  };

  const removeExercise = (key: string) => {
    onChange({ ...draft, ejercicios: draft.ejercicios.filter((ej) => ej.key !== key) });
  };

  const canSubmit = draft.nombre.trim().length > 0
    && draft.ejercicios.some((ej) => ej.nombre_ejercicio.trim().length > 0);

  return (
    <div className="gx-modal-overlay" onClick={onClose}>
      <div className="gx-card gx-routine-form" onClick={(e) => e.stopPropagation()}>
        <div className="gx-routine-form-head">
          <h2>{mode === 'create' ? 'Nueva rutina' : 'Editar rutina'}</h2>
          <button type="button" className="gx-modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="gx-routine-form-body">
          <div className="gx-field">
            <label htmlFor="rutina-nombre">Nombre de la rutina</label>
            <input
              id="rutina-nombre"
              type="text"
              className="gx-input"
              placeholder="Ej. Rutina de fuerza — tren superior"
              value={draft.nombre}
              onChange={(e) => onChange({ ...draft, nombre: e.target.value })}
              required
            />
          </div>

          <div className="gx-field">
            <label htmlFor="rutina-descripcion">Descripción (opcional)</label>
            <textarea
              id="rutina-descripcion"
              className="gx-input gx-textarea"
              placeholder="Objetivo, nivel recomendado, notas generales..."
              value={draft.descripcion}
              onChange={(e) => onChange({ ...draft, descripcion: e.target.value })}
              rows={2}
            />
          </div>

          <div className="gx-routine-form-exercises-head">
            <span className="gx-field-label">Ejercicios</span>
            <button type="button" className="gx-btn gx-btn--outline gx-btn--sm" onClick={addExercise}>
              <Plus size={15} /> Agregar ejercicio
            </button>
          </div>

          <div className="gx-exercise-list">
            {draft.ejercicios.map((ej, index) => (
              <div className="gx-exercise-row" key={ej.key}>
                <div className="gx-exercise-row-top">
                  <span className="gx-exercise-index">{index + 1}</span>
                  <ExerciseNameField
                    value={ej.nombre_ejercicio}
                    onChange={(value) => updateExercise(ej.key, { nombre_ejercicio: value })}
                    catalog={catalog}
                  />
                  <button
                    type="button"
                    className="gx-exercise-remove"
                    onClick={() => removeExercise(ej.key)}
                    disabled={draft.ejercicios.length === 1}
                    aria-label="Quitar ejercicio"
                    title="Quitar ejercicio"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="gx-exercise-row-grid">
                  <input
                    type="number"
                    min={1}
                    className="gx-input"
                    placeholder="Series"
                    value={ej.series}
                    onChange={(e) => updateExercise(ej.key, { series: e.target.value })}
                  />
                  <input
                    type="text"
                    className="gx-input"
                    placeholder="Reps (ej. 8-10)"
                    value={ej.repeticiones}
                    onChange={(e) => updateExercise(ej.key, { repeticiones: e.target.value })}
                  />
                  <input
                    type="number"
                    min={0}
                    className="gx-input"
                    placeholder="Descanso (seg)"
                    value={ej.descanso_segundos}
                    onChange={(e) => updateExercise(ej.key, { descanso_segundos: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  className="gx-input"
                  placeholder="Notas (opcional): tempo, peso sugerido, técnica..."
                  value={ej.notas}
                  onChange={(e) => updateExercise(ej.key, { notas: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="gx-routine-form-footer">
          <button type="button" className="gx-btn gx-btn--outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="gx-btn gx-btn--primary"
            onClick={onSubmit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? 'Guardando...' : mode === 'create' ? 'Crear rutina' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
