"use client";

import { useEffect, useRef, useState } from "react";
import { loadExerciseIndex, findExercisesInText, type ExerciseEntry } from "../lib/exerciseSearch";
import ExerciseCard from "./ExerciseCard";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  exercises?: ExerciseEntry[];
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generamos un ID temporal único al iniciar el componente.
  const [sessionId] = useState(() => "session_" + Date.now().toString(36) + Math.random().toString(36).substring(2));

  // Precargamos el indice del dataset de ejercicios apenas se abre el chat, para
  // no tener que esperar la descarga cuando llegue la primera respuesta de la IA.
  const exerciseIndexRef = useRef<ExerciseEntry[] | null>(null);
  useEffect(() => {
    if (isOpen && !exerciseIndexRef.current) {
      loadExerciseIndex().then((index) => {
        exerciseIndexRef.current = index;
      });
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://159.65.111.84.sslip.io/webhook/bot-demo-web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId: sessionId }),
      });

      const data = await response.json();

      // Revisamos si n8n manda un arreglo (como en tu captura) o un objeto directo, y sacamos el "output"
      const botText = Array.isArray(data) && data.length > 0
        ? data[0].output
        : data.output || "Error al leer la respuesta de la IA";

      const exerciseIndex = exerciseIndexRef.current ?? (await loadExerciseIndex());
      exerciseIndexRef.current = exerciseIndex;
      const exercises = findExercisesInText(botText, exerciseIndex);

      setMessages((prev) => [...prev, { sender: "bot", text: botText, exercises }]);
    } catch (error) {
      console.error("Error al conectar con el bot:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error de conexión con el servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Ventana del Chat */}
      {isOpen && (
        <div style={{
          width: '320px', height: '420px', backgroundColor: '#ffffff', borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
          marginBottom: '16px', border: '1px solid #eaeaea', overflow: 'hidden'
        }}>
          
          {/* Cabecera */}
          <div style={{ backgroundColor: '#005c8a', color: '#ffffff', padding: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🤖 Asistente SchedMaster</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px', padding: 0 }}>
              ✕
            </button>
          </div>
          
          {/* Área de Mensajes */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '20px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>🏋️‍♂️</span>
                <p>¡Hola! ¿Tienes dudas sobre el gimnasio, aforos o reservas?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} style={{
                maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '8px',
                alignSelf: msg.sender === "user" ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '12px', fontSize: '14px',
                  backgroundColor: msg.sender === "user" ? '#009ce3' : '#ffffff',
                  color: msg.sender === "user" ? '#ffffff' : '#1f2937',
                  border: msg.sender === "user" ? 'none' : '1px solid #e5e7eb',
                  borderBottomRightRadius: msg.sender === "user" ? '0' : '12px',
                  borderBottomLeftRadius: msg.sender === "bot" ? '0' : '12px',
                }}>
                  {msg.text}
                </div>

                {/* Tarjetas ricas: animaciones de ejercicios detectadas en la respuesta de la IA */}
                {msg.exercises && msg.exercises.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {msg.exercises.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div style={{ backgroundColor: '#e5e7eb', color: '#4b5563', alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '0', fontSize: '12px', fontStyle: 'italic' }}>
                Escribiendo...
              </div>
            )}
          </div>

          {/* Caja de Texto y Envío */}
          <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6', backgroundColor: '#ffffff', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu duda..."
              style={{ flex: 1, padding: '8px 16px', borderRadius: '999px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', color: '#000000' }}
            />
            <button 
              onClick={sendMessage} 
              style={{ backgroundColor: '#005c8a', color: '#ffffff', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#005c8a', color: '#ffffff', width: '60px', height: '60px', borderRadius: '50%',
          border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'right'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}