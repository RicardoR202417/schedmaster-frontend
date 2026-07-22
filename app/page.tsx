'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  Flame,
  ArrowRightOutside,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:bg-gray-900 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Dumbbell className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">SchedMaster</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/nosotros" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Nosotros
            </Link>
            <Link href="/beneficios" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Beneficios
            </Link>
            <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Contacto
            </Link>
          </nav>
          <Link href="/login" className="btn btn--blue px-4 py-2">
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Transforma tu <span className="text-blue-500">cuerpo y mente</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Accede al gimnasio universitario de primera clase y mejora tu bienestar cada día.
                Entrena con los mejores equipos y guía profesional.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/seleccion-servicio"
                  className="flex-1 btn btn--blue px-8 py-3 text-lg font-medium hover-lift transition-all"
                >
                  Quiero Entrenar
                </Link>
                <Link
                  href="/nosotros"
                  className="flex-1 btn btn--outline px-8 py-3 text-lg font-medium hover-lift transition-all"
                >
                  Conócenos
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover-scale transition-transform duration-500">
                <img
                  src="/gimnasio1.jpeg"
                  alt="Gimnasio universitario moderno"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Estadísticas que inspiran
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover-lift transition-all transform hover-scale">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Dumbbell className="text-blue-500 h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,247+</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Estudiantes activos</p>
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover-lift transition-all transform hover-scale">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="text-blue-500 h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">89+</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Horarios disponibles</p>
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover-lift transition-all transform hover-scale">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Flame className="text-blue-500 h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3,421+</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Clases realizadas</p>
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover-lift transition-all transform hover-scale">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="text-blue-500 h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12,450+</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Horas de entrenamiento</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover-card-transition transition-all hover-lift">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-blue-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Comunidad Universitaria
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Entrena junto a otros estudiantes motivados y crea conexiones que trascienden el gimnasio.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover-card-transition transition-all hover-lift">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="text-blue-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Seguridad y Higiene
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instalaciones impecables con protocolos de limpieza rigurosos y equipos desinfectados continuamente.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover-card-transition transition-all hover-lift">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Flame className="text-blue-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Resultados Comprobados
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Programas diseñados por profesionales que se adaptan a todos los niveles, desde principiante hasta avanzado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar tu transformación?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y descubre el mejor versión de ti mismo. Las próximas convocatorias se abren pronto.
          </p>
          <Link
            href="/seleccion-servicio"
            className="btn btn--white px-8 py-3 text-lg font-medium inline-flex items-center justify-center hover-scale transition-transform relative overflow-hidden"
          >
            Quiero Entrenar
            <ArrowRightOutside className="ml-3 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
