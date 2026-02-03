"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabaseClient";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  type GalleryImage = {
  name: string;
  url: string;
};

const [images, setImages] = useState<GalleryImage[]>([]);
const [selected, setSelected] = useState<GalleryImage | null>(null);
const [uploading, setUploading] = useState(false);
const [canUpload, setCanUpload] = useState(false);

const EVENT_DATE = new Date("2026-02-20T14:00:00").getTime();

  // 📸 LOAD IMAGES
  async function loadImages() {
  const { data, error } = await supabase.storage
    .from("galeria-tomas")
    .list("", {
      limit: 300,
      sortBy: { column: "created_at", order: "desc" }
    });

  if (error) {
    console.error("Error cargando galería:", error);
    return;
  }

  if (!data) return;

  const files = data
    .filter(file => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
    .map(file => ({
      name: file.name,
      url: supabase.storage
        .from("galeria-tomas")
        .getPublicUrl(file.name).data.publicUrl
    }));

  setImages(files);
}



  // 📤 UPLOAD IMAGE
  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("galeria-tomas")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  setUploading(false);

  if (error) {
    console.error("Error subiendo imagen:", error);
    return;
  }

  await loadImages();
}

async function deletePhoto(name: string) {
  const ok = confirm("¿Eliminar esta foto?");
  if (!ok) return;

  const { error } = await supabase.storage
    .from("galeria-tomas")
    .remove([name]);

  if (!error) loadImages();
}

  const sounds = useRef<any>(null);

