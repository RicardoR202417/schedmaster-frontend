"use client";

import { useEffect, useRef } from "react";
import { Dumbbell } from "lucide-react";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [onclick], ' +
  '.btn, .btn-mini, .btn-icon, .btn-logout, .btn-close, .btn-login, .service-card, ' +
  '.dia-btn, .nav a, .menu-toggle, .theme-switch, .auth-link a';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const cursor = cursorRef.current;
    if (!isFinePointer || !cursor) return;

    document.documentElement.classList.add("has-custom-cursor");

    const handleMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursor.classList.remove("is-hidden");

      const isInteractive = !!(e.target as Element | null)?.closest(INTERACTIVE_SELECTOR);
      cursor.classList.toggle("is-hovering", isInteractive);
    };

    const handleDown = () => cursor.classList.add("is-clicking");
    const handleUp = () => cursor.classList.remove("is-clicking");
    const handleLeaveWindow = () => cursor.classList.add("is-hidden");

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor is-hidden" aria-hidden="true">
      <span className="custom-cursor-icon">
        <Dumbbell size={18} strokeWidth={2.4} />
      </span>
    </div>
  );
}
