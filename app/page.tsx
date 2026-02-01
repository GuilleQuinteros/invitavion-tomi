"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const uploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // 🎼 Jurassic Theme
    const jurassicTheme = new Howl({
      src: ["/audio/music.mp3"],
      volume: 0.6,
      loop: false,
    });

    // 🌴 Ambiente selva continuo
    const ambience = new Howl({
      src: ["/audio/jungle-ambience.mp3"],
      loop: true,
      volume: 0.3,
    });

    // 🦖 Dinos
    const raptor = new Howl({ src: ["/audio/raptor.mp3"], volume: 0.9 });
    const trex = new Howl({ src: ["/audio/trex-roar.mp3"], volume: 0.9 });

    // 👣 Pisadas Trex
    const stomp = new Howl({ src: ["/audio/stomp.mp3"], volume: 1.5 });

    // 🎬 FX cine
    const whoosh = new Howl({ src: ["/audio/whoosh.mp3"], volume: 0.7 });
    const hit = new Howl({ src: ["/audio/cinematic-hit.mp3"], volume: 0.9 });
    const finalHit = new Howl({ src: ["/audio/final-hit.mp3"], volume: 1 });

    // 🔓 DESBLOQUEO DE AUDIO PARA AUTOPLAY
    const unlockAudio = () => {
      ambience.play();
      ambience.stop(); // Desbloquea todos los Howl
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    // 🎵 Jurassic Theme al entrar
    ScrollTrigger.create({
      trigger: "#section-raptor",
      start: "top 70%",
      once: true,
      onEnter: () => jurassicTheme.play(),
    });

    // 🦖 RAPTOR — entrada cinematográfica
    gsap.fromTo(
      "#dino-raptor",
      { x: -340, opacity: 0, scale: 1.15 },
      {
        x: -40,
        opacity: 1,
        duration: 3.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: "#section-raptor",
          start: "top 70%",
          onEnter: () => {
            whoosh.play();
            setTimeout(() => raptor.play(), 1200);
          },
        },
      }
    );

    // ✨ TEXTO CINEMÁTICO ENTRANDO
    gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // 🦖 IDLE BREATHING DINOS
    gsap.to("#dino-raptor", {
      scale: 1.03,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to("#dino-trex", {
      scale: 1.02,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 🌫 MICRO SHAKE AMBIENTE
    gsap.to(".jungle-bg", {
      x: 2,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 🦖 TREX — pesado + temblor
    gsap.fromTo(
      "#dino-trex",
      { x: 360, opacity: 0, scale: 1.2 },
      {
        x: 40,
        opacity: 1,
        duration: 3.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: "#section-trex",
          start: "top 70%",
          onEnter: () => {
            hit.play();
            setTimeout(() => trex.play(), 1000);
            setTimeout(() => stomp.play(), 1600);

            gsap.to("body", {
              x: -10,
              duration: 0.08,
              repeat: 6,
              yoyo: true,
              ease: "power1.inOut",
            });
          },
        },
      }
    );

    // 🎬 FINAL HIT
    ScrollTrigger.create({
      trigger: "#section-final",
      start: "top 60%",
      onEnter: () => {
        gsap.to(".plant-left", { left: "0%", duration: 2 });
        gsap.to(".plant-right", { right: "0%", duration: 2 });
        gsap.to(".final-text", { opacity: 1, delay: 1.5 });
      },
    });

    // 🌿 PARALLAX JUNGLE REAL
    gsap.to(".jungle-bg", {
      backgroundPositionY: "40%",
      ease: "none",
      scrollTrigger: {
        trigger: ".jungle-bg",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // 🖱 INTERACCIÓN — CLICK EN DINOS
    const raptorEl = document.querySelector("#dino-raptor") as HTMLElement | null;
    const trexEl = document.querySelector("#dino-trex") as HTMLElement | null;

    if (raptorEl) {
      raptorEl.addEventListener("click", () => {
        raptor.play();
        gsap.fromTo(raptorEl, { scale: 1 }, { scale: 1.1, yoyo: true, repeat: 1, duration: 0.15 });
      });
    }

    if (trexEl) {
      trexEl.addEventListener("click", () => {
        trex.play();
        stomp.play();
        gsap.fromTo(trexEl, { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 1, duration: 0.18 });
      });
    }

    // ⏳ COUNTDOWN
    const targetDate = new Date("2026-02-20T18:30:00").getTime();
    const countdownEl = document.getElementById("countdown") as HTMLDivElement | null;

    const updateCountdown = () => {
      if (!countdownEl) return;

      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        countdownEl.innerHTML = "¡ES HOY 🦖🔥!";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      countdownEl.innerHTML = `
        <div class="countdown-box">
          <span>${days}</span><small>DÍAS</small>
        </div>
        <div class="countdown-box">
          <span>${hours}</span><small>HORAS</small>
        </div>
        <div class="countdown-box">
          <span>${minutes}</span><small>MIN</small>
        </div>
        <div class="countdown-box">
          <span>${seconds}</span><small>SEG</small>
        </div>
      `;
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      ambience.stop();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* 🎬 BANNER */}
      <section className="banner flex items-end p-10">
        <h1 className="text-5xl text-center font-extrabold text-yellow-400 drop-shadow-[0_0_25px_rgba(255,200,0,0.6)]">
          Te invito a celebrar mi cumpleaños.
        </h1>
      </section>

      {/* 🌴 FONDO LARGO */}
      <div className="jungle-bg">
        {/* FRASE */}
        <section className="min-h-[50vh] flex items-center justify-center">
          <p className="title-font reveal-text text-4xl md:text-5xl text-center max-w-2xl">
            Una aventura jurásica está por comenzar…
          </p>
        </section>

        {/* 🦖 RAPTOR */}
        <section
          id="section-raptor"
          className="min-h-[65vh] flex items-center justify-center relative overflow-hidden"
        >
          <img
            id="dino-raptor"
            src="/images/dino-left.png"
            className="dino dino-raptor cursor-pointer"
          />
          <p className="body-font text-xl text-center opacity-80 mt-6">
            Exploradores, prepárense para una misión legendaria.
          </p>
        </section>

        {/* ⏳ FECHA + COUNTDOWN */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h3 className="title-font text-center reveal-text text-6xl mb-4">
            20 DE FEBRERO  18:30 HS
          </h3>
          <p className="body-font text-lg opacity-80 mb-8">
            El tiempo corre… la aventura se acerca
          </p>
          <div
            id="countdown"
            className="text-5xl md:text-6xl font-extrabold tracking-widest text-yellow-400 drop-shadow-[0_0_20px_rgba(255,255,0,0.4)]"
          />
        </section>

        {/* 🗺 MAPA */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h2 className="title-font text-5xl mb-4">
            📍 Paraguay 624, Corrientes Capital
          </h2>
          <p className="body-font opacity-80 mb-6">
            El punto donde comienza la expedición
          </p>
          <iframe
            className="w-[90%] max-w-3xl h-[320px] rounded-xl border border-white/20"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d547.4827998966989!2d-58.826730989877845!3d-27.465669237618993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94456b5f2b4b59e5%3A0x41bdce2a8fac9da7!2sParaguay%20624%2C%20W3400%20CLC%2C%20Corrientes!5e1!3m2!1ses-419!2sar!4v1769889737163!5m2!1ses-419!2sar"
          ></iframe>
        </section>

        {/* 🦖 TREX */}
        <section
          id="section-trex"
          className="min-h-[65vh] flex items-center justify-center relative overflow-hidden"
        >
          <img
            id="dino-trex"
            src="/images/dino-right.png"
            className="dino dino-trex cursor-pointer"
          />
          <p className="text-3xl text-center">El rey de la selva te espera…</p>
        </section>

        {/* CONFIRMAR ASISTENCIA */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="title-font text-center reveal-text text-5xl mb-6">
            Confirmar asistencia
          </h2>
          <a
            href="https://wa.me/XXXXXXXXXX?text=Confirmo asistencia al cumple de Tomás 🦖"
            target="_blank"
            className="px-8 py-4 bg-green-600 rounded-xl text-white font-bold hover:scale-105 transition"
          >
            Confirmar por WhatsApp
          </a>
        </section>

        {/* SUBIDA DE FOTOS */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="title-font text-center text-5xl mb-6">Subí tus fotos</h2>
          <input type="file" ref={uploadRef} onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            alert("Foto lista 📸 (Storage se activa en Fase D)");
          }} />
          <div id="photo-gallery" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"></div>
        </section>

        {/* 🎉 FINAL */}
        <section
          id="section-final"
          className="min-h-[55vh] flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-6xl md:text-7xl font-extrabold text-green-400 tracking-wide drop-shadow-[0_0_30px_rgba(0,255,150,0.6)]">
            LA AVENTURA TE ESPERA
          </h2>
          <p className="mt-6 text-lg text-center">TOMÁS</p>
        </section>
      </div>
    </main>
  );
}
