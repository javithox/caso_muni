package com.msvc.reporte.controller;

import com.msvc.reporte.dto.ReporteDTO;
import com.msvc.reporte.dto.GeolocationResponseDTO;
import com.msvc.reporte.service.ReporteService;
import com.msvc.reporte.service.GoogleMapsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReporteController {
    
    private final ReporteService reporteService;
    private final GoogleMapsService googleMapsService;
    
    // ===== CRUD REPORTES =====
    
    @PostMapping
    public ResponseEntity<ReporteDTO> crearReporte(@RequestBody ReporteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reporteService.crearReporte(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReporteDTO> obtenerReporte(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerReporte(id));
    }
    
    @GetMapping
    public ResponseEntity<List<ReporteDTO>> listarReportes() {
        return ResponseEntity.ok(reporteService.listarReportes());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReporteDTO> actualizarReporte(@PathVariable Long id, @RequestBody ReporteDTO dto) {
        return ResponseEntity.ok(reporteService.actualizarReporte(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReporte(@PathVariable Long id) {
        reporteService.eliminarReporte(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReporteDTO>> obtenerReportesPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(reporteService.obtenerReportesPorEstado(estado));
    }
    
    @GetMapping("/severidad/{severidad}")
    public ResponseEntity<List<ReporteDTO>> obtenerReportesPorSeveridad(@PathVariable Integer severidad) {
        return ResponseEntity.ok(reporteService.obtenerReportesPorSeveridad(severidad));
    }
    
    // ===== GOOGLE MAPS GEOLOCATION =====
    
    /**
     * Geocoding: Convierte una dirección en coordenadas (lat, lng)
     * POST /api/reportes/maps/geocode
     */
    @PostMapping("/maps/geocode")
    public ResponseEntity<GeolocationResponseDTO> geocodeAddress(@RequestBody Map<String, String> payload) {
        String direccion = payload.get("direccion");
        if (direccion == null || direccion.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        GeolocationResponseDTO response = googleMapsService.geocodeAddress(direccion);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Reverse Geocoding: Convierte coordenadas en una dirección
     * POST /api/reportes/maps/reverse-geocode
     */
    @PostMapping("/maps/reverse-geocode")
    public ResponseEntity<GeolocationResponseDTO> reverseGeocode(@RequestBody Map<String, Double> payload) {
        Double latitud = payload.get("latitud");
        Double longitud = payload.get("longitud");
        
        if (latitud == null || longitud == null) {
            return ResponseEntity.badRequest().build();
        }
        
        GeolocationResponseDTO response = googleMapsService.reverseGeocode(latitud, longitud);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Valida que una dirección sea válida usando Google Maps
     * GET /api/reportes/maps/validate-address?address=...
     */
    @GetMapping("/maps/validate-address")
    public ResponseEntity<Map<String, Object>> validateAddress(@RequestParam String address) {
        boolean isValid = googleMapsService.validateAddress(address);
        return ResponseEntity.ok(Map.of(
                "address", address,
                "valid", isValid
        ));
    }
    
    /**
     * Obtiene reportes cercanos a una ubicación
     * GET /api/reportes/nearby?latitud=XX&longitud=YY&distancia=5
     * distancia en kilómetros
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<ReporteDTO>> getNearbyReports(
            @RequestParam Double latitud,
            @RequestParam Double longitud,
            @RequestParam(defaultValue = "5") Double distancia) {
        List<ReporteDTO> reportes = reporteService.obtenerReportesNearby(latitud, longitud, distancia);
        return ResponseEntity.ok(reportes);
    }
}
