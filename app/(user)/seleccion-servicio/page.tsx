'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dumbbell,
  Apple,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import AlertModal from '../../components/AlertModal';
import { useDarkMode } from '../../hooks/useDarkMode';
import ChatBot from '../../components/ChatBot';

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingConvocatoria, setLoadingConvocatoria] = useState(false);

  const { darkMode, toggle } = useDarkMode();
  const router = useRouter();

  const images = [
    '/gimnasio1.jpeg',
    '/gimnasio2.jpeg',
    '/gimnasio3.jpeg',
    '/gimnasio4.jpeg',
    '/gimnasio5.jpeg',
  ];

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  // 🔥 VALIDAR CONVOCATORIA
  const handleQuieroEntrenar = async () => {
    if (loadingConvocatoria) return;

    setLoadingConvocatoria(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lista-espera/convocatoria-activa`
      );

      const data = await res.json();

      if (res.ok && data.activa) {
        router.push(
          `/convocatoria-activa?data=${encodeURIComponent(JSON.stringify(data.periodo))}`
        );
        return;
      }

      setOpenModal(true);

    } catch (error) {
      setAlertMessage('Error al verificar la convocatoria');
      setAlertOpen(true);
    } finally {
      setLoadingConvocatoria(false);
    }
  };

  // 👉 REGISTRO LISTA DE ESPERA
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lista-espera`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: email }),
        }
      );

      const data = await res.json();

      // 🔥 si justo se activó convocatoria
      if (res.status === 409 && data.message === 'convocatoria_activa') {
        router.push(
          `/convocatoria-activa?data=${encodeURIComponent(JSON.stringify(data.periodo))}`
        );
        return;
      }

      if (!res.ok) {
        setAlertMessage(data.message || 'Error');
        setAlertOpen(true);
        return;
      }

      setSent(true);

    } catch {
      setAlertMessage('Error de conexión');
      setAlertOpen(true);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setSent(false);
    setEmail('');
  };

  return (
    <div className="home-page min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* HEADER */}
      <header className="home-header bg-white dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="logo" className="h-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">SchedMaster</span>
          </div>
          <Link href="/login" className="btn btn--blue px-4 py-2 hover-lift transition-transform">
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 items-center gap-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Transforma tu <span className="text-blue-500">cuerpo y mente</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                  Accede al gimnasio universitario y mejora tu bienestar cada día con nuestras
                  instalaciones de primera clase y programas personalizados.
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleQuieroEntrenar}
                    disabled={loadingConvocatoria}
                    className="flex-1 btn btn--blue px-8 py-3 text-lg font-medium hover-lift transition-transform relative overflow-hidden"
                  >
                    {loadingConvocatoria ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      'Quiero Entrenar'
                    )}
                  </button>
                  <Link
                    href="/nosotros"
                    className="flex-1 btn btn--outline px-8 py-3 text-lg font-medium hover-lift transition-transform"
                  >
                    Conócenos
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/10"></div>
                  <div className="relative z-10 flex items-center justify-center p-4">
                    <img
                      src={images[currentImg]}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                      alt={`Instalaciones del gimnasio ${currentImg + 1}`}
                    />
                  </div>
                </div>

                {/* Carousel controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImg(index)}
                      className={`w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-300 ${
                        currentImg === index
                          ? 'bg-blue-500 w-6 h-6'
                          : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-none opacity-5">
            <div className="absolute top-10 left-10 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse delay-200"></div>
          </div>
        </section>

        {/* INFO SECTION */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sobre el gimnasio universitario
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Nuestras instalaciones están diseñadas para brindarte un espacio completo de entrenamiento.
                Las convocatorias se abren cada cuatrimestre para que puedas formar parte de nuestra
                comunidad activa y comprometida con el bienestar.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                ¿Por qué entrenar aquí?
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Descubre los beneficios que te esperan en nuestro gimnasio universitario
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Benefit 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Dumbbell className="text-blue-500 h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Mejora tu condición física
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Equipos de última generación y programas adaptados a todos los niveles.
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <RefreshCw className="text-blue-500 h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Reduce el estrés
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    El ejercicio regular ayuda a liberar tensiones y mejorar tu estado de ánimo.
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Activity className="text-blue-500 h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Aumenta tu energía
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Siente más vitalidad y rendimiento en tus actividades diarias.
                  </p>
                </div>

                {/* Benefit 4 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="text-blue-500 h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Comunidad universitaria
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Entrena junto a otros estudiantes comprometidos con su bienestar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FACILITIES SECTION */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                Conoce nuestras instalaciones
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Espacios diseñados para tu máximo rendimiento y comodidad
              </p>
              <div className="relative">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5"></div>
                  <div className="relative z-10">
                    <div className="carousel-wrapper">
                      <img
                        src={images[currentImg]}
                        className="w-full h-full object-cover"
                        alt={`Instalación ${currentImg + 1}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Carousel navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImg(index)}
                      className={`w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-300 ${
                        currentImg === index
                          ? 'bg-blue-500 w-6 h-6'
                          : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                Selecciona un servicio
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Elige el servicio que mejor se adapte a tus necesidades
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Gym Service */}
                <div
                  onClick={() => setOpenModal(true)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform cursor-pointer"
                >
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Dumbbell className="text-blue-500 h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Gimnasio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Reserva tu horario y entrena cuando mejor te convenga
                  </p>
                </div>

                {/* Nursing Service */}
                <Link
                  href="/nutricion"
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform opacity-50 pointer-events-none"
                >
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Apple className="text-blue-500 h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Enfermería
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Próximamente
                  </p>
                </Link>

                {/* Coming Soon */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover-lift transition-transform opacity-50 pointer-events-none">
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="text-blue-500 h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Próximamente
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nuevos talleres en camino
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL WAITING LIST */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl transform scale-95 animate-pop-in">
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={closeModal}
              title="Cerrar"
            >
              <X size={20} />
            </button>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mx-auto mb-4">
                  <CheckCircle2 className="text-green-500 h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Registro confirmado
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Te notificaremos cuando se habilite la próxima convocatoria.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Convocatoria cerrada
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Déjanos tu correo y te avisaremos cuando se abra la próxima convocatoria.
                </p>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tucorreo@uteq.edu.mx"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full btn btn--blue px-4 py-2 text-lg font-medium hover-lift transition-transform"
                  >
                    Notificarme
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <AlertModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <ChatBot className="fixed bottom-4 right-4 z-50" />
    </div>
  );
}