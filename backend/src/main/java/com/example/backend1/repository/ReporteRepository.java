package com.example.backend1;

import com.msvc.reporte.entity.ReporteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<ReporteEntity, Long> {
    
    List<ReporteEntity> findByEstado(ReporteEntity.EstadoReporte estado);
    
    List<ReporteEntity> findByReportadoPor(String reportadoPor);
    
    @Query("SELECT r FROM ReporteEntity r WHERE r.fechaCreacion BETWEEN :inicio AND :fin")
    List<ReporteEntity> findReportesBetweenDates(@Param("inicio") LocalDateTime inicio, 
                                                  @Param("fin") LocalDateTime fin);
    
    @Query("SELECT r FROM ReporteEntity r WHERE r.nivelSeveridad >= :severidad")
    List<ReporteEntity> findReportesBySeveridad(@Param("severidad") Integer severidad);
    
    @Query("SELECT r FROM ReporteEntity r WHERE " +
           "SQRT(POW(r.latitud - :lat, 2) + POW(r.longitud - :lon, 2)) < :distancia")
    List<ReporteEntity> findReportesNearby(@Param("lat") Double lat, 
                                            @Param("lon") Double lon,
                                            @Param("distancia") Double distancia);
}
