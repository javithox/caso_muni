package com.example.backend1.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String mensaje;
    
    @Column(nullable = false)
    private Long reporteId;
    
    @Column(nullable = false)
    private Long ubicacionId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoAlerta tipoAlerta;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoAlerta estado;
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaEnvio;
    
    private LocalDateTime fechaRecepcion;
    
    @ElementCollection
    private java.util.List<String> destinatarios;
    
    @Column(nullable = false)
    private Boolean enviada;
    
    public enum TipoAlerta {
        INCENDIO, EVACUACION, ZONA_PELIGROSA, MONITOREO, INFORMATIVA
    }
    
    public enum EstadoAlerta {
        PENDIENTE, ENVIADA, ENTREGADA, LEIDA, FALLIDA
    }
}
