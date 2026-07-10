package com.example.backend1.service;
import com.example.backend1.dto.GeolocationResponseDTO;
import org.springframework.stereotype.Service;
@Service
public class GoogleMapsService {
    public GeolocationResponseDTO geocodeAddress(String direccion) {
        return GeolocationResponseDTO.builder()
                .success(true)
                .direccion(direccion)
                .latitud(0.0)
                .longitud(0.0)
                .build();
    }
    public GeolocationResponseDTO reverseGeocode(Double latitud, Double longitud) {
        return GeolocationResponseDTO.builder()
                .success(true)
                .direccion("Dirección simulada")
                .latitud(latitud)
                .longitud(longitud)
                .build();
    }
    public boolean validateAddress(String address) {
        return true;
    }
}
