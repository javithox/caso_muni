# 🔗 Arquitectura de Microservicios - Valle del Sol

## Descripción General

Este proyecto implementa una arquitectura de **3 microservicios desacoplados** conectados a través de **OpenFeign** para comunicación inter-microservicios. Cada uno es independiente con su propia base de datos y puerto.

---

## 📊 Estructura de Microservicios

```
┌─────────────────────────────────────────────────┐
│         API Gateway (Frontend - 3000)           │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌────────┐ ┌──────────┐ ┌────────┐
    │ Reporte│ │Alerta    │ │Ubicación│
    │8081    │ │8083      │ │8082    │
    └────────┘ └──────────┘ └────────┘
        │          │          │
        ▼          ▼          ▼
    ┌────────┐ ┌──────────┐ ┌────────┐
    │Postgres│ │Postgres  │ │Postgres│
    │Reporte │ │Alerta    │ │Ubicación│
    └────────┘ └──────────┘ └────────┘
```

---

## 🏗️ Microservicios

### 1️⃣ **MSVC-REPORTE** (Puerto 8081)
**Responsabilidad:** Gestión de reportes de incendios forestales

**Base de datos:** `incendio_reporte_db`

**Entidades:**
- `ReporteEntity` - Reportes de incendios con geolocalización

**Endpoints:**
```
POST   /api/reportes                    - Crear reporte
GET    /api/reportes                    - Listar todos
GET    /api/reportes/{id}               - Obtener uno
PUT    /api/reportes/{id}               - Actualizar
DELETE /api/reportes/{id}               - Eliminar
GET    /api/reportes/estado/{estado}    - Por estado
GET    /api/reportes/severidad/{nivel}  - Por severidad
```

**Atributos principales:**
- ID, Título, Descripción
- Latitud, Longitud (Geolocalización)
- Estado: PENDIENTE, CONFIRMADO, EN_PROCESO, RESUELTO, CANCELADO
- Nivel de Severidad (1-5)
- URL de foto/video
- Fecha de creación/actualización

---

### 2️⃣ **MSVC-LOCALIZACION** (Puerto 8082)
**Responsabilidad:** Gestión de ubicaciones y geolocalización

**Base de datos:** `incendio_localizacion_db`

**Entidades:**
- `UbicacionEntity` - Ubicaciones con nivel de riesgo

**Endpoints:**
```
POST   /api/ubicaciones                 - Registrar ubicación
GET    /api/ubicaciones                 - Listar todas
GET    /api/ubicaciones/{id}            - Obtener una
PUT    /api/ubicaciones/{id}            - Actualizar
DELETE /api/ubicaciones/{id}            - Eliminar
GET    /api/ubicaciones/zona/{zona}     - Por zona
GET    /api/ubicaciones/riesgo/{nivel}  - Por nivel de riesgo
GET    /api/ubicaciones/radio?lat&lon&radio  - En radio
GET    /api/ubicaciones/area?latMin&latMax&lonMin&lonMax - En área
```

**Atributos principales:**
- ID, Latitud, Longitud
- Descripción, Zona
- Nivel de Riesgo: BAJO, MEDIO, ALTO, CRÍTICO
- Distancia desde un punto
- Registrado por (usuario)

---

### 3️⃣ **MSVC-ALERTA** (Puerto 8083)
**Responsabilidad:** Gestión de alertas y notificaciones comunitarias

**Base de datos:** `incendio_alerta_db`

**Entidades:**
- `AlertaEntity` - Alertas con referencia a reportes y ubicaciones

**Endpoints:**
```
POST   /api/alertas                     - Crear alerta
GET    /api/alertas                     - Listar todas
GET    /api/alertas/{id}                - Obtener una
PUT    /api/alertas/{id}                - Actualizar
DELETE /api/alertas/{id}                - Eliminar
GET    /api/alertas/estado/{estado}     - Por estado
GET    /api/alertas/reporte/{reporteId} - De un reporte
GET    /api/alertas/pendientes          - Pendientes
POST   /api/alertas/{id}/enviar         - Enviar alerta
```

