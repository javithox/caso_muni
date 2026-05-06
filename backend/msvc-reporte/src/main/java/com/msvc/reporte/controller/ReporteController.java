package com.msvc.reporte.controller;

import com.msvc.reporte.dto.ReporteDTO;
import com.msvc.reporte.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReporteController {
    
    private final ReporteService reporteService;
    
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
}
