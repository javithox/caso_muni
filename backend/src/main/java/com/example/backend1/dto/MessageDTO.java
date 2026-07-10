package com.example.backend1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private String message;
    
    public MessageDTO(String message) {
        this.message = message;
    }
}
