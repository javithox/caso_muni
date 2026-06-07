package com.msvc.localizacion.repository;

import com.example.backend1.entity.UbicacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbicacionRepository extends JpaRepository<UbicacionEntity, Long> {
    
    List<UbicacionEntity> findByZona(String zona);
    
    List<UbicacionEntity> findByNivelRiesgo(UbicacionEntity.NivelRiesgo nivel);
    
    List<UbicacionEntity> findByRegistradoPor(String registradoPor);
    
    @Query("SELECT u FROM UbicacionEntity u WHERE " +
           "SQRT(POW(u.latitud - :lat, 2) + POW(u.longitud - :lon, 2)) < :radio")
    List<UbicacionEntity> findUbicacionesEnRadio(@Param("lat") Double lat, 
                                                   @Param("lon") Double lon,
                                                   @Param("radio") Double radio);
    
    @Query("SELECT u FROM UbicacionEntity u WHERE u.latitud BETWEEN :latMin AND :latMax " +
           "AND u.longitud BETWEEN :lonMin AND :lonMax")
    List<UbicacionEntity> findUbicacionesEnArea(@Param("latMin") Double latMin,
                                                 @Param("latMax") Double latMax,
                                                 @Param("lonMin") Double lonMin,
                                                 @Param("lonMax") Double lonMax);
}
