package com.msvc.localizacion.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ubicaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double latitud;
    
    @Column(nullable = false)
    private Double longitud;
    
    @Column(nullable = false)
    private String descripcion;
    
    @Column(nullable = false)
    private String zona;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NivelRiesgo nivelRiesgo;
    
    @Column(nullable = false)
    private LocalDateTime fechaRegistro;
    
    private LocalDateTime fechaActualizacion;
    
    @Column(columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double distancia;
    
    @Column(nullable = false)
    private String registradoPor;
    
    public enum NivelRiesgo {
        BAJO, MEDIO, ALTO, CRITICO
    }
}
