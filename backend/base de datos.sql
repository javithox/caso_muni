CREATE TABLE reportes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descripcion TEXT,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    nivel_severidad INTEGER,
    estado VARCHAR(50)
);