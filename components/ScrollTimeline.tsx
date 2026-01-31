"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTimeline() {
  useEffect(() => {
    gsap.fromTo(
      "#title",
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: "#title",
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center gap-6">

      <h2 id="title" className="text-7xl font-extrabold text-yellow-400">
        TOMÁS
      </h2>

      <p className="text-3xl">20 DE FEBRERO</p>
      <p className="text-2xl text-gray-400">Corrientes</p>

      <p className="text-xl mt-6 italic">
        ¡Será una fiesta legendaria!
      </p>

    </section>
  );
}
