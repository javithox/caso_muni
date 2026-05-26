-- Script para crear las bases de datos de los microservicios
-- Ejecutar como superusuario en PostgreSQL

-- Crear database para MSVC-REPORTE
CREATE DATABASE incendio_reporte_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_SV.UTF-8'
    LC_CTYPE = 'es_SV.UTF-8'
    TEMPLATE = template0;
CREATE TABLE reportes (

    id BIGSERIAL PRIMARY KEY,

    -- Información básica
    titulo VARCHAR(255) NOT NULL,

    descripcion TEXT,

    -- Ubicación
    latitud DOUBLE PRECISION NOT NULL,

    longitud DOUBLE PRECISION NOT NULL,

    ubicacion_id VARCHAR(255) NOT NULL,

    direccion VARCHAR(500),

    place_maps_id VARCHAR(255),

    -- Estado y metadata
    estado VARCHAR(50) NOT NULL,

    reportado_por VARCHAR(255) NOT NULL,

    contacto_emergencia VARCHAR(255),

    fecha_creacion TIMESTAMP NOT NULL,

    fecha_actualizacion TIMESTAMP,

    -- Severidad e impacto
    nivel_severidad INTEGER NOT NULL,

    area_afectada DOUBLE PRECISION,

    radio_influencia DOUBLE PRECISION,

    -- Detalles del incendio
    fuente_ignicion VARCHAR(255),

    vegetacion_afectada VARCHAR(255),

    peligro_personas BOOLEAN,

    peligro_infraestructura BOOLEAN,

    -- Condiciones ambientales
    presencia_humo BOOLEAN,

    velocidad_viento DOUBLE PRECISION,

    temperatura DOUBLE PRECISION,

    -- Acciones y observaciones
    acciones_tomadas TEXT,

    observaciones TEXT,

    -- Multimedia
    url_foto VARCHAR(1000),

    url_video VARCHAR(1000),

    fotos_urls TEXT
);

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
