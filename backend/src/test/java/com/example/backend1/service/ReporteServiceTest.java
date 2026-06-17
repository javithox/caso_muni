package com.example.backend1.service;

import com.example.backend1.dto.ReporteDTO;
import com.example.backend1.dto.GeolocationResponseDTO;
import com.example.backend1.entity.ReporteEntity;
import com.example.backend1.repository.ReporteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests para ReporteService
 * Funcionalidades: CRUD de reportes, búsqueda por estado/severidad, reportes cercanos
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ReporteService - Tests Unitarios")
class ReporteServiceTest {

    @Mock
    private ReporteRepository reporteRepository;

    @Mock
    private GoogleMapsService googleMapsService;

    @InjectMocks
    private ReporteService reporteService;

    private ReporteEntity reporteMock;
    private ReporteDTO reporteDTOMock;

    @BeforeEach
    void setUp() {
        reporteMock = ReporteEntity.builder()
                .id(1L)
                .titulo("Incendio Forestal")
                .descripcion("Incendio en zona boscosa")
                .latitud(3.4372)
                .longitud(-76.5343)
                .ubicacionId("1")
                .direccion("Carrera 5 #10-20")
                .estado(ReporteEntity.EstadoReporte.PENDIENTE)
                .reportadoPor("Juan Pérez")
                .contactoEmergencia("3101234567")
                .nivelSeveridad(4)
                .areaAfectada(25.5)
                .radioInfluencia(5.0)
                .fuenteIgnicion("Negligencia")
                .vegetacionAfectada("Bosque")
                .peligroPersonas(true)
                .peligroInfraestructura(false)
                .presenciaHumo(true)
                .velocidadViento(15.5)
                .temperatura(32.5)
                .accionesTomadas("Evacuación iniciada")
                .observaciones("Fuego activo")
                .url_foto("https://example.com/foto1.jpg")
                .fechaCreacion(LocalDateTime.now())
                .build();

        reporteDTOMock = ReporteDTO.fromEntity(reporteMock);
    }

    // ===== TESTS CRUD =====

