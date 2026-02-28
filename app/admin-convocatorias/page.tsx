'use client';

import { useState } from 'react';
import { Plus, CalendarDays, Pencil, Power, PowerOff, X, Save } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface Convocatoria {
  id: number;
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  fechaIngreso: string;
  estado: 'activada' | 'desactivada';
}

type FormState = Omit<Convocatoria, 'id'>;

export default function AdminConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([
    { id: 1, periodo: 'Enero - Abril 2026', fechaInicio: '2026-01-05', fechaFin: '2026-01-20', fechaIngreso: '2026-01-27', estado: 'activada' },
  ]);

  const [modalCrear,  setModalCrear]  = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const emptyForm: FormState = { periodo: '', fechaInicio: '', fechaFin: '', fechaIngreso: '', estado: 'activada' };
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCrear  = () => { setForm(emptyForm); setModalCrear(true);  document.body.style.overflow = 'hidden'; };
  const closeCrear = () => { setModalCrear(false);  document.body.style.overflow = ''; };

  const openEditar  = (c: Convocatoria) => { setForm(c); setModalEditar(true);  document.body.style.overflow = 'hidden'; };
  const closeEditar = () => { setModalEditar(false); document.body.style.overflow = ''; };

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  /* ── Contenido del modal (compartido crear/editar) ── */
  const ModalContent = ({ onClose, title, subtitle }: { onClose: () => void; title: string; subtitle: string }) => (
    <div className="modal-box modal-box--wide">
      {/* modal-header reemplaza modal-admin-header */}
      <div className="modal-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button className="btn-close" onClick={onClose}><X /></button>
      </div>

      {/* modal-body reemplaza modal-admin-body */}
      <div className="modal-body">
        <div className="form-group">
          <label><CalendarDays /> Periodo</label>
          <input className="form-select" type="text" placeholder="Ej. Mayo – Agosto 2026" {...field('periodo')} />
        </div>
        <div className="form-group">
          <label>Fecha inicio inscripciones</label>
          <input className="form-select" type="date" {...field('fechaInicio')} />
        </div>
        <div className="form-group">
          <label>Fecha fin inscripciones</label>
          <input className="form-select" type="date" {...field('fechaFin')} />
        </div>
        <div className="form-group">
          <label>Fecha ingreso oficial</label>
          <input className="form-select" type="date" {...field('fechaIngreso')} />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select className="form-select" {...field('estado')}>
            <option value="activada">Activada</option>
            <option value="desactivada">Desactivada</option>
          </select>
        </div>
      </div>

      {/* modal-footer reemplaza modal-admin-footer */}
      <div className="modal-footer">
        <button className="btn btn--outline" onClick={onClose}>Cancelar</button>
        <button className="btn btn--blue"><Save /> Guardar</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="app">
        <AdminSidebar onLogout={() => console.log('logout')} />

        <main className="main">
          <div className="main-inner">

            <header className="section-header">
              <div>
                <h2>Convocatorias</h2>
                <p>Administra los periodos de inscripción disponibles</p>
              </div>
              <button className="btn btn--yellow" onClick={openCrear}>
                <Plus /> Nueva convocatoria
              </button>
            </header>

            <section className="table-area">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Periodo</th>
                      <th>Inicio inscripciones</th>
                      <th>Fin inscripciones</th>
                      <th>Ingreso oficial</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convocatorias.map(c => (
                      <tr key={c.id}>
                        <td>{c.periodo}</td>
                        <td className="muted">{c.fechaInicio}</td>
                        <td className="muted">{c.fechaFin}</td>
                        <td className="muted">{c.fechaIngreso}</td>
                        <td>
                          <span className={`chip chip--${c.estado}`}>
                            {c.estado === 'activada' ? <Power size={14} /> : <PowerOff size={14} />}
                            {c.estado}
                          </span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button className="btn-icon btn-icon--cyan" onClick={() => openEditar(c)} aria-label="Editar">
                              <Pencil size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Modales — usan .modal-overlay en vez de .modal-admin */}
      {modalCrear && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeCrear()}>
          <ModalContent onClose={closeCrear} title="Nueva convocatoria" subtitle="Configura un nuevo periodo de inscripciones" />
        </div>
      )}
      {modalEditar && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeEditar()}>
          <ModalContent onClose={closeEditar} title="Editar convocatoria" subtitle="Actualiza la información del periodo" />
        </div>
      )}
    </>
  );
}