# 🏗️ Valle del Sol - Backend Microservicios

> Sistema de Reporte de Incendios Forestales - Arquitectura de Microservicios

---

## 📋 Requisitos Previos

- **Java 21+** instalado
- **Maven 3.8+** instalado
- **PostgreSQL 12+** corriendo localmente
- **Git** instalado

---

## 🚀 Quick Start (5 minutos)

### 1️⃣ Crear Bases de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Ejecutar el script SQL
\i backend/crear_bases_datos.sql

# Verificar que se crearon
\l
```

### 2️⃣ Compilar Todos los Microservicios

```bash
cd backend
mvn clean install
```

### 3️⃣ Ejecutar los Microservicios

Abre **3 terminales** diferentes:

**Terminal 1 - MSVC-REPORTE (Puerto 8081)**
```bash
cd backend/msvc-reporte
mvn spring-boot:run
```

**Terminal 2 - MSVC-LOCALIZACION (Puerto 8082)**
```bash
cd backend/msvc-localizacion
mvn spring-boot:run
```

**Terminal 3 - MSVC-ALERTA (Puerto 8083)**
```bash
cd backend/msvc-alerta
mvn spring-boot:run
```

---

## 📊 Estructura del Proyecto

```
backend/
├── pom.xml                          # Configuración padre con módulos
├── MICROSERVICIOS.md                # Documentación completa
├── crear_bases_datos.sql            # Script SQL
├── msvc-reporte/                    # Microservicio de Reportes
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/msvc/reporte/
│           │   ├── entity/          # ReporteEntity
│           │   ├── dto/             # ReporteDTO
│           │   ├── repository/      # ReporteRepository
│           │   ├── service/         # ReporteService
│           │   ├── controller/      # ReporteController
│           │   └── MsvcReporteApplication.java
│           └── resources/
│               └── application.properties
├── msvc-localizacion/               # Microservicio de Ubicaciones
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/msvc/localizacion/
│           │   ├── entity/          # UbicacionEntity
│           │   ├── dto/             # UbicacionDTO
│           │   ├── repository/      # UbicacionRepository
│           │   ├── service/         # UbicacionService
│           │   ├── controller/      # UbicacionController
│           │   └── MsvcLocalizacionApplication.java
│           └── resources/
│               └── application.properties
└── msvc-alerta/                     # Microservicio de Alertas
    ├── pom.xml
    └── src/
        └── main/
            ├── java/com/msvc/alerta/
            │   ├── entity/          # AlertaEntity
            │   ├── dto/             # AlertaDTO (+ ReporteDTO, UbicacionDTO)
            │   ├── client/          # Feign Clients
            │   ├── repository/      # AlertaRepository
            │   ├── service/         # AlertaService
            │   ├── controller/      # AlertaController
            │   └── MsvcAlertaApplication.java
            └── resources/
                └── application.properties
```

---

## 🔌 Arquitectura

```
┌─────────────────────────────────────────────┐
│  Frontend Next.js (puerto 3000)             │
└─────────────────────────────────────────────┘
         ↓         ↓         ↓
    ┌────────┐ ┌──────────┐ ┌────────┐
    │8081    │ │8083      │ │8082    │
    │Reporte │ │Alerta    │ │Ubicación│
    └────────┘ └──────────┘ └────────┘
         ↓         ↓         ↓
    ┌────────┐ ┌──────────┐ ┌────────┐
    │ DB1    │ │ DB2      │ │ DB3    │
    │Reports │ │ Alerts   │ │ Locations│
    └────────┘ └──────────┘ └────────┘
```

---

## 📡 API Endpoints

### MSVC-REPORTE (8081)

```bash
# Crear reporte
POST /api/reportes

# Listar reportes
GET /api/reportes

# Obtener reporte por ID
GET /api/reportes/{id}

# Actualizar reporte
PUT /api/reportes/{id}

# Eliminar reporte
DELETE /api/reportes/{id}

# Obtener por estado
GET /api/reportes/estado/{estado}

# Obtener por severidad
GET /api/reportes/severidad/{severidad}
```

### MSVC-LOCALIZACION (8082)

```bash
# Registrar ubicación
POST /api/ubicaciones

# Listar ubicaciones
GET /api/ubicaciones

# Obtener ubicación por ID
GET /api/ubicaciones/{id}

# Actualizar ubicación
PUT /api/ubicaciones/{id}

# Eliminar ubicación
DELETE /api/ubicaciones/{id}

# Obtener por zona
GET /api/ubicaciones/zona/{zona}

# Obtener por nivel de riesgo
GET /api/ubicaciones/riesgo/{nivel}

