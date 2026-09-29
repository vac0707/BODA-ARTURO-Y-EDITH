/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, Clock, MapPin, Gift, Music, Volume2, VolumeX, 
  Send, CheckCircle2, Users, Sparkles, Mail, MessageSquare, ChevronDown, ExternalLink, Phone,
  Maximize2, X, ChevronLeft, ChevronRight, Camera
} from 'lucide-react';

const galleryPhotos = [
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708952/bd6ac395-7fdf-47c5-bf46-82747bd3b51f.png', title: 'Arturo & Edith' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708942/9f816cd2-bcdd-4412-88c0-67824c9696a1.png', title: 'Momentos Especiales' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708933/96348d31-92e5-4330-b3a4-97f34b6d319e.png', title: 'Nuestro Amor' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708922/10b9f0da-538d-4c34-8e3d-bbfbd1cf5e72.png', title: 'Miradas de Amor' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708888/e88e3cc8-85e9-4916-9ea0-00931dccb8ae.png', title: 'Compañeros de Vida' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708877/6ed61dde-d3d8-4a7b-b56e-d4c3f4757111.png', title: 'Felicidad Eterna' },
  { url: 'https://res.cloudinary.com/vsgbhmey/image/upload/v1790708113/2d65b8ed-3df5-4ede-9564-aac5f1defca5.png', title: 'Camino al Altar' }
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Lightbox State
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no'>('yes');
  const [rsvpDiet, setRsvpDiet] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-10-17T14:30:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ambient chime simulator using Web Audio API for gentle wedding music toggle
  const toggleMusic = () => {
    if (!isPlayingMusic) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setAudioCtx(ctx);
        playSoftChimes(ctx);
        setIsPlayingMusic(true);
      } catch {
        setIsPlayingMusic(true);
      }
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlayingMusic(false);
    }
  };

  const playSoftChimes = (ctx: AudioContext) => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    let index = 0;

    const playNote = () => {
      if (ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[index % notes.length], ctx.currentTime);
      index++;

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3);

      setTimeout(playNote, 4000);
    };

    playNote();
  };

  const handleWhatsAppRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    const attendanceText = rsvpStatus === 'yes' ? 'Sí asistirré con mucha alegría 🎉' : 'No podré asistir, pero les acompaño en espíritu ✨';
    const message = `Hola Arturo y Edith, soy *${rsvpName}*. Confirmo mi asistencia a su boda.\n\n- Asistencia: ${attendanceText}\n- Número de personas: ${rsvpGuests}\n- Restricciones/Dieta: ${rsvpDiet || 'Ninguna'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51983991678?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Calendar days for October 2026
  const octoberDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptyStartDays = 3; // Thu (0=Mon, 1=Tue, 2=Wed, 3=Thu)

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2A29] selection:bg-[#C5B358]/20 relative">
      
      {/* Background Ambient Music Control Floating Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 bg-[#6B7F67] hover:bg-[#556B52] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group border border-[#D4AF37]/40"
        title={isPlayingMusic ? "Silenciar música ambiental" : "Reproducir música ambiental"}
        aria-label="Música ambiental"
      >
        {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-medium px-0 group-hover:px-1">
          {isPlayingMusic ? 'Música Activa' : 'Música'}
        </span>
      </button>

      {/* 1. PANTALLA INICIAL / BIENVENIDA (SOBRE VIRTUAL) */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 bg-[#F5EFE6] flex items-center justify-center p-4 transition-all duration-1000">
          <div className="absolute inset-0 bg-[radial-gradient(#C5B358_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
          
          <div className="relative max-w-lg w-full bg-[#FFFEFC] rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-8 sm:p-12 text-center overflow-hidden transform transition-all duration-700 animate-float">
            
            <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-[#C5B358]/50 rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-[#C5B358]/50 rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-[#C5B358]/50 rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-[#C5B358]/50 rounded-br-lg"></div>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6B7F67]/10 text-[#6B7F67] mb-6 border border-[#6B7F67]/20">
              <Mail className="w-8 h-8" />
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold mb-3">
              Estás invitado
            </p>

            <h1 className="font-script text-6xl sm:text-7xl text-[#4A5D47] mb-4 drop-shadow-sm">
              A & E
            </h1>

            <div className="w-24 h-[1px] bg-[#C5B358] mx-auto my-4"></div>

            <p className="font-serif-wedding text-xl sm:text-2xl text-[#2C2A29] italic mb-8">
              Arturo Camacho Salcedo & Edith Peña Sánchez
            </p>

            <p className="text-sm text-stone-600 mb-8 font-sans-wedding max-w-xs mx-auto leading-relaxed">
              Con la bendición de Dios y el amor que nos une, nos complace invitarte a compartir nuestro gran día.
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#6B7F67] hover:bg-[#556B52] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-[#D4AF37]/50"
            >
              <Sparkles className="w-4 h-4 text-[#C5B358] group-hover:rotate-12 transition-transform" />
              <span className="tracking-widest text-sm uppercase">Abrir Invitación</span>
              <Heart className="w-4 h-4 text-[#FBF9F5] group-hover:scale-110 transition-transform" />
            </button>

            <div className="mt-6 text-xs text-stone-400 font-sans-wedding">
              17 de Octubre, 2026
            </div>
          </div>
        </div>
      )}

      {/* MAIN INVITATION CONTENT */}
      <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* 2. PORTADA PRINCIPAL */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/vsgbhmey/image/upload/v1790695399/ed8f920f-25a6-4afc-ab52-c2b85eef2148.png" 
              alt="Arturo y Edith Boda" 
              className="w-full h-full object-cover object-center scale-105 animate-pulse-gold duration-[10000ms]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto py-20 text-white flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-medium mb-4 bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm border border-[#D4AF37]/30">
              Nuestra Boda
            </span>

            <h2 className="font-serif-wedding text-4xl sm:text-6xl md:text-7xl font-light tracking-wide mb-4 text-[#FBF9F5]">
              Arturo Camacho Salcedo
            </h2>

            <span className="font-script text-4xl sm:text-5xl text-[#D4AF37] my-2">&amp;</span>

            <h2 className="font-serif-wedding text-4xl sm:text-6xl md:text-7xl font-light tracking-wide mb-8 text-[#FBF9F5]">
              Edith Peña Sánchez
            </h2>

            <div className="w-32 h-[1px] bg-[#D4AF37]/80 my-4"></div>

            <p className="font-serif-wedding italic text-xl sm:text-2xl text-stone-200 tracking-wider mb-8">
              “17 de Octubre de 2026”
            </p>

            <a 
              href="#cuenta-regresiva"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-300 hover:text-white transition-colors animate-bounce"
            >
              <span>Desliza para descubrir</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* NAVIGATION BAR */}
        <nav className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
            <span className="font-script text-2xl text-[#6B7F67] font-bold">A &amp; E</span>
            
            <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-stone-600">
              <a href="#detalles" className="hover:text-[#6B7F67] transition-colors">Detalles</a>
              <a href="#calendario" className="hover:text-[#6B7F67] transition-colors">Calendario</a>
              <a href="#galeria" className="hover:text-[#6B7F67] transition-colors">Galería</a>
              <a href="#ubicacion" className="hover:text-[#6B7F67] transition-colors">Ubicación</a>
              <a href="#asistencia" className="hover:text-[#6B7F67] transition-colors">Asistencia</a>
              <a href="#regalos" className="hover:text-[#6B7F67] transition-colors">Regalos</a>
            </div>

            <a 
              href="#asistencia"
              className="px-4 py-2 bg-[#6B7F67] hover:bg-[#556B52] text-white text-xs uppercase tracking-wider rounded-md transition-colors"
            >
              Confirmar
            </a>
          </div>
        </nav>

        {/* 3. CUENTA REGRESIVA */}
        <section id="cuenta-regresiva" className="py-24 px-4 bg-[#F7F4EC] text-center relative">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-3">
              Cuenta Regresiva
            </span>
            <h3 className="font-serif-wedding text-3xl sm:text-5xl text-[#2C2A29] mb-4">
              Cada vez falta menos para nuestro gran día
            </h3>
            <p className="text-stone-600 text-sm sm:text-base font-sans-wedding max-w-lg mx-auto mb-12">
              17 de octubre de 2026 – 14:30 horas
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div className="bg-[#FFFEFC] p-6 rounded-xl shadow-sm border border-[#C5B358]/20">
                <span className="font-serif-wedding text-4xl sm:text-5xl font-semibold text-[#6B7F67] block mb-1">
                  {timeLeft.days}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Días</span>
              </div>
              <div className="bg-[#FFFEFC] p-6 rounded-xl shadow-sm border border-[#C5B358]/20">
                <span className="font-serif-wedding text-4xl sm:text-5xl font-semibold text-[#6B7F67] block mb-1">
                  {timeLeft.hours}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Horas</span>
              </div>
              <div className="bg-[#FFFEFC] p-6 rounded-xl shadow-sm border border-[#C5B358]/20">
                <span className="font-serif-wedding text-4xl sm:text-5xl font-semibold text-[#6B7F67] block mb-1">
                  {timeLeft.minutes}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Minutos</span>
              </div>
              <div className="bg-[#FFFEFC] p-6 rounded-xl shadow-sm border border-[#C5B358]/20">
                <span className="font-serif-wedding text-4xl sm:text-5xl font-semibold text-[#6B7F67] block mb-1">
                  {timeLeft.seconds}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Segundos</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FECHA TIPO CALENDARIO */}
        <section id="calendario" className="py-24 px-4 bg-[#FBF9F5] text-center">
          <div className="max-w-xl mx-auto bg-[#FFFEFC] rounded-2xl shadow-xl border border-[#C5B358]/30 p-8 sm:p-12 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6B7F67] via-[#C5B358] to-[#6B7F67]"></div>

            <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-2">
              Reserva la fecha
            </span>
            <h3 className="font-serif-wedding text-3xl sm:text-4xl text-[#2C2A29] mb-2">
              Octubre 2026
            </h3>
            <p className="text-stone-500 text-sm mb-8 font-sans-wedding">
              17 de octubre de 2026
            </p>

            <div className="grid grid-cols-7 gap-2 mb-6 text-xs uppercase font-semibold text-stone-400">
              <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: emptyStartDays }).map((_, index) => (
                <div key={`empty-${index}`} className="h-10"></div>
              ))}

              {octoberDays.map((day) => {
                const isWeddingDay = day === 17;
                return (
                  <div
                    key={day}
                    className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                      isWeddingDay
                        ? 'bg-[#6B7F67] text-white font-bold ring-4 ring-[#C5B358]/30 shadow-md scale-110'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-[#6B7F67] font-medium">
              <Sparkles className="w-4 h-4 text-[#C5B358]" />
              <span>Sábado 17 de Octubre · Gran Día</span>
            </div>
          </div>
        </section>

        {/* GALERÍA DE FOTOS DE ALTO NIVEL (ADAPTABLE VERTICALES Y HORIZONTALES CON LIGHTBOX) */}
        <section id="galeria" className="py-24 px-4 bg-[#F4EFE6]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-3">
                Nuestra Historia en Imágenes
              </span>
              <h3 className="font-serif-wedding text-4xl sm:text-5xl text-[#2C2A29] mb-4">
                Galería de Momentos
              </h3>
              <p className="text-stone-600 text-sm sm:text-base font-sans-wedding max-w-lg mx-auto">
                Instantes que guardamos en el corazón y que hoy compartimos con quienes más amamos. Haz clic en cualquier foto para ampliarla.
              </p>
            </div>

            {/* Responsive Masonry / Column layout that adapts naturally to vertical & horizontal photos */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveImageIndex(index)}
                  className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md cursor-pointer bg-white border border-[#C5B358]/20 transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-1">
                      Arturo &amp; Edith
                    </span>
                    <h4 className="font-serif-wedding text-white text-xl font-light">
                      {photo.title}
                    </h4>
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
        {activeImageIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 z-50 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
              aria-label="Cerrar galería"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((activeImageIndex - 1 + galleryPhotos.length) % galleryPhotos.length);
              }}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-50"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((activeImageIndex + 1) % galleryPhotos.length);
              }}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-50"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative">
              <img
                src={galleryPhotos[activeImageIndex].url}
                alt={galleryPhotos[activeImageIndex].title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-center">
                <p className="font-serif-wedding text-2xl text-white font-light">
                  {galleryPhotos[activeImageIndex].title}
                </p>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] mt-1">
                  {activeImageIndex + 1} de {galleryPhotos.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5 & 6. SECCIÓN CEREMONIA Y RECEPCIÓN */}
        <section id="ubicacion" className="py-24 px-4 bg-[#FBF9F5]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-3">
                Ubicaciones &amp; Horarios
              </span>
              <h3 className="font-serif-wedding text-4xl sm:text-5xl text-[#2C2A29]">
                Dónde &amp; Cuándo
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Ceremonia Card */}
              <div className="bg-[#FFFEFC] rounded-2xl shadow-md border border-[#C5B358]/20 p-8 sm:p-10 flex flex-col justify-between text-center relative overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6B7F67]"></div>
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6B7F67]/10 text-[#6B7F67] mb-6">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#6B7F67] font-semibold block mb-2">
                    Ceremonia Religiosa
                  </span>
                  <h4 className="font-serif-wedding text-3xl text-[#2C2A29] mb-4">
                    Capilla La Divina Providencia
                  </h4>
                  <p className="text-stone-600 text-sm font-sans-wedding mb-6 leading-relaxed">
                    Te esperamos puntualmente para dar gracias a Dios en este momento sagrado.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBF9F5] rounded-full text-sm font-medium text-stone-700 border border-stone-200 mb-2">
                    <Clock className="w-4 h-4 text-[#6B7F67]" />
                    <span>14:30 horas</span>
                  </div>
                </div>
              </div>

              {/* Recepción Card */}
              <div className="bg-[#FFFEFC] rounded-2xl shadow-md border border-[#C5B358]/20 p-8 sm:p-10 flex flex-col justify-between text-center relative overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C5B358]"></div>
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C5B358]/10 text-[#C5B358] mb-6">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#C5B358] font-semibold block mb-2">
                    Recepción
                  </span>
                  <h4 className="font-serif-wedding text-3xl text-[#2C2A29] mb-4">
                    Salón de eventos Villa Prada
                  </h4>
                  <p className="text-stone-600 text-sm font-sans-wedding mb-6 leading-relaxed">
                    Celebremos juntos con música, cena y alegría hasta el amanecer.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBF9F5] rounded-full text-sm font-medium text-stone-700 border border-stone-200 mb-2">
                    <Clock className="w-4 h-4 text-[#C5B358]" />
                    <span>Al terminar la ceremonia</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. CONFIRMACIÓN DE ASISTENCIA (WHATSAPP +51 983 991 678) */}
        <section id="asistencia" className="py-24 px-4 bg-[#F7F4EC]">
          <div className="max-w-2xl mx-auto bg-[#FFFEFC] rounded-2xl shadow-xl border border-[#C5B358]/30 p-8 sm:p-12">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-2">
                RSVP
              </span>
              <h3 className="font-serif-wedding text-3xl sm:text-4xl text-[#2C2A29] mb-3">
                Confirmación de Asistencia
              </h3>
              <p className="text-stone-600 text-sm font-sans-wedding mb-2">
                Por favor confirma tu asistencia al WhatsApp <span className="font-bold text-[#6B7F67]">+51 983 991 678</span> antes del 1 de Octubre de 2026.
              </p>
            </div>

            <form onSubmit={handleWhatsAppRsvp} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Tu nombre completo o familia
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Ej. Juan Pérez y Familia"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#6B7F67] focus:outline-none text-sm bg-[#FBF9F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                    ¿Asistirás?
                  </label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as 'yes' | 'no')}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#6B7F67] focus:outline-none text-sm bg-[#FBF9F5]"
                  >
                    <option value="yes">Sí, ahí estaré con alegría</option>
                    <option value="no">No podré asistir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                    Número de asistentes
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#6B7F67] focus:outline-none text-sm bg-[#FBF9F5]"
                  >
                    <option value="1">1 persona</option>
                    <option value="2">2 personas</option>
                    <option value="3">3 personas</option>
                    <option value="4">4 personas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-2">
                  Restricciones alimenticias o alergias (Opcional)
                </label>
                <input
                  type="text"
                  value={rsvpDiet}
                  onChange={(e) => setRsvpDiet(e.target.value)}
                  placeholder="Ej. Vegetariano, celíaco, ninguna"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#6B7F67] focus:outline-none text-sm bg-[#FBF9F5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Confirmar por WhatsApp (+51 983 991 678)</span>
              </button>
            </form>
          </div>
        </section>

        {/* 8. MESA DE REGALOS */}
        <section id="regalos" className="py-24 px-4 bg-[#FBF9F5]">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6B7F67] font-semibold block mb-3">
              Detalles
            </span>
            <h3 className="font-serif-wedding text-3xl sm:text-5xl text-[#2C2A29] mb-6">
              Mesa de Regalos
            </h3>
            <p className="text-stone-600 text-sm sm:text-base font-sans-wedding max-w-lg mx-auto mb-12">
              Su presencia es nuestro mejor regalo. Si desean tener un detalle adicional con nosotros para iniciar nuestro hogar, les compartimos las siguientes opciones:
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#FFFEFC] p-8 rounded-xl shadow-sm border border-[#C5B358]/20 flex flex-col items-center">
                <Gift className="w-10 h-10 text-[#6B7F67] mb-4" />
                <h4 className="font-serif-wedding text-2xl text-[#2C2A29] mb-2">Lluvia de Sobres</h4>
                <p className="text-stone-600 text-xs font-sans-wedding leading-relaxed mb-6">
                  Habrá un buzón especial en la recepción para recibir sus sobres con buenos deseos.
                </p>
                <span className="text-xs font-semibold text-[#6B7F67] uppercase tracking-wider">Disponible en recepción</span>
              </div>

              <div className="bg-[#FFFEFC] p-8 rounded-xl shadow-sm border border-[#C5B358]/20 flex flex-col items-center">
                <Sparkles className="w-10 h-10 text-[#C5B358] mb-4" />
                <h4 className="font-serif-wedding text-2xl text-[#2C2A29] mb-2">Mesa de Regalos Liverpool</h4>
                <p className="text-stone-600 text-xs font-sans-wedding leading-relaxed mb-6">
                  Número de evento / mesa de regalos digital para su comodidad.
                </p>
                <span className="text-xs font-semibold text-[#C5B358] uppercase tracking-wider">Código: #51429876</span>
              </div>
            </div>
          </div>
        </section>

        {/* 10. CIERRE */}
        <footer className="py-20 px-4 bg-[#4A5D47] text-[#FBF9F5] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
          
          <div className="relative max-w-xl mx-auto flex flex-col items-center">
            <span className="font-script text-5xl text-[#D4AF37] mb-4">A &amp; E</span>
            
            <div className="w-16 h-[1px] bg-[#D4AF37] my-4"></div>

            <p className="font-serif-wedding text-2xl sm:text-3xl italic mb-6 leading-relaxed">
              “Será un honor contar con tu presencia en este día tan especial.”
            </p>

            <p className="text-stone-300 text-sm font-sans-wedding mb-8">
              Arturo Camacho Salcedo &amp; Edith Peña Sánchez
            </p>

            <div className="text-xs text-stone-400 tracking-widest uppercase">
              17 · 10 · 2026
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
