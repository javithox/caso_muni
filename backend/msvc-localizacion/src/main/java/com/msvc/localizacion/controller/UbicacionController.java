package com.msvc.localizacion.controller;

import com.msvc.localizacion.dto.UbicacionDTO;
import com.msvc.localizacion.service.UbicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ubicaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UbicacionController {
    
    private final UbicacionService ubicacionService;
    
    @PostMapping
    public ResponseEntity<UbicacionDTO> registrarUbicacion(@RequestBody UbicacionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ubicacionService.registrarUbicacion(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionDTO> obtenerUbicacion(@PathVariable Long id) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacion(id));
    }
    
    @GetMapping
    public ResponseEntity<List<UbicacionDTO>> listarUbicaciones() {
        return ResponseEntity.ok(ubicacionService.listarUbicaciones());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UbicacionDTO> actualizarUbicacion(@PathVariable Long id, @RequestBody UbicacionDTO dto) {
        return ResponseEntity.ok(ubicacionService.actualizarUbicacion(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUbicacion(@PathVariable Long id) {
        ubicacionService.eliminarUbicacion(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/zona/{zona}")
    public ResponseEntity<List<UbicacionDTO>> obtenerPorZona(@PathVariable String zona) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionesPorZona(zona));
    }
    
    @GetMapping("/riesgo/{nivel}")
    public ResponseEntity<List<UbicacionDTO>> obtenerPorRiesgo(@PathVariable String nivel) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionesPorRiesgo(nivel));
    }
    
    @GetMapping("/radio")
    public ResponseEntity<List<UbicacionDTO>> obtenerEnRadio(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam Double radio) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionesEnRadio(lat, lon, radio));
    }
    
    @GetMapping("/area")
    public ResponseEntity<List<UbicacionDTO>> obtenerEnArea(
            @RequestParam Double latMin,
            @RequestParam Double latMax,
            @RequestParam Double lonMin,
            @RequestParam Double lonMax) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicacionesEnArea(latMin, latMax, lonMin, lonMax));
    }
}