    @Test
    @DisplayName("crearReporte - debe crear un nuevo reporte exitosamente")
    void testCrearReporte() {
        // Arrange
        when(googleMapsService.reverseGeocode(anyDouble(), anyDouble()))
                .thenReturn(GeolocationResponseDTO.builder()
                        .success(true)
                        .direccion("Carrera 5 #10-20")
                        .placeId("place123")
                        .build());
        when(reporteRepository.save(any(ReporteEntity.class))).thenReturn(reporteMock);

        // Act
        ReporteDTO resultado = reporteService.crearReporte(reporteDTOMock);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getTitulo()).isEqualTo("Incendio Forestal");
        assertThat(resultado.getNivelSeveridad()).isEqualTo(4);
        assertThat(resultado.getEstado()).isEqualTo("PENDIENTE");
        verify(reporteRepository, times(1)).save(any(ReporteEntity.class));
    }

    @Test
    @DisplayName("crearReporte - debe obtener dirección si no la proporciona")
    void testCrearReporteConReverseGeocode() {
        // Arrange
        reporteDTOMock.setDireccion(null);
        GeolocationResponseDTO geoResponse = GeolocationResponseDTO.builder()
                .success(true)
                .direccion("Carrera 5 #10-20, Cali")
                .placeId("place123")
                .build();
        
        when(googleMapsService.reverseGeocode(3.4372, -76.5343)).thenReturn(geoResponse);
        when(reporteRepository.save(any(ReporteEntity.class))).thenReturn(reporteMock);

        // Act
        ReporteDTO resultado = reporteService.crearReporte(reporteDTOMock);

        // Assert
        assertThat(resultado.getDireccion()).isNotNull();
        verify(googleMapsService, times(1)).reverseGeocode(anyDouble(), anyDouble());
    }

    @Test
    @DisplayName("obtenerReporte - debe obtener reporte por ID")
    void testObtenerReporte() {
        // Arrange
        when(reporteRepository.findById(1L)).thenReturn(Optional.of(reporteMock));

        // Act
        ReporteDTO resultado = reporteService.obtenerReporte(1L);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getTitulo()).isEqualTo("Incendio Forestal");
    }

    @Test
    @DisplayName("obtenerReporte - debe lanzar excepción si reporte no existe")
    void testObtenerReporteNoExiste() {
        // Arrange
        when(reporteRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> reporteService.obtenerReporte(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Reporte no encontrado");
    }

    @Test
    @DisplayName("listarReportes - debe retornar lista de reportes")
    void testListarReportes() {
        // Arrange
        ReporteEntity reporte2 = ReporteEntity.builder()
                .id(2L)
                .titulo("Incendio 2")
                .estado(ReporteEntity.EstadoReporte.EN_PROCESO)
                .build();
        List<ReporteEntity> reportes = Arrays.asList(reporteMock, reporte2);
        when(reporteRepository.findAll()).thenReturn(reportes);

        // Act
        List<ReporteDTO> resultado = reporteService.listarReportes();

        // Assert
        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getId()).isEqualTo(1L);
        assertThat(resultado.get(1).getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("listarReportes - debe retornar lista vacía")
    void testListarReportesVacio() {
        // Arrange
        when(reporteRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<ReporteDTO> resultado = reporteService.listarReportes();

        // Assert
        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("actualizarReporte - debe actualizar campos de reporte")
    void testActualizarReporte() {
        // Arrange
        ReporteDTO actualizacion = ReporteDTO.builder()
                .titulo("Incendio Controlado")
                .estado("EN_PROCESO")
                .build();

        ReporteEntity reporteActualizado = reporteMock.toBuilder()
                .titulo("Incendio Controlado")
                .estado(ReporteEntity.EstadoReporte.EN_PROCESO)
                .build();

        when(reporteRepository.findById(1L)).thenReturn(Optional.of(reporteMock));
        when(reporteRepository.save(any(ReporteEntity.class))).thenReturn(reporteActualizado);

        // Act
        ReporteDTO resultado = reporteService.actualizarReporte(1L, actualizacion);

        // Assert
        assertThat(resultado.getTitulo()).isEqualTo("Incendio Controlado");
        assertThat(resultado.getEstado()).isEqualTo("EN_PROCESO");
    }

    @Test
    @DisplayName("eliminarReporte - debe eliminar reporte")
    void testEliminarReporte() {
        // Arrange
        doNothing().when(reporteRepository).deleteById(1L);

        // Act
        reporteService.eliminarReporte(1L);

        // Assert
        verify(reporteRepository, times(1)).deleteById(1L);
    }

    // ===== TESTS BÚSQUEDA =====

    @Test
    @DisplayName("obtenerReportesPorEstado - debe retornar reportes pendientes")
    void testObtenerReportesPorEstado() {
        // Arrange
        List<ReporteEntity> reportesPendientes = Arrays.asList(reporteMock);
        when(reporteRepository.findByEstado(ReporteEntity.EstadoReporte.PENDIENTE))
                .thenReturn(reportesPendientes);

        // Act
        List<ReporteDTO> resultado = reporteService.obtenerReportesPorEstado("PENDIENTE");

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getEstado()).isEqualTo("PENDIENTE");
    }

    @Test
    @DisplayName("obtenerReportesPorSeveridad - debe retornar reportes de severidad alta")
    void testObtenerReportesPorSeveridad() {
        // Arrange
        List<ReporteEntity> reportesAltos = Arrays.asList(reporteMock);
        when(reporteRepository.findReportesBySeveridad(4))
                .thenReturn(reportesAltos);

        // Act
        List<ReporteDTO> resultado = reporteService.obtenerReportesPorSeveridad(4);

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNivelSeveridad()).isEqualTo(4);
    }

    // ===== TESTS GEOLOCALIZACIÓN =====

    @Test
    @DisplayName("obtenerReportesNearby - debe retornar reportes en radio de 5km")
    void testObtenerReportesNearby() {
        // Arrange
        List<ReporteEntity> reportesCercanos = Arrays.asList(reporteMock);
        when(reporteRepository.findReportesNearby(3.4372, -76.5343, 5.0))
                .thenReturn(reportesCercanos);

        // Act
        List<ReporteDTO> resultado = reporteService.obtenerReportesNearby(3.4372, -76.5343, 5.0);

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getLatitud()).isEqualTo(3.4372);
        assertThat(resultado.get(0).getLongitud()).isEqualTo(-76.5343);
    }

    @Test
    @DisplayName("obtenerReportesNearby - debe retornar lista vacía si no hay reportes cercanos")
    void testObtenerReportesNearbyVacio() {
        // Arrange
        when(reporteRepository.findReportesNearby(0.0, 0.0, 1.0))
                .thenReturn(Arrays.asList());

        // Act
        List<ReporteDTO> resultado = reporteService.obtenerReportesNearby(0.0, 0.0, 1.0);

        // Assert
        assertThat(resultado).isEmpty();
    }
}
