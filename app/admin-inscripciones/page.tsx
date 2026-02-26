'use client';

import { useState, useEffect } from 'react';
import './admin-inscripciones.css';
import {
  Users,
  Download,
  RefreshCw,
  Search,
  XCircle,
  Check,
  X,
  Clock,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Dumbbell,
  Stethoscope,
  Shield,
  Flame,
  Sparkles,
  CalendarDays,
  MessageCircle,
  Send,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

// ==========================================
// Constantes y Configuración
// ==========================================

// Generador de horarios
const generarHorarios = (inicio: number, fin: number, intervalo: number = 30): string[] => {
  const horarios: string[] = [];
  for (let hora = inicio; hora <= fin; hora++) {
    for (let minuto = 0; minuto < 60; minuto += intervalo) {
      if (hora === fin && minuto > 0) break;
      const horaStr = hora.toString().padStart(2, '0');
      const minutoStr = minuto.toString().padStart(2, '0');
      horarios.push(`${horaStr}:${minutoStr}`);
    }
  }
  return horarios;
};

const HORARIOS_INICIO = generarHorarios(6, 21);
const HORARIOS_FIN = generarHorarios(6, 22).slice(1);

// Capacidades por horario
const CAPACIDADES_HORARIO: { [key: string]: number } = {
  '06:00': 25, '06:30': 25,
  '07:00': 28, '07:30': 28,
  '08:00': 30, '08:30': 30,
  '09:00': 30, '09:30': 30,
  '10:00': 30, '10:30': 28,
  '11:00': 28, '11:30': 28,
  '12:00': 25, '12:30': 25,
  '13:00': 25, '13:30': 25,
  '14:00': 28, '14:30': 28,
  '15:00': 30, '15:30': 30,
  '16:00': 32, '16:30': 32,
  '17:00': 32, '17:30': 32,
  '18:00': 35, '18:30': 35,
  '19:00': 35, '19:30': 30,
  '20:00': 30, '20:30': 25,
  '21:00': 25,
};

// Días de la semana
const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

// Configuración de roles
const ROL_CONFIG = {
  estudiante: { icon: GraduationCap, nombre: 'Estudiante' },
  docente: { icon: Briefcase, nombre: 'Docente' },
  entrenador: { icon: Dumbbell, nombre: 'Entrenador' },
  nutriologa: { icon: Stethoscope, nombre: 'Nutrióloga' },
  administrador_general: { icon: Shield, nombre: 'Admin general' },
} as const;

// Divisiones
const DIVISIONES = [
  { value: 'dtai', label: 'DTAI' },
  { value: 'dmec', label: 'DMEC' },
  { value: 'dind', label: 'DIND' },
  { value: 'dea', label: 'DEA' },
  { value: 'dae', label: 'DAE' },
];

// Roles disponibles
const ROLES = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'docente', label: 'Docente' },
  { value: 'entrenador', label: 'Entrenador' },
  { value: 'nutriologa', label: 'Nutrióloga' },
  { value: 'administrador_general', label: 'Administrador general' },
];

// Prioridades
const PRIORIDADES = [
  { value: 'alta', label: 'Alta' },
  { value: 'baja', label: 'Baja' },
];

// ==========================================
// Interfaces
// ==========================================

interface Inscripcion {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  rol: string;
  division: string;
  carrera: string;
  cuatrimestre: string;
  prioridad: 'alta' | 'baja';
  registro: string;
}

interface ModalData {
  userId: number;
  userName: string;
  userEmail: string;
}

