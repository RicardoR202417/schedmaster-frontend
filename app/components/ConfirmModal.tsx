'use client';

import { X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel
}: Readonly<ConfirmModalProps>) {

  if (!open) return null;

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        {/* BOTON CERRAR */}

        <button
          type="button"
          className="modal-close"
          onClick={onCancel}
          title="Cerrar"
        >
          <X size={20}/>
        </button>

        {/* CONTENIDO */}

        <h2>{title}</h2>

        <p className="muted">
          {message}
        </p>

        {/* BOTONES */}

        <div className="modal-buttons">

          <button type="button"
            className="btn btn--outline"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button type="button"
            className="btn btn--red"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>

  );
}
