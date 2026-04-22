"use client";

import type { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import "../estilos/estiloReporte.css";


export default function Reportes() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const files = inputFileRef.current?.files;

    if (!files || files.length === 0) {
      alert("Selecciona un archivo primero");
      return;
    }

    const file = files[0];

    // Validación de tipo
    if (!file.type.startsWith("video/")) {
      alert("Solo se permiten videos");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (event: { percentage: number }) => {
          setProgress(event.percentage);
        },
      });

      setBlob(newBlob);
    } catch (error) {
      console.error(error);
      alert("Error al subir el video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main>
      {/* NAV */}
      <div>
        <ul className="lista-de-botones">
          <li><Link href="/" className="btn-nav">Home</Link></li>
          <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
          <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
          <li><Link href="/iniciarSesion" className="btn-nav">Iniciar Sesión</Link></li>
          <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
        </ul>
      </div>

      {/* CONTENIDO */}
      <div className="contenedor-video">
        <h1 className="titulo-reportes">Reportes</h1>
        <h2>Subir video desde tu dispositivo</h2>

        <form onSubmit={handleSubmit}>
          <input ref={inputFileRef} type="file" accept="video/*" />

          <button type="submit" disabled={uploading}>
            {uploading ? `Subiendo... ${progress.toFixed(0)}%` : "Subir Video"}
          </button>
        </form>

        {/* BARRA PROGRESO */}
        {uploading && (
          <div style={{ marginTop: "10px" }}>
            <progress value={progress} max="100" />
          </div>
        )}

        {/* RESULTADO */}
        {blob && (
          <div>
            <h3>Video subido con éxito:</h3>
            <a href={blob.url} target="_blank" rel="noopener noreferrer">
              {blob.url}
            </a>

            <video width="400" controls src={blob.url}></video>
          </div>
        )}
      </div>
    </main>
  );
}