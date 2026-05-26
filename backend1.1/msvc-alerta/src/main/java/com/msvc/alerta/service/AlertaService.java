package com.msvc.alerta.service;

import com.msvc.alerta.client.ReporteClient;
import com.msvc.alerta.client.UbicacionClient;
import com.msvc.alerta.dto.AlertaDTO;
import com.msvc.alerta.dto.ReporteDTO;
import com.msvc.alerta.dto.UbicacionDTO;
import com.msvc.alerta.entity.AlertaEntity;
import com.msvc.alerta.repository.AlertaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertaService {
    
    private final AlertaRepository alertaRepository;
    private final ReporteClient reporteClient;
    private final UbicacionClient ubicacionClient;
    
    public AlertaDTO crearAlerta(AlertaDTO dto) {
        try {
            // Validar que el reporte existe consultando el microservicio de reportes
            ReporteDTO reporte = reporteClient.obtenerReporte(dto.getReporteId());
            log.info("Reporte validado: {}", reporte.getId());
            
            // Validar que la ubicación existe consultando el microservicio de ubicaciones
            UbicacionDTO ubicacion = ubicacionClient.obtenerUbicacion(dto.getUbicacionId());
            log.info("Ubicación validada: {}", ubicacion.getId());
            
            AlertaEntity entity = AlertaEntity.builder()
                    .titulo(dto.getTitulo())
                    .mensaje(dto.getMensaje())
                    .reporteId(dto.getReporteId())
                    .ubicacionId(dto.getUbicacionId())
                    .tipoAlerta(AlertaEntity.TipoAlerta.valueOf(dto.getTipoAlerta()))
                    .estado(AlertaEntity.EstadoAlerta.PENDIENTE)
                    .fechaCreacion(LocalDateTime.now())
                    .destinatarios(dto.getDestinatarios() != null ? dto.getDestinatarios() : new ArrayList<>())
                    .enviada(false)
                    .build();
            
            AlertaEntity saved = alertaRepository.save(entity);
            
            // Buscar ubicaciones en radio de influencia para notificación masiva
            List<UbicacionDTO> ubicacionesCercanas = ubicacionClient.obtenerUbicacionesEnRadio(
                    reporte.getLatitud(),
                    reporte.getLongitud(),
                    5.0 // Radio de 5km
            );
            
            log.info("Ubicaciones cercanas encontradas: {}", ubicacionesCercanas.size());
            
            return AlertaDTO.fromEntity(saved);
        } catch (Exception e) {
            log.error("Error al crear alerta y validar datos externos: {}", e.getMessage());
            throw new RuntimeException("Error al crear alerta: " + e.getMessage());
        }
    }
    
    public AlertaDTO obtenerAlerta(Long id) {
        return alertaRepository.findById(id)
                .map(AlertaDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
    }
    
    public List<AlertaDTO> listarAlertas() {
        return alertaRepository.findAll().stream()
                .map(AlertaDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public AlertaDTO actualizarAlerta(Long id, AlertaDTO dto) {
        AlertaEntity entity = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        
        if (dto.getTitulo() != null) entity.setTitulo(dto.getTitulo());
        if (dto.getMensaje() != null) entity.setMensaje(dto.getMensaje());
        if (dto.getEstado() != null) entity.setEstado(AlertaEntity.EstadoAlerta.valueOf(dto.getEstado()));
        if (dto.getEnviada() != null) entity.setEnviada(dto.getEnviada());
        
        AlertaEntity updated = alertaRepository.save(entity);
        return AlertaDTO.fromEntity(updated);
    }
    
    public void eliminarAlerta(Long id) {
        alertaRepository.deleteById(id);
    }
    
    public List<AlertaDTO> obtenerAlertasPorEstado(String estado) {
        return alertaRepository.findByEstado(AlertaEntity.EstadoAlerta.valueOf(estado))
                .stream()
                .map(AlertaDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<AlertaDTO> obtenerAlertasPorReporte(Long reporteId) {
        return alertaRepository.findByReporteId(reporteId)
                .stream()
                .map(AlertaDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<AlertaDTO> obtenerAlertasPendientes() {
        return alertaRepository.findByEnviada(false)
                .stream()
                .map(AlertaDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public AlertaDTO enviarAlerta(Long id) {
        AlertaEntity entity = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        
        entity.setEstado(AlertaEntity.EstadoAlerta.ENVIADA);
        entity.setFechaEnvio(LocalDateTime.now());
        entity.setEnviada(true);
        
        AlertaEntity updated = alertaRepository.save(entity);
        return AlertaDTO.fromEntity(updated);
    }
}