**Atributos principales:**
- ID, Título, Mensaje
- ReporteId (vinculado a msvc-reporte)
- UbicacionId (vinculado a msvc-localizacion)
- Tipo: INCENDIO, EVACUACION, ZONA_PELIGROSA, MONITOREO, INFORMATIVA
- Estado: PENDIENTE, ENVIADA, ENTREGADA, LEIDA, FALLIDA
- Destinatarios (lista)

**Clientes Feign:**
- `ReporteClient` → Consume `/api/reportes/{id}` de MSVC-REPORTE
- `UbicacionClient` → Consume `/api/ubicaciones/{id}` y `/api/ubicaciones/radio` de MSVC-LOCALIZACION

---

## 🔌 Comunicación Inter-Microservicios

### MSVC-ALERTA se conecta a:

#### 1. **ReporteClient** (HTTP → MSVC-REPORTE:8081)
```java
@FeignClient(name = "msvc-reporte", url = "http://localhost:8081")
public interface ReporteClient {
    @GetMapping("/api/reportes/{id}")
    ReporteDTO obtenerReporte(@PathVariable Long id);
}
```

#### 2. **UbicacionClient** (HTTP → MSVC-LOCALIZACION:8082)
```java
@FeignClient(name = "msvc-localizacion", url = "http://localhost:8082")
public interface UbicacionClient {
    @GetMapping("/api/ubicaciones/{id}")
    UbicacionDTO obtenerUbicacion(@PathVariable Long id);
    
    @GetMapping("/api/ubicaciones/radio")
    List<UbicacionDTO> obtenerUbicacionesEnRadio(...);
}
```

### Flujo de creación de alerta:
1. Frontend/API envía: `POST /api/alertas` con `reporteId` y `ubicacionId`
2. MSVC-ALERTA valida llamando a MSVC-REPORTE: `GET /api/reportes/{id}`
3. MSVC-ALERTA valida llamando a MSVC-LOCALIZACION: `GET /api/ubicaciones/{id}`
4. Si ambas validaciones pasan, se crea la alerta
5. MSVC-ALERTA busca ubicaciones cercanas: `GET /api/ubicaciones/radio`
6. Alerta se almacena en su BD y se retorna al cliente

---

## 🗄️ Bases de Datos

Cada microservicio tiene su propia base de datos PostgreSQL:

| Microservicio | Base de Datos | Puerto | Tabla Principal |
|---|---|---|---|
| MSVC-REPORTE | incendio_reporte_db | 5432 | reportes |
| MSVC-LOCALIZACION | incendio_localizacion_db | 5432 | ubicaciones |
| MSVC-ALERTA | incendio_alerta_db | 5432 | alertas |

### Crear las bases de datos:
```sql
CREATE DATABASE incendio_reporte_db;
CREATE DATABASE incendio_localizacion_db;
CREATE DATABASE incendio_alerta_db;
```

---

## 🚀 Compilación y Ejecución

### Opción 1: Compilar desde la raíz (backend/)

```bash
cd backend
mvn clean install

# Esto compilará automáticamente los 3 microservicios
# ya que están definidos en el pom padre
```

### Opción 2: Compilar individuales

```bash
# Compilar MSVC-REPORTE
cd backend/msvc-reporte
mvn clean package
java -jar target/msvc-reporte-1.0.0.jar

# En otra terminal, compilar MSVC-LOCALIZACION
cd backend/msvc-localizacion
mvn clean package
java -jar target/msvc-localizacion-1.0.0.jar

# En otra terminal, compilar MSVC-ALERTA
cd backend/msvc-alerta
mvn clean package
java -jar target/msvc-alerta-1.0.0.jar
```

### Opción 3: Ejecutar con Maven Spring Boot Plugin

```bash
# Terminal 1
cd backend/msvc-reporte
mvn spring-boot:run

# Terminal 2
cd backend/msvc-localizacion
mvn spring-boot:run

# Terminal 3
cd backend/msvc-alerta
mvn spring-boot:run
```

---

## 📝 Archivo pom.xml Padre

El archivo `backend/pom.xml` gestiona la estructura de módulos:

