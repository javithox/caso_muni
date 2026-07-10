package com.example.backend1.dto;
import com.example.backend1.entity.UbicacionEntity;
import lombok.*;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionDTO {
    private Long id;
    private Double latitud;
    private Double longitud;
    private String descripcion;
    private String zona;
    private String nivelRiesgo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaActualizacion;
    private Double distancia;
    private String registradoPor;
    public static UbicacionDTO fromEntity(UbicacionEntity entity) {
        return UbicacionDTO.builder()
                .id(entity.getId())
                .latitud(entity.getLatitud())
                .longitud(entity.getLongitud())
                .descripcion(entity.getDescripcion())
                .zona(entity.getZona())
                .nivelRiesgo(entity.getNivelRiesgo().toString())
                .fechaRegistro(entity.getFechaRegistro())
                .fechaActualizacion(entity.getFechaActualizacion())
                .distancia(entity.getDistancia())
                .registradoPor(entity.getRegistradoPor())
                .build();
    }
}
