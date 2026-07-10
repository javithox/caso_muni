# Sistema de Autenticación y Gestión de Usuarios

## Resumen
Se ha implementado un sistema completo de autenticación y gestión de perfiles de usuario para la aplicación Valle del Sol. Los usuarios pueden:
- ✅ Registrarse con nombre, nombre completo, email y contraseña
- ✅ Iniciar sesión con email y contraseña
- ✅ Ver su perfil con toda la información personal
- ✅ Editar su información de perfil
- ✅ Cambiar su contraseña
- ✅ Ver información adicional (fecha de registro, último ingreso, etc.)

## Cambios Implementados

### Backend (Spring Boot)

#### 1. **Nuevas Entidades**
- `UsuarioEntity.java` - Entidad de Usuario con campos completos
  - Campos: id, nombre, email, password, nombreCompleto, telefono, direccion, ciudad, rol, activo, fechas
  - Validaciones: email y nombre únicos
  - Roles: CIUDADANO, BOMBERO, ADMINISTRADOR

#### 2. **Nuevos DTOs**
- `UsuarioDTO.java` - DTO para transferir datos de usuario (sin contraseña)
- `LoginDTO.java` - DTO para login (email, password)
- `RegisterDTO.java` - DTO para registro (nombre, email, password, nombreCompleto)
- `AuthResponseDTO.java` - DTO para respuesta de autenticación (token, usuario, mensaje)
- `ChangePasswordDTO.java` - DTO para cambio de contraseña
- `MessageDTO.java` - DTO para mensajes de respuesta

#### 3. **Nuevos Repositorios**
- `UsuarioRepository.java`
  - Métodos de búsqueda: findByEmail, findByNombre, findByNombreOrEmail
  - Métodos de validación: existsByEmail, existsByNombre

#### 4. **Nuevo Servicio**
- `UsuarioService.java`
  - `registrar()` - Registra nuevo usuario con encriptación de contraseña
  - `login()` - Autentica usuario y retorna token
  - `obtenerPerfil()` - Obtiene información del usuario
  - `actualizarPerfil()` - Actualiza campos permitidos
  - `cambiarContrasena()` - Cambia la contraseña del usuario

#### 5. **Nuevo Controlador**
- `AuthController.java` - REST endpoints para autenticación
  - `POST /api/auth/register` - Registro de usuario
  - `POST /api/auth/login` - Login
  - `GET /api/auth/perfil/{id}` - Obtener perfil
  - `PUT /api/auth/perfil/{id}` - Actualizar perfil
  - `POST /api/auth/cambiar-contrasena/{id}` - Cambiar contraseña

#### 6. **Dependencias Agregadas**
- Spring Security (para encriptación BCrypt)

#### 7. **Script SQL**
- `crear_tabla_usuarios.sql` - Crea tabla de usuarios con índices y tabla de auditoría

### Frontend (Next.js)

#### 1. **Nueva Página de Perfil**
- `app/perfil/page.tsx` - Página completa de gestión de perfil
  - Ver información personal
  - Editar perfil (nombre completo, teléfono, dirección, ciudad)
  - Cambiar contraseña
  - Ver información adicional (fecha creación, último ingreso)
  - Botón para cerrar sesión

#### 2. **Actualizaciones de Páginas Existentes**
- `app/registrarse/page.tsx`
  - Agregado campo "Nombre Completo"
  - Mejorada validación de formulario
  
- `app/iniciarsesion/page.tsx`
  - Redirige a `/perfil` después de login exitoso
  - Guarda datos del usuario en localStorage

- `app/page.tsx` (Home)
  - Navegación dinámica basada en autenticación
  - Link a perfil si usuario está autenticado
  - Botón de cerrar sesión

## Cómo Usar

### Desde el Backend

#### 1. **Crear Base de Datos**
```bash
psql -U postgres -f backend/crear_tabla_usuarios.sql
```

#### 2. **Compilar y Ejecutar**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Desde el Frontend

#### 1. **Instalar dependencias**
```bash
cd my-msvc-valle-del-sol
npm install
```

#### 2. **Ejecutar en desarrollo**
```bash
npm run dev
```

#### 3. **Abrir navegador**
```
http://localhost:3000
```

## Flujo de Autenticación

### Registro
1. Usuario llena formulario en `/registrarse`
2. Frontend envía datos a `POST /api/auth/register`
3. Backend valida que email y nombre sean únicos
4. Backend encripta contraseña con BCrypt
5. Backend guarda usuario en BD
6. Usuario redirigido a `/iniciarsesion`

### Login
1. Usuario llena formulario en `/iniciarsesion`
2. Frontend envía email y password a `POST /api/auth/login`
3. Backend busca usuario por email
4. Backend valida contraseña con BCrypt
5. Backend actualiza `ultimoIngreso`
6. Backend retorna token y datos del usuario
7. Frontend guarda token y usuario en localStorage
8. Usuario redirigido a `/perfil`

