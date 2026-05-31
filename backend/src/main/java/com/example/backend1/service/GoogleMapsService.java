package com.example.backend1;

import com.msvc.reporte.dto.GeolocationResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleMapsService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;
    
    @Value("${google.maps.api.key:}")
    private String apiKeyFallback;
    
    private static final String GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    
    /**
     * Realiza geocoding: convierte una dirección en coordenadas (latitud, longitud)
     * @param direccion La dirección a geocodificar
     * @return Respuesta con coordenadas
     */
    public GeolocationResponseDTO geocodeAddress(String direccion) {
        try {
            String apiKey = getApiKey();
            
            String url = UriComponentsBuilder.fromHttpUrl(GEOCODING_URL)
                    .queryParam("address", direccion)
                    .queryParam("key", apiKey)
                    .toUriString();
            
            log.info("Geocoding address: {}", direccion);
            
            GeomapResponse response = restTemplate.getForObject(url, GeomapResponse.class);
            
            if (response != null && "OK".equals(response.status) && !response.results.isEmpty()) {
                GeocodeResult result = response.results.get(0);
                GeolocationResponseDTO dto = new GeolocationResponseDTO();
                dto.setLatitud(result.geometry.location.lat);
                dto.setLongitud(result.geometry.location.lng);
                dto.setDireccion(result.formatted_address);
                dto.setPlaceId(result.place_id);
                dto.setSuccess(true);
                dto.setMessage("Geocoding exitoso");
                
                log.info("Geocoding successful: {} -> ({}, {})", 
                        direccion, dto.getLatitud(), dto.getLongitud());
                
                return dto;
            } else {
                log.warn("Geocoding failed for address: {}", direccion);
                return createErrorResponse("No se pudo geocodificar la dirección");
            }
        } catch (Exception e) {
            log.error("Error en geocoding: {}", e.getMessage(), e);
            return createErrorResponse("Error en geocoding: " + e.getMessage());
        }
    }
    
    /**
     * Realiza reverse geocoding: convierte coordenadas en una dirección
     * @param latitud Latitud
     * @param longitud Longitud
     * @return Respuesta con dirección
     */
    public GeolocationResponseDTO reverseGeocode(Double latitud, Double longitud) {
        try {
            String apiKey = getApiKey();
            
            String url = UriComponentsBuilder.fromHttpUrl(GEOCODING_URL)
                    .queryParam("latlng", latitud + "," + longitud)
                    .queryParam("key", apiKey)
                    .toUriString();
            
            log.info("Reverse geocoding coordinates: {}, {}", latitud, longitud);
            
            GeomapResponse response = restTemplate.getForObject(url, GeomapResponse.class);
            
            if (response != null && "OK".equals(response.status) && !response.results.isEmpty()) {
                GeocodeResult result = response.results.get(0);
                GeolocationResponseDTO dto = new GeolocationResponseDTO();
                dto.setLatitud(latitud);
                dto.setLongitud(longitud);
                dto.setDireccion(result.formatted_address);
                dto.setPlaceId(result.place_id);
                dto.setSuccess(true);
                dto.setMessage("Reverse geocoding exitoso");
                
                log.info("Reverse geocoding successful: ({}, {}) -> {}", 
                        latitud, longitud, dto.getDireccion());
                
                return dto;
            } else {
                log.warn("Reverse geocoding failed for coordinates: {}, {}", latitud, longitud);
                return createErrorResponse("No se pudo obtener la dirección para las coordenadas");
            }
        } catch (Exception e) {
            log.error("Error en reverse geocoding: {}", e.getMessage(), e);
            return createErrorResponse("Error en reverse geocoding: " + e.getMessage());
        }
    }
    
    /**
     * Valida que una dirección sea válida
     * @param direccion Dirección a validar
     * @return true si la dirección es válida
     */
    public boolean validateAddress(String direccion) {
        GeolocationResponseDTO response = geocodeAddress(direccion);
        return response.isSuccess();
    }
    
    /**
     * Obtiene el API key, con fallback si es necesario
     * @return API key de Google Maps
     */
    private String getApiKey() {
        if (googleMapsApiKey != null && !googleMapsApiKey.isEmpty()) {
            return googleMapsApiKey;
        }
        if (apiKeyFallback != null && !apiKeyFallback.isEmpty()) {
            return apiKeyFallback;
        }
        throw new RuntimeException("Google Maps API key no configurada");
    }
    
    private GeolocationResponseDTO createErrorResponse(String message) {
        GeolocationResponseDTO dto = new GeolocationResponseDTO();
        dto.setSuccess(false);
        dto.setMessage(message);
        return dto;
    }
    
    // DTOs internos para mapear respuesta de Google Maps
    static class GeomapResponse {
        public java.util.List<GeocodeResult> results;
        public String status;
    }
    
    static class GeocodeResult {
        public String formatted_address;
        public String place_id;
        public Geometry geometry;
    }
    
    static class Geometry {
        public Location location;
    }
    
    static class Location {
        public Double lat;
        public Double lng;
    }
}
