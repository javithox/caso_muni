# 📋 Ejemplos de Payloads JSON

## MSVC-REPORTE (8081)

### Crear Reporte
```json
POST /api/reportes
Content-Type: application/json

{
  "titulo": "Incendio Forestal - Zona A",
  "descripcion": "Se ha detectado un incendio activo en la zona de amortiguamiento del parque",
  "latitud": 13.6929,
  "longitud": -89.2182,
  "ubicacionId": "1",
  "reportadoPor": "usuario@example.com",
  "nivelSeveridad": 5,
  "url_foto": "https://example.com/photo.jpg",
  "url_video": "https://example.com/video.mp4"
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "titulo": "Incendio Forestal - Zona A",
  "descripcion": "Se ha detectado un incendio activo...",
  "latitud": 13.6929,
  "longitud": -89.2182,
  "ubicacionId": "1",
  "estado": "PENDIENTE",
  "reportadoPor": "usuario@example.com",
  "fechaCreacion": "2026-05-06T14:30:00",
  "fechaActualizacion": null,
  "url_foto": "https://example.com/photo.jpg",
  "url_video": "https://example.com/video.mp4",
  "nivelSeveridad": 5
}
```

### Actualizar Reporte
```json
PUT /api/reportes/1
Content-Type: application/json

{
  "estado": "CONFIRMADO",
  "nivelSeveridad": 4
}
```

### Obtener Reportes por Estado
```
GET /api/reportes/estado/CONFIRMADO
GET /api/reportes/estado/EN_PROCESO
GET /api/reportes/estado/RESUELTO
```

### Obtener Reportes por Severidad
```
GET /api/reportes/severidad/4    (Obtiene nivel 4 y superiores)
GET /api/reportes/severidad/5
```

---

## MSVC-LOCALIZACION (8082)

### Registrar Ubicación
```json
POST /api/ubicaciones
Content-Type: application/json

{
  "latitud": 13.6929,
  "longitud": -89.2182,
  "descripcion": "Zona forestal cercana a la comunidad",
  "zona": "Zona Norte",
  "nivelRiesgo": "ALTO",
  "registradoPor": "admin@example.com"
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "latitud": 13.6929,
  "longitud": -89.2182,
  "descripcion": "Zona forestal cercana a la comunidad",
  "zona": "Zona Norte",
  "nivelRiesgo": "ALTO",
  "fechaRegistro": "2026-05-06T14:30:00",
  "fechaActualizacion": null,
  "distancia": 0.0,
  "registradoPor": "admin@example.com"
}
```

### Actualizar Ubicación
```json
PUT /api/ubicaciones/1
Content-Type: application/json

{
  "nivelRiesgo": "CRITICO"
}
```

### Obtener Ubicaciones por Zona
```
GET /api/ubicaciones/zona/Zona%20Norte
GET /api/ubicaciones/zona/Zona%20Sur
```

### Obtener Ubicaciones por Nivel de Riesgo
```
GET /api/ubicaciones/riesgo/BAJO
GET /api/ubicaciones/riesgo/MEDIO
GET /api/ubicaciones/riesgo/ALTO
GET /api/ubicaciones/riesgo/CRITICO
```

### Obtener Ubicaciones en Radio (5km)
```
GET /api/ubicaciones/radio?lat=13.6929&lon=-89.2182&radio=5.0
```

### Obtener Ubicaciones en Área
```
GET /api/ubicaciones/area?latMin=13.6&latMax=13.7&lonMin=-89.3&lonMax=-89.1
```

---

## MSVC-ALERTA (8083)

### Crear Alerta (Valida reportes y ubicaciones)
```json
POST /api/alertas
Content-Type: application/json

{
  "titulo": "⚠️ ALERTA: Incendio Forestal Detectado",
  "mensaje": "Se ha detectado un incendio en la Zona Norte. Evacua el área inmediatamente. Línea de emergencia: 911",
  "reporteId": 1,
  "ubicacionId": 1,
  "tipoAlerta": "INCENDIO",
  "destinatarios": [
    "admin@example.com",
    "+50376123456",
    "+50377234567"
  ]
}
```

**Respuesta (201):**
```json
{
  "id": 1,
  "titulo": "⚠️ ALERTA: Incendio Forestal Detectado",
  "mensaje": "Se ha detectado un incendio en la Zona Norte...",
  "reporteId": 1,
  "ubicacionId": 1,
  "tipoAlerta": "INCENDIO",
  "estado": "PENDIENTE",
  "fechaCreacion": "2026-05-06T14:30:00",
  "fechaEnvio": null,
  "fechaRecepcion": null,
  "destinatarios": [
    "admin@example.com",
    "+50376123456",
    "+50377234567"
  ],
  "enviada": false
}
```

### Crear Alerta de Evacuación
```json
POST /api/alertas
Content-Type: application/json

{
  "titulo": "🚨 EVACUACIÓN OBLIGATORIA",
  "mensaje": "Por favor, evacue la zona inmediatamente. Dirígase a los puntos de encuentro señalados",
  "reporteId": 1,
  "ubicacionId": 1,
  "tipoAlerta": "EVACUACION",
  "destinatarios": [
    "community@example.com",
    "alcaldia@example.com"
  ]
}
```

