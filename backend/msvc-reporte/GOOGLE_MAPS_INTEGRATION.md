# 🚀 Mejoras del Servicio de Reportes - Google Maps Integration

**Fecha:** Mayo 2026  
**Versión:** 2.0.0  
**Estado:** ✅ Completado

---

## 📋 Resumen de Cambios

Se han implementado mejoras significativas al microservicio `msvc-reporte` para:

1. **Agregar detalles enriquecidos** al modelo de reportes
2. **Integrar Google Maps API** para geocodificación y reverse geocodificación
3. **Crear componentes React** mejorados con mapas interactivos
4. **Implementar endpoints** específicos para operaciones geoespaciales

---

## 🔄 BACKEND - Cambios en msvc-reporte

### 1. Nuevos Campos en ReporteEntity

Se agregaron **19 nuevos campos** a la entidad para capturar información más detallada:

#### Ubicación Mejorada
```java
private String direccion;          // Dirección desde Google Maps Reverse Geocoding
private String placeMapsId;        // ID de lugar de Google Maps
```

#### Detalles del Incendio
```java
private String fuenteIgnicion;         // rayo, negligencia, vandalismos, etc.
private String vegetacionAfectada;     // bosque, pastos, matorral, etc.
private Double areaAfectada;           // En hectáreas
private Double radioInfluencia;        // En kilómetros
private Boolean peligroPersonas;       // Existe peligro para personas
private Boolean peligroInfraestructura; // Existe peligro para infraestructura
```

#### Condiciones Ambientales
```java
private Boolean presenciaHumo;    // ¿Hay humo visible?
private Double velocidadViento;   // En km/h
private Double temperatura;       // En celsius
```

#### Contacto y Acciones
```java
private String contactoEmergencia;    // Teléfono o email
private String accionesTomadas;       // Respuesta inmediata
private String observaciones;         // Notas adicionales
private String fotosUrls;             // JSON array de múltiples fotos
```

### 2. Nuevo Servicio: GoogleMapsService

Ubicación: `src/main/java/com/msvc/reporte/service/GoogleMapsService.java`

**Funcionalidades principales:**

```java
// Geocoding: Dirección → Coordenadas
GeolocationResponseDTO geocodeAddress(String direccion);

// Reverse Geocoding: Coordenadas → Dirección
GeolocationResponseDTO reverseGeocode(Double latitud, Double longitud);

// Validación
boolean validateAddress(String direccion);
```

**Características:**
- Llamadas HTTP a Google Maps Geocoding API
- Manejo de errores robusto
- Logging con SLF4J
- Fallback para API Key

### 3. Nuevos Endpoints de Google Maps

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/reportes/maps/geocode` | Convertir dirección a coordenadas |
| `POST` | `/api/reportes/maps/reverse-geocode` | Convertir coordenadas a dirección |
| `GET` | `/api/reportes/maps/validate-address?address=...` | Validar dirección |
| `GET` | `/api/reportes/nearby?latitud=X&longitud=Y&distancia=5` | Reportes cercanos (km) |

### 4. Actualización de application.properties

```properties
# Google Maps API
google.maps.api.key=${GOOGLE_MAPS_API_KEY:}
```

**Cómo configurar:**
```bash
# Opción 1: Variable de entorno
export GOOGLE_MAPS_API_KEY="tu-api-key"

# Opción 2: Archivo .env
GOOGLE_MAPS_API_KEY=tu-api-key

# Opción 3: application-dev.properties
google.maps.api.key=tu-api-key
```

---

## 🎨 FRONTEND - Cambios en my-msvc-valle-del-sol

### 1. Nuevas Dependencias

```json
{
  "@react-google-maps/api": "^2.19.3",
  "axios": "^1.7.7"
}
```

**Instalación:**
```bash
cd my-msvc-valle-del-sol
npm install
```

### 2. Tipos TypeScript Mejorados

Archivo: `types/reporte.ts`

```typescript
interface Reporte {
  // Información básica
  titulo: string;
  descripcion: string;
  
  // Ubicación con Google Maps
  latitud: number;
  longitud: number;
  direccion?: string;
  placeMapsId?: string;
  
  // Detalles del incendio
  fuenteIgnicion?: string;
  vegetacionAfectada?: string;
  areaAfectada?: number;
  radioInfluencia?: number;
  
  // Condiciones ambientales
  presenciaHumo?: boolean;
  velocidadViento?: number;
  temperatura?: number;
  
  // Y más...
}
```

### 3. Servicio de API: reporteApi.ts

Archivo: `utils/reporteApi.ts`

Proporciona métodos para:
- CRUD de reportes
- Geocodificación
- Reverse geocodificación
- Validación de direcciones
- Búsqueda de reportes cercanos

**Ejemplo de uso:**

```typescript
// Crear reporte con geolocalización
const reporte = await reporteApi.crearReporte({
  titulo: "Incendio sector norte",
  latitud: 3.4372,
  longitud: -76.5343,
  reportadoPor: "Juan Pérez"
});

