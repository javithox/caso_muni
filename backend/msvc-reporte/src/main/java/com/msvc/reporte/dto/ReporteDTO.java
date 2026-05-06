package com.msvc.reporte.dto;

import com.msvc.reporte.entity.ReporteEntity;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteDTO {
    
    private Long id;
    private String titulo;
    private String descripcion;
    private Double latitud;
    private Double longitud;
    private String ubicacionId;
    private String estado;
    private String reportadoPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private String url_foto;
    private String url_video;
    private Integer nivelSeveridad;
    
    public static ReporteDTO fromEntity(ReporteEntity entity) {
        return ReporteDTO.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .descripcion(entity.getDescripcion())
                .latitud(entity.getLatitud())
                .longitud(entity.getLongitud())
                .ubicacionId(entity.getUbicacionId())
                .estado(entity.getEstado().toString())
                .reportadoPor(entity.getReportadoPor())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaActualizacion(entity.getFechaActualizacion())
                .url_foto(entity.getUrl_foto())
                .url_video(entity.getUrl_video())
                .nivelSeveridad(entity.getNivelSeveridad())
                .build();
    }
}
