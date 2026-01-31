"use client";

import { useEffect } from "react";
import { Howl } from "howler";

export default function AudioManager() {
  useEffect(() => {
    const music = new Howl({
      src: ["/audio/music.mp3"],
      loop: true,
      volume: 0.5
    });

    const roar = new Howl({
      src: ["/audio/trex-roar.mp3"],
      volume: 1
    });

    music.play();

    setTimeout(() => {
      roar.play();
    }, 5000);
  }, []);

  return null;
}
