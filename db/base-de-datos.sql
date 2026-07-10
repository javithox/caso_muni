-- Crear base de datos (si no existe)
-- CREATE DATABASE valle_del_sol;


-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    rol VARCHAR(50) NOT NULL DEFAULT 'CIUDADANO',
    activo BOOLEAN NOT NULL DEFAULT true,
    verificado BOOLEAN NOT NULL DEFAULT false,
    foto TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    ultimo_ingreso TIMESTAMP,
    CONSTRAINT chk_rol CHECK (rol IN ('CIUDADANO', 'BOMBERO', 'ADMINISTRADOR'))
);

-- Tabla de Reportes
CREATE TABLE IF NOT EXISTS reportes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    nivel_severidad INTEGER,
    estado VARCHAR(50) DEFAULT 'ABIERTO',
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP
);

-- Tabla de Ubicaciones
CREATE TABLE IF NOT EXISTS ubicaciones (
    id BIGSERIAL PRIMARY KEY,
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    descripcion VARCHAR(255),
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Alertas
CREATE TABLE IF NOT EXISTS alertas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    urgencia VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'ACTIVA',
    reporte_id BIGINT REFERENCES reportes(id),
    ubicacion_id BIGINT REFERENCES ubicaciones(id),
    usuario_id BIGINT REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP
);

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON usuarios(nombre);
CREATE INDEX IF NOT EXISTS idx_reportes_usuario ON reportes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes(estado);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_usuario ON ubicaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alertas_reporte ON alertas(reporte_id);
CREATE INDEX IF NOT EXISTS idx_alertas_ubicacion ON alertas(ubicacion_id);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
