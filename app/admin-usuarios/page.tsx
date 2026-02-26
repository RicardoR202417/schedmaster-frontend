'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Pencil, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import './admin-usuarios.css';

// ==========================================
// Tipos
// ==========================================

type Rol    = 'asistente' | 'admin' | 'docente' | 'entrenador' | 'nutriologa';
type Estado = 'activo' | 'inactivo';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  iniciales: string;
  correo: string;
  matricula: string;
  carrera: string;
  rol: Rol;
  estado: Estado;
}

// ==========================================
// Helpers
// ==========================================

const AVATAR_COLORS = [
  'avatar-c1', 'avatar-c2', 'avatar-c3', 'avatar-c4',
  'avatar-c5', 'avatar-c6', 'avatar-c7', 'avatar-c8',
] as const;

const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const ROL_LABELS: Record<Rol, string> = {
  asistente:   'Asistente',
  admin:       'Admin',
  docente:     'Docente',
  entrenador:  'Entrenador',
  nutriologa:  'Nutrióloga',
};

// ==========================================
// Componente
// ==========================================

export default function AdminUsuariosPage() {
  // ==========================================
  // Estados
  // ==========================================

  // TODO: Cargar usuarios desde API en useEffect
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterRol,      setFilterRol]      = useState('');
  const [filterEstado,   setFilterEstado]   = useState('');
  const [filterCarrera,  setFilterCarrera]  = useState('');

  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);

  // ==========================================
  // Efectos
  // ==========================================

  // TODO: Cargar lista de usuarios al montar
  // useEffect(() => {
  //   const fetchUsuarios = async () => {
  //     try {
  //       const response = await fetch('API_URL/usuarios');
  //       const data = await response.json();
  //       setUsuarios(data);
  //     } catch (error) {
  //       console.error('Error cargando usuarios:', error);
  //     }
  //   };
  //   fetchUsuarios();
  // }, []);

  useEffect(() => {
    let filtered = [...usuarios];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((u) =>
        `${u.nombre} ${u.apellido} ${u.correo} ${u.matricula}`
          .toLowerCase()
          .includes(q)
      );
    }
    if (filterRol) {
      filtered = filtered.filter((u) => u.rol === filterRol);
    }
    if (filterEstado) {
      filtered = filtered.filter((u) => u.estado === filterEstado);
    }
    if (filterCarrera) {
      filtered = filtered.filter((u) =>
        u.carrera.toLowerCase() === filterCarrera.toLowerCase()
      );
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchQuery, filterRol, filterEstado, filterCarrera]);

  // ==========================================
  // Handlers
  // ==========================================

  const handleNuevoUsuario = () => {
    // TODO: Abrir modal o redirigir a formulario de nuevo usuario
    console.log('Nuevo usuario');
  };

  const handleEditar = (id: number) => {
    // TODO: Abrir modal de edición con los datos del usuario id
    console.log('Editar usuario:', id);
  };

  const handleEliminar = (id: number) => {
    // TODO: Confirmar y llamar a API DELETE /usuarios/:id
    console.log('Eliminar usuario:', id);
  };

  const handleLogout = () => {
    // TODO: Implementar logout y redirección
    console.log('Cerrar sesión');
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="app">
      {/* SIDEBAR */}
      <AdminSidebar onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="main" aria-label="Contenido principal">
        <div className="main-inner">

          {/* Header */}
          <header className="usr-header" aria-label="Encabezado de usuarios">
            <div className="usr-title">
              <h2>Gestión de Usuarios</h2>
              <p>Administra los usuarios de la plataforma</p>
            </div>
            <button className="btn btn-yellow" type="button" onClick={handleNuevoUsuario}>
              <UserPlus aria-hidden="true" />
              Nuevo Usuario
            </button>
          </header>

          {/* Filtros */}
          <section className="usr-filters" aria-label="Filtros de usuarios">
            <div className="field usr-search" role="search">
              <Search aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, matrícula o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="select"
              aria-label="Filtrar por rol"
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="asistente">Asistente</option>
              <option value="admin">Admin</option>
              <option value="docente">Docente</option>
              <option value="entrenador">Entrenador</option>
              <option value="nutriologa">Nutrióloga</option>
              {/* TODO: Poblar dinámicamente desde API */}
            </select>

            <select
              className="select"
              aria-label="Filtrar por estado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <select
              className="select"
              aria-label="Filtrar por carrera"
              value={filterCarrera}
              onChange={(e) => setFilterCarrera(e.target.value)}
            >
              <option value="">Todas las carreras</option>
              {/* TODO: Poblar dinámicamente desde API */}
            </select>
          </section>

          {/* Lista de usuarios */}
          <section className="usr-list" aria-label="Lista de usuarios">
            {filteredUsuarios.length === 0 ? (
              <div className="usr-empty">
                <p className="usr-empty-title">No hay usuarios para mostrar</p>
                <p className="usr-empty-desc">
                  Los usuarios registrados aparecerán aquí una vez conectada la API
                </p>
              </div>
            ) : (
              filteredUsuarios.map((usr) => (
                <div key={usr.id} className="usr-card">
                  {/* Avatar */}
                  <div
                    className={`usr-avatar ${getAvatarClass(usr.id)}`}
                    aria-hidden="true"
                  >
                    {usr.iniciales}
                  </div>

                  {/* Info */}
                  <div className="usr-info">
                    <span className="usr-name">
                      {usr.nombre} {usr.apellido}
                    </span>
                    <span className="usr-email muted">{usr.correo}</span>
                    <div className="usr-tags">
                      <span className="usr-tag">{usr.matricula}</span>
                      <span className="usr-tag">{usr.carrera}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="usr-actions">
                    <span className={`chip chip-rol chip-rol--${usr.rol}`}>
                      {ROL_LABELS[usr.rol]}
                    </span>
                    <span className={`chip chip-estado chip-estado--${usr.estado}`}>
                      {usr.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                      className="btn-icon btn-icon--edit"
                      type="button"
                      aria-label={`Editar a ${usr.nombre} ${usr.apellido}`}
                      onClick={() => handleEditar(usr.id)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn-icon btn-icon--delete"
                      type="button"
                      aria-label={`Eliminar a ${usr.nombre} ${usr.apellido}`}
                      onClick={() => handleEliminar(usr.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
