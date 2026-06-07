package com.example.backend1.repository;

import com.msvc.alerta.entity.AlertaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<AlertaEntity, Long> {
    
    List<AlertaEntity> findByEstado(AlertaEntity.EstadoAlerta estado);
    
    List<AlertaEntity> findByReporteId(Long reporteId);
    
    List<AlertaEntity> findByTipoAlerta(AlertaEntity.TipoAlerta tipo);
    
    @Query("SELECT a FROM AlertaEntity a WHERE a.fechaCreacion BETWEEN :inicio AND :fin")
    List<AlertaEntity> findAlertas_Between(@Param("inicio") LocalDateTime inicio,
                                           @Param("fin") LocalDateTime fin);
    
    List<AlertaEntity> findByEnviada(Boolean enviada);
}
