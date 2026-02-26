'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';
import './dashboard.css';

export default function DashboardPage() {
  const router = useRouter();

  // Verificar token de sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // TODO: Eliminar token y redirigir al login
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="app">
      {/* SIDEBAR — Componente reutilizable */}
      <AdminSidebar onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="main" aria-label="Contenido principal">
        <div className="main-inner">
          {/* Header */}
          <header className="dash-header" aria-label="Encabezado del dashboard">
            <div className="dash-title">
              <h2>Dashboard</h2>
              <p>Bienvenido al panel de administración de SchedMaster.</p>
            </div>
          </header>

          {/* Tarjetas de resumen */}
          <section className="dash-cards" aria-label="Resumen del sistema">
            <div className="dash-card">
              <span className="dash-card-label">Inscripciones pendientes</span>
              <span className="dash-card-value">0</span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Usuarios registrados</span>
              <span className="dash-card-value">0</span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Asistencias hoy</span>
              <span className="dash-card-value">0</span>
            </div>
            <div className="dash-card">
              <span className="dash-card-label">Servicios activos</span>
              <span className="dash-card-value">0</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

