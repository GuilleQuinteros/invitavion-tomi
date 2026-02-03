"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Galeria() {
  const [images, setImages] = useState<string[]>([])
  const BUCKET = "galeria-tomas"

  useEffect(() => {
    const loadImages = async () => {
      const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .list()

      if (data) {
        const urls = data.map(file =>
          supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl
        )
        setImages(urls)
      }
    }

    loadImages()
  }, [])

  return (
    <section className="galeria">
      <h2>Momentos Jurásicos</h2>

      <div className="grid">
        {images.map((url, i) => (
          <img key={i} src={url} className="foto" />
        ))}
      </div>
    </section>
  )
}
