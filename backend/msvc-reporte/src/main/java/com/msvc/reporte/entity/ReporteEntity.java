package com.msvc.reporte.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

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
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private Double latitud;
    
    @Column(nullable = false)
    private Double longitud;
    
    @Column(nullable = false)
    private String ubicacionId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoReporte estado;
    
    @Column(nullable = false)
    private String reportadoPor;
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    private String url_foto;
    
    private String url_video;
    
    @Column(nullable = false)
    private Integer nivelSeveridad;
    
    public enum EstadoReporte {
        PENDIENTE, CONFIRMADO, EN_PROCESO, RESUELTO, CANCELADO
    }
}
