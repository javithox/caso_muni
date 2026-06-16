package com.example.backend1.service;

import com.example.backend1.entity.UsuarioEntity;
import com.example.backend1.dto.*;
import com.example.backend1.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Registrar nuevo usuario
     */
    public AuthResponseDTO registrar(RegisterDTO dto) {
        // Validar campos obligatorios
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de usuario es requerido");
        }
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El email es requerido");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es requerida");
        }
        if (dto.getPassword().length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }
        
        // Validar que el usuario y email no existan
        if (usuarioRepository.existsByNombre(dto.getNombre().trim())) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }
        
        if (usuarioRepository.existsByEmail(dto.getEmail().trim())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Crear nuevo usuario
        String nombreCompleto = (dto.getNombreCompleto() != null && !dto.getNombreCompleto().trim().isEmpty()) 
                ? dto.getNombreCompleto() 
                : dto.getNombre();
        
        UsuarioEntity usuario = UsuarioEntity.builder()
                .nombre(dto.getNombre().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nombreCompleto(nombreCompleto)
                .rol(UsuarioEntity.RolUsuario.CIUDADANO)
                .activo(true)
                .verificado(false)
                .fechaCreacion(LocalDateTime.now())
                .build();
        
        try {
            usuario = usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el usuario en la base de datos: " + e.getMessage());
        }
        
        return AuthResponseDTO.builder()
                .token("token-" + usuario.getId())
                .usuario(convertToDTO(usuario))
                .mensaje("Usuario registrado exitosamente")
                .build();
    }
    
    /**
     * Login de usuario
     */
    public AuthResponseDTO login(LoginDTO dto) {
        // Buscar usuario por email
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }
        
        UsuarioEntity usuario = usuarioOpt.get();
        
        // Validar contraseña
        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }
        
        // Actualizar último ingreso
        usuario.setUltimoIngreso(LocalDateTime.now());
        usuarioRepository.save(usuario);
        
        return AuthResponseDTO.builder()
                .token("token-" + usuario.getId())
                .usuario(convertToDTO(usuario))
                .mensaje("Login exitoso")
                .build();
    }
    
    /**
     * Obtener perfil de usuario por ID
     */
    public UsuarioDTO obtenerPerfil(Long id) {
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        return convertToDTO(usuarioOpt.get());
    }
    
    /**
     * Actualizar perfil de usuario
     */
    public UsuarioDTO actualizarPerfil(Long id, UsuarioDTO dto) {
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        UsuarioEntity usuario = usuarioOpt.get();
        
        // Actualizar campos permitidos
        if (dto.getNombreCompleto() != null) {
            usuario.setNombreCompleto(dto.getNombreCompleto());
        }
        if (dto.getTelefono() != null) {
            usuario.setTelefono(dto.getTelefono());
        }
        if (dto.getDireccion() != null) {
            usuario.setDireccion(dto.getDireccion());
        }
        if (dto.getCiudad() != null) {
            usuario.setCiudad(dto.getCiudad());
        }
        if (dto.getFoto() != null) {
            usuario.setFoto(dto.getFoto());
        }
        
        usuario.setFechaActualizacion(LocalDateTime.now());
        usuario = usuarioRepository.save(usuario);
        
        return convertToDTO(usuario);
    }
    
    /**
     * Cambiar contraseña
     */
    public void cambiarContrasena(Long id, String passwordActual, String passwordNueva) {
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        UsuarioEntity usuario = usuarioOpt.get();
        
        // Validar contraseña actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        
        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuario.setFechaActualizacion(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }
    
    /**
     * Convertir entidad a DTO (sin mostrar la contraseña)
     */
    private UsuarioDTO convertToDTO(UsuarioEntity usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .nombreCompleto(usuario.getNombreCompleto())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .ciudad(usuario.getCiudad())
                .rol(usuario.getRol() != null ? usuario.getRol().toString() : "CIUDADANO")
                .activo(usuario.getActivo())
                .fechaCreacion(usuario.getFechaCreacion())
                .fechaActualizacion(usuario.getFechaActualizacion())
                .ultimoIngreso(usuario.getUltimoIngreso())
                .foto(usuario.getFoto())
                .verificado(usuario.getVerificado())
                .build();
    }
}
