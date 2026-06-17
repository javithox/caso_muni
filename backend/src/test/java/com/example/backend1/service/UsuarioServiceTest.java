package com.example.backend1.service;

import com.example.backend1.dto.*;
import com.example.backend1.entity.UsuarioEntity;
import com.example.backend1.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests para UsuarioService
 * Funcionalidades: Registro, Login, Perfil, Cambio de contraseña
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioService - Tests Unitarios")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioEntity usuarioMock;
    private RegisterDTO registerDTO;
    private LoginDTO loginDTO;

    @BeforeEach
    void setUp() {
        usuarioMock = UsuarioEntity.builder()
                .id(1L)
                .nombre("juanperez")
                .email("juan@example.com")
                .password(new BCryptPasswordEncoder().encode("password123"))
                .nombreCompleto("Juan Pérez")
                .rol(UsuarioEntity.RolUsuario.CIUDADANO)
                .activo(true)
                .verificado(false)
                .fechaCreacion(LocalDateTime.now())
                .build();

        registerDTO = RegisterDTO.builder()
                .nombre("juanperez")
                .email("juan@example.com")
                .password("password123")
                .nombreCompleto("Juan Pérez")
                .build();

        loginDTO = LoginDTO.builder()
                .email("juan@example.com")
                .password("password123")
                .build();
    }

    // ===== TESTS REGISTRO =====

    @Test
    @DisplayName("registrar - debe crear usuario exitosamente")
    void testRegistrarUsuario() {
        // Arrange
        when(usuarioRepository.existsByNombre("juanperez")).thenReturn(false);
        when(usuarioRepository.existsByEmail("juan@example.com")).thenReturn(false);
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioMock);

        // Act
        AuthResponseDTO resultado = usuarioService.registrar(registerDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getMensaje()).isEqualTo("Usuario registrado exitosamente");
        assertThat(resultado.getUsuario()).isNotNull();
        assertThat(resultado.getUsuario().getNombre()).isEqualTo("juanperez");
        verify(usuarioRepository, times(1)).save(any(UsuarioEntity.class));
    }

    @Test
    @DisplayName("registrar - debe validar nombre requerido")
    void testRegistrarSinNombre() {
        // Arrange
        registerDTO.setNombre("");

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.registrar(registerDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("El nombre de usuario es requerido");
    }

    @Test
    @DisplayName("registrar - debe validar email requerido")
    void testRegistrarSinEmail() {
        // Arrange
        registerDTO.setEmail("");

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.registrar(registerDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("El email es requerido");
    }

    @Test
    @DisplayName("registrar - debe validar contraseña mínimo 6 caracteres")
    void testRegistrarContraseñaCorta() {
        // Arrange
        registerDTO.setPassword("12345");

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.registrar(registerDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("La contraseña debe tener al menos 6 caracteres");
    }

    @Test
    @DisplayName("registrar - debe rechazar si usuario existe")
    void testRegistrarUsuarioExistente() {
        // Arrange
        when(usuarioRepository.existsByNombre("juanperez")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.registrar(registerDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("El nombre de usuario ya está registrado");
    }

    @Test
    @DisplayName("registrar - debe rechazar si email existe")
    void testRegistrarEmailExistente() {
        // Arrange
        when(usuarioRepository.existsByNombre("juanperez")).thenReturn(false);
        when(usuarioRepository.existsByEmail("juan@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.registrar(registerDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("El email ya está registrado");
    }

    // ===== TESTS LOGIN =====

    @Test
    @DisplayName("login - debe autenticar usuario exitosamente")
    void testLoginExitoso() {
        // Arrange
        when(usuarioRepository.findByEmail("juan@example.com"))
                .thenReturn(Optional.of(usuarioMock));
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioMock);

        // Act
        AuthResponseDTO resultado = usuarioService.login(loginDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getMensaje()).isEqualTo("Login exitoso");
        assertThat(resultado.getUsuario().getNombre()).isEqualTo("juanperez");
        verify(usuarioRepository, times(1)).save(any(UsuarioEntity.class));
    }

    @Test
    @DisplayName("login - debe rechazar email inexistente")
    void testLoginEmailNoExistente() {
        // Arrange
        when(usuarioRepository.findByEmail("noexiste@example.com"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.login(loginDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuario o contraseña incorrectos");
    }

    @Test
    @DisplayName("login - debe rechazar contraseña incorrecta")
    void testLoginContraseñaIncorrecta() {
        // Arrange
        loginDTO.setPassword("passwordIncorrecto");
        when(usuarioRepository.findByEmail("juan@example.com"))
                .thenReturn(Optional.of(usuarioMock));

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.login(loginDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuario o contraseña incorrectos");
    }

    // ===== TESTS PERFIL =====

    @Test
    @DisplayName("obtenerPerfil - debe retornar datos de usuario")
    void testObtenerPerfil() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));

        // Act
        UsuarioDTO resultado = usuarioService.obtenerPerfil(1L);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("juanperez");
        assertThat(resultado.getEmail()).isEqualTo("juan@example.com");
    }

    @Test
    @DisplayName("obtenerPerfil - debe lanzar excepción si usuario no existe")
    void testObtenerPerfilNoExistente() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.obtenerPerfil(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuario no encontrado");
    }

    @Test
    @DisplayName("actualizarPerfil - debe actualizar datos de usuario")
    void testActualizarPerfil() {
        // Arrange
        UsuarioDTO actualizacion = UsuarioDTO.builder()
                .nombreCompleto("Juan Carlos Pérez")
                .telefono("3101234567")
                .ciudad("Cali")
                .build();

        UsuarioEntity usuarioActualizado = usuarioMock.toBuilder()
                .nombreCompleto("Juan Carlos Pérez")
                .telefono("3101234567")
                .ciudad("Cali")
                .build();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioActualizado);

        // Act
        UsuarioDTO resultado = usuarioService.actualizarPerfil(1L, actualizacion);

        // Assert
        assertThat(resultado.getNombreCompleto()).isEqualTo("Juan Carlos Pérez");
        assertThat(resultado.getTelefono()).isEqualTo("3101234567");
        assertThat(resultado.getCiudad()).isEqualTo("Cali");
    }

    @Test
    @DisplayName("actualizarPerfil - debe lanzar excepción si usuario no existe")
    void testActualizarPerfilNoExistente() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.actualizarPerfil(999L, new UsuarioDTO()))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuario no encontrado");
    }

    // ===== TESTS CAMBIO DE CONTRASEÑA =====

    @Test
    @DisplayName("cambiarContrasena - debe cambiar contraseña exitosamente")
    void testCambiarContrasena() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));
        when(usuarioRepository.save(any(UsuarioEntity.class))).thenReturn(usuarioMock);

        // Act
        usuarioService.cambiarContrasena(1L, "password123", "newPassword123");

        // Assert
        verify(usuarioRepository, times(1)).save(any(UsuarioEntity.class));
    }

    @Test
    @DisplayName("cambiarContrasena - debe rechazar contraseña actual incorrecta")
    void testCambiarContrasenaIncorrecta() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioMock));

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.cambiarContrasena(1L, "passwordIncorrecto", "newPassword123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Contraseña actual incorrecta");
    }

    @Test
    @DisplayName("cambiarContrasena - debe lanzar excepción si usuario no existe")
    void testCambiarContrasenaUsuarioNoExiste() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> usuarioService.cambiarContrasena(999L, "password123", "newPassword123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuario no encontrado");
    }
}
