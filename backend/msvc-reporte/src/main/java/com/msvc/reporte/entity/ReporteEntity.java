package com.msvc.reporte.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reportes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Información básica del reporte
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    // Ubicación
    @Column(nullable = false)
    private Double latitud;
    
    @Column(nullable = false)
    private Double longitud;
    
    @Column(nullable = false)
    private String ubicacionId;
    
    private String direccion; // Desde Google Maps Reverse Geocoding
    
    private String placeMapsId; // ID de lugar de Google Maps
    
    // Estado y metadata
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoReporte estado;
    
    @Column(nullable = false)
    private String reportadoPor;
    
    private String contactoEmergencia; // Teléfono o email de contacto
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    // Severidad e impacto
    @Column(nullable = false)
    private Integer nivelSeveridad; // 1-5
    
    private Double areaAfectada; // En hectáreas
    
    private Double radioInfluencia; // En kilómetros
    
    // Detalles del incendio
    private String fuenteIgnicion; // Causa (rayo, negligencia, vandal., etc.)
    
    private String vegetacionAfectada; // Tipo (bosque, pastos, matorral, etc.)
    
    private Boolean peligroPersonas; // Existe peligro para personas
    
    private Boolean peligroInfraestructura; // Existe peligro para infraestructura
    
    // Condiciones ambientales
    private Boolean presenciaHumo; // ¿Hay humo visible?
    
    private Double velocidadViento; // En km/h
    
    private Double temperatura; // En celsius
    
    // Acciones y observaciones
    @Column(columnDefinition = "TEXT")
    private String accionesTomadas; // Respuesta inmediata
    
    @Column(columnDefinition = "TEXT")
    private String observaciones; // Notas adicionales
    
    // Multimedia
    private String url_foto; // Foto principal
    
    private String url_video; // Video principal
    
    @Column(columnDefinition = "TEXT")
    private String fotosUrls; // JSON array de URLs adicionales de fotos
    
    // Enum para estados
    public enum EstadoReporte {
        PENDIENTE, CONFIRMADO, EN_PROCESO, RESUELTO, CANCELADO
    }
}