### Crear Alerta de Monitoreo
```json
POST /api/alertas
Content-Type: application/json

{
  "titulo": "Monitoreo: Zona de Riesgo Identificada",
  "mensaje": "La siguiente zona ha sido identificada como zona de alto riesgo. Se recomienda monitoreo constante",
  "reporteId": 1,
  "ubicacionId": 1,
  "tipoAlerta": "MONITOREO",
  "destinatarios": [
    "brigada@example.com"
  ]
}
```

### Actualizar Alerta
```json
PUT /api/alertas/1
Content-Type: application/json

{
  "estado": "ENTREGADA",
  "mensaje": "Alerta actualizada con nueva información"
}
```

### Enviar Alerta
```json
POST /api/alertas/1/enviar
```

**Respuesta:**
```json
{
  "id": 1,
  "titulo": "⚠️ ALERTA: Incendio Forestal Detectado",
  "mensaje": "Se ha detectado un incendio en la Zona Norte...",
  "reporteId": 1,
  "ubicacionId": 1,
  "tipoAlerta": "INCENDIO",
  "estado": "ENVIADA",
  "fechaCreacion": "2026-05-06T14:30:00",
  "fechaEnvio": "2026-05-06T14:31:30",
  "fechaRecepcion": null,
  "destinatarios": [...],
  "enviada": true
}
```

### Obtener Alertas por Estado
```
GET /api/alertas/estado/PENDIENTE
GET /api/alertas/estado/ENVIADA
GET /api/alertas/estado/ENTREGADA
GET /api/alertas/estado/LEIDA
GET /api/alertas/estado/FALLIDA
```

### Obtener Alertas de un Reporte
```
GET /api/alertas/reporte/1
GET /api/alertas/reporte/2
```

### Obtener Alertas Pendientes
```
GET /api/alertas/pendientes
```

---

## 🔗 Flujo Completo (Ejemplo)

### 1️⃣ Registrar Ubicación
```bash
curl -X POST http://localhost:8082/api/ubicaciones \
  -H "Content-Type: application/json" \
  -d '{
    "latitud": 13.6929,
    "longitud": -89.2182,
    "descripcion": "Zona forestal",
    "zona": "Zona A",
    "nivelRiesgo": "ALTO",
    "registradoPor": "admin"
  }'

# Respuesta: {"id": 1, ...}
```

### 2️⃣ Crear Reporte
```bash
curl -X POST http://localhost:8081/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Incendio detectado",
    "descripcion": "Incendio en zona A",
    "latitud": 13.6929,
    "longitud": -89.2182,
    "ubicacionId": "1",
    "reportadoPor": "usuario1",
    "nivelSeveridad": 4,
    "url_foto": "https://example.com/foto.jpg"
  }'

# Respuesta: {"id": 1, ...}
```

### 3️⃣ Crear Alerta (MSVC-ALERTA valida automáticamente)
```bash
curl -X POST http://localhost:8083/api/alertas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "ALERTA: Incendio Zona A",
    "mensaje": "Evacuación inmediata",
    "reporteId": 1,
    "ubicacionId": 1,
    "tipoAlerta": "INCENDIO",
    "destinatarios": ["admin@example.com", "+50376123456"]
  }'

# Respuesta: {"id": 1, ...}
# En background:
#   - Valida reporteId en MSVC-REPORTE
#   - Valida ubicacionId en MSVC-LOCALIZACION
#   - Busca ubicaciones cercanas en radio de 5km
#   - Crea la alerta
```

### 4️⃣ Enviar Alerta
```bash
curl -X POST http://localhost:8083/api/alertas/1/enviar

# Respuesta: {"id": 1, "estado": "ENVIADA", "fechaEnvio": "2026-05-06T14:31:30", ...}
```

### 5️⃣ Verificar Estado
```bash
curl http://localhost:8083/api/alertas/1

# Respuesta: {"id": 1, "estado": "ENVIADA", "enviada": true, ...}
```

---

## ⚠️ Códigos de Error

| Código | Significado |
|--------|------------|
| 200 | OK - Operación exitosa |
| 201 | CREATED - Recurso creado |
| 204 | NO CONTENT - Eliminado exitosamente |
| 400 | BAD REQUEST - Datos inválidos |
| 404 | NOT FOUND - Recurso no existe |
| 500 | INTERNAL SERVER ERROR - Error del servidor |

---

## 🧪 Pruebas con Postman

1. Importar los ejemplos anteriores en Postman
2. Cambiar variables según tu entorno
3. Ejecutar en orden: Ubicación → Reporte → Alerta

---

## 💡 Consejos

- Siempre crear Ubicación primero
- Luego crear Reporte con el ID de Ubicación
- Finalmente crear Alerta con IDs de Reporte y Ubicación
- La Alerta valida automáticamente que existan ambos
