'use client';

import { useState } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

const [form, setForm] = useState({
  nombre: '',
  apellido: '',
  email: '',
  tipo: '', // 🔥 nuevo (estudiante/docente)
  carrera: '',
  password: '',
  confirmPassword: '',
  terms: false,
});


  const [strength, setStrength] = useState(0);
  const [progress, setProgress] = useState(33);
  const [success, setSuccess] = useState(false);

  // 🔹 manejar inputs
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

  // 🔹 fuerza de contraseña
  const checkPassword = (password: string) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*]/.test(password)) s++;
    setStrength(s);
  };

  // 🔹 progreso
  const updateProgress = (data: any) => {
  const baseFields = [
    'nombre',
    'apellido',
    'email',
    'tipo',
    'password',
    'confirmPassword',
  ];

  let filled = baseFields.filter((f) => data[f]).length;

  // 🔥 si es estudiante también cuenta carrera
  if (data.tipo === 'estudiante') {
    if (data.carrera) filled++;
  } else {
    filled++; // docente no necesita carrera
  }

  if (data.terms) filled++;

  const total = data.tipo === 'estudiante' ? 8 : 7;
  setProgress((filled / total) * 100);
};

  // 🔹 submit
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
    <div className="container">
      <button
        className="back-button"
        onClick={() => router.push('/login')}
      >
        ← Volver al inicio
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
                  placeholder="Nombre"
                  onChange={handleChange}
                  required
                />
                <input
                  name="apellido"
                  placeholder="Apellido"
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="correo@uteq.edu.mx"
                onChange={handleChange}
                required
              />

            <select
  name="tipo"
  value={form.tipo}
  onChange={handleChange}
  required
>
  <option value="">Selecciona tipo de usuario</option>
  <option value="estudiante">Estudiante</option>
  <option value="docente">Docente</option>
</select>

             {form.tipo === 'estudiante' && (
  <select
    name="carrera"
    value={form.carrera}
    onChange={handleChange}
    required
  >
    <option value="">Selecciona tu carrera</option>
    <option value="sistemas">Ing. en Sistemas</option>
    <option value="industrial">Ing. Industrial</option>
    <option value="mecatronica">Ing. Mecatrónica</option>
    <option value="administracion">Administración</option>
  </select>
)}


              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                required
              />

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="terms"
                  onChange={handleChange}
                />
                <span>Acepto términos</span>
              </div>

              <button
                type="submit"
                className="btn-register"
                disabled={strength < 3}
              >
                Crear mi cuenta
              </button>
            </form>
          </>
        ) : (
          <div className="success-message active">
            <h2 className="success-title">¡Cuenta creada!</h2>
            <p className="success-text">
              Redirigiendo al login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
