'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';

export default function DashboardPage() {
  const router = useRouter();

  // useEffect(() => {
  //   if (!localStorage.getItem('token')) router.push('/login');
  // }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="app">
      <AdminSidebar onLogout={handleLogout} />

      <main className="main">
        <div className="main-inner">

          <header className="section-header">
            <div>
              <h2>Dashboard</h2>
              <p>Bienvenido al panel de administración de SchedMaster.</p>
            </div>
          </header>

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