```xml
<groupId>com.msvc</groupId>
<artifactId>backend-parent</artifactId>
<version>1.0.0</version>
<packaging>pom</packaging>

<modules>
    <module>msvc-reporte</module>
    <module>msvc-localizacion</module>
    <module>msvc-alerta</module>
</modules>

<dependencyManagement>
    <!-- Spring Boot 4.0.6 -->
    <!-- Spring Cloud 2024.0.0 para Feign -->
    <!-- PostgreSQL Driver -->
</dependencyManagement>
```

Cada hijo tiene su pom.xml con:
```xml
<parent>
    <groupId>com.msvc</groupId>
    <artifactId>backend-parent</artifactId>
    <version>1.0.0</version>
    <relativePath>../</relativePath>
</parent>

<groupId>com.msvc.reporte</groupId>
<artifactId>msvc-reporte</artifactId>
<version>1.0.0</version>
```

---

## 🧪 Pruebas con Curl

### 1. Crear Ubicación
```bash
curl -X POST http://localhost:8082/api/ubicaciones \
  -H "Content-Type: application/json" \
  -d '{
    "latitud": 13.6929,
    "longitud": -89.2182,
    "descripcion": "Zona A - Sector 1",
    "zona": "Zona A",
    "nivelRiesgo": "ALTO",
    "registradoPor": "admin"
  }'
```

### 2. Crear Reporte
```bash
curl -X POST http://localhost:8081/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Incendio Forestal",
    "descripcion": "Incendio detectado en zona A",
    "latitud": 13.6929,
    "longitud": -89.2182,
    "ubicacionId": "1",
    "reportadoPor": "usuario1",
    "nivelSeveridad": 4
  }'
```

### 3. Crear Alerta (ejecuta validaciones en otros servicios)
```bash
curl -X POST http://localhost:8083/api/alertas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "ALERTA: Incendio en Zona A",
    "mensaje": "Se ha detectado un incendio en la zona A. Evacuen inmediatamente",
    "reporteId": 1,
    "ubicacionId": 1,
    "tipoAlerta": "INCENDIO",
    "destinatarios": ["admin@example.com", "+50376123456"]
  }'
```

### 4. Listar Alertas Pendientes
```bash
curl http://localhost:8083/api/alertas/pendientes
```

### 5. Enviar Alerta
```bash
curl -X POST http://localhost:8083/api/alertas/1/enviar
```

---

## 🔧 Configuración de Puertos

| Servicio | Puerto | Base de Datos |
|---|---|---|
| MSVC-REPORTE | 8081 | incendio_reporte_db |
| MSVC-LOCALIZACION | 8082 | incendio_localizacion_db |
| MSVC-ALERTA | 8083 | incendio_alerta_db |
| Frontend (Next.js) | 3000 | (integración próxima) |

---

## 📦 Dependencias Compartidas

Definidas en `backend/pom.xml`:

- **Spring Boot:** 4.0.6
- **Spring Cloud:** 2024.0.0 (con OpenFeign)
- **PostgreSQL:** Latest
- **Lombok:** Latest
- **Jakarta Persistence:** Latest (JPA)
- **Spring Validation:** Latest

---

## 🔐 Consideraciones de Seguridad

- [ ] Implementar JWT o OAuth2
- [ ] Agregar CORS configurado
- [ ] Validar entrada en todos los endpoints
- [ ] Implementar rate limiting
- [ ] Agregar logs de auditoría
- [ ] Implementar circuit breaker (Resilience4j)
- [ ] Agregar métricas con Micrometer
- [ ] Documentar API con Swagger/OpenAPI

---

## 📚 Próximos Pasos

1. ✅ Crear y conectar 3 microservicios
2. ⬜ Integrar con Frontend Next.js (my-msvc-valle-del-sol)
3. ⬜ Implementar autenticación JWT
4. ⬜ Agregar notificaciones en tiempo real (WebSocket)
5. ⬜ Implementar búsqueda avanzada con Elasticsearch
6. ⬜ Agregar cache con Redis
7. ⬜ Dockerizar los servicios
8. ⬜ Desplegar en producción (Kubernetes/AWS)

---

## 📧 Contacto y Soporte

Para preguntas sobre la arquitectura de microservicios, consulta:
- Documentación de OpenFeign: https://cloud.spring.io/spring-cloud-openfeign/
- Spring Cloud Reference: https://spring.io/projects/spring-cloud
