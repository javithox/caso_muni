# 🔥 Backend - Valle del Sol
## Sistema de Reporte de Incendios Forestales

### Descripción
Backend de Node.js + Express + Prisma que maneja:
- ✅ Autenticación de usuarios (Registro/Login)
- ✅ CRUD de reportes de incendios
- ✅ Almacenamiento de coordenadas GPS
- ✅ Base de datos PostgreSQL

---

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Copiar .env.example a .env (ya está configurado)

# 3. Configurar Prisma
npx prisma generate
npx prisma migrate dev --name init

# 4. Ejecutar servidor
npm run dev
# El servidor estará en http://localhost:8081
```

---

## 📊 Tablas de Base de Datos

### Usuario
```
- id (PK)
- nombre
- email (único)
- password (hasheada SHA256)
- createdAt
```

### Reporte
```
- id (PK)
- titulo
- descripcion
- latitud
- longitud
- estado
- severidad
- imagen (opcional)
- createdAt
- usuarioId (FK)
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register    → Crear usuario
POST   /api/auth/login       → Iniciar sesión
```

### Reportes
```
GET    /api/reportes         → Obtener todos
POST   /api/reportes         → Crear reporte
```

---

## 📁 Estructura

```
src/
├── controllers/          # Lógica de negocio
├── routes/              # Definición de rutas
├── middleware/          # Middleware personalizado
├── lib/                 # Librerías (Prisma)
├── config/              # Configuración
├── app.ts               # Configuración de Express
└── server.ts            # Punto de entrada

prisma/
├── schema.prisma        # Modelos de BD
└── migrations/          # Migraciones
```

---

## 🔑 Variables de Entorno (.env)

```
PORT=8081
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/valle_del_sol"
JWT_SECRET=mi_clave_super_secreta
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 🗄️ Requisitos Previos

✅ PostgreSQL 12+  
✅ Node.js 18+  
✅ npm 8+

---

## 📚 Documentación Completa

Ver archivos en raíz del proyecto:
- [GUIA_CONFIGURACION_COMPLETA.md](../GUIA_CONFIGURACION_COMPLETA.md) - Configuración detallada
- [QUICK_START.md](../QUICK_START.md) - Inicio rápido
- [RESUMEN_CAMBIOS_IMPLEMENTADOS.md](../RESUMEN_CAMBIOS_IMPLEMENTADOS.md) - Cambios recientes

---

## 💻 Desarrollo

```bash
# Modo watch (con reinicio automático)
npm run dev

# Build para producción
npm run build

# Ejecutar desde build
npm start
```

---

## 🧪 Test

```bash
npx prisma studio     # Ver datos en UI
```

---

**¡Sistema 100% funcional!** 🎉
