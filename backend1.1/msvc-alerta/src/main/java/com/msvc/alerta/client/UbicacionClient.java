package com.msvc.alerta.client;

import com.msvc.alerta.dto.UbicacionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "msvc-localizacion", url = "http://localhost:8082")
public interface UbicacionClient {
    
    @GetMapping("/api/ubicaciones/{id}")
    UbicacionDTO obtenerUbicacion(@PathVariable Long id);
    
    @GetMapping("/api/ubicaciones/radio")
    List<UbicacionDTO> obtenerUbicacionesEnRadio(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam Double radio);
}