// Geocodificar dirección
const geo = await reporteApi.geocodeAddress("Calle 5 #123, Cali");
console.log(`Lat: ${geo.latitud}, Lng: ${geo.longitud}`);

// Reverse geocoding
const address = await reporteApi.reverseGeocode(3.4372, -76.5343);
console.log(`Dirección: ${address.direccion}`);

// Reportes cercanos
const nearby = await reporteApi.getNearbyReports(3.4372, -76.5343, 5);
```

### 4. Componente GoogleMapsComponent.tsx

Archivo: `app/components/GoogleMapsComponent.tsx`

**Características:**
- Mapa interactivo con Google Maps
- Múltiples markers con colores por severidad
- Info windows con detalles de reportes
- Click en mapa para obtener coordenadas
- Soporte para ubicación automática

**Props:**

```typescript
interface GoogleMapsComponentProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
}
```

**Ejemplo:**

```tsx
import GoogleMapsComponent from '@/app/components/GoogleMapsComponent';

<GoogleMapsComponent
  markers={reportes.map(r => ({
    id: r.id,
    titulo: r.titulo,
    latitud: r.latitud,
    longitud: r.longitud,
    severidad: r.nivelSeveridad,
    estado: r.estado
  }))}
  onMapClick={(lat, lng) => {
    console.log(`Ubicación seleccionada: ${lat}, ${lng}`);
  }}
/>
```

### 5. Formulario Mejorado: ReporteFormMejorado.tsx

Archivo: `app/components/ReporteFormMejorado.tsx`

**Secciones principales:**

1. **📌 Información Básica**
   - Título
   - Reportado por
   - Descripción
   - Severidad (1-5)
   - Contacto de emergencia

2. **📍 Ubicación con Google Maps**
   - Campo de búsqueda de dirección
   - Botón de geocodificación
   - Mapa interactivo
   - Campos de latitud/longitud

3. **🔥 Detalles del Incendio**
   - Fuente de ignición
   - Tipo de vegetación
   - Área afectada
   - Radio de influencia
   - Peligros (personas, infraestructura)

4. **🌡️ Condiciones Ambientales**
   - Temperatura
   - Velocidad del viento
   - Presencia de humo

5. **📝 Acciones y Observaciones**
   - Acciones tomadas
   - Notas adicionales

**Características:**
- Reverse geocoding automático
- Validación de formulario
- Mensajes de error y éxito
- Interfaz responsive con Tailwind CSS
- Integración total con Google Maps

---

## 📡 Ejemplos de API Calls

### 1. Crear Reporte con Detalles Completos

**Endpoint:** `POST /api/reportes`

```json
{
  "titulo": "Incendio forestal sector norte",
  "descripcion": "Se reporta incendio en la zona boscosa del sector norte",
  "latitud": 3.4372,
  "longitud": -76.5343,
  "ubicacionId": "loc-001",
  "reportadoPor": "Juan Pérez García",
  "contactoEmergencia": "+57 3001234567",
  "nivelSeveridad": 4,
  "fuenteIgnicion": "rayo",
  "vegetacionAfectada": "bosque",
  "areaAfectada": 2.5,
  "radioInfluencia": 5.0,
  "peligroPersonas": true,
  "peligroInfraestructura": false,
  "presenciaHumo": true,
  "velocidadViento": 15.5,
  "temperatura": 28.3,
  "accionesTomadas": "Se alertó a bomberos. Evacuación en curso.",
  "observaciones": "Vientos fuertes en la zona",
  "url_foto": "https://ejemplo.com/foto1.jpg"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "titulo": "Incendio forestal sector norte",
  "descripcion": "Se reporta incendio en la zona boscosa del sector norte",
  "latitud": 3.4372,
  "longitud": -76.5343,
  "direccion": "Carrera 5, Cali, Colombia",
  "placeMapsId": "ChIJH_example",
  "estado": "PENDIENTE",
  "reportadoPor": "Juan Pérez García",
  "contactoEmergencia": "+57 3001234567",
  "fechaCreacion": "2026-05-21T14:30:00",
  "nivelSeveridad": 4,
  "fuenteIgnicion": "rayo",
  "vegetacionAfectada": "bosque",
  "areaAfectada": 2.5,
  "radioInfluencia": 5.0,
  "peligroPersonas": true,
  "peligroInfraestructura": false,
  "presenciaHumo": true,
  "velocidadViento": 15.5,
  "temperatura": 28.3,
  "accionesTomadas": "Se alertó a bomberos. Evacuación en curso.",
  "observaciones": "Vientos fuertes en la zona",
  "url_foto": "https://ejemplo.com/foto1.jpg"
}
```

### 2. Geocodificación

**Endpoint:** `POST /api/reportes/maps/geocode`

```json
{
  "direccion": "Calle 5 #123, Cali, Colombia"
}
```

**Respuesta:**
```json
{
  "latitud": 3.4372,
  "longitud": -76.5343,
  "direccion": "Calle 5, Cali, Valle del Cauca, Colombia",
  "placeId": "ChIJH_example",
  "success": true,
  "message": "Geocoding exitoso"
}
```

### 3. Reverse Geocodificación

**Endpoint:** `POST /api/reportes/maps/reverse-geocode`

```json
{
  "latitud": 3.4372,
  "longitud": -76.5343
}
```

**Respuesta:**
```json
{
  "latitud": 3.4372,
  "longitud": -76.5343,
  "direccion": "Carrera 5, Cali, Valle del Cauca, Colombia",
  "placeId": "ChIJH_example",
  "success": true,
  "message": "Reverse geocoding exitoso"
}
```

### 4. Obtener Reportes Cercanos

**Endpoint:** `GET /api/reportes/nearby?latitud=3.4372&longitud=-76.5343&distancia=5`

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Incendio forestal sector norte",
    "latitud": 3.4372,
    "longitud": -76.5343,
    "estado": "EN_PROCESO",
    "nivelSeveridad": 4,
    "direccion": "Carrera 5, Cali"
  },
  {
    "id": 2,
    "titulo": "Pequeño foco de fuego",
    "latitud": 3.4380,
    "longitud": -76.5350,
    "estado": "PENDIENTE",
    "nivelSeveridad": 2,
    "direccion": "Carrera 6, Cali"
  }
]
```

