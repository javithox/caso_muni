package com.example.backend1.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeolocationResponseDTO {
    private boolean success;
    private String message;
    private String direccion;
    private Double latitud;
    private Double longitud;
    private String placeId;
}
