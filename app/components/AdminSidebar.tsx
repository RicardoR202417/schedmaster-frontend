'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Home,
  Users,
  CalendarCheck,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import './AdminSidebar.css';

// ==========================================
// Props
// ==========================================

interface AdminSidebarProps {
  /** Callback al pulsar "Cerrar sesión". Opcional: por defecto imprime en consola. */
  onLogout?: () => void;
  /** Nombre del usuario que se muestra en el footer del sidebar. */
  userName?: string;
  /** Rol del usuario que se muestra en el footer del sidebar. */
  userRole?: string;
  /** Iniciales para el avatar del footer. */
  userInitials?: string;
}

// ==========================================
// Ítems de navegación
// ==========================================

const NAV_ITEMS = [
  { href: '/dashboard',             icon: Home,         label: 'Dashboard'     },
  { href: '/admin-usuarios',        icon: Users,        label: 'Usuarios'      },
  { href: '/admin-asistencias',     icon: CalendarCheck,label: 'Asistencias'   },
  { href: '/admin-inscripciones',   icon: UserPlus,     label: 'Inscripciones' },
  { href: '/admin-estadisticas',    icon: BarChart3,    label: 'Estadísticas'  },
  { href: '/admin-configuracion',   icon: Settings,     label: 'Configuración' },
];

// ==========================================
// Componente
// ==========================================

export default function AdminSidebar({
  onLogout,
  userName    = 'Admin UTEQ',
  userRole    = 'Administrador',
  userInitials = 'AU',
}: AdminSidebarProps) {
  const [sidebarActive, setSidebarActive] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarActive((prev) => !prev);
  const closeSidebar  = () => setSidebarActive(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Cerrar sesión');
    }
  };

  return (
    <>
      {/* Botón hamburguesa — visible solo en móvil y solo cuando el sidebar está cerrado */}
      {!sidebarActive && (
        <button
          className="menu-toggle"
          type="button"
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          <LayoutGrid />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarActive ? 'active' : ''}`}
        aria-label="Menú administrador"
        onClick={(e) => {
          // Cerrar al pulsar el overlay en móvil
          if (e.target === e.currentTarget) closeSidebar();
        }}
      >
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-logo" aria-hidden="true">
            <LayoutGrid />
          </div>
          <div className="sb-brand-text">
            <h1>SchedMaster</h1>
            <p>Panel de Administración</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="nav" aria-label="Navegación" onClick={closeSidebar}>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? 'active' : ''}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon /> {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer — usuario */}
        <div className="sb-footer" aria-label="Usuario actual">
          <div className="sb-user">
            <div className="avatar" aria-hidden="true">
              {userInitials}
            </div>
            <div className="sb-user-info">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
          </div>
          <button className="btn-logout" type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
