package com.example.backend1.controller;

import com.example.backend1.dto.ReporteDTO;
import com.example.backend1.dto.GeolocationResponseDTO;
import com.example.backend1.service.ReporteService;
import com.example.backend1.service.GoogleMapsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para ReporteController
 * Funcionalidades: CRUD de reportes vía REST, Geolocalización
 */
@WebMvcTest(ReporteController.class)
@DisplayName("ReporteController - Tests de Integración REST")
class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReporteService reporteService;

    @MockBean
    private GoogleMapsService googleMapsService;

    private ReporteDTO reporteDTOMock;

    @BeforeEach
    void setUp() {
        reporteDTOMock = ReporteDTO.builder()
                .id(1L)
                .titulo("Incendio Forestal")
                .descripcion("Incendio en zona boscosa")
                .latitud(3.4372)
                .longitud(-76.5343)
                .ubicacionId("1")
                .direccion("Carrera 5 #10-20")
                .estado("PENDIENTE")
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
    }

    // ===== TESTS CRUD REST =====

    @Test
    @DisplayName("POST /api/reportes - debe crear reporte y retornar 201")
    void testCrearReporte() throws Exception {
        // Arrange
        when(reporteService.crearReporte(any(ReporteDTO.class))).thenReturn(reporteDTOMock);

        // Act & Assert
        mockMvc.perform(post("/api/reportes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reporteDTOMock)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Incendio Forestal"))
                .andExpect(jsonPath("$.nivelSeveridad").value(4));

        verify(reporteService, times(1)).crearReporte(any(ReporteDTO.class));
    }

    @Test
    @DisplayName("GET /api/reportes/{id} - debe obtener reporte por ID")
    void testObtenerReporte() throws Exception {
        // Arrange
        when(reporteService.obtenerReporte(1L)).thenReturn(reporteDTOMock);

        // Act & Assert
        mockMvc.perform(get("/api/reportes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Incendio Forestal"));

        verify(reporteService, times(1)).obtenerReporte(1L);
    }

    @Test
    @DisplayName("GET /api/reportes - debe listar todos los reportes")
    void testListarReportes() throws Exception {
        // Arrange
        ReporteDTO reporte2 = ReporteDTO.builder()
                .id(2L)
                .titulo("Incendio 2")
                .estado("EN_PROCESO")
                .build();

        when(reporteService.listarReportes()).thenReturn(Arrays.asList(reporteDTOMock, reporte2));

        // Act & Assert
        mockMvc.perform(get("/api/reportes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)));

        verify(reporteService, times(1)).listarReportes();
    }

    @Test
    @DisplayName("PUT /api/reportes/{id} - debe actualizar reporte")
    void testActualizarReporte() throws Exception {
        // Arrange
        ReporteDTO actualizacion = ReporteDTO.builder()
                .titulo("Incendio Controlado")
                .estado("EN_PROCESO")
                .build();

        ReporteDTO reporteActualizado = reporteDTOMock.toBuilder()
                .titulo("Incendio Controlado")
                .estado("EN_PROCESO")
                .build();

        when(reporteService.actualizarReporte(eq(1L), any(ReporteDTO.class)))
                .thenReturn(reporteActualizado);

        // Act & Assert
        mockMvc.perform(put("/api/reportes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(actualizacion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Incendio Controlado"))
                .andExpect(jsonPath("$.estado").value("EN_PROCESO"));

        verify(reporteService, times(1)).actualizarReporte(eq(1L), any(ReporteDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/reportes/{id} - debe eliminar reporte")
    void testEliminarReporte() throws Exception {
        // Arrange
        doNothing().when(reporteService).eliminarReporte(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/reportes/1"))
                .andExpect(status().isNoContent());

        verify(reporteService, times(1)).eliminarReporte(1L);
    }

    // ===== TESTS BÚSQUEDA POR FILTROS =====

    @Test
    @DisplayName("GET /api/reportes/estado/{estado} - debe obtener reportes por estado")
    void testObtenerReportesPorEstado() throws Exception {
        // Arrange
        when(reporteService.obtenerReportesPorEstado("PENDIENTE"))
                .thenReturn(Arrays.asList(reporteDTOMock));

        // Act & Assert
        mockMvc.perform(get("/api/reportes/estado/PENDIENTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].estado").value("PENDIENTE"))
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)));

        verify(reporteService, times(1)).obtenerReportesPorEstado("PENDIENTE");
    }

    @Test
    @DisplayName("GET /api/reportes/severidad/{severidad} - debe obtener reportes por severidad")
    void testObtenerReportesPorSeveridad() throws Exception {
        // Arrange
        when(reporteService.obtenerReportesPorSeveridad(4))
                .thenReturn(Arrays.asList(reporteDTOMock));

        // Act & Assert
        mockMvc.perform(get("/api/reportes/severidad/4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nivelSeveridad").value(4));

        verify(reporteService, times(1)).obtenerReportesPorSeveridad(4);
    }

    // ===== TESTS GOOGLE MAPS GEOLOCATION =====

    @Test
    @DisplayName("POST /api/reportes/maps/geocode - debe convertir dirección a coordenadas")
    void testGeocode() throws Exception {
        // Arrange
        GeolocationResponseDTO response = GeolocationResponseDTO.builder()
                .success(true)
                .direccion("Carrera 5 #10-20")
                .latitud(3.4372)
                .longitud(-76.5343)
                .build();

        when(googleMapsService.geocodeAddress("Carrera 5 #10-20, Cali"))
                .thenReturn(response);

        Map<String, String> payload = new HashMap<>();
        payload.put("direccion", "Carrera 5 #10-20, Cali");

        // Act & Assert
        mockMvc.perform(post("/api/reportes/maps/geocode")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.latitud").value(3.4372))
                .andExpect(jsonPath("$.longitud").value(-76.5343));

        verify(googleMapsService, times(1)).geocodeAddress("Carrera 5 #10-20, Cali");
    }

    @Test
    @DisplayName("POST /api/reportes/maps/reverse-geocode - debe convertir coordenadas a dirección")
    void testReverseGeocode() throws Exception {
        // Arrange
        GeolocationResponseDTO response = GeolocationResponseDTO.builder()
                .success(true)
                .direccion("Carrera 5 #10-20")
                .latitud(3.4372)
                .longitud(-76.5343)
                .build();

        when(googleMapsService.reverseGeocode(3.4372, -76.5343))
                .thenReturn(response);

        Map<String, Double> payload = new HashMap<>();
        payload.put("latitud", 3.4372);
        payload.put("longitud", -76.5343);

        // Act & Assert
        mockMvc.perform(post("/api/reportes/maps/reverse-geocode")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.direccion").value("Carrera 5 #10-20"));

        verify(googleMapsService, times(1)).reverseGeocode(3.4372, -76.5343);
    }

    @Test
    @DisplayName("GET /api/reportes/maps/validate-address - debe validar dirección")
    void testValidateAddress() throws Exception {
        // Arrange
        when(googleMapsService.validateAddress("Carrera 5 #10-20, Cali"))
                .thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/reportes/maps/validate-address")
                .param("address", "Carrera 5 #10-20, Cali"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true));

        verify(googleMapsService, times(1)).validateAddress("Carrera 5 #10-20, Cali");
    }

    @Test
    @DisplayName("GET /api/reportes/nearby - debe obtener reportes cercanos")
    void testGetNearbyReports() throws Exception {
        // Arrange
        when(reporteService.obtenerReportesNearby(3.4372, -76.5343, 5.0))
                .thenReturn(Arrays.asList(reporteDTOMock));

        // Act & Assert
        mockMvc.perform(get("/api/reportes/nearby")
                .param("latitud", "3.4372")
                .param("longitud", "-76.5343")
                .param("distancia", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Incendio Forestal"));

        verify(reporteService, times(1)).obtenerReportesNearby(3.4372, -76.5343, 5.0);
    }
}
