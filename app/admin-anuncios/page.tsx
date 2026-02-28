'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Megaphone } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface Anuncio {
  id: number;
  titulo: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  fotografia: string;
  fecha_publicacion: string;
  activo: boolean;
}

export default function AdminAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [search, setSearch]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<Anuncio | null>(null);

  useEffect(() => {
    setAnuncios([
      { id: 1, titulo: 'Convocatoria abierta',      prioridad: 'Alta',  fotografia: 'foto.jpeg', fecha_publicacion: '2026-02-25', activo: true  },
      { id: 2, titulo: 'Mantenimiento del sistema', prioridad: 'Media', fotografia: 'foto.jpeg', fecha_publicacion: '2026-02-20', activo: false },
    ]);
  }, []);

  const anunciosFiltrados = anuncios.filter(a =>
    a.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (a: Anuncio) => { setEditing(a); setModalOpen(true); };
  const deleteAnuncio = (id: number) => setAnuncios(prev => prev.filter(a => a.id !== id));

  const prioridadChip = (p: string) => {
    if (p === 'Alta')  return 'chip chip--alta';
    if (p === 'Baja')  return 'chip chip--baja';
    return 'chip chip--pendiente';
  };

  return (
    <div className="app">
      <AdminSidebar />

      <main className="main">
        <div className="main-inner">

          {/* Header */}
          <header className="section-header">
            <div>
              <h2>Anuncios</h2>
              <p>Crea avisos importantes para los usuarios inscritos</p>
            </div>
            <button className="btn btn--yellow" onClick={openCreate}>
              <Plus size={16} /> Nuevo anuncio
            </button>
          </header>

          {/* Búsqueda */}
          <div className="filter-bar">
            <div className="field">
              <Search />
              <input
                placeholder="Buscar anuncio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla */}
          <section className="table-area">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Prioridad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Fotografía</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {anunciosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <Megaphone size={32} />
                          <p>No hay anuncios</p>
                          <small>Los anuncios aparecerán aquí</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    anunciosFiltrados.map(a => (
                      <tr key={a.id}>
                        <td>{a.titulo}</td>
                        <td><span className={prioridadChip(a.prioridad)}>{a.prioridad}</span></td>
                        <td className="muted">{a.fecha_publicacion}</td>
                        <td>
                          <span className={`chip ${a.activo ? 'chip--activo' : 'chip--inactivo'}`}>
                            {a.activo ? 'Activo' : 'Oculto'}
                          </span>
                        </td>
                        <td className="muted">{a.fotografia}</td>
                        <td>
                          <div className="row-actions">
                            <button className="btn-icon btn-icon--cyan" onClick={() => openEdit(a)} aria-label="Editar">
                              <Pencil size={14} />
                            </button>
                            <button className="btn-icon btn-icon--red" onClick={() => deleteAnuncio(a.id)} aria-label="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}