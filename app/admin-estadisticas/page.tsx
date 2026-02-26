'use client';

import { useState, useEffect } from 'react';
import './admin-estadisticas.css';
import {
  LayoutGrid,
  Home,
  Users,
  CalendarCheck,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  Flame,
  Sparkles,
  Activity,
  Award,
  Check,
  X,
  Menu,
  FileText,
  Database,
} from 'lucide-react';

// ==========================================
// Datos de demostración
// ==========================================

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DIAS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const mockKPIs = {
  interesados:       { valor: 1284, cambio: +12.4 },
  notificados:       { valor: 1210, cambio: +8.1  },
  inscritos:         { valor: 847,  cambio: +5.3  },
  asistencia:        { valor: 78.4, cambio: -2.1, suffix: '%' },
  anuncios:          { valor: 34,   cambio: +18.7 },

};

const inscripcionesMes = [42, 58, 71, 95, 88, 110, 134, 122, 148, 155, 143, 160];
const interesadosMes   = [68, 90, 105, 140, 130, 160, 185, 170, 195, 210, 192, 215];

const funnelData = [
  { label: 'Interesados registrados',    count: 1284, color: '#00a4e0' },
  { label: 'Notificados por correo',     count: 1210, color: '#3b82f6' },
  { label: 'Abrieron convocatoria',      count: 980,  color: '#8b5cf6' },
  { label: 'Iniciaron inscripción',      count: 910,  color: '#ebbA3d' },
  { label: 'Inscripciones completadas',  count: 847,  color: '#22c55e' },
];

const porRol = [
  { label: 'Estudiante', count: 612, color: '#00a4e0' },
  { label: 'Docente',    count: 128, color: '#3b82f6' },
  { label: 'Entrenador', count: 54,  color: '#8b5cf6' },
  { label: 'Nutrióloga', count: 32,  color: '#ebbA3d' },
  { label: 'Admin',      count: 21,  color: '#22c55e' },
];

const porDivision = [
  { label: 'DTAI', count: 310 },
  { label: 'DMEC', count: 245 },
  { label: 'DIND', count: 178 },
  { label: 'DEA',  count: 77  },
  { label: 'DAE',  count: 37  },
];

const heatmapData = [
  [85, 90, 88, 92, 78],
  [70, 75, 80, 68, 72],
  [92, 95, 91, 89, 94],
  [60, 65, 70, 58, 63],
  [88, 85, 90, 87, 82],
  [45, 55, 48, 52, 50],
];

const topAsistencia = [
  { nombre: 'Fernanda López',  division: 'DTAI', pct: 98 },
  { nombre: 'Carlos Mendoza',  division: 'DMEC', pct: 96 },
  { nombre: 'Ana Gutiérrez',   division: 'DIND', pct: 95 },
  { nombre: 'Ricardo Torres',  division: 'DTAI', pct: 93 },
  { nombre: 'Sofía Ramírez',   division: 'DEA',  pct: 91 },
  { nombre: 'Luis Herrera',    division: 'DMEC', pct: 89 },
];

const actividadReciente = [
  { texto: '<strong>47 nuevas inscripciones</strong> en la última hora',                         tiempo: 'Hace 12 min', color: '#22c55e' },
  { texto: 'Convocatoria enviada a <strong>1,210 interesados</strong>',                          tiempo: 'Hace 1h',     color: '#00a4e0' },
  { texto: 'Admin publicó anuncio <strong>"Cambio de horario semana 8"</strong>',                tiempo: 'Hace 3h',     color: '#8b5cf6' },
  { texto: 'Asistencia marcada para <strong>234 usuarios</strong> · Lunes',                     tiempo: 'Hace 5h',     color: '#ebbA3d' },
  { texto: '<strong>12 inscripciones rechazadas</strong> por cupo',                              tiempo: 'Hace 8h',     color: '#ef4444' },
];

const detalleTabla = [
  { convocatoria: 'Conv. Otoño 2024',     periodo: 'Sep–Dic 2024', interesados: 412, notificados: 395, inscritos: 278, asistencia: 81.2, estado: 'cerrado' },
  { convocatoria: 'Conv. Primavera 2025', periodo: 'Ene–Abr 2025', interesados: 388, notificados: 372, inscritos: 261, asistencia: 76.5, estado: 'cerrado' },
  { convocatoria: 'Conv. Verano 2025',    periodo: 'May–Ago 2025', interesados: 484, notificados: 443, inscritos: 308, asistencia: 79.1, estado: 'activo'  },
];

