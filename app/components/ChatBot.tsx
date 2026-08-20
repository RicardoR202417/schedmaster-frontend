"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { loadExerciseIndex, findExercisesInText, type ExerciseEntry } from "../lib/exerciseSearch";
import ExerciseCard from "./ExerciseCard";
import ChatMascot from "./ChatMascot";

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
  const bodyRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

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
    <div className="gx-chat-root">
      {isOpen && (
        <div className="gx-chat-window" role="dialog" aria-label="Asistente SchedMaster">
          <div className="gx-chat-header">
            <ChatMascot size={38} />
            <div className="gx-chat-header-text">
              <strong>Asistente SchedMaster</strong>
              <span className="gx-chat-header-status">En línea</span>
            </div>
            <button
              type="button"
              className="gx-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              title="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="gx-chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="gx-chat-empty">
                <ChatMascot size={56} />
                <p>¡Hola! ¿Tienes dudas sobre el gimnasio, aforos o reservas?</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`gx-chat-msg ${msg.sender === "user" ? "gx-chat-msg--user" : "gx-chat-msg--bot"}`}>
                  {msg.sender === "bot" && (
                    <span className="gx-chat-msg-avatar"><ChatMascot size={24} /></span>
                  )}
                  <div className="gx-chat-bubble">{msg.text}</div>
                </div>

                {/* Tarjetas ricas: animaciones de ejercicios detectadas en la respuesta de la IA */}
                {msg.exercises && msg.exercises.length > 0 && (
                  <div className="gx-chat-exercises">
                    {msg.exercises.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="gx-chat-typing" aria-label="Escribiendo">
                <span /><span /><span />
              </div>
            )}
          </div>

          <div className="gx-chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu duda..."
              className="gx-chat-input"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="gx-chat-send"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="gx-chat-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
        title="Asistente SchedMaster"
      >
        {isOpen ? <X size={26} className="gx-chat-close-icon" /> : <ChatMascot size={42} />}
      </button>
    </div>
  );
}
