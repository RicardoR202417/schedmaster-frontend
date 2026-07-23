import Link from 'next/link';
import { Dumbbell, ArrowLeft, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Ejercicios | SchedMaster',
  description: 'Explora ejercicios con animaciones, guiados por nuestro entrenador virtual.',
};

// Adelanto curado del dataset de ejercicios. Estos 8 archivos (imagen + gif, ~0.8MB
// en total) se versionan directo en public/ejercicios-preview para que esta pagina
// funcione en cualquier entorno sin depender de "npm run fetch:exercises" (que
// descarga el dataset completo de 1,300+ ejercicios a public/exercises-dataset,
// gitignored por su peso, y solo es necesario para la busqueda del ChatBot).
const FEATURED_EXERCISES = [
  { name: 'Push-up', bodyPart: 'Chest', equipment: 'Body weight', gif: '/ejercicios-preview/0662-I4hDWkc.gif' },
  { name: 'Pull-up', bodyPart: 'Back', equipment: 'Body weight', gif: '/ejercicios-preview/0652-lBDjFxJ.gif' },
  { name: 'Burpee', bodyPart: 'Cardio', equipment: 'Body weight', gif: '/ejercicios-preview/1160-dK9394r.gif' },
  { name: 'Mountain climber', bodyPart: 'Cardio', equipment: 'Body weight', gif: '/ejercicios-preview/0630-RJgzwny.gif' },
  { name: 'Crunch floor', bodyPart: 'Waist', equipment: 'Body weight', gif: '/ejercicios-preview/0274-TFqbd8t.gif' },
  { name: 'Squat to overhead reach', bodyPart: 'Upper legs', equipment: 'Body weight', gif: '/ejercicios-preview/1685-QChZi3x.gif' },
  { name: 'Lunge with jump', bodyPart: 'Upper legs', equipment: 'Body weight', gif: '/ejercicios-preview/3582-PM1PZjg.gif' },
  { name: 'Jump rope', bodyPart: 'Cardio', equipment: 'Rope', gif: '/ejercicios-preview/2612-e1e76I2.gif' },
];

export default function EjerciciosPage() {
  const exercises = FEATURED_EXERCISES;

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
            <div key={exercise.name} className="ejercicio-card">
              <div className="ejercicio-card-media">
                <img src={exercise.gif} alt={exercise.name} loading="lazy" />
              </div>
              <div className="ejercicio-card-body">
                <h3>{exercise.name}</h3>
                <div className="ejercicio-card-tags">
                  <span className="chip chip--asistente">{exercise.bodyPart}</span>
                  <span className="chip chip--asistente">{exercise.equipment}</span>
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
