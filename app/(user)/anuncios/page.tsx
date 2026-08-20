'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Dumbbell, User, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import ThemeToggle from '../../components/ThemeToggle';
import Reveal from '../../components/Reveal';
import { gxFontClass } from '../../styles/fonts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_URL.replace('/api', '');

const getAnnouncementImageUrl = (fotografia?: string | null) => {
  if (!fotografia) return null;
  if (/^https?:\/\//i.test(fotografia) || fotografia.startsWith('/')) return fotografia;
  return `${BASE_URL}/imagenes/${fotografia}`;
};

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
  fotografia?: string;
  fecha_publicacion: string;
}

export default function HomeUserPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/anuncios`)
      .then(res => res.json())
      .then(data => setAnuncios(data))
      .catch(err => console.error(err));
  }, []);

  return (
<<<<<<< HEAD
    <div className="home-page">
      <header className="home-header">
        <div className="logo-section">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span>SchedMaster</span>
=======
    <div className={`gx-scope gx-app ${gxFontClass}`}>
      <header className="gx-app-topbar">
        <div className="gx-app-topbar-inner">
          <span className="gx-brand">
            <span className="gx-brand-mark"><Dumbbell size={18} strokeWidth={2.4} /></span>
            <span className="gx-brand-name">SchedMaster</span>
          </span>
          <div className="gx-app-topbar-actions">
            <ThemeToggle />
            <Link href="/perfil" className="gx-btn gx-btn--icon gx-btn--outline" aria-label="Mi perfil">
              <User size={18} />
            </Link>
          </div>
>>>>>>> 4b4a7b420896697ca861eb3196535359c836f64c
        </div>
      </header>

      <section className="gx-app-hero">
        <h1>Tablón del <span className="gx-grad-text">gimnasio</span></h1>
        <p>Mantente al tanto de los avisos y novedades de tu comunidad universitaria.</p>
      </section>

      <section className="gx-app-section">
        <div className="gx-app-section-label">
          <div>
            <span>Anuncios</span>
            <h2>Novedades recientes</h2>
          </div>
        </div>

        <div className="gx-announcement-grid">
          {anuncios.length === 0 ? (
            <p className="gx-announcement-empty">No hay anuncios disponibles</p>
          ) : (
<<<<<<< HEAD
            anuncios.map((a) => {
              const imageUrl = getAnnouncementImageUrl(a.fotografia);

              return (
                <div className="card" key={a.id}>
                  <div className="support-item">
                    <div className="state">SM</div>
                    <div>
                      <p className="announcement-title">
                        {a.titulo}
                      </p>
                      <small className="announcement-date">
                        {new Date(a.fecha_publicacion).toLocaleDateString()}
                      </small>
                    </div>
=======
            anuncios.map((a, i) => (
              <Reveal as="div" key={a.id} delay={(i % 3) * 60} className="gx-card gx-card--hover gx-announcement-card">
                <div className="gx-announcement-head">
                  <span className="gx-announcement-avatar"><Megaphone size={16} /></span>
                  <div>
                    <p className="gx-announcement-title">{a.titulo}</p>
                    <span className="gx-announcement-date">
                      {new Date(a.fecha_publicacion).toLocaleDateString()}
                    </span>
>>>>>>> 4b4a7b420896697ca861eb3196535359c836f64c
                  </div>

                  <p className="message">
                    {a.descripcion}
                  </p>

                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="anuncio"
                      className="announcement-image"
                    />
                  )}
                </div>
<<<<<<< HEAD
              );
            })
=======

                <p>{a.descripcion}</p>

                {a.fotografia && (
                  <img
                    src={`${BASE_URL}/imagenes/${a.fotografia}`}
                    alt="anuncio"
                    className="gx-announcement-image"
                  />
                )}
              </Reveal>
            ))
>>>>>>> 4b4a7b420896697ca861eb3196535359c836f64c
          )}
        </div>
      </section>
    </div>
  );
}
