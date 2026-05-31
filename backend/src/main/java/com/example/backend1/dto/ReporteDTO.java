package com.example.backend1.dto;

import com.msvc.reporte.entity.ReporteEntity;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteDTO {
    
    // Información básica
    private Long id;
    private String titulo;
    private String descripcion;
    
    // Ubicación
    private Double latitud;
    private Double longitud;
    private String ubicacionId;
    private String direccion;
    private String placeMapsId;
    
    // Estado y metadata
    private String estado;
    private String reportadoPor;
    private String contactoEmergencia;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // Severidad e impacto
    private Integer nivelSeveridad;
    private Double areaAfectada;
    private Double radioInfluencia;
    
    // Detalles del incendio
    private String fuenteIgnicion;
    private String vegetacionAfectada;
    private Boolean peligroPersonas;
    private Boolean peligroInfraestructura;
    
    // Condiciones ambientales
    private Boolean presenciaHumo;
    private Double velocidadViento;
    private Double temperatura;
    
    // Acciones y observaciones
    private String accionesTomadas;
    private String observaciones;
    
    // Multimedia
    private String url_foto;
    private String url_video;
    private String fotosUrls;
    
    public static ReporteDTO fromEntity(ReporteEntity entity) {
        return ReporteDTO.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .descripcion(entity.getDescripcion())
                .latitud(entity.getLatitud())
                .longitud(entity.getLongitud())
                .ubicacionId(entity.getUbicacionId())
                .direccion(entity.getDireccion())
                .placeMapsId(entity.getPlaceMapsId())
                .estado(entity.getEstado().toString())
                .reportadoPor(entity.getReportadoPor())
                .contactoEmergencia(entity.getContactoEmergencia())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaActualizacion(entity.getFechaActualizacion())
                .nivelSeveridad(entity.getNivelSeveridad())
                .areaAfectada(entity.getAreaAfectada())
                .radioInfluencia(entity.getRadioInfluencia())
                .fuenteIgnicion(entity.getFuenteIgnicion())
                .vegetacionAfectada(entity.getVegetacionAfectada())
                .peligroPersonas(entity.getPeligroPersonas())
                .peligroInfraestructura(entity.getPeligroInfraestructura())
                .presenciaHumo(entity.getPresenciaHumo())
                .velocidadViento(entity.getVelocidadViento())
                .temperatura(entity.getTemperatura())
                .accionesTomadas(entity.getAccionesTomadas())
                .observaciones(entity.getObservaciones())
                .url_foto(entity.getUrl_foto())
                .url_video(entity.getUrl_video())
                .fotosUrls(entity.getFotosUrls())
                .build();
    }
}
