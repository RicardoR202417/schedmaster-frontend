'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import Bitacora, { type Comentario } from '../components/Bitacora';

type Rol    = 'asistente' | 'admin' | 'docente' | 'entrenador' | 'nutriologa';
type Estado = 'activo' | 'inactivo';

interface Usuario {
  id: number; nombre: string; apellido: string; iniciales: string;
  correo: string; matricula: string; carrera: string; rol: Rol; estado: Estado;
}

const AVATAR_COLORS = ['ac1','ac2','ac3','ac4','ac5','ac6','ac7','ac8'] as const;
const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const ROL_LABELS: Record<Rol, string> = {
  asistente: 'Asistente', admin: 'Admin', docente: 'Docente',
  entrenador: 'Entrenador', nutriologa: 'Nutrióloga',
};

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1, nombre: 'María', apellido: 'González', iniciales: 'MG',
      correo: 'maria.gonzalez@uteq.edu.mx', matricula: '2021-001',
      carrera: 'Ing. en Sistemas', rol: 'asistente', estado: 'activo',
    },
  ]);

  const BITACORA_MOCK: Record<number, Comentario[]> = {
    1: [
      { id: 1, autorNombre: 'Admin UTEQ', autorIniciales: 'AU',
        fecha: '2026-02-20T10:30:00.000Z', texto: 'Se verificó la identidad del usuario.' },
    ],
  };

  const [searchQuery,   setSearchQuery]   = useState('');
  const [filterRol,     setFilterRol]     = useState('');
  const [filterEstado,  setFilterEstado]  = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [bitacoraOpen,  setBitacoraOpen]  = useState(false);
  const [bitacoraUsuario, setBitacoraUsuario] = useState<{ id: number; nombre: string } | null>(null);

  useEffect(() => {
    let f = [...usuarios];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(u => `${u.nombre} ${u.apellido} ${u.correo} ${u.matricula}`.toLowerCase().includes(q));
    }
    if (filterRol)     f = f.filter(u => u.rol === filterRol);
    if (filterEstado)  f = f.filter(u => u.estado === filterEstado);
    if (filterCarrera) f = f.filter(u => u.carrera.toLowerCase() === filterCarrera.toLowerCase());
    setFilteredUsuarios(f);
  }, [usuarios, searchQuery, filterRol, filterEstado, filterCarrera]);

  const handleLogout    = () => console.log('Cerrar sesión');
  const handleEditar    = (id: number) => console.log('Editar:', id);
  const handleEliminar  = (id: number) => console.log('Eliminar:', id);
  const handleBitacora  = (id: number, nombre: string) => { setBitacoraUsuario({ id, nombre }); setBitacoraOpen(true); };

  return (
    <div className="app">
      <AdminSidebar onLogout={handleLogout} />

      <main className="main">
        <div className="main-inner">

          {/* Header */}
          <header className="section-header">
            <div>
              <h2>Gestión de Usuarios</h2>
              <p>Administra los usuarios de la plataforma</p>
            </div>
            <button className="btn btn--yellow" type="button" onClick={() => console.log('Nuevo usuario')}>
              <UserPlus /> Nuevo Usuario
            </button>
          </header>

          {/* Filtros */}
          <section className="filter-bar">
            <div className="field">
              <Search />
              <input type="search" placeholder="Buscar por nombre, matrícula o correo..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <select className="select" value={filterRol} onChange={e => setFilterRol(e.target.value)}>
              <option value="">Todos los roles</option>
              <option value="asistente">Asistente</option>
              <option value="admin">Admin</option>
              <option value="docente">Docente</option>
              <option value="entrenador">Entrenador</option>
              <option value="nutriologa">Nutrióloga</option>
            </select>
            <select className="select" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <select className="select" value={filterCarrera} onChange={e => setFilterCarrera(e.target.value)}>
              <option value="">Todas las carreras</option>
            </select>
          </section>

          {/* Lista */}
          <section className="row-list">
            {filteredUsuarios.length === 0 ? (
              <div className="empty-state">
                <p>No hay usuarios para mostrar</p>
                <small>Los usuarios registrados aparecerán aquí una vez conectada la API</small>
              </div>
            ) : (
              filteredUsuarios.map(usr => (
                <div key={usr.id} className="row-card">
                  <div className={`row-avatar ${getAvatarClass(usr.id)}`}>{usr.iniciales}</div>

                  <div className="row-info">
                    <span className="row-name">{usr.nombre} {usr.apellido}</span>
                    <span className="row-sub muted">{usr.correo}</span>
                    <div className="row-tags">
                      <span className="row-tag">{usr.matricula}</span>
                      <span className="row-tag">{usr.carrera}</span>
                    </div>
                  </div>

                  <div className="row-actions">
                    <span className={`chip chip--${usr.rol}`}>{ROL_LABELS[usr.rol]}</span>
                    <span className={`chip chip--${usr.estado}`}>
                      {usr.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                    <button className="btn-icon btn-icon--blue" type="button"
                      aria-label={`Bitácora de ${usr.nombre}`}
                      onClick={() => handleBitacora(usr.id, `${usr.nombre} ${usr.apellido}`)}>
                      <ClipboardList />
                    </button>
                    <button className="btn-icon btn-icon--cyan" type="button"
                      aria-label={`Editar a ${usr.nombre}`} onClick={() => handleEditar(usr.id)}>
                      <Pencil />
                    </button>
                    <button className="btn-icon btn-icon--red" type="button"
                      aria-label={`Eliminar a ${usr.nombre}`} onClick={() => handleEliminar(usr.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

        </div>
      </main>

      {bitacoraUsuario && (
        <Bitacora
          isOpen={bitacoraOpen}
          onClose={() => setBitacoraOpen(false)}
          usuarioId={bitacoraUsuario.id}
          usuarioNombre={bitacoraUsuario.nombre}
          comentariosIniciales={BITACORA_MOCK[bitacoraUsuario.id] ?? []}
        />
      )}
    </div>
  );
}