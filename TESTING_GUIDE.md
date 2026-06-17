# 🧪 Guía Completa de Testing - Valle del Sol

## Estructura de Tests

### Frontend (Next.js + React)
```
my-msvc-valle-del-sol/
├── jest.config.js           # Configuración de Jest
├── jest.setup.js            # Setup de Testing Library
├── utils/
│   └── __tests__/
│       └── reporteApi.test.ts    # Tests para API de reportes
└── app/components/
    └── __tests__/
        └── (próximos tests)
```

### Backend (Spring Boot)
```
backend/
├── src/test/java/
│   └── com/example/backend1/
│       ├── service/
│       │   ├── ReporteServiceTest.java      # Tests para servicio de reportes
│       │   └── UsuarioServiceTest.java      # Tests para autenticación
│       └── controller/
│           └── ReporteControllerTest.java   # Tests REST API
```

---

## 🚀 Ejecutar Tests

### Frontend - Jest

**Instalar dependencias** (si no lo hiciste):
```bash
cd my-msvc-valle-del-sol
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest jest-environment-jsdom ts-jest axios-mock-adapter
```

**Ejecutar todos los tests:**
```bash
npm test
```

**Ejecutar un archivo de test específico:**
```bash
npm test -- utils/__tests__/reporteApi.test.ts
```

**Ejecutar con coverage:**
```bash
npm test -- --coverage
```

**Watch mode (reinicia automáticamente):**
```bash
npm test -- --watch
```

### Backend - Maven

**Ejecutar todos los tests:**
```bash
cd backend
mvn test
```

**Ejecutar clase de test específica:**
```bash
mvn test -Dtest=ReporteServiceTest
```

**Ejecutar método de test específico:**
```bash
mvn test -Dtest=ReporteServiceTest#testCrearReporte
```

**Con coverage (Jacoco):**
```bash
mvn clean test jacoco:report
# Ver reporte en: target/site/jacoco/index.html
```

**Solo compilar sin ejecutar:**
```bash
mvn clean test -DskipTests
```

---

## 📋 Tests Implementados

### Frontend Tests

#### `reporteApi.test.ts` - 22 Tests
Cubre todas las funcionalidades de la API de reportes:

**CRUD Operations** (6 tests)
- ✅ Crear reporte exitosamente
- ✅ Manejo de errores en creación
- ✅ Obtener reporte por ID
- ✅ Error si reporte no existe
- ✅ Listar todos los reportes
- ✅ Lista vacía

**Search by Filters** (2 tests)
- ✅ Filtrar por estado
- ✅ Filtrar por severidad

**Geolocation** (6 tests)
- ✅ Geocoding: Dirección → Coordenadas
- ✅ Error en geocoding
- ✅ Reverse Geocoding: Coordenadas → Dirección
- ✅ Validar dirección
- ✅ Validar dirección inválida
- ✅ Error en validación

**Nearby Reports** (3 tests)
- ✅ Obtener reportes en radio
- ✅ Usar distancia por defecto
- ✅ Lista vacía

---

### Backend Tests

#### `ReporteServiceTest.java` - 18 Tests
Tests unitarios para la lógica de reportes:

**CRUD** (6 tests)
- ✅ Crear reporte
- ✅ Obtener dirección con reverse geocoding
- ✅ Obtener reporte por ID
- ✅ Error si reporte no existe
- ✅ Listar reportes
- ✅ Listar vacío

**Search** (3 tests)
- ✅ Filtrar por estado
- ✅ Filtrar por severidad
- ✅ Reportes nearby

**Geolocation** (2 tests)
- ✅ Obtener reportes cercanos
- ✅ Lista vacía si no hay cercanos

**Validation** (7 tests)
- ✅ Validaciones de datos
- ✅ Manejo de excepciones

#### `UsuarioServiceTest.java` - 17 Tests
Tests para autenticación y gestión de usuarios:

**Register** (5 tests)
- ✅ Registrar usuario exitosamente
- ✅ Validar nombre requerido
- ✅ Validar email requerido
- ✅ Validar contraseña (mín 6 caracteres)
- ✅ Usuario/Email ya existe

