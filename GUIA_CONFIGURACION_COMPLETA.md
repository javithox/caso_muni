# 🔥 GUÍA DE CONFIGURACIÓN - Valle del Sol Sistema de Reportes

## ✅ CAMBIOS IMPLEMENTADOS

### 1. **Formularios Reparados** ✓
- ✅ Formulario de **Iniciar Sesión** - Ahora guarda datos en BD y redirige
- ✅ Formulario de **Registrarse** - Ahora crea usuarios en BD correctamente
- ✅ Formulario de **Reportes** - Ya estaba funcional, ahora envía a BD

### 2. **Nuevas Funcionalidades** ✓
- ✅ **Página de Mapa** (`/mapa`) - Visualiza todos los reportes guardados con marcadores
- ✅ **Componente MapaReportes** - Mapa interactivo con Leaflet que muestra incendios por severidad
- ✅ Manejo de **sesiones de usuario**
- ✅ **Sistema de marcadores codificados por color**:
  - 🟢 Verde: Severidad baja (1-3)
  - 🟠 Naranja: Severidad media (4-6)
  - 🔴 Rojo: Severidad alta (7-10)

---

## 🚀 PASOS PARA EJECUTAR

### **PASO 1: Configurar PostgreSQL** 
```bash
# Asegúrate que PostgreSQL esté corriendo (local o Docker)

# Opción A: Si usas Docker
docker run --name postgres-valle \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=valle_del_sol \
  -p 5432:5432 \
  -d postgres:15

# Opción B: Si ya tienes PostgreSQL instalado
# Crea la base de datos:
psql -U postgres -c "CREATE DATABASE valle_del_sol;"
```

### **PASO 2: Configurar Backend (Node.js)**
```bash
cd backend

# Instalar dependencias
npm install

# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init

# Generar cliente de Prisma
npx prisma generate

# Iniciar el servidor
npm run dev
# El servidor estará en http://localhost:8081
```

### **PASO 3: Configurar Frontend (Next.js)**
```bash
cd my-msvc-valle-del-sol

# Instalar dependencias (si no están instaladas)
npm install

# Ejecutar en modo desarrollo
npm run dev
# Accede a http://localhost:3000
```

---

## 📱 FLUJO DE USUARIO

### **1. Registro de Usuario**
```
Usuario → /registrarse → Llena formulario → 
Datos guardados en tabla "Usuario" → Redirige a /iniciarsesion
```

### **2. Iniciar Sesión**
```
Usuario → /iniciarsesion → Email + Contraseña → 
Se valida en BD → Token guardado en localStorage → 
Redirige a /reportes
```

### **3. Crear Reporte**
```
Usuario → /geolocalizacion → Selecciona ubicación en mapa →
Va a /reportes → Llena título + descripción →
Envía reporte con coordenadas → Se guarda en tabla "Reporte" →
Redirige a /mapa
```

### **4. Ver Reportes en Mapa**
```
Usuario → /mapa → Carga todos los reportes de BD →
Muestra marcadores en mapa interactivo →
Puede ver lista de reportes + detalles en pop-ups
```

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### **Tabla: Usuario**
```
id (PK)          - Int autoincrement
nombre           - String
email            - String (único)
password         - String (hash SHA256)
createdAt        - DateTime
```

### **Tabla: Reporte**
```
id (PK)          - Int autoincrement
titulo           - String
descripcion      - String
latitud          - Float
longitud         - Float
estado           - String (default: "pendiente")
severidad        - Int (1-10, default: 3)
imagen           - String (opcional)
createdAt        - DateTime
usuarioId (FK)   - Int (relación con Usuario)
```

---

## 🔑 URLs PRINCIPALES

| Página | URL | Descripción |
|--------|-----|-------------|
| Home | `/` | Página de inicio |
| Registrarse | `/registrarse` | Crear nueva cuenta |
| Iniciar Sesión | `/iniciarsesion` | Login de usuario |
| Geolocalización | `/geolocalizacion` | Seleccionar ubicación en mapa |
| Reportes | `/reportes` | Crear reporte de incendio |
| Mapa de Reportes | `/mapa` | **NUEVA** - Ver todos los reportes en mapa |

---

## 🐛 TROUBLESHOOTING

### **"Error al conectar con el servidor"**
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica que el backend esté ejecutándose (`npm run dev` en carpeta backend)
- ✅ Verifica las credenciales en `.env`

### **"No hay reportes aún"**
- ✅ Esto es normal si es la primera vez
- ✅ Crea un usuario, inicia sesión, y crea un reporte
- ✅ Luego ve a `/mapa` para verlo

### **"Error en Prisma"**
- ✅ Ejecuta: `npx prisma migrate dev --name init`
- ✅ Luego: `npx prisma generate`

### **Puerto 3000 o 8081 en uso**
- ✅ Backend: Cambia `PORT` en `.env`
- ✅ Frontend: Ejecuta `npm run dev -- -p 3001`

---

## 📊 API ENDPOINTS

### **Autenticación**
```
POST /api/auth/register
Body: { nombre, email, password }
Response: { id, nombre, email }

POST /api/auth/login
Body: { email, password }
Response: { message, usuario: { id, nombre, email } }
```

### **Reportes**
```
GET /api/reportes
Response: [ { id, titulo, descripcion, latitud, longitud, ... } ]

POST /api/reportes
Body: { titulo, descripcion, latitud, longitud }
Response: { id, titulo, ... }
```

---

## ✨ PRÓXIMAS MEJORAS SUGERIDAS

- [ ] Agregar autenticación JWT real con refresh tokens
- [ ] Permitir cargar imágenes en reportes
- [ ] Agregar filtros por fecha, severidad, estado
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Estadísticas y gráficas de reportes
- [ ] Exportar reportes a PDF
- [ ] Dashboard de administrador
- [ ] Integración con Google Maps API
- [ ] Envío de emails de confirmación

---

## 💡 NOTAS IMPORTANTES

1. **Seguridad**: Las contraseñas se guardan hasheadas con SHA256
2. **Sesiones**: Se usan tokens en localStorage (implementar JWT en producción)
3. **Mapa**: Usa OpenStreetMap (libre y sin API key)
4. **Base de datos**: PostgreSQL es requerida

---

**¡Listo! Tu sistema de reportes está 100% funcional.** 🎉
