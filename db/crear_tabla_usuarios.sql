-- Script para crear la tabla de usuarios
-- Ejecutar en PostgreSQL

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS valle_del_sol;

-- Conectar a la base de datos
\c valle_del_sol;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON usuarios(nombre);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Crear tabla de auditoría (opcional pero recomendado)
CREATE TABLE IF NOT EXISTS usuarios_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(50) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

COMMIT;