**Login** (3 tests)
- ✅ Login exitoso
- ✅ Email no existe
- ✅ Contraseña incorrecta

**Profile** (4 tests)
- ✅ Obtener perfil
- ✅ Usuario no existe
- ✅ Actualizar perfil
- ✅ Error si usuario no existe

**Password** (5 tests)
- ✅ Cambiar contraseña
- ✅ Contraseña actual incorrecta
- ✅ Usuario no existe
- ✅ Validaciones
- ✅ Manejo de errores

#### `ReporteControllerTest.java` - 13 Tests
Tests de integración para REST API:

**CRUD REST** (5 tests)
- ✅ POST /api/reportes (201)
- ✅ GET /api/reportes/{id}
- ✅ GET /api/reportes
- ✅ PUT /api/reportes/{id}
- ✅ DELETE /api/reportes/{id}

**Search** (2 tests)
- ✅ GET /api/reportes/estado/{estado}
- ✅ GET /api/reportes/severidad/{severidad}

**Geolocation** (4 tests)
- ✅ POST /api/reportes/maps/geocode
- ✅ POST /api/reportes/maps/reverse-geocode
- ✅ GET /api/reportes/maps/validate-address
- ✅ GET /api/reportes/nearby

**Status HTTP** (2 tests)
- ✅ Códigos de respuesta correctos
- ✅ Manejo de errores

---

## 🎯 Coverage

**Frontend Coverage Target:** > 80%
- Utilities: 100%
- Components: 85%

**Backend Coverage Target:** > 75%
- Services: 90%
- Controllers: 80%

**Ver coverage:**
```bash
# Frontend
npm test -- --coverage

# Backend
mvn jacoco:report
# Abrir: backend/target/site/jacoco/index.html
```

---

## 🔧 Configuración

### Jest (Frontend)

**jest.config.js:**
- Environment: jsdom
- Alias: @/ → ./
- Coverage: utils/, app/components/

**jest.setup.js:**
- Setup de Testing Library
- Mock de window.matchMedia
- Env variables

### Maven (Backend)

**pom.xml:**
- Spring Boot Starter Test (JUnit 5, Mockito)
- Jacoco para coverage
- Depencencias incluidas

---

## 📚 Ejemplos de Uso

### Ejecutar en CI/CD

```bash
# Frontend
npm install
npm test -- --coverage --passWithNoTests

# Backend
mvn clean test -q
```

### Desarrollo Local

```bash
# Frontend - Watch mode
npm test -- --watch

# Backend - Compilar y ejecutar
mvn clean test -DskipFailingTests=false
```

---

## 🎓 Estructura de Tests

### Unit Tests (Mocks)
- ✅ Servicios sin dependencias externas
- ✅ Métodos aislados
- ✅ Mockito para mocks

### Integration Tests (MockMvc)
- ✅ Controllers REST API
- ✅ HTTP status codes
- ✅ JSON serialization

### E2E (Próximo)
- Frontend + Backend integration
- Flujos completos de usuario

---

## 🐛 Debugging Tests

### Frontend
```bash
# Debug Node
node --inspect-brk node_modules/jest/bin/jest.js --runInBand

# En Chrome: chrome://inspect
```

### Backend
```bash
# Run single test con output
mvn test -Dtest=ReporteServiceTest -X

# Ver logs
mvn test -X | grep -i error
```

---

## ✅ Checklist Pre-Deployment

- [ ] Todos los tests pasen
- [ ] Coverage > 75%
- [ ] No hay warnings en logs
- [ ] Tests de integración ejecutados
- [ ] Performance aceptable
- [ ] Documentación actualizada

---

## 📊 Comandos Rápidos

```bash
# Frontend
npm test                           # Run all tests
npm test -- --coverage            # With coverage
npm test -- --watch               # Watch mode

# Backend
mvn test                           # Run all tests
mvn test -Dtest=ClassName         # Specific class
mvn clean test jacoco:report       # With coverage
```

---

## 🔗 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [JUnit 5](https://junit.org/junit5/)
- [Mockito](https://site.mockito.org/)
- [Spring Test](https://spring.io/guides/gs/testing-web/)

---

**Última actualización:** 2026-06-17
**Versión:** 1.0
