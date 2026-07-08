"use client";

import { useState } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generamos un ID temporal único al iniciar el componente. 
  // Combinamos la fecha actual con texto aleatorio para asegurar que no se repita.
  const [sessionId] = useState(() => "session_" + Date.now().toString(36) + Math.random().toString(36).substring(2));

  const sendMessage = async () => {
    if (!input.trim()) return;


    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://159.65.111.84.sslip.io/webhook/bot-demo-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Aquí enviamos el mensaje Y el sessionId temporal a n8n
        body: JSON.stringify({ 
          message: input, 
          sessionId: sessionId 
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "Mensaje recibido" }]);
    } catch (error) {
      console.error("Error al conectar con el bot:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error de conexión con el servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col mb-4 border border-gray-200 overflow-hidden transition-all">
          <div className="bg-green-600 text-white p-4 font-bold flex justify-between items-center">
            <span>Asistente SchedMaster</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-4">¡Hola! ¿En qué te puedo ayudar hoy?</p>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === "user" ? "bg-green-500 text-white self-end rounded-br-none" : "bg-gray-200 text-gray-800 self-start rounded-bl-none"}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <p className="text-gray-400 text-xs italic self-start">Escribiendo...</p>}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu duda..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 text-black"
            />
            <button onClick={sendMessage} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition">
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-transform transform hover:scale-105 float-right"
      >
        💬
      </button>
    </div>
  );
}