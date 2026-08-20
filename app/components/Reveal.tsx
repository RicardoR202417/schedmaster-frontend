'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}

/**
 * Revela su contenido con una transición suave cuando entra en el viewport.
 * Usa IntersectionObserver puro (sin librerías de animación) para mantener
 * el bundle ligero. Si el usuario prefiere menos movimiento, se muestra directo.
 */
export default function Reveal({ children, as = 'div', className = '', delay = 0 }: Readonly<RevealProps>) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px 80px 0px' }
    );

    observer.observe(node);

    // Red de seguridad: en scrolls muy rápidos (flick/momentum en móvil) o
    // pestañas en segundo plano, el navegador puede retrasar la entrega del
    // callback. Si el elemento ya quedó dentro del viewport, no lo dejamos
    // invisible para siempre.
    const failsafe = window.setTimeout(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        observer.disconnect();
      }
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`gx-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
