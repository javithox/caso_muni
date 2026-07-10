package com.example.backend1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String token;
    private UsuarioDTO usuario;
    private String mensaje;
}
