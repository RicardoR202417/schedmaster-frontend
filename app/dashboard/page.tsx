'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';

export default function DashboardPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  // 🔐 Verificar token (misma lógica que tu versión anterior)
  useEffect(() => {
    const verificarAcceso = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
      } else {
        setAutorizado(true);
      }
    };

    const timer = setTimeout(verificarAcceso, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // ⏳ Loader para evitar parpadeo
  if (!autorizado) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#fff',
          fontSize: '14px',
        }}
      >
        <p>Cargando SchedMaster...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <AdminSidebar onLogout={handleLogout} />

      <main className="main">
        <div className="main-inner">

          {/* Header con tus clases nuevas */}
          <header className="section-header">
            <div>
              <h2>Dashboard</h2>
              <p>Bienvenido al panel de administración de SchedMaster.</p>
            </div>
          </header>

          {/* Cards estadísticas */}
          <section className="stat-grid" aria-label="Resumen del sistema">
            <div className="stat-card">
              <span className="stat-card-label">Inscripciones pendientes</span>
              <span className="stat-card-value">0</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">Usuarios registrados</span>
              <span className="stat-card-value">0</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">Asistencias hoy</span>
              <span className="stat-card-value">0</span>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">Servicios activos</span>
              <span className="stat-card-value">0</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}