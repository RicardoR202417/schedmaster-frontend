'use client';

import './perfil.css';
import { User, Calendar, Clock, Home } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  return (
    <div className="perfil-page">

    
<header className="perfil-header">
  <div className="logo-section">
    <img src="/logo.png" alt="logo" />
    <span>SchedMaster</span>
  </div>

  <Link href="/home" className="btn-home">
    <Home size={18} />
    Inicio
  </Link>
</header>

      {/* HERO */}
      <section className="perfil-hero">
        <h1>Mi perfil</h1>
        <p>Consulta tu información y tu inscripción actual</p>
      </section>

      <section className="perfil-content">

        {/* DATOS PERSONALES */}
        <div className="perfil-card">
          <div className="card-title">
            <User size={20} />
            <h3>Información personal</h3>
          </div>

          <div className="perfil-grid">
            <div>
              <span className="label">Nombre</span>
              <p>Ana López García</p>
            </div>

            <div>
              <span className="label">Correo</span>
              <p>ana.lopez@uteq.edu.mx</p>
            </div>

            <div>
              <span className="label">Carrera</span>
              <p>Ingeniería en Software</p>
            </div>

            <div>
              <span className="label">División</span>
              <p>TIC</p>
            </div>
          </div>
        </div>

        {/* PERIODO */}
        <div className="perfil-card">
          <div className="card-title">
            <Calendar size={20} />
            <h3>Periodo inscrito</h3>
          </div>

          <p className="periodo-name">Periodo Enero - Abril 2026</p>
          <span className="periodo-status">Activo</span>
        </div>

        {/* HORARIO */}
        <div className="perfil-card">
          <div className="card-title">
            <Clock size={20} />
            <h3>Horario asignado</h3>
          </div>

          <div className="horario-box">
            <p><strong>Día:</strong> Lunes y Miércoles</p>
            <p><strong>Hora:</strong> 18:00 - 19:00</p>
          </div>
        </div>

      </section>

    </div>
  );
}