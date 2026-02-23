'use client';

import { useState } from 'react';
import './login.css';
import Link from 'next/link';
import { CircleCheck, ListOrdered, Bell } from 'lucide-react';


export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();
if (res.ok) {

  if (data.status === 'pending') {
    window.location.href = '/pending';
    return;
  }

  if (data.status === 'approved') {
    window.location.href = '/dashboard';
    return;
  }

} else {
  alert(data.message);
}
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="login-page">
      {/* HERO */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="brand-logo">
            <img src="/logo.png" alt="Logo" width="60" height="60" />
          </div>

          <h1 className="hero-title">SchedMaster</h1>
          <p className="hero-subtitle">
            Gestión inteligente de horarios UTEQ
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CircleCheck size={20} strokeWidth={2.5} />
              </div>
              <span className="feature-text">
                Reserva tu horario favorito
              </span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <ListOrdered size={20} strokeWidth={2.5} />
              </div>
              <span className="feature-text">
                Fila virtual inteligente
              </span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Bell size={20} strokeWidth={2.5} />
              </div>
              <span className="feature-text">
                Notificaciones en tiempo real
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN */}
      <div className="login-section">
        <div className="decorative-shape shape-1"></div>
        <div className="decorative-shape shape-2"></div>

        <div className="login-container">
          <div className="login-header">
            <h1>
              Bienvenido de <span className="highlight">nuevo</span>
            </h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo institucional</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="usuario@uteq.edu.mx"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot-password">
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Iniciar sesión
            </button>
          </form>

          <div className="divider">
            <span>¿Primera vez?</span>
          </div>

          <div className="auth-link">
            <Link href="/register">Crea tu cuenta aquí</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
