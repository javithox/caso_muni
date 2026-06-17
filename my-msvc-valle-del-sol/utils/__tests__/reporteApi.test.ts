/**
 * Tests para ReporteApiService
 * Funcionalidades: CRUD de reportes, Geolocalización, Búsqueda de reportes cercanos
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import reporteApi from '../reporteApi';
import { Reporte } from '@/types/reporte';

describe('ReporteApiService', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Crear un mock de axios
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  // ===== TESTS CRUD =====

  describe('CRUD Operations', () => {
    const mockReporte: Reporte = {
      id: 1,
      titulo: 'Incendio Forestal',
      descripcion: 'Incendio en zona boscosa',
      latitud: 3.4372,
      longitud: -76.5343,
      ubicacionId: '1',
      reportadoPor: 'Juan Pérez',
      contactoEmergencia: '3101234567',
      nivelSeveridad: 4,
      direccion: 'Carrera 5 #10-20',
      areaAfectada: 25.5,
      radioInfluencia: 5,
      fuenteIgnicion: 'Negligencia',
      vegetacionAfectada: 'Bosque',
      peligroPersonas: true,
      peligroInfraestructura: false,
      presenciaHumo: true,
      velocidadViento: 15.5,
      temperatura: 32.5,
      accionesTomadas: 'Evacuación iniciada',
      observaciones: 'Fuego activo',
      url_foto: 'https://example.com/foto1.jpg',
    };

    test('crearReporte - debe crear un reporte exitosamente', async () => {
      mock.onPost('/reportes').reply(201, mockReporte);

      const resultado = await reporteApi.crearReporte(mockReporte);

      expect(resultado).toEqual(mockReporte);
      expect(resultado.id).toBe(1);
      expect(resultado.titulo).toBe('Incendio Forestal');
      expect(resultado.nivelSeveridad).toBe(4);
    });

    test('crearReporte - debe fallar si hay error en la API', async () => {
      mock.onPost('/reportes').reply(500, { message: 'Error interno' });

      await expect(reporteApi.crearReporte(mockReporte)).rejects.toThrow();
    });

    test('obtenerReporte - debe obtener un reporte por ID', async () => {
      mock.onGet('/reportes/1').reply(200, mockReporte);

      const resultado = await reporteApi.obtenerReporte(1);

      expect(resultado).toEqual(mockReporte);
      expect(resultado.id).toBe(1);
    });

    test('obtenerReporte - debe lanzar error si reporte no existe', async () => {
      mock.onGet('/reportes/999').reply(404, { message: 'Reporte no encontrado' });

      await expect(reporteApi.obtenerReporte(999)).rejects.toThrow();
    });

    test('listarReportes - debe listar todos los reportes', async () => {
      const mockReportes = [mockReporte, { ...mockReporte, id: 2 }];
      mock.onGet('/reportes').reply(200, mockReportes);

      const resultado = await reporteApi.listarReportes();

      expect(resultado).toEqual(mockReportes);
      expect(resultado.length).toBe(2);
    });

    test('listarReportes - debe retornar lista vacía', async () => {
      mock.onGet('/reportes').reply(200, []);

      const resultado = await reporteApi.listarReportes();

      expect(resultado).toEqual([]);
      expect(resultado.length).toBe(0);
    });

    test('actualizarReporte - debe actualizar un reporte', async () => {
      const actualizacion = { titulo: 'Incendio Controlado' };
      const reporteActualizado = { ...mockReporte, ...actualizacion };
      mock.onPut('/reportes/1', actualizacion).reply(200, reporteActualizado);

      const resultado = await reporteApi.actualizarReporte(1, actualizacion);

      expect(resultado.titulo).toBe('Incendio Controlado');
    });

    test('eliminarReporte - debe eliminar un reporte', async () => {
      mock.onDelete('/reportes/1').reply(204);

      await expect(reporteApi.eliminarReporte(1)).resolves.toBeUndefined();
    });
  });

  // ===== TESTS BÚSQUEDA POR FILTROS =====

  describe('Search by Filters', () => {
    const mockReportesPendientes = [
      { id: 1, titulo: 'Incendio 1', estado: 'PENDIENTE', nivelSeveridad: 3 },
      { id: 2, titulo: 'Incendio 2', estado: 'PENDIENTE', nivelSeveridad: 4 },
    ];

    test('obtenerReportesPorEstado - debe filtrar por estado PENDIENTE', async () => {
      mock.onGet('/reportes/estado/PENDIENTE').reply(200, mockReportesPendientes);

      const resultado = await reporteApi.obtenerReportesPorEstado('PENDIENTE');

      expect(resultado.length).toBe(2);
      expect(resultado[0].estado).toBe('PENDIENTE');
    });

    test('obtenerReportesPorSeveridad - debe filtrar por severidad 4', async () => {
      const mockReportesAltos = [
        { id: 2, titulo: 'Incendio 2', nivelSeveridad: 4 },
      ];
      mock.onGet('/reportes/severidad/4').reply(200, mockReportesAltos);

      const resultado = await reporteApi.obtenerReportesPorSeveridad(4);

      expect(resultado[0].nivelSeveridad).toBe(4);
    });
  });

  // ===== TESTS GEOLOCALIZACIÓN =====

  describe('Geolocation Features', () => {
    test('geocodeAddress - debe convertir dirección en coordenadas', async () => {
      const mockResponse = {
        success: true,
        direccion: 'Carrera 5 #10-20, Cali',
        latitud: 3.4372,
        longitud: -76.5343,
      };
      mock.onPost('/reportes/maps/geocode').reply(200, mockResponse);

      const resultado = await reporteApi.geocodeAddress('Carrera 5 #10-20, Cali');

      expect(resultado.success).toBe(true);
      expect(resultado.latitud).toBe(3.4372);
      expect(resultado.longitud).toBe(-76.5343);
    });

    test('geocodeAddress - debe manejar error de dirección inválida', async () => {
      mock.onPost('/reportes/maps/geocode').reply(400, { message: 'Dirección inválida' });

      await expect(reporteApi.geocodeAddress('Dirección inválida')).rejects.toThrow();
    });

    test('reverseGeocode - debe convertir coordenadas en dirección', async () => {
      const mockResponse = {
        success: true,
        direccion: 'Carrera 5 #10-20, Cali',
        latitud: 3.4372,
        longitud: -76.5343,
      };
      mock.onPost('/reportes/maps/reverse-geocode').reply(200, mockResponse);

      const resultado = await reporteApi.reverseGeocode(3.4372, -76.5343);

      expect(resultado.success).toBe(true);
      expect(resultado.direccion).toBe('Carrera 5 #10-20, Cali');
    });

    test('validateAddress - debe validar una dirección', async () => {
      mock.onGet('/reportes/maps/validate-address').reply(200, { valid: true });

      const resultado = await reporteApi.validateAddress('Carrera 5 #10-20, Cali');

      expect(resultado).toBe(true);
    });

    test('validateAddress - debe retornar false si dirección es inválida', async () => {
      mock.onGet('/reportes/maps/validate-address').reply(200, { valid: false });

      const resultado = await reporteApi.validateAddress('Dirección inválida');

      expect(resultado).toBe(false);
    });

    test('validateAddress - debe retornar false en error', async () => {
      mock.onGet('/reportes/maps/validate-address').reply(500);

      const resultado = await reporteApi.validateAddress('Cualquier dirección');

      expect(resultado).toBe(false);
    });
  });

  // ===== TESTS UBICACIÓN CERCANA =====

  describe('Nearby Reports', () => {
    test('getNearbyReports - debe obtener reportes en radio de 5km', async () => {
      const mockReporteCercano = [
        { id: 1, titulo: 'Incendio cercano', latitud: 3.4372, longitud: -76.5343 },
      ];
      mock.onGet('/reportes/nearby').reply(200, mockReporteCercano);

      const resultado = await reporteApi.getNearbyReports(3.4372, -76.5343, 5);

      expect(resultado.length).toBe(1);
      expect(resultado[0].titulo).toBe('Incendio cercano');
    });

    test('getNearbyReports - debe usar distancia por defecto de 5km', async () => {
      mock.onGet('/reportes/nearby').reply(200, []);

      await reporteApi.getNearbyReports(3.4372, -76.5343);

      expect(mock.history.get[0].params.distancia).toBe(5);
    });

    test('getNearbyReports - debe retornar lista vacía si no hay reportes cercanos', async () => {
      mock.onGet('/reportes/nearby').reply(200, []);

      const resultado = await reporteApi.getNearbyReports(3.4372, -76.5343, 1);

      expect(resultado.length).toBe(0);
    });
  });
});
