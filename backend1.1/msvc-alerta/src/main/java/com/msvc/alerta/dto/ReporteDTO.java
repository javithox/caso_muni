package com.msvc.alerta.dto;

import lombok.*;

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
    private String estado;
    private Integer nivelSeveridad;
}
