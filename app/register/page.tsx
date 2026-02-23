'use client';

import { useState, useEffect } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircleCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    tipo: 'estudiante',
    division: '',
    carrera: '',
    horario: '', // ✅ nuevo campo
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]); // ✅ estado horarios
  const [strength, setStrength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(false);

  // 🔹 cargar divisiones
  useEffect(() => {
    const loadDivisiones = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/catalogo/divisiones');
        const data = await res.json();
        setDivisiones(data);
      } catch (error) {
        console.error('Error cargando divisiones', error);
      }
    };
    loadDivisiones();
  }, []);

  // 🔹 cargar horarios
  useEffect(() => {
    const loadHorarios = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/horarios');
        const data = await res.json();
        setHorarios(data);
      } catch (error) {
        console.error('Error cargando horarios', error);
      }
    };
    loadHorarios();
  }, []);

  // 🔹 recalcular progreso
  useEffect(() => {
    updateProgress(form);
  }, [form]);

  // 🔹 manejar cambios
  const handleChange = async (e: any) => {
    const { name, value, type, checked } = e.target;
    const newForm: any = {
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    };

    if (name === 'tipo' && value === 'docente') {
      newForm.division = '';
      newForm.carrera = '';
      newForm.horario = '';
      setCarreras([]);
    }

    if (name === 'division') {
      newForm.carrera = '';
      setCarreras([]);

      if (value) {
        try {
          setLoadingCarreras(true);
          const res = await fetch(`http://localhost:3001/api/catalogo/carreras/${value}`);
          const data = await res.json();
          setCarreras(data);
        } catch (error) {
          console.error('Error cargando carreras', error);
        } finally {
          setLoadingCarreras(false);
        }
      }
    }

    setForm(newForm);

    if (name === 'password') {
      checkPassword(value);
    }
  };

  const checkPassword = (password: string) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*]/.test(password)) s++;
    setStrength(s);
  };

  const updateProgress = (data: any) => {
    let fields = [
      'nombre',
      'apellido_paterno',
      'apellido_materno',
      'email',
      'password',
      'confirmPassword',
    ];

    if (data.tipo === 'estudiante') {
      fields.push('division', 'carrera', 'horario');
    }

    let filled = fields.filter((f) => data[f]).length;
    if (data.terms) filled++;

    const total = fields.length + 1;
    setProgress((filled / total) * 100);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido_paterno: form.apellido_paterno,
          apellido_materno: form.apellido_materno,
          correo: form.email,
          password: form.password,
          id_carrera: form.tipo === 'estudiante' ? form.carrera : null,
          id_division: form.tipo === 'estudiante' ? form.division : null,
          id_horario: form.tipo === 'estudiante' ? form.horario : null, // ✅ enviado
          cuatrimestre: 1,
          id_rol: form.tipo === 'estudiante' ? 1 : 2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error(error);
      alert('Error al registrar');
    }
  };

  const isFormValid = () => {
    if (strength < 3 || !form.terms) return false;
    if (!form.nombre || !form.apellido_paterno || !form.apellido_materno || !form.email || !form.password || !form.confirmPassword) return false;
    if (form.tipo === 'estudiante' && (!form.division || !form.carrera || !form.horario)) return false;
    return true;
  };

  return (
    <div className="register-page">
      <div className="container">
        <button className="btn-secondary back-button" onClick={() => router.push('/login')}>
          <ArrowLeft size={18} strokeWidth={2.5} />
          Volver al inicio
        </button>

        <div className="register-card">
          {!success ? (
            <>
              <div className="header">
                <h1>Únete a <span className="highlight">SchedMaster</span></h1>
                <p className="subtitle">Completa tu información para crear tu cuenta</p>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" data-progress={progress} />
              </div>

              <form onSubmit={handleSubmit}>
                <select name="tipo" value={form.tipo} className="auth-select" onChange={handleChange}>
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                </select>

                <div className="form-row">
                  <input name="nombre" value={form.nombre} className="auth-input" placeholder="Nombre" onChange={handleChange} required />
                  <input name="apellido_paterno" value={form.apellido_paterno} className="auth-input" placeholder="Apellido Paterno" onChange={handleChange} required />
                  <input name="apellido_materno" value={form.apellido_materno} className="auth-input" placeholder="Apellido Materno" onChange={handleChange} required />
                </div>

                <input name="email" value={form.email} type="email" className="auth-input" placeholder="correo@uteq.edu.mx" onChange={handleChange} required />

                {form.tipo === 'estudiante' && (
                  <>
                    <select name="division" value={form.division} className="auth-select" onChange={handleChange} required>
                      <option value="">Selecciona tu división</option>
                      {divisiones.map((d) => (
                        <option key={d.id_division} value={d.id_division}>
                          {d.siglas} - {d.nombre_division}
                        </option>
                      ))}
                    </select>

                    <select name="carrera" value={form.carrera} className="auth-select" onChange={handleChange} required disabled={!form.division || loadingCarreras}>
                      <option value="">{loadingCarreras ? 'Cargando carreras...' : 'Selecciona tu carrera'}</option>
                      {carreras.map((c) => (
                        <option key={c.id_carrera} value={c.id_carrera}>
                          {c.nombre_carrera}
                        </option>
                      ))}
                    </select>

                    {/* ✅ SELECT HORARIO */}
                    <select name="horario" value={form.horario} className="auth-select" onChange={handleChange} required>
                      <option value="">Selecciona tu horario</option>
                      {horarios.map((h) => (
                        <option key={h.id_horario} value={h.id_horario}>
                          {h.dia_semana} — {new Date(h.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <input name="password" value={form.password} type="password" className="auth-input" placeholder="Contraseña" onChange={handleChange} required />
                <input name="confirmPassword" value={form.confirmPassword} type="password" className="auth-input" placeholder="Confirmar contraseña" onChange={handleChange} required />

                <div className="checkbox-wrapper">
                  <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} />
                  <label htmlFor="terms">Acepto términos</label>
                </div>

                <button type="submit" className="btn-primary" disabled={!isFormValid()}>
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
              <p className="success-text">Redirigiendo al login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}