package com.msvc.reporte.service;

import com.msvc.reporte.dto.ReporteDTO;
import com.msvc.reporte.dto.GeolocationResponseDTO;
import com.msvc.reporte.entity.ReporteEntity;
import com.msvc.reporte.repository.ReporteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReporteService {
    
    private final ReporteRepository reporteRepository;
    private final GoogleMapsService googleMapsService;
    
    public ReporteDTO crearReporte(ReporteDTO dto) {
        // Reverse geocoding: obtener dirección desde coordenadas
        String direccion = dto.getDireccion();
        String placeMapsId = dto.getPlaceMapsId();
        
        if ((direccion == null || direccion.isEmpty()) && dto.getLatitud() != null && dto.getLongitud() != null) {
            try {
                GeolocationResponseDTO geoResponse = googleMapsService.reverseGeocode(
                        dto.getLatitud(), 
                        dto.getLongitud()
                );
                if (geoResponse.isSuccess()) {
                    direccion = geoResponse.getDireccion();
                    placeMapsId = geoResponse.getPlaceId();
                }
            } catch (Exception e) {
                log.warn("No se pudo obtener dirección desde coordenadas: {}", e.getMessage());
            }
        }
        
        ReporteEntity entity = ReporteEntity.builder()
                // Datos básicos
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                
                // Ubicación
                .latitud(dto.getLatitud())
                .longitud(dto.getLongitud())
                .ubicacionId(dto.getUbicacionId())
                .direccion(direccion)
                .placeMapsId(placeMapsId)
                
                // Estado
                .estado(ReporteEntity.EstadoReporte.PENDIENTE)
                .reportadoPor(dto.getReportadoPor())
                .contactoEmergencia(dto.getContactoEmergencia())
                .fechaCreacion(LocalDateTime.now())
                
                // Severidad
                .nivelSeveridad(dto.getNivelSeveridad() != null ? dto.getNivelSeveridad() : 3)
                .areaAfectada(dto.getAreaAfectada())
                .radioInfluencia(dto.getRadioInfluencia())
                
                // Detalles del incendio
                .fuenteIgnicion(dto.getFuenteIgnicion())
                .vegetacionAfectada(dto.getVegetacionAfectada())
                .peligroPersonas(dto.getPeligroPersonas())
                .peligroInfraestructura(dto.getPeligroInfraestructura())
                
                // Condiciones ambientales
                .presenciaHumo(dto.getPresenciaHumo())
                .velocidadViento(dto.getVelocidadViento())
                .temperatura(dto.getTemperatura())
                
                // Acciones y observaciones
                .accionesTomadas(dto.getAccionesTomadas())
                .observaciones(dto.getObservaciones())
                
                // Multimedia
                .url_foto(dto.getUrl_foto())
                .url_video(dto.getUrl_video())
                .fotosUrls(dto.getFotosUrls())
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
        
        // Campos básicos
        if (dto.getTitulo() != null) entity.setTitulo(dto.getTitulo());
        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());
        if (dto.getEstado() != null) entity.setEstado(ReporteEntity.EstadoReporte.valueOf(dto.getEstado()));
        
        // Ubicación
        if (dto.getLatitud() != null) entity.setLatitud(dto.getLatitud());
        if (dto.getLongitud() != null) entity.setLongitud(dto.getLongitud());
        if (dto.getDireccion() != null) entity.setDireccion(dto.getDireccion());
        if (dto.getPlaceMapsId() != null) entity.setPlaceMapsId(dto.getPlaceMapsId());
        
        // Contacto
        if (dto.getContactoEmergencia() != null) entity.setContactoEmergencia(dto.getContactoEmergencia());
        
        // Severidad e impacto
        if (dto.getNivelSeveridad() != null) entity.setNivelSeveridad(dto.getNivelSeveridad());
        if (dto.getAreaAfectada() != null) entity.setAreaAfectada(dto.getAreaAfectada());
        if (dto.getRadioInfluencia() != null) entity.setRadioInfluencia(dto.getRadioInfluencia());
        
        // Detalles del incendio
        if (dto.getFuenteIgnicion() != null) entity.setFuenteIgnicion(dto.getFuenteIgnicion());
        if (dto.getVegetacionAfectada() != null) entity.setVegetacionAfectada(dto.getVegetacionAfectada());
        if (dto.getPeligroPersonas() != null) entity.setPeligroPersonas(dto.getPeligroPersonas());
        if (dto.getPeligroInfraestructura() != null) entity.setPeligroInfraestructura(dto.getPeligroInfraestructura());
        
        // Condiciones ambientales
        if (dto.getPresenciaHumo() != null) entity.setPresenciaHumo(dto.getPresenciaHumo());
        if (dto.getVelocidadViento() != null) entity.setVelocidadViento(dto.getVelocidadViento());
        if (dto.getTemperatura() != null) entity.setTemperatura(dto.getTemperatura());
        
        // Acciones y observaciones
        if (dto.getAccionesTomadas() != null) entity.setAccionesTomadas(dto.getAccionesTomadas());
        if (dto.getObservaciones() != null) entity.setObservaciones(dto.getObservaciones());
        
        // Multimedia
        if (dto.getUrl_foto() != null) entity.setUrl_foto(dto.getUrl_foto());
        if (dto.getUrl_video() != null) entity.setUrl_video(dto.getUrl_video());
        if (dto.getFotosUrls() != null) entity.setFotosUrls(dto.getFotosUrls());
        
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
    
    /**
     * Obtiene reportes cercanos a una ubicación específica
     * @param latitud Latitud del centro de búsqueda
     * @param longitud Longitud del centro de búsqueda
     * @param distanciaKm Distancia en kilómetros
     * @return Lista de reportes cercanos
     */
    public List<ReporteDTO> obtenerReportesNearby(Double latitud, Double longitud, Double distanciaKm) {
        return reporteRepository.findReportesNearby(latitud, longitud, distanciaKm)
                .stream()
                .map(ReporteDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