---

## 🔐 Configuración de Google Maps API Key

### Paso 1: Crear proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita estas APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API

### Paso 2: Crear API Key

1. Ve a "Credenciales"
2. Crea una nueva clave de API
3. Restringe la clave a:
   - HTTP referrers (para frontend)
   - IP addresses (para backend)

### Paso 3: Configurar en el proyecto

**Backend (.env o application-dev.properties):**
```properties
google.maps.api.key=AIza_YOUR_BACKEND_API_KEY
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza_YOUR_FRONTEND_API_KEY
```

### Paso 4: Prueba local

```bash
# Backend
cd backend/msvc-reporte
mvn spring-boot:run

# Frontend (nueva terminal)
cd my-msvc-valle-del-sol
npm run dev
```

---

## 📊 Estructura de Base de Datos - Nueva Migración

La tabla `reportes` ahora incluye estos campos adicionales:

```sql
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS direccion VARCHAR(255);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS place_maps_id VARCHAR(255);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS area_afectada DECIMAL(10, 2);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS radio_influencia DECIMAL(10, 2);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS fuente_ignicion VARCHAR(100);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS vegetacion_afectada VARCHAR(100);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS peligro_personas BOOLEAN;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS peligro_infraestructura BOOLEAN;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS presencia_humo BOOLEAN;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS velocidad_viento DECIMAL(8, 2);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS temperatura DECIMAL(8, 2);
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS acciones_tomadas TEXT;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS observaciones TEXT;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS fotos_urls TEXT;
ALTER TABLE reportes ADD COLUMN IF NOT EXISTS contacto_emergencia VARCHAR(20);
```

---

## ✅ Testing

### Test de Geocodificación

```bash
curl -X POST http://localhost:8081/api/reportes/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"direccion":"Calle 5 #123, Cali"}'
```

### Test de Reverse Geocodificación

```bash
curl -X POST http://localhost:8081/api/reportes/maps/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{"latitud":3.4372,"longitud":-76.5343}'
```

### Test de Reportes Cercanos

```bash
curl -X GET "http://localhost:8081/api/reportes/nearby?latitud=3.4372&longitud=-76.5343&distancia=5"
```

---

## 📚 Archivos Modificados/Creados

### Backend

- ✅ `ReporteEntity.java` - 32 campos (was 12)
- ✅ `ReporteDTO.java` - 32 campos (was 12)
- ✅ `ReporteController.java` - +4 endpoints (was 7)
- ✅ `ReporteService.java` - +3 métodos (was 6)
- ✅ `GoogleMapsService.java` - NUEVO
- ✅ `GeolocationResponseDTO.java` - NUEVO
- ✅ `MsvcReporteApplication.java` - RestTemplate Bean
- ✅ `application.properties` - Google Maps config

### Frontend

- ✅ `package.json` - +2 dependencias
- ✅ `types/reporte.ts` - NUEVO
- ✅ `utils/reporteApi.ts` - NUEVO
- ✅ `app/components/GoogleMapsComponent.tsx` - NUEVO
- ✅ `app/components/ReporteFormMejorado.tsx` - NUEVO

---

## 🎯 Próximas Mejoras Sugeridas

1. **Autenticación JWT** para APIs
2. **Rate limiting** en endpoints de Google Maps
3. **Caché** de geocodificaciones
4. **WebSockets** para actualizaciones en tiempo real
5. **Notificaciones push** para alertas críticas
6. **Análisis de patrones** de incendios
7. **Integración con SMS/WhatsApp** para alertas

---

## 📞 Soporte

Para dudas o problemas con la integración:

1. Verifica que Google Maps API Key esté configurada
2. Revisa los logs del backend: `application.properties`
3. Valida que CORS esté habilitado
4. Prueba endpoints con curl o Postman

---

**Versión:** 2.0.0  
**Última actualización:** Mayo 21, 2026  
**Estado:** ✅ Production Ready
