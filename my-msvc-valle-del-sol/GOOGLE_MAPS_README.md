# 🗺️ Google Maps Integration - Frontend

## Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Google Maps API Key

**Crear archivo `.env.local`:**

```bash
cp .env.example .env.local
```

**Editar `.env.local` y agregar tu API Key:**

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza_YOUR_API_KEY
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

### 3. Ejecutar proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🎨 Componentes Disponibles

### GoogleMapsComponent

Muestra un mapa interactivo con marcadores de reportes.

```tsx
import GoogleMapsComponent from '@/app/components/GoogleMapsComponent';

<GoogleMapsComponent
  markers={[
    {
      id: 1,
      titulo: "Incendio sector norte",
      latitud: 3.4372,
      longitud: -76.5343,
      severidad: 4,
      estado: "EN_PROCESO"
    }
  ]}
  onMapClick={(lat, lng) => console.log(`Clicked: ${lat}, ${lng}`)}
  zoom={13}
  height="400px"
/>
```

### ReporteFormMejorado

Formulario completo para crear reportes con Google Maps integrado.

```tsx
import ReporteFormMejorado from '@/app/components/ReporteFormMejorado';

<ReporteFormMejorado
  onSubmit={(reporte) => console.log("Reporte creado:", reporte)}
  initialData={{
    reportadoPor: "Juan Pérez"
  }}
/>
```

---

## 🔌 Servicio de API

### Métodos disponibles

```typescript
import reporteApi from '@/utils/reporteApi';

// CRUD
await reporteApi.crearReporte(reporte);
await reporteApi.obtenerReporte(id);
await reporteApi.listarReportes();
await reporteApi.actualizarReporte(id, reporte);
await reporteApi.eliminarReporte(id);

// Geolocalización
await reporteApi.geocodeAddress("Calle 5, Cali");
await reporteApi.reverseGeocode(3.4372, -76.5343);
await reporteApi.validateAddress("Calle 5, Cali");

// Búsqueda
await reporteApi.getNearbyReports(3.4372, -76.5343, 5); // 5 km
await reporteApi.obtenerReportesPorEstado("EN_PROCESO");
await reporteApi.obtenerReportesPorSeveridad(3);
```

---

## 🌍 Tipos TypeScript

```typescript
import { Reporte, MapMarker, GeolocationResponse } from '@/types/reporte';
```

**Reporte:**
- id, titulo, descripcion
- latitud, longitud, direccion, placeMapsId
- estado, nivelSeveridad
- fuenteIgnicion, vegetacionAfectada
- areaAfectada, radioInfluencia
- peligroPersonas, peligroInfraestructura
- presenciaHumo, velocidadViento, temperatura
- accionesTomadas, observaciones
- url_foto, url_video, fotosUrls

---

## 🔧 Configuración Backend

Asegúrate que el backend esté ejecutándose:

```bash
cd ../backend/msvc-reporte
mvn spring-boot:run
```

Debe estar en http://localhost:8081

---

## 📋 Ejemplos de Uso

### Crear reporte con mapa

```tsx
'use client';

import { useState } from 'react';
import ReporteFormMejorado from '@/app/components/ReporteFormMejorado';

export default function Page() {
  const [reporte, setReporte] = useState(null);

  return (
    <div>
      <ReporteFormMejorado
        onSubmit={(r) => {
          setReporte(r);
          alert(`Reporte creado: ID ${r.id}`);
        }}
      />
    </div>
  );
}
```

### Mostrar reportes cercanos

```tsx
'use client';

import { useEffect, useState } from 'react';
import GoogleMapsComponent from '@/app/components/GoogleMapsComponent';
import reporteApi from '@/utils/reporteApi';

export default function MapsPage() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadNearby = async () => {
      const reportes = await reporteApi.getNearbyReports(3.4372, -76.5343, 10);
      setMarkers(reportes.map(r => ({
        id: r.id!,
        titulo: r.titulo,
        latitud: r.latitud,
        longitud: r.longitud,
        severidad: r.nivelSeveridad || 3,
        estado: r.estado || 'PENDIENTE'
      })));
    };
    loadNearby();
  }, []);

  return <GoogleMapsComponent markers={markers} />;
}
```

---

## ⚠️ Troubleshooting

### Error: "Google Maps API Key no configurada"

**Solución:**
1. Verifica que `.env.local` existe
2. Que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté correcto
3. Reinicia el servidor `npm run dev`

### Error: "Backend no responde"

**Solución:**
1. Asegúrate que backend está en `http://localhost:8081`
2. Verifica que CORS está habilitado
3. Revisa logs del backend

### Mapa no carga pero sin errores

**Solución:**
1. Abre DevTools (F12)
2. Verifica que el script de Google Maps se cargó
3. Comprueba que la API Key tiene Maps JavaScript API habilitada

---

## 📱 Responsive Design

Los componentes están optimizados para:
- 📱 Móvil (320px - 640px)
- 💻 Tablet (641px - 1024px)
- 🖥️ Desktop (1025px+)

Usa Tailwind CSS classes para customizar:

```tsx
<GoogleMapsComponent height="300px" /> {/* Mobile */}
<GoogleMapsComponent height="500px" /> {/* Desktop */}
```

---

## 🎨 Temas de Color

### Severidad de Incendios

| Severidad | Color | Emoji |
|-----------|-------|-------|
| 1-2 | Verde | 🟢 |
| 3 | Amarillo | 🟡 |
| 4 | Naranja | 🟠 |
| 5 | Rojo | 🔴 |

### Estados de Reportes

| Estado | Color |
|--------|-------|
| PENDIENTE | Gris |
| CONFIRMADO | Azul |
| EN_PROCESO | Púrpura |
| RESUELTO | Verde oscuro |
| CANCELADO | Rojo |

---

## 📚 Documentación Relacionada

- [Backend Integration](../backend/msvc-reporte/GOOGLE_MAPS_INTEGRATION.md)
- [API Endpoints](../backend/msvc-reporte/EJEMPLOS_PAYLOADS.md)
- [Next.js Docs](https://nextjs.org)
- [React Google Maps Docs](https://react-google-maps-api-docs.netlify.app/)

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Variables de entorno en Vercel:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_API_URL=https://api.ejemplo.com
```

---

**Última actualización:** Mayo 21, 2026  
**Version:** 2.0.0
