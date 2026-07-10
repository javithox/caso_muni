package com.example.backend1.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    
    private Long id;
    private String nombre;
    private String email;
    private String nombreCompleto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String rol;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime ultimoIngreso;
    private String foto;
    private Boolean verificado;
}
