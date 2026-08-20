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
    <div className="home-page">
      <header className="home-header">
        <div className="logo-section">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span>SchedMaster</span>
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
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