### Acceso a Perfil
1. Usuario navega a `/perfil`
2. Frontend obtiene datos de localStorage
3. Frontend hace GET a `/api/auth/perfil/{id}` para obtener datos frescos
4. Se muestran todos los datos del usuario
5. Usuario puede editar o cambiar contraseña

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/perfil/{id}` | Obtener perfil de usuario |
| PUT | `/api/auth/perfil/{id}` | Actualizar perfil |
| POST | `/api/auth/cambiar-contrasena/{id}` | Cambiar contraseña |

## Datos Almacenados

### Usuario en BD
```java
{
  id: Long,
  nombre: String (único),
  email: String (único),
  password: String (encriptada con BCrypt),
  nombreCompleto: String,
  telefono: String,
  direccion: String,
  ciudad: String,
  rol: Enum (CIUDADANO, BOMBERO, ADMINISTRADOR),
  activo: Boolean,
  fechaCreacion: LocalDateTime,
  fechaActualizacion: LocalDateTime,
  ultimoIngreso: LocalDateTime,
  foto: String (URL),
  verificado: Boolean
}
```

### Usuario en localStorage (Frontend)
```json
{
  "id": 1,
  "nombre": "usuario123",
  "email": "usuario@example.com",
  "nombreCompleto": "Juan Pérez",
  "telefono": "+56912345678",
  "direccion": "Calle Principal 123",
  "ciudad": "Santiago",
  "rol": "CIUDADANO",
  "activo": true,
  "fechaCreacion": "2026-06-15T10:30:00",
  "ultimoIngreso": "2026-06-15T11:00:00",
  "verificado": false
}
```

## Seguridad

### Encriptación de Contraseña
- Utilizamos BCryptPasswordEncoder de Spring Security
- Las contraseñas se encriptan automáticamente al registrar o cambiar
- Las contraseñas NUNCA se retornan en respuestas de API
- En el DTO no se incluye el campo password

### Validaciones
- Email y nombre de usuario deben ser únicos
- Email debe tener formato válido
- Contraseña se valida antes de cambiarla
- Token se valida antes de acceder a rutas protegidas (próxima implementación)

## Próximas Mejoras (Opcional)

1. **JWT Tokens** - Reemplazar token simple por JWT
2. **Autenticación OAUTH** - Google, GitHub, etc.
3. **Email Verification** - Verificar email antes de usar cuenta
4. **2FA** - Autenticación de dos factores
5. **Recuperación de Contraseña** - Reset por email
6. **Session Management** - Mejorar manejo de sesiones
7. **Roles y Permisos** - Restricción de endpoints por rol

## Troubleshooting

### Error: "El email ya está registrado"
- Intenta con otro email
- Verifica que el email sea correcto

### Error: "Usuario o contraseña incorrectos"
- Verifica que el email sea correcto
- Verifica que la contraseña sea correcta
- Asegúrate de haber registrado la cuenta primero

### Error: "No hay sesión activa"
- Debes iniciar sesión primero
- Los datos se guardan en localStorage del navegador
- Si limpias localStorage, se pierde la sesión

### El backend no responde
- Verifica que el servidor esté corriendo en puerto 8081
- Revisa que la base de datos esté disponible
- Comprueba las dependencias con `mvn dependency:tree`

## Archivos Creados/Modificados

### Backend
- ✅ `src/main/java/com/example/backend1/entity/UsuarioEntity.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/UsuarioDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/LoginDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/RegisterDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/AuthResponseDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/ChangePasswordDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/dto/MessageDTO.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/repository/UsuarioRepository.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/service/UsuarioService.java` (NUEVO)
- ✅ `src/main/java/com/example/backend1/controller/AuthController.java` (NUEVO)
- ✅ `pom.xml` (MODIFICADO - agregada dependencia Spring Security)
- ✅ `crear_tabla_usuarios.sql` (NUEVO)

### Frontend
- ✅ `app/perfil/page.tsx` (NUEVO)
- ✅ `app/registrarse/page.tsx` (MODIFICADO)
- ✅ `app/iniciarsesion/page.tsx` (MODIFICADO)
- ✅ `app/page.tsx` (MODIFICADO)

## Estado: ✅ IMPLEMENTACIÓN COMPLETA

Todos los componentes están listos para usar:
- ✅ Registro de usuarios funcional
- ✅ Login de usuarios funcional
- ✅ Perfil de usuario con edición
- ✅ Cambio de contraseña
- ✅ Gestión de sesiones
- ✅ Base de datos configurada
- ✅ Encriptación de contraseñas
- ✅ API REST completa
