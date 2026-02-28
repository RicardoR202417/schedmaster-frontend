'use client';

import { useState, useEffect } from 'react';
import {
  Users, Download, RefreshCw, Search, XCircle,
  Check, X, Clock, AlertTriangle, GraduationCap, Briefcase,
  Dumbbell, Stethoscope, Shield, Flame, Sparkles,
  CalendarDays, MessageCircle, Send,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const generarHorarios = (inicio: number, fin: number, intervalo = 30) => {
  const h: string[] = [];
  for (let hora = inicio; hora <= fin; hora++) {
    for (let min = 0; min < 60; min += intervalo) {
      if (hora === fin && min > 0) break;
      h.push(`${hora.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`);
    }
  }
  return h;
};

const HORARIOS_INICIO = generarHorarios(6, 21);
const HORARIOS_FIN    = generarHorarios(6, 22).slice(1);
const DIAS_SEMANA     = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

const CAPACIDADES: Record<string, number> = {
  '06:00':25,'06:30':25,'07:00':28,'07:30':28,'08:00':30,'08:30':30,
  '09:00':30,'09:30':30,'10:00':30,'10:30':28,'11:00':28,'11:30':28,
  '12:00':25,'12:30':25,'13:00':25,'13:30':25,'14:00':28,'14:30':28,
  '15:00':30,'15:30':30,'16:00':32,'16:30':32,'17:00':32,'17:30':32,
  '18:00':35,'18:30':35,'19:00':35,'19:30':30,'20:00':30,'20:30':25,'21:00':25,
};

const ROL_CONFIG = {
  estudiante:             { icon: GraduationCap, nombre: 'Estudiante'     },
  docente:                { icon: Briefcase,     nombre: 'Docente'        },
  entrenador:             { icon: Dumbbell,      nombre: 'Entrenador'     },
  nutriologa:             { icon: Stethoscope,   nombre: 'Nutrióloga'     },
  administrador_general:  { icon: Shield,        nombre: 'Admin general'  },
} as const;

const DIVISIONES = [
  { value: 'dtai', label: 'DTAI' }, { value: 'dmec', label: 'DMEC' },
  { value: 'dind', label: 'DIND' }, { value: 'dea',  label: 'DEA'  }, { value: 'dae', label: 'DAE' },
];
const ROLES = [
  { value: 'estudiante',            label: 'Estudiante'            },
  { value: 'docente',               label: 'Docente'               },
  { value: 'entrenador',            label: 'Entrenador'            },
  { value: 'nutriologa',            label: 'Nutrióloga'            },
  { value: 'administrador_general', label: 'Administrador general' },
];

interface Inscripcion {
  id: number; nombre: string; apellido_paterno: string; apellido_materno: string;
  correo: string; rol: string; division: string; carrera: string;
  cuatrimestre: string; prioridad: 'alta' | 'baja'; registro: string;
}

interface ModalData { userId: number; userName: string; userEmail: string; }

export default function AdminInscripcionesPage() {
  const [inscripciones,         setInscripciones]         = useState<Inscripcion[]>([]);
  const [searchQuery,           setSearchQuery]           = useState('');
  const [filterRol,             setFilterRol]             = useState('');
  const [filterPrioridad,       setFilterPrioridad]       = useState('');
  const [filterDivision,        setFilterDivision]        = useState('');
  const [filteredInscripciones, setFilteredInscripciones] = useState<Inscripcion[]>([]);

  const [modalActive, setModalActive] = useState(false);
  const [modalData,   setModalData]   = useState<ModalData | null>(null);
  const [modalForm,   setModalForm]   = useState({
    periodo: '', horaInicio: '', horaFin: '', dias: [] as string[], mensaje: '',
  });
  const [capacidadDisplay, setCapacidadDisplay] = useState('Selecciona un horario');

  useEffect(() => {
    let f = [...inscripciones];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter(i => `${i.id} ${i.nombre} ${i.apellido_paterno} ${i.apellido_materno} ${i.correo}`.toLowerCase().includes(q));
    }
    if (filterRol)       f = f.filter(i => i.rol === filterRol);
    if (filterPrioridad) f = f.filter(i => i.prioridad === filterPrioridad);
    if (filterDivision)  f = f.filter(i => i.division.toLowerCase() === filterDivision.toLowerCase());
    setFilteredInscripciones(f);
  }, [searchQuery, filterRol, filterPrioridad, filterDivision, inscripciones]);

  const getRolInfo = (rol: string) => {
    const cfg = ROL_CONFIG[rol as keyof typeof ROL_CONFIG];
    if (cfg) { const I = cfg.icon; return { icon: <I size={14} />, nombre: cfg.nombre }; }
    return { icon: <Users size={14} />, nombre: rol };
  };

  const countPendientes = filteredInscripciones.length;
  const countAlta       = filteredInscripciones.filter(i => i.prioridad === 'alta').length;

  const openModal = (userId: number, userName: string, userEmail: string) => {
    setModalData({ userId, userName, userEmail });
    setModalActive(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalActive(false);
    document.body.style.overflow = '';
    setModalForm({ periodo: '', horaInicio: '', horaFin: '', dias: [], mensaje: '' });
    setCapacidadDisplay('Selecciona un horario');
    setModalData(null);
  };

  const toggleDay = (day: string) =>
    setModalForm(prev => ({
      ...prev,
      dias: prev.dias.includes(day) ? prev.dias.filter(d => d !== day) : [...prev.dias, day],
    }));

  const sendCounterProposal = () => {
    if (!modalForm.periodo || !modalForm.horaInicio || !modalForm.horaFin || modalForm.dias.length === 0) {
      alert('Completa todos los campos obligatorios'); return;
    }
    console.log('Contrapropuesta:', { ...modalData, ...modalForm });
    closeModal();
  };

  return (
    <>
      <div className="app">
        <AdminSidebar onLogout={() => console.log('logout')} />

        <main className="main">
          <div className="main-inner">

            <header className="section-header">
              <div>
                <h2>Inscripciones de usuarios</h2>
                <p>Valida registros pendientes. Puedes aceptar, rechazar o proponer un horario alternativo.</p>
              </div>
              <div className="row-actions" style={{ flexWrap: 'wrap' }}>
                <div className="chip chip--pendiente"><Users size={14} /> Pendientes: <strong>{countPendientes}</strong></div>
                <div className="chip chip--alta"><AlertTriangle size={14} /> Prioridad alta: <strong>{countAlta}</strong></div>
                <button className="btn btn--outline" onClick={() => console.log('exportar')}>
                  <Download /> Exportar
                </button>
                <button className="btn btn--blue" onClick={() => console.log('refrescar')}>
                  <RefreshCw /> Actualizar
                </button>
              </div>
            </header>

            <div className="filter-bar">
              <div className="field">
                <Search />
                <input type="search" placeholder="Buscar por nombre, correo o ID..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <select className="select" value={filterRol} onChange={e => setFilterRol(e.target.value)}>
                <option value="">Rol: Todos</option>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <select className="select" value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)}>
                <option value="">Prioridad: Todas</option>
                <option value="alta">Alta</option>
                <option value="baja">Baja</option>
              </select>
              <select className="select" value={filterDivision} onChange={e => setFilterDivision(e.target.value)}>
                <option value="">División: Todas</option>
                {DIVISIONES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <button className="btn btn--outline" onClick={() => { setSearchQuery(''); setFilterRol(''); setFilterPrioridad(''); setFilterDivision(''); }}>
                <XCircle /> Limpiar
              </button>
            </div>

            <section className="table-area">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th><th>Nombre</th><th>Ap. Paterno</th><th>Ap. Materno</th>
                      <th>Correo</th><th>Rol</th><th>División</th><th>Carrera</th>
                      <th>Cuatrimestre</th><th>Prioridad</th><th>Registro</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInscripciones.length === 0 ? (
                      <tr><td colSpan={12}>
                        <div className="empty-state">
                          <Users size={40} strokeWidth={1.5} />
                          <p>No hay inscripciones pendientes</p>
                          <small>Los nuevos registros aparecerán aquí automáticamente</small>
                        </div>
                      </td></tr>
                    ) : filteredInscripciones.map(insc => (
                      <tr key={insc.id}>
                        <td className="muted">{insc.id}</td>
                        <td>{insc.nombre}</td>
                        <td>{insc.apellido_paterno}</td>
                        <td>{insc.apellido_materno}</td>
                        <td className="muted">{insc.correo}</td>
                        <td>
                          <span className="chip chip--asistente">
                            {getRolInfo(insc.rol).icon} {getRolInfo(insc.rol).nombre}
                          </span>
                        </td>
                        <td className="muted">{insc.division}</td>
                        <td>{insc.carrera}</td>
                        <td className="muted">{insc.cuatrimestre}</td>
                        <td>
                          <span className={`chip chip--${insc.prioridad === 'alta' ? 'alta' : 'baja'}`}>
                            {insc.prioridad === 'alta' ? <Flame size={12} /> : <Sparkles size={12} />}
                            {insc.prioridad === 'alta' ? 'Alta' : 'Baja'}
                          </span>
                        </td>
                        <td className="muted">{insc.registro}</td>
                        <td>
                          <div className="row-actions">
                            <button className="btn-mini btn-mini--green" onClick={() => console.log('Aceptar', insc.id)}>
                              <Check size={12} /> Aceptar
                            </button>
                            <button className="btn-mini btn-mini--red" onClick={() => console.log('Rechazar', insc.id)}>
                              <X size={12} /> Rechazar
                            </button>
                            <button className="btn-mini btn-mini--yellow"
                              onClick={() => openModal(insc.id, `${insc.nombre} ${insc.apellido_paterno}`, insc.correo)}>
                              <Clock size={12} /> Contrapropuesta
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

      {/* Modal contrapropuesta — usa .modal-overlay + .modal-box--wide */}
      {modalActive && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box modal-box--wide">

            <div className="modal-header">
              <div>
                <h3>Proponer horario alternativo</h3>
                <p>{modalData?.userName} · {modalData?.userEmail}</p>
              </div>
              <button className="btn-close" onClick={closeModal}><X /></button>
            </div>

            <div className="modal-body">

              <div className="form-group">
                <label><CalendarDays size={16} /> Periodo académico</label>
                <div className="select-with-icon">
                  <select className="form-select" value={modalForm.periodo}
                    onChange={e => setModalForm({ ...modalForm, periodo: e.target.value })}>
                    <option value="" disabled>No hay periodos disponibles</option>
                  </select>
                  <CalendarDays size={16} />
                </div>
              </div>

              <div className="form-group">
                <label><Clock size={16} /> Configuración de horario</label>
                <div className="time-grid">
                  <div className="time-input-wrapper">
                    <label><Clock size={14} /> Hora inicio</label>
                    <div className="select-with-icon">
                      <select className="form-select" value={modalForm.horaInicio}
                        onChange={e => {
                          setModalForm({ ...modalForm, horaInicio: e.target.value });
                          setCapacidadDisplay(CAPACIDADES[e.target.value] ? `${CAPACIDADES[e.target.value]} personas` : 'Selecciona un horario');
                        }}>
                        <option value="">--:--</option>
                        {HORARIOS_INICIO.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <Clock size={14} />
                    </div>
                  </div>
                  <div className="time-input-wrapper">
                    <label><Clock size={14} /> Hora fin</label>
                    <div className="select-with-icon">
                      <select className="form-select" value={modalForm.horaFin}
                        onChange={e => setModalForm({ ...modalForm, horaFin: e.target.value })}>
                        <option value="">--:--</option>
                        {HORARIOS_FIN.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <Clock size={14} />
                    </div>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-box-content">
                    <Users size={16} />
                    <span>Capacidad disponible: <strong>{capacidadDisplay}</strong></span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label><CalendarDays size={16} /> Días de la semana</label>
                <div className="days-selector">
                  {DIAS_SEMANA.map(dia => (
                    <div key={dia}
                      className={`day-chip ${modalForm.dias.includes(dia) ? 'selected' : ''}`}
                      onClick={() => toggleDay(dia)}>
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label><MessageCircle size={16} /> Mensaje opcional</label>
                <textarea className="form-textarea"
                  placeholder="Agrega un mensaje opcional para el usuario… (Ctrl+Enter para enviar)"
                  value={modalForm.mensaje}
                  onChange={e => setModalForm({ ...modalForm, mensaje: e.target.value })}
                />
              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn--outline" onClick={closeModal}>Cancelar</button>
              <button className="btn btn--blue" onClick={sendCounterProposal}>
                <Send size={16} /> Enviar contrapropuesta
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}