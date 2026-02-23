'use client';

import { LogOut, Info, Clock, LifeBuoy, ChevronDown, Mail, Phone } from 'lucide-react';
import './pending.css';

export default function PendingAccountPage() {
  const handleLogout = () => {
    alert('Cerrar sesión (UI). Integra aquí tu lógica real.');
  };

  return (
    <div className="pending-page">
      <div className="wrap">
        <div className="top">
          <div className="brand">SCHEDMASTER</div>
        </div>

        <section className="card">
          <div className="hero">
            <div className="state" aria-hidden="true">
              <Info />
            </div>

            <div>
              <h1>Cuenta pendiente de aprobación</h1>
              <p className="message">
                Tu cuenta fue registrada correctamente. En cuanto el administrador la apruebe,
                podrás acceder al sistema 
              </p>

              <div className="status">
                <Clock />
                Estado: Pendiente
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary" type="button" onClick={handleLogout}>
              <LogOut />
              Cerrar sesión
            </button>
          </div>

          <div className="foot">
            Si tu cuenta ya fue aprobada y sigues viendo esta pantalla, cierra sesión e inicia nuevamente.
          </div>

          <div className="support">
            <details>
              <summary>
                <span className="sum-left">
                  <LifeBuoy />
                  Soporte
                </span>
                <ChevronDown className="chev" />
              </summary>

              <div className="support-body">
                <div className="support-item">
                  <Mail />
                  <div>
                    Correo: <a href="mailto:soporte@schedmaster.uteq.mx">soporte@schedmaster.uteq.mx</a>
                    <br />
                    <small>Incluye tu matrícula y una breve descripción.</small>
                  </div>
                </div>

                <div className="support-item">
                  <Phone />
                  <div>
                    Teléfono: <a href="tel:+524421234567">+52 442 123 4567</a>
                    <br />
                    <small>Horario: Lunes a Viernes.</small>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}