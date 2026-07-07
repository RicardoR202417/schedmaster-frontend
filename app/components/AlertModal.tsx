'use client';

import { X } from 'lucide-react';

interface AlertModalProps {
  open: boolean
  title?: string
  message: string
  buttonText?: string
  onClose: () => void
}

export default function AlertModal({
  open,
  title = "Mensaje",
  message,
  buttonText = "Aceptar",
  onClose
}: Readonly<AlertModalProps>){

  if(!open) return null

  return(

    <div className="modal-overlay">

      <div className="modal-box">

        <button type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
          title="Close modal"
        >
          <X size={20}/>
        </button>

        <h2>{title}</h2>

        <p className="muted">
          {message}
        </p>

        <div className="modal-actions">

          <button type="button"
            className="btn btn--blue"
            onClick={onClose}
          >
            {buttonText}
          </button>

        </div>

      </div>

    </div>

  )
}
