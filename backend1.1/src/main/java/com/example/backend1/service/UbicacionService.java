package com.msvc.localizacion.service;

import com.msvc.localizacion.dto.UbicacionDTO;
import com.msvc.localizacion.entity.UbicacionEntity;
import com.msvc.localizacion.repository.UbicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UbicacionService {
    
    private final UbicacionRepository ubicacionRepository;
    
    public UbicacionDTO registrarUbicacion(UbicacionDTO dto) {
        UbicacionEntity entity = UbicacionEntity.builder()
                .latitud(dto.getLatitud())
                .longitud(dto.getLongitud())
                .descripcion(dto.getDescripcion())
                .zona(dto.getZona())
                .nivelRiesgo(UbicacionEntity.NivelRiesgo.valueOf(dto.getNivelRiesgo()))
                .fechaRegistro(LocalDateTime.now())
                .registradoPor(dto.getRegistradoPor())
                .distancia(0.0)
                .build();
        
        UbicacionEntity saved = ubicacionRepository.save(entity);
        return UbicacionDTO.fromEntity(saved);
    }
    
    public UbicacionDTO obtenerUbicacion(Long id) {
        return ubicacionRepository.findById(id)
                .map(UbicacionDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
    }
    
    public List<UbicacionDTO> listarUbicaciones() {
        return ubicacionRepository.findAll().stream()
                .map(UbicacionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public UbicacionDTO actualizarUbicacion(Long id, UbicacionDTO dto) {
        UbicacionEntity entity = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
        
        if (dto.getLatitud() != null) entity.setLatitud(dto.getLatitud());
        if (dto.getLongitud() != null) entity.setLongitud(dto.getLongitud());
        if (dto.getDescripcion() != null) entity.setDescripcion(dto.getDescripcion());
        if (dto.getNivelRiesgo() != null) entity.setNivelRiesgo(UbicacionEntity.NivelRiesgo.valueOf(dto.getNivelRiesgo()));
        
        entity.setFechaActualizacion(LocalDateTime.now());
        UbicacionEntity updated = ubicacionRepository.save(entity);
        return UbicacionDTO.fromEntity(updated);
    }
    
    public void eliminarUbicacion(Long id) {
        ubicacionRepository.deleteById(id);
    }
    
    public List<UbicacionDTO> obtenerUbicacionesPorZona(String zona) {
        return ubicacionRepository.findByZona(zona).stream()
                .map(UbicacionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<UbicacionDTO> obtenerUbicacionesPorRiesgo(String nivelRiesgo) {
        return ubicacionRepository.findByNivelRiesgo(UbicacionEntity.NivelRiesgo.valueOf(nivelRiesgo))
                .stream()
                .map(UbicacionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<UbicacionDTO> obtenerUbicacionesEnRadio(Double lat, Double lon, Double radio) {
        return ubicacionRepository.findUbicacionesEnRadio(lat, lon, radio).stream()
                .map(UbicacionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<UbicacionDTO> obtenerUbicacionesEnArea(Double latMin, Double latMax, Double lonMin, Double lonMax) {
        return ubicacionRepository.findUbicacionesEnArea(latMin, latMax, lonMin, lonMax).stream()
                .map(UbicacionDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
