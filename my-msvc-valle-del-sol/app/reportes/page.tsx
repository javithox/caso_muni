
"use client";
import type {PutBlobResult} from '@vercel/blob';
import {handleUpload, upload} from '@vercel/blob/client';
import {useState, useRef, FormEvent} from 'react';

export default function Reportes(){
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob,setBlob]=useState<PutBlobResult | null>(null);
  const [uploading, setUploading] = useState(false);
  return(
      <>
        <main>
          <div>  
            <ul className="lista-de-botones">
              <button><a href="/" className="btn-nav">Home</a></button>
                  <button><a href="/reportes" className="btn-nav">Reportes</a></button>
                  <button><a href="/geolocalizacion" className="btn-nav">Geolocalización</a></button>
                  <button><a href="/iniciarSesion" className="btn-nav">Iniciar Sesion</a></button>
                  <button><a href="/registrarse" className="btn-nav">Registrarse</a></button>
                </ul>
              </div>

              <div className='contenedor-video'>
                <h1 className='titulo-reportes'>Reportes</h1>
                <h2>Subir video desde tu plataforma</h2>
                <form onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setUploading(true);

                    const files = inputFileRef.current?.files;
                    if (!files || files.length === 0) {
                      setUploading(false);
                      throw new Error("No hay archivos seleccionados");
                    }

                    const file = files[0];

                    const newBlob = await upload({
                      file,
                      access: 'public',
                      handleUploadUrl: '/api/upload',
                    });
                    setBlob(newBlob);
                    setUploading(false);
                  }}>
                  <input ref={inputFileRef} type="file" accept="video/*" />
                  <button type="submit" disabled={uploading}>
                    {uploading ? 'Subiendo...' : 'Subir Video'}
                  </button>
                </form>
                {blob && (
                  <div>
                    <h3>Video subido con éxito:</h3>
                    <a href={blob.url} target="_blank" rel="noopener noreferrer">
                    {blob.url}
                  </a>
                </div>
              )}
            </div>
          </main>
      </>
  );
}