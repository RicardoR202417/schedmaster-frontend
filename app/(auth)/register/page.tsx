'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CircleCheck } from 'lucide-react';
import TerminosModal from "@/app/components/TerminosModal";
import AlertModal from '../../components/AlertModal';

<<<<<<< HEAD
function getRoleId(tipo: string) {
  if (tipo === 'estudiante') return 1;
  if (tipo === 'docente') return 2;
  return 3;
}

const INITIAL_FORM = {
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
  terms: false
};

function addStudentValidationErrors(
  form: typeof INITIAL_FORM,
  errors: Record<string, string>
) {
  if (form.tipo !== 'estudiante') return;
  if (!form.division) errors.division = 'campo obligatorio';
  if (!form.carrera) errors.carrera = 'campo obligatorio';
}

function getValidationErrors(form: typeof INITIAL_FORM) {
  const errors: Record<string, string> = {};
  if (!form.nombre) errors.nombre = 'campo obligatorio';
  if (!form.apellido_paterno) errors.apellido_paterno = 'campo obligatorio';
  if (!form.apellido_materno) errors.apellido_materno = 'campo obligatorio';
  if (!form.email) errors.email = 'campo obligatorio';
  addStudentValidationErrors(form, errors);
  if (!form.horarioId) errors.horarioId = 'campo obligatorio';
  if (form.diasSeleccionados.length === 0) errors.dias = 'selecciona al menos un dia';
  if (!form.password) errors.password = 'campo obligatorio';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'las contrasenas no coinciden';
  if (!form.terms) errors.terms = 'acepta los terminos';
  return errors;
}

function getPasswordStatus(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /\d|[^A-Za-z0-9]/.test(password);
  const checks = [hasMinLength, hasUppercase, hasNumberOrSymbol];
  const strength = checks.filter(Boolean).length;
  const level = password
    ? Math.min(4, Math.floor((strength / checks.length) * 4))
    : 0;

  return { hasMinLength, hasUppercase, hasNumberOrSymbol, level };
}

export default function RegisterPage() {
=======
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a

export default function RegisterPage() {
  const router = useRouter();
  const progressFillRef = useRef<HTMLDivElement | null>(null);

<<<<<<< HEAD
  const [form,setForm] = useState(INITIAL_FORM);
=======
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
    terms: false
  });
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a

  const [showTerminos, setShowTerminos] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [horarios, setHorarios] = useState<any[]>([]);
  const [diasHorario, setDiasHorario] = useState<any[]>([]);
  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    hasMinLength,
    hasUppercase,
    hasNumberOrSymbol,
    level: passwordMeterLevel
  } = getPasswordStatus(form.password);

