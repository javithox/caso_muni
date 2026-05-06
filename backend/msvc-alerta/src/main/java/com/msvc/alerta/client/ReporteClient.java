package com.msvc.alerta.client;

import com.msvc.alerta.dto.ReporteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "msvc-reporte", url = "http://localhost:8081")
public interface ReporteClient {
    
    @GetMapping("/api/reportes/{id}")
    ReporteDTO obtenerReporte(@PathVariable Long id);
}
