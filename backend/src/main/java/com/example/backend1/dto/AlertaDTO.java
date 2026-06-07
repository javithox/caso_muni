package com.example.backend1.dto;

import com.example.backend1.entity.AlertaEntity;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaDTO {
    
    private Long id;
    private String titulo;
    private String mensaje;
    private Long reporteId;
    private Long ubicacionId;
    private String tipoAlerta;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaRecepcion;
    private List<String> destinatarios;
    private Boolean enviada;
    
    public static AlertaDTO fromEntity(AlertaEntity entity) {
        return AlertaDTO.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .mensaje(entity.getMensaje())
                .reporteId(entity.getReporteId())
                .ubicacionId(entity.getUbicacionId())
                .tipoAlerta(entity.getTipoAlerta().toString())
                .estado(entity.getEstado().toString())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaEnvio(entity.getFechaEnvio())
                .fechaRecepcion(entity.getFechaRecepcion())
                .destinatarios(entity.getDestinatarios())
                .enviada(entity.getEnviada())
                .build();
    }
}