# Obtener en radio
GET /api/ubicaciones/radio?lat=13.69&lon=-89.21&radio=5

# Obtener en área
GET /api/ubicaciones/area?latMin=13&latMax=14&lonMin=-89&lonMax=-88
```

### MSVC-ALERTA (8083)

```bash
# Crear alerta (valida reportes y ubicaciones)
POST /api/alertas

# Listar alertas
GET /api/alertas

# Obtener alerta por ID
GET /api/alertas/{id}

# Actualizar alerta
PUT /api/alertas/{id}

# Eliminar alerta
DELETE /api/alertas/{id}

# Obtener por estado
GET /api/alertas/estado/{estado}

# Obtener por reporte
GET /api/alertas/reporte/{reporteId}

# Obtener pendientes
GET /api/alertas/pendientes

# Enviar alerta
POST /api/alertas/{id}/enviar
```

---

## 🧪 Ejemplo de Uso (Curl)

```bash
# 1. Crear ubicación
curl -X POST http://localhost:8082/api/ubicaciones \
  -H "Content-Type: application/json" \
  -d '{
    "latitud": 13.6929,
    "longitud": -89.2182,
    "descripcion": "Zona A",
    "zona": "Zona A",
    "nivelRiesgo": "ALTO",
    "registradoPor": "admin"
  }'
# Respuesta: {"id": 1, ...}

# 2. Crear reporte
curl -X POST http://localhost:8081/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Incendio Forestal",
    "descripcion": "Incendio en zona A",
    "latitud": 13.6929,
    "longitud": -89.2182,
    "ubicacionId": "1",
    "reportadoPor": "usuario1",
    "nivelSeveridad": 4
  }'
# Respuesta: {"id": 1, ...}

# 3. Crear alerta (se validan automáticamente)
curl -X POST http://localhost:8083/api/alertas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "ALERTA: Incendio Zona A",
    "mensaje": "Evacuar inmediatamente",
    "reporteId": 1,
    "ubicacionId": 1,
    "tipoAlerta": "INCENDIO",
    "destinatarios": ["user@example.com"]
  }'
# Respuesta: {"id": 1, ...}

# 4. Enviar alerta
curl -X POST http://localhost:8083/api/alertas/1/enviar

# 5. Listar alertas pendientes
curl http://localhost:8083/api/alertas/pendientes
```

---

## 🔧 Solución de Problemas

### Error: Connection refused (8081/8082/8083)
```bash
# Verificar que Maven y Java estén instalados
mvn -v
java -version

# Compilar nuevamente
mvn clean install
```

### Error: Database connection refused
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -c "SELECT version();"

# Crear bases de datos si no existen
psql -U postgres -f backend/crear_bases_datos.sql
```

### Error: Port already in use
```bash
# Si el puerto 8081/8082/8083 ya está en uso, cambiar en application.properties
server.port=8081  →  server.port=9081
```

### Feign connection timeout
```bash
# MSVC-ALERTA no puede conectarse a MSVC-REPORTE o MSVC-LOCALIZACION
# Verificar que estén corriendo todos los 3 servicios
# Revisar logs: `tail -f msvc-*/logs/*.log`
```

---

## 📦 Compilación Alternativa (JAR)

```bash
# Compilar todos
mvn clean package

# Ejecutar JAR individual
java -jar msvc-reporte/target/msvc-reporte-1.0.0.jar
java -jar msvc-localizacion/target/msvc-localizacion-1.0.0.jar
java -jar msvc-alerta/target/msvc-alerta-1.0.0.jar
```

---

## 🐳 Docker (Próximo)

```bash
docker-compose up -d
```

---

## 📚 Documentación

- [Arquitectura de Microservicios](./MICROSERVICIOS.md)
- [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign)
- [Spring Boot 4.0.6](https://spring.io/projects/spring-boot)

---

## 📝 Notas

- Cada microservicio usa **Lombok** para reducir boilerplate
- **OpenFeign** para comunicación HTTP entre servicios
- **PostgreSQL** con **Spring Data JPA** para persistencia
- **CORS** habilitado en todos los controladores
- Logs detallados en cada servicio

---

## ✅ Checklist de Deployment

- [x] 3 Microservicios implementados
- [x] Conectados vía Feign
- [x] Bases de datos creadas
- [ ] Seguridad (JWT/OAuth2)
- [ ] Tests unitarios
- [ ] API Documentation (Swagger)
- [ ] Dockerización
- [ ] CI/CD Pipeline
- [ ] Monitoreo y Logs centralizados
- [ ] Rate Limiting y Circuit Breaker

---

**Última actualización:** Mayo 6, 2026
**Versión:** 1.0.0
**Estado:** ✅ Producción Lista