<<<<<<< HEAD
  // 1. Cargar todos los horarios (Esto ya trae los dÃ­as incluidos gracias a nuestro backend)
  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/horarios`)
      .then(r=>r.json())
      .then(d=>setHorarios(Array.isArray(d)?d:d?.data||[]))
      .catch((error)=>{
        console.error('Error cargando horarios:', error);
        setHorarios([]);
      });
  },[]);

  // 2.  SOLUCIÃ“N: Extraer los dÃ­as directamente de la lista que ya tenemos en memoria
=======
  useEffect(() => {
    fetch(`${API_URL}/horarios`)
      .then(r => r.json())
      .then(d => setHorarios(Array.isArray(d) ? d : d?.data || []))
      .catch(() => setHorarios([]));
  }, []);

>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
  useEffect(() => {
    if (!form.horarioId) {
      setDiasHorario([]);
      setForm(prev => ({ ...prev, diasSeleccionados: [] }));
      return;
    }

<<<<<<< HEAD
    // Buscamos el horario exacto que el alumno seleccionÃ³ en el dropdown
    const horarioElegido = horarios.find(h => h.id_horario.toString() === form.horarioId.toString());

    if (horarioElegido?.dias_ids) {
      // Separamos el texto de los dÃ­as ("Lunes, MiÃ©rcoles") en un arreglo
=======
    const horarioElegido = horarios.find(h => h.id_horario.toString() === form.horarioId.toString());

    if (horarioElegido && horarioElegido.dias_ids) {
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      const nombresDias = horarioElegido.dias_semana.split(', ');
      
      const diasArmados = horarioElegido.dias_ids.map((id: number, index: number) => ({
        id_dia: id,
        nombre: nombresDias[index]
      }));
      
      setDiasHorario(diasArmados);
<<<<<<< HEAD
      // Limpiamos los dÃ­as seleccionados por si el alumno cambiÃ³ de horario a mitad del registro
=======
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      setForm(prev => ({ ...prev, diasSeleccionados: [] })); 
    } else {
      setDiasHorario([]);
    }
  }, [form.horarioId, horarios]);

  useEffect(() => {
    fetch(`${API_URL}/catalogo/divisiones`)
      .then(r => r.json())
      .then(setDivisiones)
      .catch(() => setDivisiones([]));
  }, []);

<<<<<<< HEAD
  // Cargar carreras segÃºn divisiÃ³n
  useEffect(()=>{
    if(!form.division){
=======
  useEffect(() => {
    if (!form.division) {
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      setCarreras([]);
      return;
    }
    fetch(`${API_URL}/catalogo/carreras/${form.division}`)
      .then(r => r.json())
      .then(setCarreras)
      .catch(() => setCarreras([]));
  }, [form.division]);

  useEffect(() => {
    const fields = ['nombre', 'apellido_paterno', 'apellido_materno', 'email', 'password', 'confirmPassword', 'horarioId'];
    let filled = fields.filter(f => (form as any)[f]).length;
    if (form.terms) filled++;
    setProgress((filled / (fields.length + 1)) * 100);
  }, [form]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

<<<<<<< HEAD
  // Toggle selecciÃ³n de dÃ­as
  const toggleDia=(id:number)=>{
    setForm(prev=>({
=======
  const toggleDia = (id: number) => {
    setForm(prev => ({
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      ...prev,
      diasSeleccionados: prev.diasSeleccionados.includes(id)
        ? prev.diasSeleccionados.filter(d => d !== id)
        : [...prev.diasSeleccionados, id]
    }));
  };

<<<<<<< HEAD
  // ValidaciÃ³n
  useEffect(() => {
    setErrors(getValidationErrors(form));
  }, [form]);
=======
  useEffect(() => {
    const newErrors: any = {};
    if (!form.nombre) newErrors.nombre = "campo obligatorio";
    if (!form.apellido_paterno) newErrors.apellido_paterno = "campo obligatorio";
    if (!form.apellido_materno) newErrors.apellido_materno = "campo obligatorio";
    if (!form.email) newErrors.email = "campo obligatorio";
    else if (!form.email.endsWith("@uteq.edu.mx")) {
      newErrors.email = "Debe ser un correo institucional (@uteq.edu.mx)";
    }
    if (form.tipo === "estudiante") {
      if (!form.division) newErrors.division = "campo obligatorio";
      if (!form.carrera) newErrors.carrera = "campo obligatorio";
    }
    if (!form.horarioId) newErrors.horarioId = "campo obligatorio";
    if (form.diasSeleccionados.length === 0) newErrors.dias = "selecciona al menos un día";
    if (!form.password) newErrors.password = "campo obligatorio";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "las contraseñas no coinciden";
    if (!form.terms) newErrors.terms = "acepta los términos";
    setErrors(newErrors);
  }, [form, form.diasSeleccionados.length]);
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a

  const formValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.email.endsWith("@uteq.edu.mx")) {
      alert("Solo se permiten correos institucionales (@uteq.edu.mx)");
      return;
    }
    if (!formValid) return;

    const datosParaBackend = {
      nombre: form.nombre,
      apellido_paterno: form.apellido_paterno,
      apellido_materno: form.apellido_materno,
      correo: form.email,
      password: form.password,
      id_carrera: form.carrera,
      id_division: form.division,
<<<<<<< HEAD
      id_rol: getRoleId(form.tipo),
=======
      id_rol: form.tipo === 'estudiante' ? 1 : form.tipo === 'docente' ? 2 : 3,
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      id_horario: form.horarioId,
      dias_seleccionados: form.diasSeleccionados
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaBackend)
      });

<<<<<<< HEAD
      if(res.ok){
        setSuccess(true);
        setTimeout(()=>router.push('/login'),2000);
        return;
      }

      const errorData=await res.json();
      setAlertMessage(`Error al registrar: ${errorData.message}`);
      setAlertOpen(true);

    }catch(error){
      console.error('Error registrando usuario:', error);
      setAlertMessage('Error de conexion al registrar');
=======
      if (!res.ok) {
        const errorData = await res.json();
        setAlertMessage(`Error al registrar: ${errorData.message}`);
        setAlertOpen(true);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);

    } catch {
      setAlertMessage('Error de conexión al registrar');
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
      setAlertOpen(true);
    }
  };

  return (
    <div className="register-page">
      <div className="register-page container">
<<<<<<< HEAD
        {success ? (
          <div className="card--glass card--center">
            <div className="success-icon"><CircleCheck size={40}/></div>
            <h2 className="success-title">Â¡Cuenta creada!</h2>
            <p className="success-text">Redirigiendo al inicio de sesiÃ³nâ€¦</p>
          </div>
        ) : (
=======
        {!success ? (
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
          <div className="card--glass">
            <button type="button" className="btn btn--back" onClick={() => router.push('/seleccion-servicio')}>
              <ArrowLeft size={18} /> Volver al inicio
            </button>

            <div className="page-header">
<<<<<<< HEAD
              <div className="logo-badge"><CircleCheck size={32}/></div>
              <h1 className="title">Ãšnete a <span className="highlight">SchedMaster</span></h1>
              <p className="subtitle">Completa tu informaciÃ³n para crear tu cuenta</p>
=======
              <div className="logo-badge"><CircleCheck size={32} /></div>
              <h1 className="title">Únete a <span className="highlight">SchedMaster</span></h1>
              <p className="subtitle">Completa tu información para crear tu cuenta</p>
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
            </div>

            <div className="progress-bar">
              <div ref={progressFillRef} className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de usuario</label>
                <select id="tipo" title="Tipo de usuario" name="tipo" value={form.tipo} className="auth-select" onChange={handleChange}>
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input name="nombre" value={form.nombre} className="auth-input" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Apellido paterno</label>
                  <input name="apellido_paterno" value={form.apellido_paterno} className="auth-input" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Apellido materno</label>
                  <input name="apellido_materno" value={form.apellido_materno} className="auth-input" onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Correo institucional</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  className={`auth-input ${errors.email ? "input-error" : ""}`}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="error-text">{errors.email}</p>
                )}
              </div>

<<<<<<< HEAD
              {/* DivisiÃ³n y carrera */}
              {form.tipo==="estudiante" && (
                <>
                  <div className="form-group">
                    <label htmlFor="division">DivisiÃ³n</label>
                    <select id="division" title="DivisiÃ³n" name="division" value={form.division} className="auth-select" onChange={handleChange}>
                      <option value="">Selecciona divisiÃ³n</option>
                      {divisiones.map(d=>(<option key={d.id_division} value={d.id_division}>{d.nombre_division}</option>))}
=======
              {form.tipo === "estudiante" && (
                <>
                  <div className="form-group">
                    <label htmlFor="division">División</label>
                    <select id="division" title="División" name="division" value={form.division} className="auth-select" onChange={handleChange}>
                      <option value="">Selecciona división</option>
                      {divisiones.map(d => (<option key={d.id_division} value={d.id_division}>{d.nombre_division}</option>))}
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="carrera">Carrera</label>
                    <select id="carrera" title="Carrera" name="carrera" value={form.carrera} className="auth-select" onChange={handleChange}>
                      <option value="">Selecciona carrera</option>
                      {carreras.map(c => (<option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="horarioId">Horario</label>
                <select id="horarioId" title="Horario" name="horarioId" value={form.horarioId} className="auth-select" onChange={handleChange}>
                  <option value="">Selecciona horario</option>
                  {horarios.map(h => (<option key={h.id_horario} value={h.id_horario}>{h.hora_inicio} - {h.hora_fin}</option>))}
                </select>
              </div>

<<<<<<< HEAD
              {/* DÃ­as */}
=======
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
              {form.horarioId && (
                <div className="dias-container">
                  {diasHorario.map(d => (
                    <button
                      key={d.id_dia}
                      type="button"
                      className={`dia-btn ${form.diasSeleccionados.includes(d.id_dia) ? 'active' : ''}`}
                      onClick={() => toggleDia(d.id_dia)}
                    >
                      {d.nombre}
                    </button>
                  ))}
                </div>
              )}

              <div className="form-group">
<<<<<<< HEAD
                <label className="input-label" htmlFor="password"><Lock size={16}/> ContraseÃ±a</label>
                <input id="password" title="ContraseÃ±a" name="password" type="password" className="auth-input" placeholder="Crea una contraseÃ±a segura" onChange={handleChange}/>

                <div className="password-validator" aria-live="polite">
                  <div className="password-validator-bars" aria-hidden="true">
                    <span className={`password-validator-bar ${passwordMeterLevel >= 1 ? 'is-active' : ''}`} />
                    <span className={`password-validator-bar ${passwordMeterLevel >= 2 ? 'is-active' : ''}`} />
                    <span className={`password-validator-bar ${passwordMeterLevel >= 3 ? 'is-active' : ''}`} />
                    <span className={`password-validator-bar ${passwordMeterLevel >= 4 ? 'is-active' : ''}`} />
                  </div>

                  <ul className="password-validator-list">
                    <li className={`password-validator-item ${hasMinLength ? 'is-met' : ''}`}>
                      <span className="password-validator-dot" aria-hidden="true" />
                      <span>MÃ­nimo 8 caracteres</span>
                    </li>
                    <li className={`password-validator-item ${hasUppercase ? 'is-met' : ''}`}>
                      <span className="password-validator-dot" aria-hidden="true" />
                      <span>Una letra mayÃºscula</span>
                    </li>
                    <li className={`password-validator-item ${hasNumberOrSymbol ? 'is-met' : ''}`}>
                      <span className="password-validator-dot" aria-hidden="true" />
                      <span>Un nÃºmero o sÃ­mbolo</span>
                    </li>
                  </ul>
                </div>

                {!!form.password && errors.password && <small className="error-text">{errors.password}</small>}
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="confirmPassword"><Lock size={16}/> Confirmar contraseÃ±a</label>
                <input id="confirmPassword" title="Confirmar contraseÃ±a" name="confirmPassword" type="password" className="auth-input" placeholder="Confirma tu contraseÃ±a" onChange={handleChange}/>
                {!!form.confirmPassword && errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
              </div>

              <div className="checkbox-wrapper">
                <input id="terms" type="checkbox" name="terms" checked={form.terms} onChange={handleChange}/>
                <label htmlFor="terms">Acepto los <span>tÃ©rminos y condiciones</span></label>
=======
                <label>Contraseña</label>
                <input name="password" type="password" className="auth-input" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input name="confirmPassword" type="password" className="auth-input" onChange={handleChange} />
              </div>

              <div className="checkbox-wrapper">
                <input
                  id="terms"
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />
                <label htmlFor="terms">
                  Acepto los{" "}
                  <span
                    onClick={() => setShowTerminos(true)}
                    style={{ color: "#00A4E0", cursor: "pointer", fontWeight: "700" }}
                  >
                    términos y condiciones
                  </span>
                </label>
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
              </div>

              <button type="submit" disabled={!formValid} className="btn btn--blue btn--full btn--lg">
                Crear mi cuenta
              </button>
            </form>
          </div>
<<<<<<< HEAD
=======
        ) : (
          <div>Cuenta creada exitosamente. Redirigiendo...</div>
>>>>>>> 13b389d226f34e57ca51f476304ff1a8e2a7e34a
        )}

        <TerminosModal
          open={showTerminos}
          onClose={() => setShowTerminos(false)}
        />

      </div>

      <AlertModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
