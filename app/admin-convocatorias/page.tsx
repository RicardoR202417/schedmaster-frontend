'use client';

import { useState } from 'react';
import './admin-convocatorias.css';
import {
  Plus,
  CalendarDays,
  Pencil,
  Power,
  PowerOff,
  X,
  Save,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface Convocatoria {
  id: number;
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  fechaIngreso: string;
  estado: 'activada' | 'desactivada';
}

export default function AdminConvocatoriasPage() {
  // 👇 DATO FAKE PARA VISUALIZAR
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([
    {
      id: 1,
      periodo: 'Enero - Abril 2026',
      fechaInicio: '2026-01-05',
      fechaFin: '2026-01-20',
      fechaIngreso: '2026-01-27',
      estado: 'activada',
    },
  ]);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
    useState<Convocatoria | null>(null);

  const [form, setForm] = useState({
    periodo: '',
    fechaInicio: '',
    fechaFin: '',
    fechaIngreso: '',
    estado: 'activada' as 'activada' | 'desactivada',
  });

  const openCrear = () => {
    setForm({
      periodo: '',
      fechaInicio: '',
      fechaFin: '',
      fechaIngreso: '',
      estado: 'activada',
    });
    setModalCrear(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCrear = () => {
    setModalCrear(false);
    document.body.style.overflow = '';
  };

  const openEditar = (conv: Convocatoria) => {
    setConvocatoriaSeleccionada(conv);
    setForm(conv);
    setModalEditar(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditar = () => {
    setModalEditar(false);
    document.body.style.overflow = '';
  };

  const handleLogout = () => console.log('logout');

  return (
    <>
      <div className="app">
        <AdminSidebar onLogout={handleLogout} />

        <main className="main">
          <div className="main-inner">

            {/* HEADER */}
            <header className="header">
              <div className="title">
                <h2>Convocatorias</h2>
                <p>Administra los periodos de inscripción disponibles</p>
              </div>

              <div className="header-actions">
                <button className="btn btn-primary" onClick={openCrear}>
                  <Plus /> Nueva convocatoria
                </button>
              </div>
            </header>

            {/* TABLA */}
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
                    {convocatorias.map((c) => (
                      <tr key={c.id}>
                        <td>{c.periodo}</td>
                        <td>{c.fechaInicio}</td>
                        <td>{c.fechaFin}</td>
                        <td>{c.fechaIngreso}</td>

                        <td>
                          <span
                            className={`chip ${
                              c.estado === 'activada'
                                ? 'chip-active'
                                : 'chip-off'
                            }`}
                          >
                            {c.estado === 'activada' ? (
                              <Power size={14} />
                            ) : (
                              <PowerOff size={14} />
                            )}
                            {c.estado}
                          </span>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              className="btn-mini"
                              onClick={() => openEditar(c)}
                            >
                              <Pencil /> Editar
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

      {/* ================= MODAL CREAR ================= */}
      <div className={`modal-overlay ${modalCrear ? 'active' : ''}`}>
        <div className="modal-content">

          <div className="modal-header">
            <div className="modal-header-text">
              <h3>Nueva convocatoria</h3>
              <p>Configura un nuevo periodo de inscripciones</p>
            </div>

            <button className="btn-close" onClick={closeCrear}>
              <X />
            </button>
          </div>

          <div className="modal-body">

            <div className="form-group">
              <label>
                <CalendarDays /> Periodo
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Ej. Mayo - Agosto 2026"
                value={form.periodo}
                onChange={(e) =>
                  setForm({ ...form, periodo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha inicio inscripciones</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm({ ...form, fechaInicio: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha fin inscripciones</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaFin}
                onChange={(e) =>
                  setForm({ ...form, fechaFin: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha ingreso oficial</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaIngreso}
                onChange={(e) =>
                  setForm({ ...form, fechaIngreso: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                className="form-select"
                value={form.estado}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estado: e.target.value as 'activada' | 'desactivada',
                  })
                }
              >
                <option value="activada">Activada</option>
                <option value="desactivada">Desactivada</option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-outline" onClick={closeCrear}>
              Cancelar
            </button>

            <button className="btn btn-primary">
              <Save /> Guardar convocatoria
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL EDITAR ================= */}
      <div className={`modal-overlay ${modalEditar ? 'active' : ''}`}>
        <div className="modal-content">

          <div className="modal-header">
            <div className="modal-header-text">
              <h3>Editar convocatoria</h3>
              <p>Actualiza la información del periodo</p>
            </div>

            <button className="btn-close" onClick={closeEditar}>
              <X />
            </button>
          </div>

          <div className="modal-body">

            <div className="form-group">
              <label>Periodo</label>
              <input
                className="form-input"
                type="text"
                value={form.periodo}
                onChange={(e) =>
                  setForm({ ...form, periodo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha inicio inscripciones</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm({ ...form, fechaInicio: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha fin inscripciones</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaFin}
                onChange={(e) =>
                  setForm({ ...form, fechaFin: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha ingreso oficial</label>
              <input
                className="form-input"
                type="date"
                value={form.fechaIngreso}
                onChange={(e) =>
                  setForm({ ...form, fechaIngreso: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                className="form-select"
                value={form.estado}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estado: e.target.value as 'activada' | 'desactivada',
                  })
                }
              >
                <option value="activada">Activada</option>
                <option value="desactivada">Desactivada</option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-outline" onClick={closeEditar}>
              Cancelar
            </button>

            <button className="btn btn-primary">
              <Save /> Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </>
  );
}