useEffect(() => {
  // 📸 Cargar galería al iniciar
  loadImages();
  const now = Date.now();
  setCanUpload(now >= EVENT_DATE);

  // 🦖 Inicializar sonidos UNA sola vez
  sounds.current = {
    jurassicTheme: new Howl({
      src: ["/audio/music.mp3"],
      loop: true,
      volume: 0.6,
      html5: true,
    }),

    ambience: new Howl({
      src: ["/audio/jungle-ambience.mp3"],
      loop: true,
      volume: 0.25,
      html5: true,
    }),

    raptor: new Howl({ src: ["/audio/raptor.mp3"], volume: 0.9 }),
    trex: new Howl({ src: ["/audio/trex-roar.mp3"], volume: 1.0 }),
    stomp: new Howl({ src: ["/audio/stomp.mp3"], volume: 0.9 }),
    whoosh: new Howl({ src: ["/audio/whoosh.mp3"], volume: 0.7 }),
    hit: new Howl({ src: ["/audio/cinematic-hit.mp3"], volume: 0.9 }),
  };

  // 🔓 Unlock audio (autoplay fix móviles)
  const unlockAudio = () => {
    Howler.ctx?.resume?.();
    setInterval(() => {
    const roar = Math.random() > 0.5 ? "trex" : "raptor";
    sounds.current[roar]?.play();
    }, 12000);


    // 🎼 Iniciar música principal
    if (!sounds.current.jurassicTheme.playing()) {
      sounds.current.jurassicTheme.play();
    }

    // 🌿 Iniciar ambiente jungle
    if (!sounds.current.ambience.playing()) {
      sounds.current.ambience.play();
    }

    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);
  window.addEventListener("touchstart", unlockAudio);

  // 🎵 Música principal cuando aparece el raptor
  ScrollTrigger.create({
    trigger: "#section-raptor",
    start: "top 70%",
    once: true,
    onEnter: () => sounds.current.jurassicTheme.play(),
  });

  // 🦖 Animación RAPTOR
  gsap.fromTo("#dino-raptor", { x: -260, opacity: 0 }, {
    x: -40,
    opacity: 1,
    duration: 3,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#section-raptor",
      start: "top 70%",
      onEnter: () => {
        sounds.current.whoosh.play();
        setTimeout(() => sounds.current.raptor.play(), 900);
      },
    },
  });

  // 🦖 Animación TREX
  gsap.fromTo("#dino-trex", { x: 260, opacity: 0 }, {
    x: 40,
    opacity: 1,
    duration: 3.4,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#section-trex",
      start: "top 70%",
      onEnter: () => {
        sounds.current.hit.play();
        setTimeout(() => sounds.current.trex.play(), 900);
        setTimeout(() => sounds.current.stomp.play(), 1300);
      },
    },
  });

  // ✨ Animación de textos
  gsap.utils.toArray(".reveal-text").forEach((el: any) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // ⏳ Countdown
  const targetDate = new Date("2026-02-20T16:00:00").getTime();
  const countdownEl = document.getElementById("countdown");

  const updateCountdown = () => {
    if (!countdownEl) return;

    const distance = targetDate - Date.now();

    if (distance < 0) {
      countdownEl.innerHTML = "¡ES HOY 🦖🔥!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownEl.innerHTML = `
      <div class="countdown-box"><span>${days}</span><small>DÍAS</small></div>
      <div class="countdown-box"><span>${hours}</span><small>HORAS</small></div>
      <div class="countdown-box"><span>${minutes}</span><small>MIN</small></div>
      <div class="countdown-box"><span>${seconds}</span><small>SEG</small></div>
    `;
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);

  gsap.from("footer", {
  opacity: 0,
  y: 60,
  duration: 1.4,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "footer",
    start: "top 85%"
  }
});



  return () => {
    Object.values(sounds.current || {}).forEach((sound: any) => sound?.stop());
    ScrollTrigger.getAll().forEach((t) => t.kill());
    clearInterval(interval);
  };
}, []);


  
  return (
    <>
    {selected && (
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[9999] flex items-center justify-center"
        onClick={() => setSelected(null)}
      >
        <img 
          src={selected.url} 
          className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl animate-fadeIn"
        />
      </div>
    )}

    <main className="bg-black text-white overflow-x-hidden">

      {/* 🎬 BANNER */}
      <section className="banner flex items-end justify-center text-center px-6 pb-16 min-h-[85vh]">
        <h1 className="title-font text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-[0_0_25px_rgba(255,200,0,0.6)]">
          Te invito a celebrar mi cumpleaños jurásico
        </h1>
      </section>

      <div className="jungle-bg">

        {/* FRASE */}
        <section className="min-h-[55vh] flex items-center justify-center text-center px-6">
          <p className="title-font reveal-text  text-3xl md:text-5xl max-w-3xl">
            Una aventura jurásica está por comenzar…
          </p>
        </section>

        {/* RAPTOR */}
        <section id="section-raptor" className="min-h-[65vh] flex flex-col items-center justify-center relative overflow-hidden px-6">
          <img id="dino-raptor" src="/images/dino-left.png" className="dino dino-raptor max-w-[280px]" />
          <p className="text-3xl md:text-3xl text-center title-font relative z-10">
            Exploradores, prepárense para una misión legendaria.
          </p>
        </section>

        {/* FECHA */}
        <section className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6">
          <h3 className="title-font reveal-text text-4xl md:text-6xl mb-3">
            20 DE FEBRERO  16 A 19 HS
          </h3>
          <p className="body-font opacity-80 mb-6">
            El tiempo corre… la aventura se acerca
          </p>
          <div id="countdown" className="text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-widest" />
        </section>

        {/* 🗺 MAPA — UBICACIÓN */}
<section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

  <h2 className="title-font text-4xl md:text-5xl mb-3">
    📍 La Escondida
  </h2>

  <p className="body-font text-lg opacity-80 mb-2">
    Espacio para eventos
  </p>

  <p className="body-font text-sm opacity-70 mb-6">
    Pacaa 9555, Laguna Soto — Corrientes
  </p>

  <iframe
    className="w-full max-w-3xl h-[320px] rounded-xl border border-white/20 shadow-xl"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2945.8647926215885!2d-58.74142792526764!3d-27.45151201593023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94456bb3c104ade9%3A0x31ef234d1e68aec7!2sLa%20Escondida%20%22Espacio%20para%20Eventos%22!5e1!3m2!1ses-419!2sar!4v1770140131675!5m2!1ses-419!2sar"
  />
        <a
          href={
            typeof navigator !== "undefined" && /iPhone|Android/i.test(navigator.userAgent)
              ? "google.navigation:q=Pacaa+9555+Laguna+Soto+Corrientes"
              : "https://www.google.com/maps/dir/?api=1&destination=Pacaa+9555+Laguna+Soto+Corrientes&travelmode=driving"
              }
                target="_blank"
                className="mt-6 px-7 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:scale-105 transition title-font shadow-lg"
                >Cómo llegar</a>
      </section>

        {/* 🦖 TREX */}
    <section
        id="section-trex"
        className="min-h-[65vh] flex items-center justify-center relative overflow-hidden"
        >
        <img
          id="dino-trex"
          src="/images/dino-right.png"
          className="absolute right-[-200px] bottom-0 w-[480px] dino-trex pointer-events-none"
        />
          <p className="text-3xl md:text-4xl text-center title-font relative z-10">
          El rey de la selva te espera…
        </p>
        </section>


        {/* 💦 PILETA */}
        <section className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="title-font text-4xl md:text-5xl mb-4">
            💦 <br />
            ¡Zona acuática jurásica!
          </h2>
          <p className="body-font text-lg opacity-90 max-w-2xl">
            Habrá pileta, juegos acuáticos y mucha diversión.
            ¡Los exploradores pueden traer traje de baño!
          </p>
        </section>

        {/* RSVP WHATSAPP */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
          <h2 className="title-font reveal-text text-4xl md:text-5xl mb-6">
            Confirmar asistencia
          </h2>
          <a
            href="https://wa.me/+5493704694631?text=Confirmo asistencia al cumple jurásico 🦖🔥"
            target="_blank"
            className="px-8 py-4 bg-green-600 rounded-xl font-bold hover:scale-105 transition"
          >
            Confirmar por WhatsApp
          </a>
        </section>

        {/* 📸 GALERÍA SUPABASE */}
            <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">

                <h2 className="title-font text-4xl md:text-5xl mb-6">
                  📸 Galería de la aventura
                </h2>
              {canUpload ? (
                <label className="cursor-pointer px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:scale-105 transition mb-8">
                  {uploading ? "Subiendo..." : "Subir foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadPhoto}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="px-6 py-3 bg-gray-700 text-gray-300 font-bold rounded-xl mb-8 opacity-80">
                  📸 La galería se habilita el día del evento
                </div>
              )}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">

    {images.map((img, i) => (
      <div 
        key={img.name}
        className="group relative overflow-hidden rounded-xl shadow-xl cursor-pointer"
      >
        <img
          src={img.url}
          loading="lazy"
          onClick={() => setSelected(img)}
          className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 
                opacity-100 md:opacity-0 
                  md:group-hover:opacity-100 
                transition flex items-end justify-between p-2">
          <button
            onClick={() => setSelected(img)}
            className="text-white text-xs bg-black/60 px-2 py-1 rounded"
          >
            Ver
          </button>
          {/*
          <button
            onClick={() => deletePhoto(img.name)}
            className="text-red-400 text-xs bg-black/60 px-2 py-1 rounded"
          >
            Borrar
          </button>*/}
        </div>
      </div>
    ))}
  </div>
</section>
{/* 🦖 SECCIÓN FINAL — NOMBRE TOMÁS */}
<section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
  <img 
    src="/images/tomas-jurassic.png" 
    alt="Tomás Jurassic"
    className="max-w-[320px] md:max-w-[520px] drop-shadow-[0_0_35px_rgba(255,180,0,0.6)] animate-fadeIn"
  />
  <p className="text-3xl md:text-4xl text-center title-font relative z-10">
    LA AVENTURA TE ESPERA…
  </p>
</section>

{/* 🧠 FOOTER — NET-ING SOLUCIONES IT */}
<footer className="bg-black/95 border-t border-white/10 py-12 px-6 text-center">

  {/* LOGO OPCIONAL */}
  <img 
    src="/images/net-ing-logo.png" 
    alt="Net-Ing Logo"
    className="mx-auto mb-3 max-h-[109px] opacity-90 hover:scale-110 transition duration-500"
  />

  <p className="text-sm opacity-70 mb-6">
    Desarrollado por <span className="font-bold text-yellow-400">Net-Ing Soluciones IT</span>
  </p>

  {/* REDES SVG */}
  <div className="flex justify-center gap-8">

    {/* INSTAGRAM */}
    <a 
      href="https://instagram.com/neting_solutions/"
      target="_blank"
      className="group transition hover:scale-125"
    >
      <svg className="w-7 h-7 text-white group-hover:text-pink-400 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    </a>

    {/* FACEBOOK */}
    <a 
      href="https://facebook.com/netingsolutions"
      target="_blank"
      className="group transition hover:scale-125"
    >
      <svg className="w-7 h-7 text-white group-hover:text-blue-400 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3 3-3h2v3h-1c-1 0-1 .5-1 1v1h2.5l-.5 3h-2v7A10 10 0 0 0 22 12z"/>
      </svg>
    </a>

    {/* WHATSAPP */}
    <a 
      href="https://wa.me/+5493704013979"
      target="_blank"
      className="group transition hover:scale-125"
    >
      <svg className="w-7 h-7 text-white group-hover:text-green-400 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.5 3.5A11 11 0 0 0 3.6 19.9L2 22l2.2-.6A11 11 0 1 0 20.5 3.5ZM12 20a8 8 0 0 1-4-1l-.3-.2-2.5.7.7-2.4-.2-.3a8 8 0 1 1 6.3 3.2Zm4.4-5.6c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.6.1-.7.7-.9.9-.3.2-.6.1a6.4 6.4 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.3-.4.1-.1.1-.3 0-.5s-.6-1.5-.8-2-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4s-1 1-.9 2.4 1 2.8 1.1 3 .2.4.4.6a10.6 10.6 0 0 0 4.5 3.9c.6.2 1.1.3 1.5.2.5-.1 1.3-.5 1.5-1s.2-.9.1-1-.2-.1-.4-.2Z"/>
      </svg>
    </a>
  </div>
</footer>

</div>
</main>
    </>
  );
}
