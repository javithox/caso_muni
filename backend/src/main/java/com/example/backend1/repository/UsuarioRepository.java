package com.example.backend1.repository;

import com.example.backend1.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    
    Optional<UsuarioEntity> findByEmail(String email);
    
    Optional<UsuarioEntity> findByNombre(String nombre);
    
    Optional<UsuarioEntity> findByNombreOrEmail(String nombre, String email);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByNombre(String nombre);
}
