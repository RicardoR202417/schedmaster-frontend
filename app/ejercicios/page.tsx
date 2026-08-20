import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import Reveal from '../components/Reveal';
import { gxFontClass } from '../styles/fonts';

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
    <div className={`gx-scope gx-home ${gxFontClass}`}>
      <SiteHeader />

      <section className="gx-ex-hero">
        <div className="gx-ex-hero-bg">
          <div className="gx-hero-orb gx-hero-orb--1 gx-float-a" />
          <div className="gx-hero-orb gx-hero-orb--2 gx-float-b" />
        </div>
        <div className="gx-ex-hero-inner">
          <span className="gx-eyebrow gx-eyebrow--on-dark"><Sparkles size={13} /> Nuevo · en avance</span>
          <h1>Ejercicios con <span style={{ background: 'linear-gradient(135deg,var(--gx-blue-400),var(--gx-violet-400))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>animación guiada</span></h1>
          <p>
            Estamos integrando un dataset de más de 1,300 ejercicios con animaciones paso a paso.
            Nuestro entrenador virtual ya puede mostrarte la técnica correcta en el chat — aquí tienes
            un adelanto de lo que viene.
          </p>
        </div>
      </section>

      <section className="gx-ex-grid-section">
        <div className="gx-container">
          <div className="gx-ex-grid">
            {exercises.map((exercise, i) => (
              <Reveal as="div" key={exercise.name} delay={(i % 4) * 60} className="gx-ex-card">
                <div className="gx-ex-card-media">
                  <img src={exercise.gif} alt={exercise.name} loading="lazy" />
                </div>
                <div className="gx-ex-card-body">
                  <h3>{exercise.name}</h3>
                  <div className="gx-ex-card-tags">
                    <span className="gx-chip">{exercise.bodyPart}</span>
                    <span className="gx-chip">{exercise.equipment}</span>
                  </div>
                </div>
              </Reveal>
            ))}

            {exercises.length === 0 && (
              <div className="gx-ex-empty">
                <p>El dataset de ejercicios aún no está descargado en este entorno.</p>
                <small>Corre <code>npm run fetch:exercises</code> para generarlo.</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="gx-cta-wrap">
        <div className="gx-container">
          <div className="gx-cta-card">
            <div className="gx-cta-inner">
              <h2>¿Quieres una rutina hecha a tu medida?</h2>
              <p>Habla con nuestro entrenador virtual y te recomendará ejercicios como estos según tu objetivo.</p>
              <Link href="/seleccion-servicio" className="gx-btn gx-btn--energy gx-btn--lg">
                Ir al gimnasio <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
