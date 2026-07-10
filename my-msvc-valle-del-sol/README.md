# 🔥 Frontend - Valle del Sol
## Sistema de Reporte de Incendios Forestales

Una aplicación Next.js 16 + React 19 + TypeScript para reportar y visualizar incendios forestales en tiempo real.

---

## ✨ Características

- 📝 **Registro de Usuarios** - Crea una cuenta
- 🔐 **Autenticación** - Inicia sesión con seguridad
- 📍 **Geolocalización** - Selecciona ubicación en mapa
- 🔥 **Reporte de Incendios** - Crea reportes con coordenadas exactas
- 🗺️ **Visualización en Mapa** - Ve todos los reportes en un mapa interactivo (⭐ NUEVO)
- 🎨 **Código de Colores** - Marcadores por severidad del incendio
- 📱 **Responsive Design** - Funciona en desktop y móvil

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar archivo .env.local
# Ya está configurado, apunta a http://localhost:8081

# 3. Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
app/
├── page.tsx                          # Home
├── layout.tsx                        # Layout principal
├── globals.css                       # Estilos globales
│
├── registrarse/                      # Registro de usuarios
│   └── page.tsx
│
├── iniciarsesion/                    # Login
│   └── page.tsx
│
├── geolocalizacion/                  # Seleccionar ubicación
│   └── page.tsx
│
├── reportes/                         # Crear reporte
│   └── page.tsx
│
├── mapa/                             # 🆕 Visualizar reportes en mapa
│   └── page.tsx
│
├── components/                       # Componentes reutilizables
│   ├── MapaReportes.tsx             # 🆕 Componente del mapa
│   ├── OpenStreetMapComponent.tsx
│   └── ReporteFormMejorado.tsx
│
├── estilos/                          # CSS por página
│   ├── estilo-iniciar-sesion.css
│   ├── estilo-registrarse.css
│   ├── estilo-geolocalizacion.css
│   └── estiloReporte.css
│
├── types/                            # Tipos TypeScript
│   ├── reporte.ts
│   └── vercel-blob.d.ts
│
└── utils/                            # Funciones utilitarias
    └── reporteApi.ts

public/                               # Archivos estáticos
```

---

## 🔄 Flujo de Usuario

```
1. INICIO
   Ir a http://localhost:3000
   ↓

2. REGISTRO
   Click "Registrarse" → Llenar formulario → Guardar en BD
   ↓

3. LOGIN
   Click "Iniciar Sesión" → Ingresar credenciales → Sesión iniciada
   ↓

4. SELECCIONAR UBICACIÓN
   Click "Geolocalización" → Hacer clic en mapa → Ubicación seleccionada
   ↓

5. CREAR REPORTE
   Click "Reportes" → Llenar título/descripción → Enviar
   Reporte guardado en BD con coordenadas exactas
   ↓

6. VER EN MAPA ⭐ NUEVO
   Click "Mapa" → Ver todos los reportes en mapa interactivo
   Marcadores con código de colores por severidad
   Click en marcador → Ver detalles en pop-up
```

---

## 📍 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/registrarse` | Crear nueva cuenta |
| `/iniciarsesion` | Iniciar sesión |
| `/geolocalizacion` | Seleccionar ubicación en mapa |
| `/reportes` | Crear reporte de incendio |
| `/mapa` | **NUEVO** - Ver todos los reportes en mapa |

---

## 🎨 Mapa Interactivo - Código de Colores

Al visitar `/mapa` verás marcadores de colores:

| Color | Severidad | Rango |
|-------|-----------|-------|
| 🟢 Verde | Baja | 1-3 |
| 🟠 Naranja | Media | 4-6 |
| 🔴 Rojo | Alta | 7-10 |

**Interactividad:**
- Haz clic en un marcador → Ver pop-up con detalles
- Botón "Zoom en marcadores" → Ajusta vista automáticamente
- Botón "🔄 Actualizar" → Recarga reportes desde BD

---

## 📦 Dependencias Principales

```json
{
  "next": "^16.2.6",
  "react": "19.2.4",
  "typescript": "^5",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "tailwindcss": "^4"
}
```

---

## 🔌 Conexión con Backend

El frontend se comunica con el backend en:
```
Backend URL: http://localhost:8081
```

**Endpoints usados:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión  
- `GET /api/reportes` - Obtener todos los reportes
- `POST /api/reportes` - Crear nuevo reporte

---

## 🛠️ Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ejecutar build
npm start

# Linter
npm run lint
```

---

## 📚 Documentación Completa

- [GUIA_CONFIGURACION_COMPLETA.md](../GUIA_CONFIGURACION_COMPLETA.md)
- [QUICK_START.md](../QUICK_START.md)
- [RESUMEN_CAMBIOS_IMPLEMENTADOS.md](../RESUMEN_CAMBIOS_IMPLEMENTADOS.md)

---

## ⚡ Requisitos Previos

- ✅ Backend corriendo en http://localhost:8081
- ✅ PostgreSQL activo
- ✅ Node.js 18+
- ✅ npm 8+

---

## 🐛 Troubleshooting

### "Error: No se pudo conectar con el servidor"
- Verifica que el backend esté corriendo (`npm run dev` en carpeta backend)

### "No hay reportes aún"
- Esto es normal si es la primera vez
- Crea un usuario, inicia sesión y crea un reporte

### "El mapa no carga"
- Verifica conexión a internet (necesita cargar tiles de OpenStreetMap)

---

## 🎯 Próximas Mejoras

- [ ] Filtrar reportes por fecha/severidad
- [ ] Cargar fotos con reportes
- [ ] Notificaciones en tiempo real
- [ ] Estadísticas y gráficas
- [ ] Exportar reportes a PDF
- [ ] Integración con Google Maps API

---

**¡Listo para usar!** 🎉

Abre http://localhost:3000 y comienza a reportar incendios.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
