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
    horarioId: '',
    diasSeleccionados: [] as number[],
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [diasHorario, setDiasHorario] = useState<any[]>([]);
  const [strength, setStrength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(false);

  // cargar divisiones
  useEffect(() => {
    fetch('http://localhost:3001/api/catalogo/divisiones')
      .then(res => res.json())
      .then(setDivisiones)
      .catch(() => setDivisiones([]));
  }, []);

  // cargar horarios
  useEffect(() => {
    fetch('http://localhost:3001/api/horarios')
      .then(res => res.json())
      .then(data => setHorarios(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setHorarios([]));
  }, []);

  // cargar días del horario
  useEffect(() => {
    if (!form.horarioId) return setDiasHorario([]);

    fetch(`http://localhost:3001/api/horarios/${form.horarioId}/dias`)
      .then(res => res.json())
      .then(setDiasHorario)
      .catch(() => setDiasHorario([]));
  }, [form.horarioId]);

  useEffect(() => updateProgress(form), [form]);

  const handleChange = async (e: any) => {
    const { name, value, type, checked } = e.target;
    const newForm: any = { ...form, [name]: type === 'checkbox' ? checked : value };

    if (name === 'division') {
      newForm.carrera = '';
      setCarreras([]);
      if (value) {
        setLoadingCarreras(true);
        const res = await fetch(`http://localhost:3001/api/catalogo/carreras/${value}`);
        setCarreras(await res.json());
        setLoadingCarreras(false);
      }
    }

    if (name === 'password') checkPassword(value);
    setForm(newForm);
  };

  const toggleDia = (idDia: number) => {
    setForm(prev => ({
      ...prev,
      diasSeleccionados: prev.diasSeleccionados.includes(idDia)
        ? prev.diasSeleccionados.filter(d => d !== idDia)
        : [...prev.diasSeleccionados, idDia],
    }));
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
    let fields = ['nombre','apellido_paterno','apellido_materno','email','password','confirmPassword'];
    if (data.tipo === 'estudiante') fields.push('division','carrera','horarioId');
    let filled = fields.filter(f => data[f]).length;
    if (data.terms) filled++;
    setProgress((filled / (fields.length + 1)) * 100);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Las contraseñas no coinciden');

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
        id_horario: form.tipo === 'estudiante' ? form.horarioId : null,
        dias_seleccionados: form.tipo === 'estudiante' ? form.diasSeleccionados : null,
        cuatrimestre: 1,
        id_rol: form.tipo === 'estudiante' ? 1 : 2,
      }),
    });

    if (!res.ok) return alert((await res.json()).message);
    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  };

  const isFormValid = () => {
    if (strength < 3 || !form.terms) return false;
    if (!form.nombre || !form.apellido_paterno || !form.apellido_materno || !form.email || !form.password || !form.confirmPassword) return false;
    if (form.tipo === 'estudiante' && (!form.division || !form.carrera || !form.horarioId)) return false;
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
                <div className="progress-fill" style={{ width: `${progress}%` }} />
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
                      {divisiones.map(d => <option key={d.id_division} value={d.id_division}>{d.siglas} - {d.nombre_division}</option>)}
                    </select>

                    <select name="carrera" value={form.carrera} className="auth-select" onChange={handleChange} required disabled={!form.division || loadingCarreras}>
                      <option value="">{loadingCarreras ? 'Cargando carreras...' : 'Selecciona tu carrera'}</option>
                      {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>)}
                    </select>

                    <select name="horarioId" value={form.horarioId} className="auth-select" onChange={handleChange} required>
                      <option value="">Selecciona tu rango de horario</option>
                      {horarios.map(h => (
                        <option key={h.id_horario} value={h.id_horario}>
                          {new Date(h.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(h.hora_fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </option>
                      ))}
                    </select>

                    {form.horarioId && (
                      <div className="dias-container">
                        {diasHorario.map(dia => (
                          <button key={dia.id_dia} type="button"
                            className={`dia-btn ${form.diasSeleccionados.includes(dia.id_dia) ? 'active' : ''}`}
                            onClick={() => toggleDia(dia.id_dia)}>
                            {dia.nombre}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* PASSWORD */}
                <div className="input-label">CONTRASEÑA</div>
                <input name="password" value={form.password} type="password" className="auth-input" placeholder="Crea una contraseña segura" onChange={handleChange} required />

                <div className="password-hints">
                  <div className={strength >= 1 ? 'hint ok' : 'hint'}>Mínimo 8 caracteres</div>
                  <div className={strength >= 2 ? 'hint ok' : 'hint'}>Una letra mayúscula</div>
                  <div className={strength >= 3 ? 'hint ok' : 'hint'}>Un número</div>
                </div>

                <div className="input-label">CONFIRMAR CONTRASEÑA</div>
                <input name="confirmPassword" value={form.confirmPassword} type="password" className="auth-input" placeholder="Confirma tu contraseña" onChange={handleChange} required />

                <label className="terms">
                  <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
                  <span>Acepto los <b>términos y condiciones</b> y la <b>política de privacidad</b> de SchedMaster</span>
                </label>

                <button type="submit" className="btn-primary" disabled={!isFormValid()}>
                  Crear mi cuenta
                </button>
              </form>
            </>
          ) : (
            <div className="success-message active">
              <div className="success-icon"><CircleCheck size={40} /></div>
              <h2 className="success-title">¡Cuenta creada!</h2>
              <p className="success-text">Redirigiendo al login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}