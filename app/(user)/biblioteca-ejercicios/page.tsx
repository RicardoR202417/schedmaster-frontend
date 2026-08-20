'use client';

import { useMemo, useState } from 'react';
import { Search, X, Dumbbell } from 'lucide-react';
import StudentShell from '../../components/StudentShell';
import Reveal from '../../components/Reveal';
import { gxFontClass } from '../../styles/fonts';
import { normalize } from '../../lib/exerciseSearch';
import exerciseLibraryData from '../../lib/exerciseLibrary.json';

interface LibraryExercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  target: string;
  muscleGroup: string;
  gif: string;
  image: string;
  steps: string[];
}

const library = exerciseLibraryData as LibraryExercise[];

const CATEGORIES = ['Todos', ...Array.from(new Set(library.map((ex) => ex.category)))];

export default function BibliotecaEjerciciosPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState<LibraryExercise | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return library.filter((ex) => {
      const matchesCategory = category === 'Todos' || ex.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return normalize(ex.name).includes(q) || normalize(ex.target).includes(q) || normalize(ex.muscleGroup).includes(q);
    });
  }, [query, category]);

  return (
    <div className={`gx-scope gx-app ${gxFontClass}`}>
      <StudentShell />

      <section className="gx-app-hero">
        <h1>Biblioteca de <span className="gx-grad-text">ejercicios</span></h1>
        <p>Explora la técnica correcta con animaciones paso a paso antes de armar tu rutina.</p>
      </section>

      <div className="gx-ex-toolbar">
        <div className="gx-ex-search">
          <Search size={17} />
          <input
            type="text"
            className="gx-input"
            placeholder="Buscar ejercicio, músculo o equipo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="gx-ex-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`gx-ex-filter ${category === cat ? 'is-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="gx-ex-count">{filtered.length} ejercicio{filtered.length === 1 ? '' : 's'}</p>
      </div>

      <section className="gx-app-section" style={{ paddingTop: 0 }}>
        <div className="gx-ex-lib-grid">
          {filtered.map((ex, i) => (
            <Reveal as="button" key={ex.id} delay={(i % 8) * 40} className="gx-ex-lib-card" type="button" onClick={() => setSelected(ex)}>
              <div className="gx-ex-lib-media">
                <img src={ex.gif} alt={ex.name} loading="lazy" />
              </div>
              <div className="gx-ex-lib-body">
                <h3>{ex.name}</h3>
                <div className="gx-ex-lib-tags">
                  <span className="gx-chip">{ex.category}</span>
                  <span className="gx-chip">{ex.equipment}</span>
                </div>
              </div>
            </Reveal>
          ))}

          {filtered.length === 0 && (
            <div className="gx-empty-state">
              <span className="gx-empty-state-icon"><Search size={24} /></span>
              <h3>Sin resultados</h3>
              <p>No encontramos ejercicios para "{query}". Prueba con otro término o categoría.</p>
            </div>
          )}
        </div>

        <p className="gx-ex-attribution">
          Animaciones © <a href="https://gymvisual.com/" target="_blank" rel="noopener noreferrer">Gym visual</a>
        </p>
      </section>

      {selected && (
        <div className="gx-modal-overlay" onClick={() => setSelected(null)}>
          <div className="gx-card gx-ex-detail" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gx-modal-close" onClick={() => setSelected(null)} aria-label="Cerrar">
              <X size={18} />
            </button>
            <div className="gx-ex-detail-media">
              <img src={selected.gif} alt={selected.name} />
            </div>
            <div className="gx-ex-detail-body">
              <h2>{selected.name}</h2>
              <div className="gx-ex-detail-tags">
                <span className="gx-chip"><Dumbbell size={11} /> {selected.category}</span>
                <span className="gx-chip">{selected.equipment}</span>
                <span className="gx-chip">Trabaja: {selected.target}</span>
              </div>
              {selected.steps.length > 0 && (
                <ol className="gx-ex-detail-steps">
                  {selected.steps.map((step, i) => (
                    <li key={i}>
                      <span className="gx-ex-step-index">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
