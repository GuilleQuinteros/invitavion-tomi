"use client";

import { useEffect } from "react";
import { Howl } from "howler";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InvitacionTomas() {

  useEffect(() => {
    // Música ambiente
    const music = new Howl({
      src: ["/audio/music.mp3"],
      loop: true,
      volume: 0.4
    });
    music.play();

    // Rugido T-Rex
    const roar = new Howl({
      src: ["/audio/trex-roar.mp3"],
      volume: 1
    });

    ScrollTrigger.create({
      trigger: "#trex",
      start: "top center",
      onEnter: () => roar.play()
    });

    // Animaciones scroll
    gsap.utils.toArray(".fade").forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 80 }, 
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: el,
            start: "top 85%"
          }
        }
      );
    });

  }, []);

  return (
    <main className="relative jungle-bg overflow-x-hidden">

  <div className="fog"></div>

  <div className="backdrop-brightness-50">

      {/* INTRO */}
      <section className="h-screen flex items-center justify-center fade">
        <h1 className="text-5xl md:text-7xl font-bold">
          Una aventura jurásica está por comenzar…
        </h1>
      </section>

      {/* NOMBRE */}
      <section className="h-screen flex flex-col items-center justify-center fade">
        <h2 id="trex" className="text-7xl md:text-9xl font-extrabold text-yellow-400">
          TOMÁS
        </h2>
        <p className="mt-4 text-2xl">te invita a su cumpleaños</p>
      </section>

      {/* FECHA */}
      <section className="h-screen flex flex-col items-center justify-center fade">
        <p className="text-3xl">📅</p>
        <h3 className="text-6xl font-bold">20 DE FEBRERO</h3>
        <p className="mt-3 italic">Prepárate para una misión legendaria</p>
      </section>

      {/* LUGAR */}
      <section className="h-screen flex flex-col items-center justify-center fade">
        <p className="text-3xl">📍</p>
        <h3 className="text-6xl font-bold">CORRIENTES</h3>
        <p className="mt-3 italic">La aventura comienza aquí</p>
      </section>

      {/* MENSAJE */}
      <section className="h-screen flex items-center justify-center fade">
        <p className="text-4xl italic max-w-3xl">
          Diversión, aventura y dinosaurios te esperan…
        </p>
      </section>

      {/* CIERRE */}
      <section className="h-screen flex flex-col items-center justify-center fade">
        <h2 className="text-7xl font-extrabold text-green-400">NO FALTES</h2>
        <p className="mt-4 text-2xl">
          TOMÁS — 20 DE FEBRERO — CORRIENTES
        </p>
        <p className="mt-4 italic text-xl">
          ¡Será una fiesta legendaria!
        </p>
      </section>

    </div>

</main>
  );
}
