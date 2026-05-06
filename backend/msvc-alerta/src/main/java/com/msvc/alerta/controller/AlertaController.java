package com.msvc.alerta.controller;

import com.msvc.alerta.dto.AlertaDTO;
import com.msvc.alerta.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertaController {
    
    private final AlertaService alertaService;
    
    @PostMapping
    public ResponseEntity<AlertaDTO> crearAlerta(@RequestBody AlertaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alertaService.crearAlerta(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AlertaDTO> obtenerAlerta(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.obtenerAlerta(id));
    }
    
    @GetMapping
    public ResponseEntity<List<AlertaDTO>> listarAlertas() {
        return ResponseEntity.ok(alertaService.listarAlertas());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AlertaDTO> actualizarAlerta(@PathVariable Long id, @RequestBody AlertaDTO dto) {
        return ResponseEntity.ok(alertaService.actualizarAlerta(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAlerta(@PathVariable Long id) {
        alertaService.eliminarAlerta(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<AlertaDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(alertaService.obtenerAlertasPorEstado(estado));
    }
    
    @GetMapping("/reporte/{reporteId}")
    public ResponseEntity<List<AlertaDTO>> obtenerPorReporte(@PathVariable Long reporteId) {
        return ResponseEntity.ok(alertaService.obtenerAlertasPorReporte(reporteId));
    }
    
    @GetMapping("/pendientes")
    public ResponseEntity<List<AlertaDTO>> obtenerAlertasPendientes() {
        return ResponseEntity.ok(alertaService.obtenerAlertasPendientes());
    }
    
    @PostMapping("/{id}/enviar")
    public ResponseEntity<AlertaDTO> enviarAlerta(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.enviarAlerta(id));
    }
}
