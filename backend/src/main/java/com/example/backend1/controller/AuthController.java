package com.example.backend1.controller;

import com.example.backend1.dto.*;
import com.example.backend1.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UsuarioService usuarioService;
    
    /**
     * Registro de nuevo usuario
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegisterDTO dto) {
        try {
            AuthResponseDTO response = usuarioService.registrar(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponseDTO.builder()
                            .mensaje("Error: " + e.getMessage())
                            .build()
            );
        }
    }
    
    /**
     * Login de usuario
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            AuthResponseDTO response = usuarioService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponseDTO.builder()
                            .mensaje("Error: " + e.getMessage())
                            .build()
            );
        }
    }
    
    /**
     * Obtener perfil de usuario
     * GET /api/auth/perfil/{id}
     */
    @GetMapping("/perfil/{id}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerPerfil(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    UsuarioDTO.builder()
                            .build()
            );
        }
    }
    
    /**
     * Actualizar perfil de usuario
     * PUT /api/auth/perfil/{id}
     */
    @PutMapping("/perfil/{id}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        try {
            UsuarioDTO usuarioActualizado = usuarioService.actualizarPerfil(id, dto);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    UsuarioDTO.builder()
                            .build()
            );
        }
    }
    
    /**
     * Cambiar contraseña
     * POST /api/auth/cambiar-contrasena/{id}
     */
    @PostMapping("/cambiar-contrasena/{id}")
    public ResponseEntity<?> cambiarContrasena(@PathVariable Long id, @RequestBody ChangePasswordDTO dto) {
        try {
            usuarioService.cambiarContrasena(id, dto.getPasswordActual(), dto.getPasswordNueva());
            return ResponseEntity.ok(new MessageDTO("Contraseña actualizada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageDTO("Error: " + e.getMessage()));
        }
    }
}
