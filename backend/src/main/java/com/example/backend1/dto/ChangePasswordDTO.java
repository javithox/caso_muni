package com.example.backend1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordDTO {
    private String passwordActual;
    private String passwordNueva;
}
