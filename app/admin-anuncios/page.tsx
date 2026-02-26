"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Megaphone, Menu } from "lucide-react";
import "./admin-anuncios.css";

interface Anuncio {
  id: number;
  titulo: string;
  prioridad: "Alta" | "Media" | "Baja";
   fotografia: string;
  fecha_publicacion: string;
  activo: boolean;
}

export default function AdminAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Anuncio | null>(null);

  useEffect(() => {
    setAnuncios([
      {
        id: 1,
        titulo: "Convocatoria abierta",
        prioridad: "Alta",
        fecha_publicacion: "2026-02-25",
        fotografia: "foto.jpeg",
        activo: true,
      },
      {
        id: 2,
        titulo: "Mantenimiento del sistema",
        prioridad: "Media",
        fecha_publicacion: "2026-02-20",
         fotografia: "foto.jpeg",
        activo: false,
      },
    ]);
  }, []);

  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-open");
  };

  const anunciosFiltrados = anuncios.filter(a =>
    a.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (a: Anuncio) => {
    setEditing(a);
    setModalOpen(true);
  };

  const deleteAnuncio = (id: number) => {
    setAnuncios(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      {/* 🔹 BOTÓN HAMBURGUESA */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      <main className="main">
        <div className="main-inner">

          <header className="header">
            <div className="title">
              <h2>Anuncios</h2>
              <p>Crea avisos importantes para los usuarios inscritos</p>
            </div>

            <div className="header-actions">
              <button className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Nuevo anuncio
              </button>
            </div>
          </header>

          <section className="controls">
            <div className="field">
              <Search />
              <input
                placeholder="Buscar anuncio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </section>

          <section className="table-area">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Prioridad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Fotografia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {anunciosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <div className="empty-state-content">
                            <Megaphone size={32} />
                            <p className="empty-state-title">No hay anuncios</p>
                            <p className="empty-state-description">
                              Los anuncios aparecerán aquí
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    anunciosFiltrados.map(a => (
                      <tr key={a.id}>
                        <td>{a.titulo}</td>
                        <td>{a.prioridad}</td>
                        <td>{a.fecha_publicacion}</td>
                        
                        <td>{a.activo ? "Activo" : "Oculto"}</td>
                        <td>{a.fotografia}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn btn-accept"
                              onClick={() => openEdit(a)}
                            >
                              <Pencil size={14} /> Editar
                            </button>

                            <button
                              className="btn btn-reject"
                              onClick={() => deleteAnuncio(a.id)}
                            >
                              <Trash2 size={14} /> Eliminar
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
    </>
  );
}