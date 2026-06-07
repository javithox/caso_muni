import axios, { AxiosInstance } from 'axios';
import { Reporte, GeolocationResponse, GeolocationRequest } from '../types/reporte';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

class ReporteApiService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ===== CRUD de Reportes =====

  /**
   * Crear un nuevo reporte
   */
  async crearReporte(reporte: Reporte): Promise<Reporte> {
    try {
      const response = await this.apiClient.post('/reportes', reporte);
      return response.data;
    } catch (error) {
      console.error('Error al crear reporte:', error);
      throw error;
    }
  }

  /**
   * Obtener un reporte por ID
   */
  async obtenerReporte(id: number): Promise<Reporte> {
    try {
      const response = await this.apiClient.get(`/reportes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      throw error;
    }
  }

  /**
   * Listar todos los reportes
   */
  async listarReportes(): Promise<Reporte[]> {
    try {
      const response = await this.apiClient.get('/reportes');
      return response.data;
    } catch (error) {
      console.error('Error al listar reportes:', error);
      throw error;
    }
  }

  /**
   * Actualizar un reporte
   */
  async actualizarReporte(id: number, reporte: Partial<Reporte>): Promise<Reporte> {
    try {
      const response = await this.apiClient.put(`/reportes/${id}`, reporte);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw error;
    }
  }

  /**
   * Eliminar un reporte
   */
  async eliminarReporte(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/reportes/${id}`);
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw error;
    }
  }

  /**
   * Obtener reportes por estado
   */
  async obtenerReportesPorEstado(estado: string): Promise<Reporte[]> {
    try {
      const response = await this.apiClient.get(`/reportes/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes por estado:', error);
      throw error;
    }
  }

  /**
   * Obtener reportes por severidad
   */
  async obtenerReportesPorSeveridad(severidad: number): Promise<Reporte[]> {
    try {
      const response = await this.apiClient.get(`/reportes/severidad/${severidad}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes por severidad:', error);
      throw error;
    }
  }

  // ===== Google Maps Geolocation =====

  /**
   * Geocoding: Convertir dirección en coordenadas
   */
  async geocodeAddress(direccion: string): Promise<GeolocationResponse> {
    try {
      const response = await this.apiClient.post('/reportes/maps/geocode', {
        direccion,
      });
      return response.data;
    } catch (error) {
      console.error('Error en geocoding:', error);
      throw error;
    }
  }

  /**
   * Reverse Geocoding: Convertir coordenadas en dirección
   */
  async reverseGeocode(latitud: number, longitud: number): Promise<GeolocationResponse> {
    try {
      const response = await this.apiClient.post('/reportes/maps/reverse-geocode', {
        latitud,
        longitud,
      });
      return response.data;
    } catch (error) {
      console.error('Error en reverse geocoding:', error);
      throw error;
    }
  }

  /**
   * Validar una dirección
   */
  async validateAddress(address: string): Promise<boolean> {
    try {
      const response = await this.apiClient.get('/reportes/maps/validate-address', {
        params: { address },
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error validando dirección:', error);
      return false;
    }
  }

  /**
   * Obtener reportes cercanos a una ubicación
   */
  async getNearbyReports(
    latitud: number,
    longitud: number,
    distancia: number = 5
  ): Promise<Reporte[]> {
    try {
      const response = await this.apiClient.get('/reportes/nearby', {
        params: { latitud, longitud, distancia },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes cercanos:', error);
      throw error;
    }
  }
}

export default new ReporteApiService();
