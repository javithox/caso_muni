// Tipos para el sistema de reportes de incendios

export interface Reporte {
  id?: number;
  
  // Información básica
  titulo: string;
  descripcion: string;
  
  // Ubicación
  latitud: number;
  longitud: number;
  ubicacionId: string;
  direccion?: string;
  placeMapsId?: string;
  
  // Estado y metadata
  estado?: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PROCESO' | 'RESUELTO' | 'CANCELADO';
  reportadoPor: string;
  contactoEmergencia?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  
  // Severidad e impacto
  nivelSeveridad?: number; // 1-5
  areaAfectada?: number; // En hectáreas
  radioInfluencia?: number; // En kilómetros
  
  // Detalles del incendio
  fuenteIgnicion?: string; // rayo, negligencia, vandal., etc.
  vegetacionAfectada?: string; // bosque, pastos, matorral, etc.
  peligroPersonas?: boolean;
  peligroInfraestructura?: boolean;
  
  // Condiciones ambientales
  presenciaHumo?: boolean;
  velocidadViento?: number; // En km/h
  temperatura?: number; // En celsius
  
  // Acciones y observaciones
  accionesTomadas?: string;
  observaciones?: string;
  
  // Multimedia
  url_foto?: string;
  url_video?: string;
  fotosUrls?: string; // JSON array
}

export interface GeolocationResponse {
  latitud?: number;
  longitud?: number;
  direccion?: string;
  placeId?: string;
  success: boolean;
  message: string;
}

export interface MapMarker {
  id: number;
  titulo: string;
  latitud: number;
  longitud: number;
  severidad: number;
  estado: string;
}

// Respuesta de API de reportes
export interface ReporteResponse {
  data: Reporte[];
  total?: number;
  page?: number;
}

// Respuesta de API de geolocalización
export interface GeolocationRequest {
  direccion?: string;
  latitud?: number;
  longitud?: number;
}
