-- Script para crear las bases de datos de los microservicios
-- Ejecutar como superusuario en PostgreSQL

-- Crear database para MSVC-REPORTE
CREATE DATABASE incendio_reporte_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_SV.UTF-8'
    LC_CTYPE = 'es_SV.UTF-8'
    TEMPLATE = template0;

-- Crear database para MSVC-LOCALIZACION
CREATE DATABASE incendio_localizacion_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_SV.UTF-8'
    LC_CTYPE = 'es_SV.UTF-8'
    TEMPLATE = template0;

-- Crear database para MSVC-ALERTA
CREATE DATABASE incendio_alerta_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_SV.UTF-8'
    LC_CTYPE = 'es_SV.UTF-8'
    TEMPLATE = template0;

-- Dar permisos al usuario postgres (o el que uses)
GRANT ALL PRIVILEGES ON DATABASE incendio_reporte_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE incendio_localizacion_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE incendio_alerta_db TO postgres;

-- Verificar que fueron creadas
\l

-- Salida esperada:
-- incendio_alerta_db      | postgres | UTF8     | es_SV.UTF-8 | es_SV.UTF-8 |
-- incendio_localizacion_db | postgres | UTF8     | es_SV.UTF-8 | es_SV.UTF-8 |
-- incendio_reporte_db     | postgres | UTF8     | es_SV.UTF-8 | es_SV.UTF-8 |