export default function AdminInscripcionesPage() {
  // ==========================================
  // Estados
  // ==========================================

  // TODO: Cargar inscripciones desde API en useEffect
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');
  const [filterDivision, setFilterDivision] = useState('');

  // Estados para el modal
  const [modalActive, setModalActive] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [modalForm, setModalForm] = useState({
    periodo: '',
    horaInicio: '',
    horaFin: '',
    dias: [] as string[],
    mensaje: '',
  });
  const [capacidadDisplay, setCapacidadDisplay] = useState('Selecciona un horario');

  // ==========================================
  // Efectos
  // ==========================================

  // TODO: Agregar useEffect para cargar datos iniciales
  // useEffect(() => {
  //   const fetchInscripciones = async () => {
  //     try {
  //       const response = await fetch('API_URL/inscripciones');
  //       const data = await response.json();
  //       setInscripciones(data);
  //     } catch (error) {
  //       console.error('Error cargando inscripciones:', error);
  //     }
  //   };
  //   fetchInscripciones();
  // }, []);

  const [filteredInscripciones, setFilteredInscripciones] = useState<Inscripcion[]>(inscripciones);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let filtered = [...inscripciones];

    // Filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((insc) => {
        const fullText = `${insc.id} ${insc.nombre} ${insc.apellido_paterno} ${insc.apellido_materno} ${insc.correo}`.toLowerCase();
        return fullText.includes(query);
      });
    }

    // Filtro de rol
    if (filterRol) {
      filtered = filtered.filter((insc) => insc.rol === filterRol);
    }

    // Filtro de prioridad
    if (filterPrioridad) {
      filtered = filtered.filter((insc) => insc.prioridad === filterPrioridad);
    }

    // Filtro de división
    if (filterDivision) {
      filtered = filtered.filter((insc) => insc.division.toLowerCase() === filterDivision.toLowerCase());
    }

    setFilteredInscripciones(filtered);
  }, [searchQuery, filterRol, filterPrioridad, filterDivision, inscripciones]);

  // ==========================================
  // Funciones Helper
  // ==========================================

  const getRolInfo = (rol: string) => {
    const config = ROL_CONFIG[rol as keyof typeof ROL_CONFIG];
    if (config) {
      const IconComponent = config.icon;
      return { icon: <IconComponent />, nombre: config.nombre };
    }
    return { icon: <Users />, nombre: rol };
  };

  const getCapacidad = (hora: string): string => {
    return CAPACIDADES_HORARIO[hora] ? `${CAPACIDADES_HORARIO[hora]} personas` : 'Selecciona un horario';
  };

  const validateCounterProposal = (): string | null => {
    if (!modalForm.periodo) return 'Por favor selecciona un periodo';
    if (!modalForm.horaInicio) return 'Por favor selecciona una hora de inicio';
    if (!modalForm.horaFin) return 'Por favor selecciona una hora de fin';
    if (modalForm.horaInicio >= modalForm.horaFin) return 'La hora de fin debe ser posterior a la hora de inicio';
    if (modalForm.dias.length === 0) return 'Por favor selecciona al menos un día de la semana';
    return null;
  };

  // ==========================================
  // Valores Derivados
  // ==========================================

  const countPendientes = filteredInscripciones.length;
  const countAlta = filteredInscripciones.filter((i) => i.prioridad === 'alta').length;

  // ==========================================
  // Handlers
  // ==========================================

  // Modal
  const openCounterModal = (userId: number, userName: string, userEmail: string) => {
    setModalData({ userId, userName, userEmail });
    setModalActive(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCounterModal = () => {
    setModalActive(false);
    document.body.style.overflow = '';
    setModalForm({
      periodo: '',
      horaInicio: '',
      horaFin: '',
      dias: [],
      mensaje: '',
    });
    setCapacidadDisplay('Selecciona un horario');
    setModalData(null);
  };

  const updateCapacidad = (horaInicio: string) => {
    setCapacidadDisplay(getCapacidad(horaInicio));
  };

  const toggleDay = (day: string) => {
    setModalForm((prev) => ({
      ...prev,
      dias: prev.dias.includes(day)
        ? prev.dias.filter((d) => d !== day)
        : [...prev.dias, day],
    }));
  };

  const sendCounterProposal = () => {
    const error = validateCounterProposal();
    if (error) {
      alert(error);
      return;
    }

    const data = {
      userId: modalData?.userId,
      id_periodo: modalForm.periodo,
      hora_inicio: modalForm.horaInicio,
      hora_fin: modalForm.horaFin,
      capacidad_maxima: capacidadDisplay.replace(' personas', ''),
      dias: modalForm.dias,
      mensaje: modalForm.mensaje,
    };

    // TODO: Implementar llamada a API para enviar contrapropuesta
    console.log('Contrapropuesta a enviar:', data);
    
    closeCounterModal();
  };

  // Acciones
  const handleAccept = (id: number) => {
    // TODO: Implementar llamada a API para aceptar inscripción
    console.log('Aceptar inscripción:', id);
  };

  const handleReject = (id: number) => {
    // TODO: Implementar llamada a API para rechazar inscripción
    console.log('Rechazar inscripción:', id);
  };

  const handleExport = () => {
    // TODO: Implementar exportación de datos (CSV/PDF)
    console.log('Exportar inscripciones');
  };

  const handleRefresh = () => {
    // TODO: Implementar llamada a API para refrescar datos
    console.log('Refrescar datos de inscripciones');
  };

  const handleLogout = () => {
    // TODO: Implementar logout y redirección
    console.log('Cerrar sesión');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRol('');
    setFilterPrioridad('');
    setFilterDivision('');
  };

  return (
    <>
      <div className="app">
        {/* SIDEBAR — Componente reutilizable */}
        <AdminSidebar onLogout={handleLogout} />

        {/* MAIN CONTENT */}
        <main className="main" aria-label="Contenido principal">
          <div className="main-inner">
            {/* Header */}
            <header className="header" aria-label="Encabezado de inscripciones">
              <div className="title">
                <h2>Inscripciones de usuarios</h2>
                <p>
                  Valida registros pendientes. Puedes aceptar o rechazar la inscripción y asignar
                  prioridad alta o baja.
                </p>
              </div>

              <div className="header-actions" aria-label="Acciones rápidas">
                <div className="pill">
                  <Users /> Pendientes: <span>{countPendientes}</span>
                </div>
                <div className="pill">
                  <AlertTriangle /> Prioridad alta: <span>{countAlta}</span>
                </div>
                <button className="btn btn-outline" type="button" onClick={handleExport}>
                  <Download aria-hidden="true" />
                  Exportar
                </button>
                <button className="btn btn-primary" type="button" onClick={handleRefresh}>
                  <RefreshCw aria-hidden="true" />
                  Actualizar
                </button>
              </div>
            </header>

            {/* Controles y filtros */}
            <section className="controls" aria-label="Filtros y búsqueda">
              <div className="field" role="search">
                <Search aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Buscar por nombre, correo o ID de usuario..."
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
                <option value="">Rol: Todos</option>
                {ROLES.map((rol) => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>

              <select
                className="select"
                aria-label="Filtrar por prioridad"
                value={filterPrioridad}
                onChange={(e) => setFilterPrioridad(e.target.value)}
              >
                <option value="">Prioridad: Todas</option>
                {PRIORIDADES.map((prioridad) => (
                  <option key={prioridad.value} value={prioridad.value}>
                    {prioridad.label}
                  </option>
                ))}
              </select>

              <select
                className="select"
                aria-label="Filtrar por división"
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
              >
                <option value="">División: Todas</option>
                {DIVISIONES.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>

              <button className="btn btn-outline" type="button" onClick={clearFilters}>
                <XCircle aria-hidden="true" />
                Limpiar
              </button>
            </section>

            {/* Tabla */}
            <section className="table-area" aria-label="Tabla de inscripciones">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido paterno</th>
                      <th>Apellido materno</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>División</th>
                      <th>Carrera</th>
                      <th>Cuatrimestre</th>
                      <th>Prioridad</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInscripciones.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="empty-state">
                          <div className="empty-state-content">
                            <Users size={48} strokeWidth={1.5} />
                            <p className="empty-state-title">
                              No hay inscripciones pendientes
                            </p>
                            <p className="empty-state-description">
                              Los nuevos registros aparecerán aquí automáticamente
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredInscripciones.map((insc) => (
                        <tr key={insc.id}>
                        <td className="muted">{insc.id}</td>
                        <td>{insc.nombre}</td>
                        <td>{insc.apellido_paterno}</td>
                        <td>{insc.apellido_materno}</td>
                        <td>{insc.correo}</td>
                        <td>
                          <span className="chip chip-role">
                            {getRolInfo(insc.rol).icon} {getRolInfo(insc.rol).nombre}
                          </span>
                        </td>
                        <td className="muted">{insc.division}</td>
                        <td>{insc.carrera}</td>
                        <td className="muted">{insc.cuatrimestre}</td>
                        <td>
                          <span className={`chip ${insc.prioridad === 'alta' ? 'chip-high' : 'chip-low'}`}>
                            {insc.prioridad === 'alta' ? <Flame /> : <Sparkles />}{' '}
                            {insc.prioridad === 'alta' ? 'Alta' : 'Baja'}
                          </span>
                        </td>
                        <td className="muted">{insc.registro}</td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn-mini btn-accept"
                              type="button"
                              onClick={() => handleAccept(insc.id)}
                            >
                              <Check /> Aceptar
                            </button>
                            <button
                              className="btn-mini btn-reject"
                              type="button"
                              onClick={() => handleReject(insc.id)}
                            >
                              <X /> Rechazar
                            </button>
                            <button
                              className="btn-mini btn-counter"
                              type="button"
                              onClick={() =>
                                openCounterModal(
                                  insc.id,
                                  `${insc.nombre} ${insc.apellido_paterno} ${insc.apellido_materno}`,
                                  insc.correo
                                )
                              }
                            >
                              <Clock /> Contrapropuesta
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-hint">
                Tip: En pantallas pequeñas, desliza horizontalmente para ver todas las columnas.
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL CONTRAPROPUESTA */}
      <div
        className={`modal-overlay ${modalActive ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCounterModal();
        }}
      >
        <div className="modal-content" role="document">
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 id="modalTitle">Proponer horario alternativo</h3>
              <p>
                Usuario: {modalData?.userName} • {modalData?.userEmail}
              </p>
            </div>
            <button className="btn-close" type="button" onClick={closeCounterModal} aria-label="Cerrar modal">
              <X />
            </button>
          </div>

          <div className="modal-body">
            {/* Periodo */}
            <div className="form-group">
              <label htmlFor="selectPeriodo">
                <CalendarDays /> Periodo académico
              </label>
              <div className="select-with-icon">
                <select
                  id="selectPeriodo"
                  className="form-select"
                  required
                  value={modalForm.periodo}
                  onChange={(e) => setModalForm({ ...modalForm, periodo: e.target.value })}
                >
                  <option value="" disabled>
                    No hay periodos disponibles
                  </option>
                </select>
                <CalendarDays />
              </div>
            </div>

            {/* Horario */}
            <div className="form-group">
              <label>
                <Clock /> Configuración de horario
              </label>
              <div className="horario-config">
                <div className="time-grid">
                  <div className="time-input-wrapper">
                    <label htmlFor="horaInicio">
                      <Clock />
                      Hora inicio
                    </label>
                    <div className="select-with-icon">
                      <select
                        id="horaInicio"
                        className="form-select"
                        required
                        value={modalForm.horaInicio}
                        onChange={(e) => {
                          setModalForm({ ...modalForm, horaInicio: e.target.value });
                          updateCapacidad(e.target.value);
                        }}
                      >
                        <option value="">--:--</option>
                        {HORARIOS_INICIO.map((hora) => (
                          <option key={`inicio-${hora}`} value={hora}>
                            {hora}
                          </option>
                        ))}
                      </select>
                      <Clock />
                    </div>
                  </div>
                  <div className="time-input-wrapper">
                    <label htmlFor="horaFin">
                      <Clock />
                      Hora fin
                    </label>
                    <div className="select-with-icon">
                      <select
                        id="horaFin"
                        className="form-select"
                        required
                        value={modalForm.horaFin}
                        onChange={(e) => setModalForm({ ...modalForm, horaFin: e.target.value })}
                      >
                        <option value="">--:--</option>
                        {HORARIOS_FIN.map((hora) => (
                          <option key={`fin-${hora}`} value={hora}>
                            {hora}
                          </option>
                        ))}
                      </select>
                      <Clock />
                    </div>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-box-content">
                    <Users />
                    <span>
                      Capacidad disponible: <strong>{capacidadDisplay}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Días */}
            <div className="form-group">
              <label>
                <CalendarDays /> Días de la semana
              </label>
              <div className="days-selector">
                {DIAS_SEMANA.map((dia) => (
                  <div
                    key={dia}
                    className={`day-chip ${modalForm.dias.includes(dia) ? 'selected' : ''}`}
                    onClick={() => toggleDay(dia)}
                  >
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje */}
            <div className="form-group">
              <label htmlFor="counterMessage">
                <MessageCircle /> Mensaje opcional
              </label>
              <textarea
                id="counterMessage"
                className="form-textarea"
                placeholder="Agrega un mensaje opcional para el usuario..."
                value={modalForm.mensaje}
                onChange={(e) => setModalForm({ ...modalForm, mensaje: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline" type="button" onClick={closeCounterModal}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="button" onClick={sendCounterProposal}>
              <Send />
              Enviar contrapropuesta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
