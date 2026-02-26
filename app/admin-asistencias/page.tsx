'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import './admin-asistencias.css';

// ==========================================
// Interfaces
// ==========================================

// Paleta de colores para avatares (se cicla por ID)
const AVATAR_COLORS = [
  'avatar-c1', 'avatar-c2', 'avatar-c3', 'avatar-c4',
  'avatar-c5', 'avatar-c6', 'avatar-c7', 'avatar-c8',
] as const;

const getAvatarClass = (id: number) =>
  AVATAR_COLORS[id % AVATAR_COLORS.length];

interface Asistencia {
  id: number;
  nombre: string;
  apellido: string;
  iniciales: string;
  horarioInicio: string;
  horarioFin: string;
  tipoEntrenamiento: string;
  carrera: string;
  matricula: string;
  estado: 'presente' | 'ausente' | 'pendiente';
}

// ==========================================
// Componente
// ==========================================

export default function AdminAsistenciasPage() {
  // ==========================================
  // Estados
  // ==========================================

  // TODO: Cargar asistencias desde API en useEffect
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  const [fecha, setFecha] = useState<string>(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });

  const [filterHorario, setFilterHorario]     = useState('');
  const [filterTipo, setFilterTipo]           = useState('');
  const [filterEstado, setFilterEstado]       = useState('pendiente');
  const [filterCarrera, setFilterCarrera]     = useState('');

  const [filteredAsistencias, setFilteredAsistencias] = useState<Asistencia[]>([]);

  // ==========================================
  // Efectos
  // ==========================================

  // TODO: Cargar asistencias al cambiar la fecha
  // useEffect(() => {
  //   const fetchAsistencias = async () => {
  //     try {
  //       const response = await fetch(`API_URL/asistencias?fecha=${fecha}`);
  //       const data = await response.json();
  //       setAsistencias(data);
  //     } catch (error) {
  //       console.error('Error cargando asistencias:', error);
  //     }
  //   };
  //   fetchAsistencias();
  // }, [fecha]);

  useEffect(() => {
    let filtered = [...asistencias];

    if (filterHorario) {
      filtered = filtered.filter(
        (a) => `${a.horarioInicio}-${a.horarioFin}` === filterHorario
      );
    }
    if (filterTipo) {
      filtered = filtered.filter(
        (a) => a.tipoEntrenamiento.toLowerCase() === filterTipo.toLowerCase()
      );
    }
    if (filterEstado) {
      filtered = filtered.filter((a) => a.estado === filterEstado);
    }
    if (filterCarrera) {
      filtered = filtered.filter(
        (a) => a.carrera.toLowerCase() === filterCarrera.toLowerCase()
      );
    }

    setFilteredAsistencias(filtered);
  }, [asistencias, filterHorario, filterTipo, filterEstado, filterCarrera]);

  // ==========================================
  // Valores derivados
  // ==========================================

  const totalReservas = asistencias.length;
  const presentes     = asistencias.filter((a) => a.estado === 'presente').length;
  const ausentes      = asistencias.filter((a) => a.estado === 'ausente').length;
  const tasaAsistencia =
    presentes + ausentes > 0
      ? Math.round((presentes / (presentes + ausentes)) * 100)
      : 0;

  // ==========================================
  // Handlers
  // ==========================================

  const handleMarcarPresente = (id: number) => {
    // TODO: Llamada a API PATCH /asistencias/:id { estado: 'presente' }
    setAsistencias((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: 'presente' } : a))
    );
  };

  const handleMarcarAusente = (id: number) => {
    // TODO: Llamada a API PATCH /asistencias/:id { estado: 'ausente' }
    setAsistencias((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: 'ausente' } : a))
    );
  };

  const handleRefresh = () => {
    // TODO: Refrescar datos desde la API con la fecha actual
    console.log('Refrescar asistencias para:', fecha);
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
          <header className="asist-header" aria-label="Encabezado de asistencias">
            <div className="asist-title">
              <h2>Control de Asistencias</h2>
              <p>Registra y monitorea la asistencia de los usuarios</p>
            </div>
            <div className="asist-date-wrap">
              <label htmlFor="fechaAsistencia" className="asist-date-label">
                Seleccionar fecha
              </label>
              <input
                id="fechaAsistencia"
                type="date"
                className="asist-date-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </header>

          {/* Filtros */}
          <section className="controls" aria-label="Filtros de asistencias">
            <select
              className="select"
              aria-label="Filtrar por horario"
              value={filterHorario}
              onChange={(e) => setFilterHorario(e.target.value)}
            >
              <option value="">Todos los horarios</option>
              {/* TODO: Poblar dinámicamente desde API */}
            </select>

            <select
              className="select"
              aria-label="Filtrar por tipo de entrenamiento"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="">Todos</option>
              {/* TODO: Poblar dinámicamente desde API */}
            </select>

            <select
              className="select"
              aria-label="Filtrar por estado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="presente">Presentes</option>
              <option value="ausente">Ausentes</option>
            </select>

            <select
              className="select"
              aria-label="Filtrar por carrera"
              value={filterCarrera}
              onChange={(e) => setFilterCarrera(e.target.value)}
            >
              <option value="">Todas</option>
              {/* TODO: Poblar dinámicamente desde API */}
            </select>

            <button className="btn btn-outline" type="button" onClick={handleRefresh}>
              <RefreshCw aria-hidden="true" />
              Actualizar
            </button>
          </section>

          {/* Tarjetas de estadísticas */}
          <section className="stats-grid" aria-label="Resumen de asistencia">
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-card-value">{totalReservas}</span>
                <span className="stat-card-label">TOTAL RESERVAS</span>
              </div>
              <div className="stat-card-circle stat-card-circle--blue" aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-card-value">{presentes}</span>
                <span className="stat-card-label">PRESENTES</span>
              </div>
              <div className="stat-card-circle stat-card-circle--green" aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-card-value">{ausentes}</span>
                <span className="stat-card-label">AUSENTES</span>
              </div>
              <div className="stat-card-circle stat-card-circle--red" aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-card-value">{tasaAsistencia}%</span>
                <span className="stat-card-label">TASA ASISTENCIA</span>
              </div>
              <div className="stat-card-circle stat-card-circle--yellow" aria-hidden="true" />
            </div>
          </section>

          {/* Lista de asistencias */}
          <section className="user-list" aria-label="Lista de asistencias">
            {filteredAsistencias.length === 0 ? (
              <div className="asist-empty">
                <p className="asist-empty-title">No hay registros para mostrar</p>
                <p className="asist-empty-desc">
                  Los registros de asistencia aparecerán aquí una vez conectada la API
                </p>
              </div>
            ) : (
              filteredAsistencias.map((asist) => (
                <div
                  key={asist.id}
                  className={`user-row user-row--${asist.estado}`}
                >
                  {/* Avatar */}
                  <div
                    className={`user-avatar ${getAvatarClass(asist.id)}`}
                    aria-hidden="true"
                  >
                    {asist.iniciales}
                  </div>

                  {/* Info */}
                  <div className="user-info">
                    <span className="user-name">
                      {asist.nombre} {asist.apellido}
                    </span>
                    <span className="user-meta">
                      {asist.horarioInicio} - {asist.horarioFin}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      {asist.tipoEntrenamiento}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      {asist.carrera}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      {asist.matricula}
                    </span>
                  </div>

                  {/* Acciones / Estado */}
                  <div className="user-actions">
                    {asist.estado === 'pendiente' ? (
                      <>
                        <button
                          className="btn-mini btn-presente"
                          type="button"
                          onClick={() => handleMarcarPresente(asist.id)}
                        >
                          Presente
                        </button>
                        <button
                          className="btn-mini btn-ausente"
                          type="button"
                          onClick={() => handleMarcarAusente(asist.id)}
                        >
                          Ausente
                        </button>
                      </>
                    ) : (
                      <span
                        className={`chip ${
                          asist.estado === 'presente'
                            ? 'chip-presente'
                            : 'chip-ausente'
                        }`}
                      >
                        {asist.estado.toUpperCase()}
                      </span>
                    )}
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
