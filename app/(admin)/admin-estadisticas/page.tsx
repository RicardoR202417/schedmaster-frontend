'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Download, FileText, Check, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AlertModal from '../../components/AlertModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DatoReporte {
  id: number;
  matricula: string;
  nombre: string;
  carrera: string;
  servicio: string;
  asistencia: string;
  estado: string;
  periodo: string; //Agregamos el periodo que ahora manda el backend
}

function getAttendanceStyle(asistencia: string) {
  const attendance = Number.parseInt(asistencia);

  if (attendance >= 80) {
    return { color: '#15803d', background: '#dcfce7' };
  }

  if (attendance > 0) {
    return { color: '#b91c1c', background: '#fee2e2' };
  }

  return { color: '#64748b', background: '#f1f5f9' };
}

function getExportButtonContent(exportDone: boolean, exporting: boolean) {
  if (exportDone) {
    return <><Check size={16} /> Â¡Descargado!</>;
  }

  if (exporting) {
    return <><RefreshCw size={16} className="spin-animation" /> Generando...</>;
  }

  return <><Download size={16} /> Descargar</>;
}

export default function AdminEstadisticasPage() {
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [modalExport,   setModalExport]   = useState(false);
  const [exportFormat,  setExportFormat]  = useState('csv');
  const [exportScope,   setExportScope]   = useState('general');
  const [exporting,     setExporting]     = useState(false);
  const [exportDone,    setExportDone]    = useState(false);
  const [alertOpen,     setAlertOpen]     = useState(false);
  const [alertMessage] = useState('');

  const [datosTabla, setDatosTabla] = useState<DatoReporte[]>([]);

  const cargarReporte = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/asistencias/reporte');
      if (res.ok) {
        const data = await res.json();
        setDatosTabla(data);
      }
    } catch (error) {
      console.error("Error cargando reporte:", error);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  const TABS = [
    { value: 'todos',     label: 'Todo el tiempo' },
    { value: '2025',      label: '2025'           },
    { value: 'verano',    label: 'Verano 2025'    },
    { value: 'primavera', label: 'Primavera 2025' },
  ];

  //LÃ³gica de Filtrado DinÃ¡mico
  const datosFiltrados = periodoFiltro === 'todos' 
    ? datosTabla 
    : datosTabla.filter(d => d.periodo.toLowerCase().includes(periodoFiltro.toLowerCase()));

  const totalInscritos = datosFiltrados.length;
  const convActivas    = 1; 

  const handleExport = () => {
    setExporting(true);
    
    // Elegimos quÃ© datos exportar segÃºn lo que pidiÃ³ el usuario
    const datosExportar = exportScope === 'completo' ? datosTabla : datosFiltrados;

    setTimeout(() => {
      setExporting(false); setExportDone(true);
      
      if (exportFormat === 'csv') {
        const rows = [
          ['MatrÃ­cula','Nombre','Carrera','Servicio','Periodo','Asistencia %','Estado'],
          ...datosExportar.map(r => [r.matricula, r.nombre, r.carrera, r.servicio, r.periodo, r.asistencia, r.estado]),
        ];
        
        //Le agregamos '\uFEFF' al inicio para que reconozca acentos y la Ã‘
        const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `reporte_asistencia_${new Date().toISOString().slice(0,10)}.csv`; a.click();
        URL.revokeObjectURL(url);
        
      } else if (exportFormat === 'pdf') {
        // MAGIA DEL PDF
        const doc = new jsPDF();
        doc.text("Reporte de Asistencias - SchedMaster", 14, 15);
        
        autoTable(doc, {
          startY: 20,
          head: [['MatrÃ­cula', 'Nombre', 'Carrera', 'Servicio', 'Asistencia', 'Estado']],
          body: datosExportar.map(r => [r.matricula, r.nombre, r.carrera, r.servicio, r.asistencia, r.estado]),
          headStyles: { fillColor: [0, 164, 224] }, // Azulito SchedMaster
        });
        
        doc.save(`reporte_asistencia_${new Date().toISOString().slice(0,10)}.pdf`);
      }

      setTimeout(() => { setModalExport(false); setExportDone(false); }, 1200);
    }, 1000);
  };

  return (
    <>
      <div className="app app--admin-stats">
        <AdminSidebar />

        <main className="main">
          <div className="main-inner">

            <header className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <h2>Reportes</h2>
                <p>VisiÃ³n completa del ciclo: interesados â†’ notificados â†’ inscritos â†’ asistencia.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '15px' }}>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div className="chip chip--blue" style={{ fontSize: '14px', padding: '8px 15px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
                    <span style={{ marginRight: '5px' }}>ðŸ‘¥</span> Inscritos totales: <strong>{totalInscritos}</strong>
                  </div>
                  <div className="chip chip--outline" style={{ fontSize: '14px', padding: '8px 15px', border: '1px solid #ddd', borderRadius: '20px' }}>
                    <span style={{ marginRight: '5px' }}>ðŸ“ˆ</span> Convocatorias activas: <strong>{convActivas}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn--outline" type="button" onClick={cargarReporte}>
                    <RefreshCw size={18} style={{ marginRight: '5px' }} /> Actualizar
                  </button>
                  <button className="btn btn--blue" type="button" onClick={() => setModalExport(true)} style={{ backgroundColor: '#00a4e0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                    <Download size={18} style={{ marginRight: '5px' }} /> Exportar reporte
                  </button>
                </div>
              </div>

              <div className="tabs-bar" style={{ marginTop: '8px', borderBottom: 'none', width: '100%' }}>
                <span className="period-label" style={{ fontWeight: 'bold', fontSize: '12px', color: '#666', marginRight: '15px', textTransform: 'uppercase' }}>Periodo:</span>
                <div className="tab-group" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {TABS.map(t => (
                    <button 
                      key={t.value} 
                      className={`tab ${periodoFiltro === t.value ? 'active' : ''}`}
                      type="button" 
                      onClick={() => setPeriodoFiltro(t.value)}
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        border: periodoFiltro === t.value ? 'none' : '1px solid #ddd',
                        background: periodoFiltro === t.value ? '#e0f2fe' : 'transparent',
                        color: periodoFiltro === t.value ? '#0369a1' : '#666',
                        cursor: 'pointer',
                        fontWeight: periodoFiltro === t.value ? 'bold' : 'normal'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <section className="table-area" style={{ marginTop: '12px' }}>
              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    <tr>
                      <th style={{ padding: '15px' }}>MatrÃ­cula</th>
                      <th style={{ padding: '15px' }}>Nombre del alumno</th>
                      <th style={{ padding: '15px' }}>Carrera</th>
                      <th style={{ padding: '15px' }}>Servicio</th>
                      <th style={{ padding: '15px' }}>Asistencia Prom.</th>
                      <th style={{ padding: '15px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          Cargando reportes o no hay datos para el periodo seleccionado...
                        </td>
                      </tr>
                    ) : (
                      datosFiltrados.map((fila) => (
                        <tr key={fila.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                          <td style={{ padding: '15px', color: '#475569', fontWeight: '500' }}>{fila.matricula}</td>
                          <td style={{ padding: '15px', fontWeight: 'bold', color: '#1e293b' }}>{fila.nombre}</td>
                          <td style={{ padding: '15px', color: '#64748b' }}>{fila.carrera}</td>
                          <td style={{ padding: '15px', color: '#64748b' }}>{fila.servicio}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{ 
                              ...getAttendanceStyle(fila.asistencia),
                              fontWeight: 'bold',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {fila.asistencia}
                            </span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              backgroundColor: fila.estado === 'Activo' ? '#dcfce7' : '#f1f5f9',
                              color: fila.estado === 'Activo' ? '#166534' : '#475569'
                            }}>
                              {fila.estado.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '15px', color: '#94a3b8', fontSize: '13px', textAlign: 'right' }}>
                Mostrando {datosFiltrados.length} registros
              </div>
            </section>

          </div>
        </main>
      </div>

      {modalExport && (
        <div className="modal-overlay">
          <div className="modal-box modal-box--wide">
            <div className="modal-header">
              <div><h3>Exportar reporte</h3><p>Elige el formato y el alcance del reporte</p></div>
              <button type="button" className="btn-close" onClick={() => setModalExport(false)} title="Cerrar"><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <span className="input-label">Formato de exportaciÃ³n</span>
                <div className="export-options">
                  {/*LE DIMOS CUELLO AL JSON COMO PIDIÃ“ ARLET */}
                  {[
                    { value:'csv',  cls:'csv',  icon:<FileText size={20} />, label:'Excel (CSV)', desc:'Compatible con Excel y hojas de cÃ¡lculo' },
                    { value:'pdf',  cls:'pdf',  icon:<FileText size={20} />, label:'PDF',         desc:'Reporte visual listo para presentar' },
                  ].map(opt => (
                    <button key={opt.value} type="button" className={`export-option ${exportFormat === opt.value ? 'selected' : ''}`} onClick={() => setExportFormat(opt.value)}>
                      <div className={`export-option-icon ${opt.cls}`}>{opt.icon}</div>
                      <div className="export-option-info">
                        <div className="export-option-name">{opt.label}</div>
                        <div className="export-option-desc">{opt.desc}</div>
                      </div>
                      <div className="export-check"><Check size={12} /></div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="export-scope" className="input-label">Alcance del reporte</label>
                <select id="export-scope" className="form-select" value={exportScope} onChange={e => setExportScope(e.target.value)}>
                  <option value="general">Tabla actual (usando el filtro de periodo)</option>
                  <option value="completo">Base de datos completa (Todo el tiempo)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn--outline" onClick={() => setModalExport(false)}>Cancelar</button>
              <button type="button" className="btn btn--blue btn--export" onClick={handleExport} disabled={exporting}>
                {getExportButtonContent(exportDone, exporting)}
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}
