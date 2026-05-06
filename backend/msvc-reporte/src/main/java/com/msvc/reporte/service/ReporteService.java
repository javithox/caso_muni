package com.msvc.reporte.service;

import com.msvc.reporte.dto.ReporteDTO;
import com.msvc.reporte.entity.ReporteEntity;
import com.msvc.reporte.repository.ReporteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {
    
    private final ReporteRepository reporteRepository;
    
    public ReporteDTO crearReporte(ReporteDTO dto) {
        ReporteEntity entity = ReporteEntity.builder()
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .latitud(dto.getLatitud())
                .longitud(dto.getLongitud())
                .ubicacionId(dto.getUbicacionId())
                .estado(ReporteEntity.EstadoReporte.PENDIENTE)
                .reportadoPor(dto.getReportadoPor())
                .fechaCreacion(LocalDateTime.now())
                .url_foto(dto.getUrl_foto())
                .url_video(dto.getUrl_video())
                .nivelSeveridad(dto.getNivelSeveridad() != null ? dto.getNivelSeveridad() : 3)
                .build();
        
        ReporteEntity saved = reporteRepository.save(entity);
        return ReporteDTO.fromEntity(saved);
    }
    
    public ReporteDTO obtenerReporte(Long id) {
        return reporteRepository.findById(id)
                .map(ReporteDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
    }
    
    public List<ReporteDTO> listarReportes() {
        return reporteRepository.findAll().stream()
                .map(ReporteDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public ReporteDTO actualizarReporte(Long id, ReporteDTO dto) {
        ReporteEntity entity = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        
        if (dto.getTitulo() != null) entity.setTitulo(dto.getTitulo());
        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());
        if (dto.getEstado() != null) entity.setEstado(ReporteEntity.EstadoReporte.valueOf(dto.getEstado()));
        if (dto.getNivelSeveridad() != null) entity.setNivelSeveridad(dto.getNivelSeveridad());
        
        entity.setFechaActualizacion(LocalDateTime.now());
        ReporteEntity updated = reporteRepository.save(entity);
        return ReporteDTO.fromEntity(updated);
    }
    
    public void eliminarReporte(Long id) {
        reporteRepository.deleteById(id);
    }
    
    public List<ReporteDTO> obtenerReportesPorEstado(String estado) {
        return reporteRepository.findByEstado(ReporteEntity.EstadoReporte.valueOf(estado))
                .stream()
                .map(ReporteDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<ReporteDTO> obtenerReportesPorSeveridad(Integer severidad) {
        return reporteRepository.findReportesBySeveridad(severidad)
                .stream()
                .map(ReporteDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
