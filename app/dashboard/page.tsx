'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  // Verificar token de sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // redirige al login si no hay token
    }
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700 }}>
        Bienvenido <span style={{ color: '#0d6efd' }}>Administrador</span>
      </h1>
      <p>Has ingresado correctamente al sistema SchedMaster.</p>
    </div>
  );
}
