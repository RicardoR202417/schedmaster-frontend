'use client';

import { useState } from 'react';
import AlertModal from './AlertModal';

const HorarioForm = () => {
  const [formData, setFormData] = useState({
    id_periodo: '',
    hora_inicio: '',
    hora_fin: '',
    tipo_actividad: '',
    capacidad_maxima: '',
    dias: [] as number[]
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idDia = Number.parseInt(e.target.value);
    if (e.target.checked) {
      setFormData({ ...formData, dias: [...formData.dias, idDia] });
    } else {
      setFormData({ ...formData, dias: formData.dias.filter(dia => dia !== idDia) });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/horarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setAlertMessage('Horario creado con éxito en la base de datos.');
      } else {
        setAlertMessage('Hubo un error al guardar el horario.');
      }
    } catch (error) {
      setAlertMessage('No se pudo conectar con el servidor.');
    }
    setAlertOpen(true);
  };

  return (
    <div className="horario-form-container">
      <form onSubmit={handleSubmit} className="horario-form">

        {/* ID Periodo — form-select igual que modales admin */}
        <div className="form-group">
          <label htmlFor="id_periodo">ID del Periodo</label>
                <input id="id_periodo" type="number" name="id_periodo" placeholder="Ej. 1" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="hora_inicio">Hora Inicio</label>
                <input id="hora_inicio" type="time" name="hora_inicio" onChange={handleChange} required step="1" title="Hora de inicio" />
          </div>
          <div className="form-group half-width">
            <label htmlFor="hora_fin">Hora Fin</label>
                <input id="hora_fin" type="time" name="hora_fin" onChange={handleChange} required step="1" title="Hora de fin" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="tipo_actividad">Tipo de Actividad</label>
                <input id="tipo_actividad" type="text" name="tipo_actividad" placeholder="Ej. Crossfit" onChange={handleChange} required />
          </div>
          <div className="form-group half-width">
            <label htmlFor="capacidad_maxima">Capacidad Máxima</label>
                <input id="capacidad_maxima" type="number" name="capacidad_maxima" placeholder="Ej. 20" onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <span className="input-label">Días de la semana</span>
          <div className="checkbox-group">
            <label htmlFor="horario-dia-lunes" className="checkbox-label"><input id="horario-dia-lunes" type="checkbox" value="1" onChange={handleDiaChange} /> Lunes</label>
            <label htmlFor="horario-dia-martes" className="checkbox-label"><input id="horario-dia-martes" type="checkbox" value="2" onChange={handleDiaChange} /> Martes</label>
            <label htmlFor="horario-dia-miercoles" className="checkbox-label"><input id="horario-dia-miercoles" type="checkbox" value="3" onChange={handleDiaChange} /> Miércoles</label>
            <label htmlFor="horario-dia-jueves" className="checkbox-label"><input id="horario-dia-jueves" type="checkbox" value="4" onChange={handleDiaChange} /> Jueves</label>
            <label htmlFor="horario-dia-viernes" className="checkbox-label"><input id="horario-dia-viernes" type="checkbox" value="5" onChange={handleDiaChange} /> Viernes</label>
          </div>
        </div>

        <button type="submit" className="btn btn--blue">
          Guardar Horario
        </button>

      </form>

      <AlertModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default HorarioForm;
