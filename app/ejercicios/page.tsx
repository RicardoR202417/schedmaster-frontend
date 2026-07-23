import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { Dumbbell, ArrowLeft, Sparkles } from 'lucide-react';
import type { ExerciseEntry } from '../lib/exerciseSearch';

export const metadata = {
  title: 'Ejercicios | SchedMaster',
  description: 'Explora ejercicios con animaciones, guiados por nuestro entrenador virtual.',
};

// IDs curados del dataset (todos con GIF ya descargado en public/exercises-dataset).
const FEATURED_IDS = ['0662', '0652', '1160', '0630', '0274', '1685', '3582', '2612'];

function loadFeaturedExercises(): ExerciseEntry[] {
  try {
    const indexPath = path.join(process.cwd(), 'public', 'exercises-dataset', 'index.json');
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const all: ExerciseEntry[] = JSON.parse(raw);
    const byId = new Map(all.map((e) => [e.id, e]));
    return FEATURED_IDS.map((id) => byId.get(id)).filter((e): e is ExerciseEntry => Boolean(e));
  } catch {
    return [];
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function EjerciciosPage() {
  const exercises = loadFeaturedExercises();

  return (
    <div className="home-page">
      {/* ── Header ─────────────────────────────── */}
      <header className="home-header home-header--scrolled">
        <div className="home-header-inner">
          <Link href="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <div className="logo-icon">
              <Dumbbell size={24} />
            </div>
            <span className="logo-text">SchedMaster</span>
          </Link>
          <nav className="home-nav">
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/beneficios">Beneficios</Link>
            <Link href="/ejercicios">Ejercicios</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="home-header-actions">
            <Link href="/" className="btn btn--back">
              <ArrowLeft size={16} /> Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* ── Intro ──────────────────────────────── */}
      <section className="ejercicios-hero">
        <div className="ejercicios-hero-inner">
          <div className="section-label">
            <span><Sparkles size={12} style={{ marginRight: 4, verticalAlign: '-2px' }} />Nuevo · en avance</span>
          </div>
          <h1 className="section-title">
            Ejercicios con <span className="highlight">animación guiada</span>
          </h1>
          <p className="section-desc">
            Estamos integrando un dataset de más de 1,300 ejercicios con animaciones paso a paso.
            Nuestro entrenador virtual ya puede mostrarte la técnica correcta en el chat — aquí tienes
            un adelanto de lo que viene.
          </p>
        </div>
      </section>

      {/* ── Grid ───────────────────────────────── */}
      <section className="ejercicios-grid-section">
        <div className="ejercicios-grid">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="ejercicio-card">
              <div className="ejercicio-card-media">
                <img src={exercise.gif} alt={exercise.name} loading="lazy" />
              </div>
              <div className="ejercicio-card-body">
                <h3>{capitalize(exercise.name)}</h3>
                <div className="ejercicio-card-tags">
                  <span className="chip chip--asistente">{capitalize(exercise.bodyPart)}</span>
                  <span className="chip chip--asistente">{capitalize(exercise.equipment)}</span>
                </div>
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="empty-state">
              <p>El dataset de ejercicios aún no está descargado en este entorno.</p>
              <small>Corre <code>npm run fetch:exercises</code> para generarlo.</small>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-bg-pattern" />
        <div className="cta-container">
          <div className="cta-content">
            <h2>¿Quieres una rutina hecha a tu medida?</h2>
            <p>Habla con nuestro entrenador virtual y te recomendará ejercicios como estos según tu objetivo.</p>
            <Link href="/seleccion-servicio" className="btn btn--yellow btn--lg cta-btn">
              Ir al gimnasio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
