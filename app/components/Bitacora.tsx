'use client';

import { useState, useMemo } from 'react';
import { X, Send, ClipboardList } from 'lucide-react';
import './Bitacora.css';

// ==========================================
// Interfaces
// ==========================================

export interface Comentario {
  id: number;
  autorNombre: string;
  autorIniciales: string;
  fecha: string; // ISO 8601
  texto: string;
}

interface BitacoraProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioNombre: string;
  usuarioId: number;
  /** Comentarios precargados (p.ej. desde API). Si no se pasan, el estado es interno. */
  comentariosIniciales?: Comentario[];
  /** Callback al enviar un comentario nuevo (para conectar con API). */
  onNuevoComentario?: (usuarioId: number, texto: string) => void;
}

// ==========================================
// Helper — colores de avatar por índice
// ==========================================

const AVATAR_COLORS = [
  'avatar-c1', 'avatar-c2', 'avatar-c3', 'avatar-c4',
  'avatar-c5', 'avatar-c6', 'avatar-c7', 'avatar-c8',
] as const;

const getAvatarClass = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

// ==========================================
// Formateador de fecha
// ==========================================

const formatFecha = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// ==========================================
// Componente
// ==========================================

export default function Bitacora({
  isOpen,
  onClose,
  usuarioNombre,
  usuarioId,
  comentariosIniciales = [],
  onNuevoComentario,
}: BitacoraProps) {
  // TODO: Reemplazar estado interno por props + llamada API cuando se conecte el backend
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosIniciales);
  const [nuevoTexto, setNuevoTexto]   = useState('');
  const [sortOrder, setSortOrder]     = useState<'reciente' | 'lejano'>('reciente');

  // ==========================================
  // Ordenamiento
  // ==========================================

  const comentariosOrdenados = useMemo(() => {
    return [...comentarios].sort((a, b) => {
      const diff = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      return sortOrder === 'reciente' ? diff : -diff;
    });
  }, [comentarios, sortOrder]);

  // ==========================================
  // Handlers
  // ==========================================

  const handleEnviar = () => {
    const texto = nuevoTexto.trim();
    if (!texto) return;

    // TODO: Reemplazar con llamada a API POST /bitacora { usuarioId, texto }
    if (onNuevoComentario) {
      onNuevoComentario(usuarioId, texto);
    } else {
      // Inserción local mientras no hay API
      const nuevo: Comentario = {
        id: Date.now(),
        autorNombre:    'Admin UTEQ',
        autorIniciales: 'AU',
        fecha:          new Date().toISOString(),
        texto,
      };
      setComentarios((prev) => [nuevo, ...prev]);
    }

    setNuevoTexto('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  // ==========================================
  // Render
  // ==========================================

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bitacoraTitle"
      onClick={handleOverlayClick}
    >
      <div className="modal-content log-modal" role="document">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="log-title-row">
              <ClipboardList aria-hidden="true" />
              <h3 id="bitacoraTitle">Bitácora</h3>
            </div>
            <p>{usuarioNombre}</p>
          </div>
          <button
            className="btn-close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar bitácora"
          >
            <X />
          </button>
        </div>

        {/* Filter bar */}
        <div className="log-filter-bar">
          <span className="log-filter-label">Ordenar por</span>
          <select
            className="select log-filter-select"
            aria-label="Ordenar comentarios"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'reciente' | 'lejano')}
          >
            <option value="reciente">Fecha más reciente</option>
            <option value="lejano">Fecha más lejana</option>
          </select>
          <span className="log-count muted">
            {comentarios.length} {comentarios.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {/* Lista de comentarios */}
        <div className="log-list" aria-label="Comentarios de bitácora">
          {comentariosOrdenados.length === 0 ? (
            <div className="log-empty">
              <ClipboardList aria-hidden="true" />
              <p className="log-empty-title">Sin registros aún</p>
              <p className="log-empty-desc">Agrega el primer comentario de esta bitácora</p>
            </div>
          ) : (
            comentariosOrdenados.map((c, idx) => (
              <div key={c.id} className="log-entry">
                <div
                  className={`log-entry-avatar ${getAvatarClass(idx)}`}
                  aria-hidden="true"
                >
                  {c.autorIniciales}
                </div>
                <div className="log-entry-body">
                  <div className="log-entry-meta">
                    <span className="log-entry-author">{c.autorNombre}</span>
                    <span className="log-entry-date muted">{formatFecha(c.fecha)}</span>
                  </div>
                  <p className="log-entry-text">{c.texto}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Compose */}
        <div className="log-compose">
          <textarea
            className="form-textarea log-textarea"
            placeholder="Escribe un comentario… (Ctrl+Enter para enviar)"
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <div className="log-compose-actions">
            <span className="log-hint muted">Ctrl+Enter para enviar</span>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEnviar}
              disabled={!nuevoTexto.trim()}
            >
              <Send aria-hidden="true" />
              Enviar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
