package com.msvc.alerta.dto;

import lombok.*;

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
}