// ==========================================
// Helpers
// ==========================================

const getHeatColor = (val: number) => {
  if (val >= 90) return '#00a4e0';
  if (val >= 75) return '#38bdf8';
  if (val >= 60) return '#bae6fd';
  if (val >= 40) return '#fde68a';
  return '#fca5a5';
};

const getInitials = (nombre: string) =>
  nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const avatarColors = ['#00a4e0', '#3b82f6', '#8b5cf6', '#ebbA3d', '#22c55e', '#ef4444'];

// ==========================================
// Sub-componentes visuales
// ==========================================

const Sparkline = ({
  data,
  secondary,
  color = '#00a4e0',
}: {
  data: number[];
  secondary?: number[];
  color?: string;
}) => {
  const h = 120;
  const w = 800;
  const max = Math.max(...data, ...(secondary ?? []));
  const step = w / (data.length - 1);

  const toPath = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (v / max) * h}`).join(' ');

  const toArea = (arr: number[]) =>
    toPath(arr) + ` L ${(arr.length - 1) * step} ${h} L 0 ${h} Z`;

  return (
    <div className="sparkline-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="sparkline-svg" style={{ height: 120 }} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map(r => (
          <line key={r} x1={0} x2={w} y1={h * (1 - r)} y2={h * (1 - r)} stroke="rgba(15,23,42,0.06)" strokeWidth={1} />
        ))}
        {secondary && <path d={toArea(secondary)} fill="rgba(59,130,246,0.07)" />}
        <path d={toArea(data)} fill={`${color}18`} />
        {secondary && (
          <path d={toPath(secondary)} fill="none" stroke="rgba(59,130,246,0.45)" strokeWidth={2} strokeDasharray="4 3" />
        )}
        <path d={toPath(data)} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={i * step} cy={h - (v / max) * h} r={3.5} fill={color} />
        ))}
      </svg>
      <div className="sparkline-axis">
        {MESES.map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
};

const Donut = ({
  data,
  total,
}: {
  data: { label: string; count: number; color: string }[];
  total: number;
}) => {
  const r = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  const segs = data.map(d => {
    const len = (d.count / total) * circ;
    const s = { ...d, len, offset };
    offset += len;
    return s;
  });

  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap" style={{ width: 160, height: 160 }}>
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle cx={80} cy={80} r={r} fill="none" stroke="rgba(15,23,42,0.05)" strokeWidth={22} />
          {segs.map((s, i) => (
            <circle
              key={i}
              cx={80} cy={80} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={22}
              strokeDasharray={`${s.len} ${circ - s.len}`}
              strokeDashoffset={-s.offset + circ * 0.25}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="donut-center-value">{total.toLocaleString()}</div>
          <div className="donut-center-label">Total</div>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-left">
              <div className="donut-dot" style={{ background: d.color }} />
              <span className="donut-legend-label">{d.label}</span>
            </div>
            <span className="donut-legend-count">{d.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data }: { data: { label: string; count: number }[] }) => {
  const max = Math.max(...data.map(d => d.count));
  const colors = ['#00a4e0', '#3b82f6', '#8b5cf6', '#ebbA3d', '#22c55e'];

  return (
    <div className="bar-chart">
      <div className="bar-chart-grid">
        {[0, 1, 2, 3].map(i => <div key={i} className="grid-line" />)}
      </div>
      {data.map((d, i) => (
        <div key={i} className="bar-group">
          <div className="bar-stack" style={{ height: 160 }}>
            <div
              className="bar"
              style={{ height: `${(d.count / max) * 100}%`, background: colors[i % colors.length] }}
            >
              <div className="bar-tooltip">{d.count.toLocaleString()}</div>
            </div>
          </div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const Funnel = () => {
  const max = funnelData[0].count;
  return (
    <div className="funnel-chart">
      {funnelData.map((row, i) => (
        <div key={i}>
          {i > 0 && (
            <div className="funnel-arrow">
              ↓ {((row.count / funnelData[i - 1].count) * 100).toFixed(1)}% continúan
            </div>
          )}
          <div className="funnel-row">
            <div className="funnel-header">
              <span>{row.label}</span>
              <span className="funnel-count">{row.count.toLocaleString()}</span>
            </div>
            <div className="funnel-track">
              <div
                className="funnel-fill"
                style={{ width: `${(row.count / max) * 100}%`, background: row.color }}
              >
                <span className="funnel-pct">{((row.count / max) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Heatmap = () => (
  <div className="heatmap">
    <div className="heatmap-header">
      {['S1', 'S2', 'S3', 'S4', 'S5'].map(s => <span key={s}>{s}</span>)}
    </div>
    {heatmapData.map((row, di) => (
      <div key={di} className="heatmap-row">
        <div className="heatmap-day-label">{DIAS[di]}</div>
        <div className="heatmap-cells">
          {row.map((val, wi) => (
            <div
              key={wi}
              className="heatmap-cell"
              style={{ background: getHeatColor(val) }}
              title={`${DIAS[di]} S${wi + 1}: ${val}%`}
            />
          ))}
        </div>
      </div>
    ))}
    <div className="heatmap-legend">
      <span className="heatmap-legend-label">Asistencia:</span>
      {[
        ['#fca5a5', '<40%'],
        ['#fde68a', '40–60%'],
        ['#bae6fd', '60–75%'],
        ['#38bdf8', '75–90%'],
        ['#00a4e0', '90%+'],
      ].map(([c, l]) => (
        <div key={l} className="heatmap-legend-item">
          <div className="heatmap-legend-dot" style={{ background: c }} />
          <span className="heatmap-legend-text">{l}</span>
        </div>
      ))}
    </div>
  </div>
);

// KPI Card — usa .pill igual que inscripciones para los contadores del header
const KpiCard = ({
  icon,
  iconClass,
  label,
  value,
  cambio,
  suffix = '',
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: number;
  cambio: number;
  suffix?: string;
}) => {
  const isUp = cambio > 0;
  const isNeutral = cambio === 0;
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className={`kpi-icon ${iconClass}`}>{icon}</div>
        <div className={`kpi-badge ${isNeutral ? 'neutral' : isUp ? 'up' : 'down'}`}>
          {isNeutral ? <Minus /> : isUp ? <TrendingUp /> : <TrendingDown />}
          {Math.abs(cambio).toFixed(1)}%
        </div>
      </div>
      <div className="kpi-value">
        {suffix ? `${value}${suffix}` : value.toLocaleString()}
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-sub">vs mes anterior</div>
    </div>
  );
};

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function AdminEstadisticasPage() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [modalExport, setModalExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope]   = useState('general');
  const [exporting, setExporting]       = useState(false);
  const [exportDone, setExportDone]     = useState(false);

  const TABS = [
    { value: 'todos',       label: 'Todo el tiempo'  },
    { value: '2025',        label: '2025'            },
    { value: 'verano',      label: 'Verano 2025'     },
    { value: 'primavera',   label: 'Primavera 2025'  },
  ];

  // Contadores para las pills del header (mismo patrón que inscripciones)
  const totalInscritos  = detalleTabla.reduce((a, r) => a + r.inscritos, 0);
  const convActivas     = detalleTabla.filter(r => r.estado === 'activo').length;

  // Lógica de exportación
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);

      if (exportFormat === 'csv') {
        const rows = [
          ['Convocatoria', 'Periodo', 'Interesados', 'Notificados', 'Inscritos', 'Asistencia %', 'Estado'],
          ...detalleTabla.map(r => [
            r.convocatoria, r.periodo, r.interesados,
            r.notificados, r.inscritos, r.asistencia, r.estado,
          ]),
        ];
        downloadFile(
          rows.map(r => r.join(',')).join('\n'),
          `estadisticas_schedmaster_${new Date().toISOString().slice(0, 10)}.csv`,
          'text/csv',
        );
      } else if (exportFormat === 'json') {
        downloadFile(
          JSON.stringify(
            { kpis: mockKPIs, funnel: funnelData, porRol, porDivision, detalle: detalleTabla },
            null, 2,
          ),
          `estadisticas_schedmaster_${new Date().toISOString().slice(0, 10)}.json`,
          'application/json',
        );
      } else {
        alert('Exportación PDF: integra jsPDF o pdfmake en producción.');
        setModalExport(false);
        setExportDone(false);
        return;
      }

      setTimeout(() => { setModalExport(false); setExportDone(false); }, 1200);
    }, 1500);
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const closeSidebar = () => setSidebarActive(false);

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        className="menu-toggle"
        type="button"
        onClick={() => setSidebarActive(!sidebarActive)}
        aria-label={sidebarActive ? 'Cerrar menú' : 'Abrir menú'}
      >
        <Menu />
      </button>

      <div className="app">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`sidebar ${sidebarActive ? 'active' : ''}`}
          aria-label="Menú administrador"
          onClick={e => { if (e.target === e.currentTarget) closeSidebar(); }}
        >
          <div className="sb-brand">
            <div className="sb-logo" aria-hidden="true"><LayoutGrid /></div>
            <div className="sb-brand-text">
              <h1>SchedMaster</h1>
              <p>Panel de Administración</p>
            </div>
          </div>

          <nav className="nav" aria-label="Navegación" onClick={closeSidebar}>
            <a href="#" aria-label="Dashboard"><Home /> Dashboard</a>
            <a href="#" aria-label="Usuarios"><Users /> Usuarios</a>
            <a href="#" aria-label="Asistencias"><CalendarCheck /> Asistencias</a>
            <a href="#" aria-label="Inscripciones"><UserPlus /> Inscripciones</a>
            <a href="#" className="active" aria-current="page" aria-label="Estadísticas">
              <BarChart3 /> Estadísticas
            </a>
            <a href="#" aria-label="Anuncios"><Mail /> Anuncios</a>
            <a href="#" aria-label="Configuración"><Settings /> Configuración</a>
          </nav>

          <div className="sb-footer" aria-label="Usuario actual">
            <div className="sb-user">
              <div className="avatar" aria-hidden="true">AU</div>
              <div className="sb-user-info">
                <strong>Admin UTEQ</strong>
                <span>Administrador</span>
              </div>
            </div>
            <button className="btn-logout" type="button">
              <LogOut aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="main" aria-label="Contenido principal">
          <div className="main-inner">

            {/* Header */}
            <header className="header" aria-label="Encabezado de estadísticas">
              <div className="title">
                <h2>Estadísticas y reportes</h2>
                <p>
                  Visión completa del ciclo: interesados registrados → notificados por correo →
                  inscritos → asistencia → anuncios del admin.
                </p>
              </div>

              {/* Pills + acciones — mismo patrón que inscripciones */}
              <div className="header-actions" aria-label="Acciones rápidas">
                <div className="pill">
                  <Users /> Inscritos totales: <span>{totalInscritos.toLocaleString()}</span>
                </div>
                <div className="pill">
                  <Activity /> Convocatorias activas: <span>{convActivas}</span>
                </div>
                <button className="btn btn-outline" type="button">
                  <RefreshCw aria-hidden="true" />
                  Actualizar
                </button>
                <button className="btn btn-primary" type="button" onClick={() => setModalExport(true)}>
                  <Download aria-hidden="true" />
                  Exportar reporte
                </button>
              </div>
            </header>

            {/* Tabs de periodo */}
            <div className="tabs-bar" role="tablist" aria-label="Filtro de periodo">
              <span className="period-label">Periodo:</span>
              <div className="tab-group">
                {TABS.map(t => (
                  <button
                    key={t.value}
                    role="tab"
                    aria-selected={periodoFiltro === t.value}
                    className={`tab ${periodoFiltro === t.value ? 'active' : ''}`}
                    type="button"
                    onClick={() => setPeriodoFiltro(t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Grid */}
            <section aria-label="Indicadores clave">
              <div className="kpi-grid">
                <KpiCard icon={<Eye />}         iconClass="blue"   label="Interesados registrados"    value={mockKPIs.interesados.valor}    cambio={mockKPIs.interesados.cambio} />
                <KpiCard icon={<Mail />}        iconClass="purple" label="Notificados por correo"     value={mockKPIs.notificados.valor}    cambio={mockKPIs.notificados.cambio} />
                <KpiCard icon={<UserPlus />}    iconClass="green"  label="Inscripciones completadas"  value={mockKPIs.inscritos.valor}      cambio={mockKPIs.inscritos.cambio} />
                <KpiCard icon={<CalendarCheck />} iconClass="yellow" label="Asistencia promedio"      value={mockKPIs.asistencia.valor}     cambio={mockKPIs.asistencia.cambio}   suffix="%" />
                <KpiCard icon={<Activity />}    iconClass="blue"   label="Anuncios publicados"        value={mockKPIs.anuncios.valor}       cambio={mockKPIs.anuncios.cambio} />
                  
              </div>
            </section>

            {/* Insights automáticos */}
            <section aria-label="Observaciones automáticas">
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon green"><Award /></div>
                  <div>
                    <div className="insight-title">Alta conversión este ciclo</div>
                    <div className="insight-desc">
                      El 69.9% de los interesados completaron su inscripción, el mejor
                      registro histórico del sistema.
                    </div>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon yellow"><AlertTriangle /></div>
                  <div>
                    <div className="insight-title">Asistencia con tendencia a la baja</div>
                    <div className="insight-desc">
                      Bajó 2.1% respecto al mes anterior. Los sábados registran la menor
                      concurrencia del ciclo.
                    </div>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon blue"><Flame /></div>
                  <div>
                    <div className="insight-title">DTAI lidera inscripciones</div>
                    <div className="insight-desc">
                      La división DTAI concentra el 36.6% del total de inscripciones activas
                      del ciclo Verano 2025.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gráficas */}
            <section aria-label="Gráficas de análisis">
              <div className="charts-section">

                {/* Tendencia mensual — ancho completo */}
                <div className="chart-card wide">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Tendencia mensual</div>
                      <div className="chart-subtitle">
                        Interesados vs inscripciones completadas — últimos 12 meses
                      </div>
                    </div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <div className="legend-dot" style={{ background: '#00a4e0' }} />
                        Inscritos
                      </div>
                      <div className="legend-item">
                        <div className="legend-dot" style={{ background: '#3b82f6', opacity: 0.5 }} />
                        Interesados
                      </div>
                    </div>
                  </div>
                  <Sparkline data={inscripcionesMes} secondary={interesadosMes} />
                </div>

                {/* Donut por rol */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Inscripciones por rol</div>
                      <div className="chart-subtitle">
                        Distribución de {mockKPIs.inscritos.valor.toLocaleString()} inscritos
                      </div>
                    </div>
                  </div>
                  <Donut data={porRol} total={mockKPIs.inscritos.valor} />
                </div>

                {/* Barras por división */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Inscripciones por división</div>
                      <div className="chart-subtitle">Distribución por unidad académica</div>
                    </div>
                  </div>
                  <BarChart data={porDivision} />
                </div>

                {/* Embudo */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Embudo de conversión</div>
                      <div className="chart-subtitle">Del interés hasta la inscripción completa</div>
                    </div>
                  </div>
                  <Funnel />
                </div>

                {/* Heatmap asistencia */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Mapa de asistencia</div>
                      <div className="chart-subtitle">
                        Porcentaje por día y semana del ciclo
                      </div>
                    </div>
                  </div>
                  <Heatmap />
                </div>

              </div>
            </section>

            {/* Rankings + actividad */}
            <section aria-label="Rankings y actividad reciente">
              <div className="charts-section">

                {/* Top asistencia */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Top asistencia</div>
                      <div className="chart-subtitle">Usuarios con mayor porcentaje de asistencia</div>
                    </div>
                  </div>
                  <div className="ranking-table">
                    {topAsistencia.map((u, i) => (
                      <div key={i} className="ranking-row">
                        <div className={`ranking-pos ${i < 3 ? 'top' : ''}`}>
                          {i < 3 ? '★' : i + 1}
                        </div>
                        <div
                          className="ranking-avatar"
                          style={{
                            background: `${avatarColors[i % avatarColors.length]}22`,
                            color: avatarColors[i % avatarColors.length],
                          }}
                        >
                          {getInitials(u.nombre)}
                        </div>
                        <div className="ranking-info">
                          <div className="ranking-name">{u.nombre}</div>
                          <div className="ranking-sub">{u.division}</div>
                        </div>
                        <div className="ranking-bar-wrap">
                          <div className="ranking-bar-track">
                            <div className="ranking-bar-fill" style={{ width: `${u.pct}%` }} />
                          </div>
                        </div>
                        <div className="ranking-pct">{u.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actividad reciente */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Actividad reciente</div>
                      <div className="chart-subtitle">Últimas acciones registradas en el sistema</div>
                    </div>
                  </div>
                  <div className="activity-list">
                    {actividadReciente.map((a, i) => (
                      <div key={i} className="activity-item">
                        <div className="activity-dot-wrap">
                          <div className="activity-dot" style={{ background: a.color }} />
                          <div className="activity-line" />
                        </div>
                        <div className="activity-content">
                          <div
                            className="activity-text"
                            dangerouslySetInnerHTML={{ __html: a.texto }}
                          />
                          <div className="activity-time">{a.tiempo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Tabla de detalle */}
            <section className="table-area" aria-label="Detalle por convocatoria">
              <div className="table-scroll">
                <div className="table-card-header">
                  <div>
                    <div className="chart-title">Detalle por convocatoria</div>
                    <div className="chart-subtitle">
                      Comparativo de métricas por periodo académico
                    </div>
                  </div>
                  <button
                    className="btn btn-outline btn-success"
                    type="button"
                    onClick={() => setModalExport(true)}
                  >
                    <Download aria-hidden="true" />
                    Exportar tabla
                  </button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Convocatoria</th>
                      <th>Periodo</th>
                      <th>Interesados</th>
                      <th>Notificados</th>
                      <th>Inscritos</th>
                      <th>Conversión</th>
                      <th>Asistencia</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleTabla.map((row, i) => {
                      const conv = ((row.inscritos / row.interesados) * 100).toFixed(1);
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 900, color: 'var(--blue-900)' }}>
                            {row.convocatoria}
                          </td>
                          <td className="muted">{row.periodo}</td>
                          <td>{row.interesados.toLocaleString()}</td>
                          <td>{row.notificados.toLocaleString()}</td>
                          <td style={{ fontWeight: 900 }}>{row.inscritos.toLocaleString()}</td>
                          <td>
                            {/* chip reutilizado igual que inscripciones */}
                            <span className="chip chip-role">
                              <TrendingUp /> {conv}%
                            </span>
                          </td>
                          <td>
                            <span className={`chip ${
                              row.asistencia >= 80
                                ? 'chip-high'
                                : row.asistencia >= 70
                                ? 'chip-role'
                                : 'chip-low'
                            }`}>
                              {row.asistencia >= 80 ? <Check /> : row.asistencia >= 70 ? <Clock /> : <AlertTriangle />}
                              {row.asistencia}%
                            </span>
                          </td>
                          <td>
                            <span className={`chip ${row.estado === 'activo' ? 'chip-high' : 'chip-low'}`}>
                              {row.estado === 'activo' ? <Sparkles /> : <CheckCircle />}
                              {row.estado === 'activo' ? 'Activo' : 'Cerrado'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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

      {/* ===== MODAL EXPORTAR — mismo patrón que modal contrapropuesta de inscripciones ===== */}
      <div
        className={`modal-overlay ${modalExport ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalExportTitle"
        onClick={e => { if (e.target === e.currentTarget) setModalExport(false); }}
      >
        <div className="modal-content" role="document">
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 id="modalExportTitle">Exportar reporte</h3>
              <p>Elige el formato y el alcance del reporte a descargar</p>
            </div>
            <button
              className="btn-close"
              type="button"
              onClick={() => setModalExport(false)}
              aria-label="Cerrar modal"
            >
              <X />
            </button>
          </div>

          <div className="modal-body">

            {/* Formato */}
            <div className="form-group">
              <label className="form-label">Formato de exportación</label>
              <div className="export-options">
                {[
                  { value: 'csv',  cls: 'csv',  icon: <FileText />, label: 'CSV / Excel',  desc: 'Compatible con Excel y Google Sheets' },
                  { value: 'json', cls: 'json', icon: <Database />, label: 'JSON',         desc: 'Datos estructurados para integraciones' },
                  { value: 'pdf',  cls: 'pdf',  icon: <FileText />, label: 'PDF',          desc: 'Reporte visual listo para presentar' },
                ].map(opt => (
                  <div
                    key={opt.value}
                    className={`export-option ${exportFormat === opt.value ? 'selected' : ''}`}
                    onClick={() => setExportFormat(opt.value)}
                  >
                    <div className={`export-option-icon ${opt.cls}`}>{opt.icon}</div>
                    <div className="export-option-info">
                      <div className="export-option-name">{opt.label}</div>
                      <div className="export-option-desc">{opt.desc}</div>
                    </div>
                    <div className="export-check"><Check /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alcance */}
            <div className="form-group">
              <label htmlFor="selectExportScope" className="form-label">
                Alcance del reporte
              </label>
              <select
                id="selectExportScope"
                className="form-select"
                value={exportScope}
                onChange={e => setExportScope(e.target.value)}
              >
                <option value="general">Resumen general (KPIs + embudo)</option>
                <option value="convocatorias">Detalle por convocatoria</option>
                <option value="asistencia">Asistencia por usuario</option>
                <option value="completo">Reporte completo</option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => setModalExport(false)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleExport}
              disabled={exporting}
              style={{ minWidth: 160 }}
            >
              {exportDone ? (
                <><Check /> ¡Descargado!</>
              ) : exporting ? (
                <><RefreshCw style={{ animation: 'spin 1s linear infinite' }} /> Generando...</>
              ) : (
                <><Download /> Descargar</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}