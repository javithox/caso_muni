package com.example.backend1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDTO {
    private String nombre;
    private String email;
    private String password;
    private String nombreCompleto;
}
