'use client';

import { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircleCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

const [form, setForm] = useState({
  nombre: '',
  apellido: '',
  email: '',
  tipo: 'estudiante', // Siempre estudiante
  carrera: '',
  password: '',
  confirmPassword: '',
  terms: false,
});


  const [strength, setStrength] = useState(0);
  const [progress, setProgress] = useState(33);
  const [success, setSuccess] = useState(false);

  // Manejar inputs
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    const newForm = {
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    };

    setForm(newForm);
    updateProgress(newForm);

    if (name === 'password') {
      checkPassword(value);
    }
  };

  // Fuerza de contraseña
  const checkPassword = (password: string) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*]/.test(password)) s++;
    setStrength(s);
  };

  // Progreso
  const updateProgress = (data: any) => {
  const baseFields = [
    'nombre',
    'apellido',
    'email',
    'carrera',
    'password',
    'confirmPassword',
  ];

  let filled = baseFields.filter((f) => data[f]).length;

  if (data.terms) filled++;

  const total = 7;
  setProgress((filled / total) * 100);
};

  // Submit
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="register-page">
      <div className="container">
        <button
          className="btn-secondary back-button"
          onClick={() => router.push('/login')}
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Volver al inicio
        </button>

      <div className="register-card">
        {!success ? (
          <>
            <div className="header">
              <h1>Únete a <span className="highlight">SchedMaster</span></h1>
              <p className="subtitle">
                Completa tu información para crear tu cuenta
              </p>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  name="nombre"
                  className="auth-input"
                  placeholder="Nombre"
                  onChange={handleChange}
                  required
                />
                <input
                  name="apellido"
                  className="auth-input"
                  placeholder="Apellido"
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                className="auth-input"
                placeholder="correo@uteq.edu.mx"
                onChange={handleChange}
                required
              />

              <select
                name="carrera"
                value={form.carrera}
                className="auth-select"
                onChange={handleChange}
                required
                aria-label="Carrera"
              >
                <option value="">Selecciona tu carrera</option>
                <option value="sistemas">Ing. en Sistemas</option>
                <option value="industrial">Ing. Industrial</option>
                <option value="mecatronica">Ing. Mecatrónica</option>
                <option value="administracion">Administración</option>
              </select>

              <input
                name="password"
                type="password"
                className="auth-input"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />

              <input
                name="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                required
              />

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="terms"
                  onChange={handleChange}
                  title="Acepto términos y condiciones"
                  aria-label="Acepto términos y condiciones"
                />
                <span>Acepto términos</span>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={strength < 3}
              >
                Crear mi cuenta
              </button>
            </form>
          </>
        ) : (
          <div className="success-message active">
            <div className="success-icon">
              <CircleCheck size={40} strokeWidth={2.5} />
            </div>
            <h2 className="success-title">¡Cuenta creada!</h2>
            <p className="success-text">
              Redirigiendo al login...
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
