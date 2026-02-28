'use client';

import { User, Calendar, Clock, Home } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo.png" alt="logo" />
          <span>SchedMaster</span>
        </div>
        <Link href="/home" className="btn-login">
          <Home size={18} /> Inicio
        </Link>
      </header>

      <section className="home-hero">
        <h1>Mi perfil</h1>
        <p>Consulta tu información y tu inscripción actual</p>
      </section>

      <section className="services-section">
        <div className="services-grid">

          <div className="card">
            <div className="card-header">
              <User size={20} />
              <span>Información personal</span>
            </div>
            <div className="form-row" style={{ flexWrap: 'wrap' }}>
              <div className="form-group">
                <span className="input-label">Nombre</span>
                <p>Ana López García</p>
              </div>
              <div className="form-group">
                <span className="input-label">Correo</span>
                <p>ana.lopez@uteq.edu.mx</p>
              </div>
              <div className="form-group">
                <span className="input-label">Carrera</span>
                <p>Ingeniería en Software</p>
              </div>
              <div className="form-group">
                <span className="input-label">División</span>
                <p>TIC</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <Calendar size={20} />
              <span>Periodo inscrito</span>
            </div>
            <p className="message">Periodo Enero - Abril 2026</p>
            <div className="status">Activo</div>
          </div>

          <div className="card">
            <div className="card-header">
              <Clock size={20} />
              <span>Horario asignado</span>
            </div>
            <div className="tip-card">
              <p><strong>Día:</strong> Lunes y Miércoles</p>
              <p style={{ marginTop: '8px' }}><strong>Hora:</strong> 18:00 - 19:00</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}