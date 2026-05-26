package com.msvc.reporte.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeolocationResponseDTO {
    
    private Double latitud;
    private Double longitud;
    private String direccion;
    private String placeId;
    private boolean success;
    private String message;
    
}
