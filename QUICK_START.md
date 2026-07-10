# ⚡ QUICK START - Valle del Sol

## 🏃 INICIO RÁPIDO EN 5 MINUTOS

### **Terminal 1: Backend (Node.js)**
```bash
cd backend
npm install                    # Solo primera vez
npm run dev                    # Inicia en puerto 8081
```

### **Terminal 2: Frontend (Next.js)**
```bash
cd my-msvc-valle-del-sol
npm install                    # Solo primera vez
npm run dev                    # Inicia en puerto 3000
```

### **Accede a:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8081

---

## 👤 CREAR USUARIO Y PROBAR

### **1. REGISTRARSE**
```
URL: http://localhost:3000/registrarse
├─ Nombre: Juan Pérez
├─ Email: juan@example.com
├─ Contraseña: 123456
└─ Clic en "Registrarse"
✅ Redirige a login automáticamente
```

### **2. INICIAR SESIÓN**
```
URL: http://localhost:3000/iniciarsesion
├─ Email: juan@example.com
├─ Contraseña: 123456
└─ Clic en "Ingresar"
✅ Redirige a /reportes automáticamente
```

### **3. CREAR REPORTE**
```
PASO A: Ir a /geolocalizacion
├─ Hacer clic en el mapa para seleccionar ubicación
├─ Se guarda en localStorage
└─ Ir a /reportes

PASO B: Llenar formulario en /reportes
├─ Título: "Incendio en Bosque Central"
├─ Descripción: "Reportamos un incendio de rápida propagación"
└─ Clic "Enviar Reporte"
✅ Se guarda en BD
✅ Redirige a /mapa
```

### **4. VER EN MAPA** ⭐ NUEVO
```
URL: http://localhost:3000/mapa
├─ Verás el marcador de tu reporte
├─ Haz clic en el marcador → Ver detalles en pop-up
├─ Verás lista de reportes abajo
└─ Botón "🔄 Actualizar" recarga desde BD
```

---

## 🎨 CÓDIGOS DE COLOR EN MAPA

| Color | Severidad | Rango |
|-------|-----------|-------|
| 🟢 Verde | Baja | 1-3 |
| 🟠 Naranja | Media | 4-6 |
| 🔴 Rojo | Alta | 7-10 |

---

## 📍 NAVEGACIÓN

```
Home (/) 
  ├─ Registrarse (/registrarse)
  ├─ Iniciar Sesión (/iniciarsesion)
  ├─ Geolocalización (/geolocalizacion) - Seleccionar ubicación
  ├─ Reportes (/reportes) - Crear reporte
  └─ 🆕 Mapa (/mapa) - Ver todos los reportes
```

---

## ❌ SI ALGO NO FUNCIONA

### **Error: "No se pudo conectar con el servidor"**
- ✅ ¿Backend está corriendo? (`npm run dev` en carpeta backend)
- ✅ ¿PostgreSQL está activo?
- ✅ ¿Puerto 8081 está disponible?

### **Error: "Database error"**
- ✅ Ejecuta en backend: `npx prisma migrate dev`
- ✅ Luego: `npx prisma generate`
- ✅ Reinicia backend

### **Mapa no muestra reportes**
- ✅ ¿Ya creaste al menos un reporte?
- ✅ ¿Navegaste a `/mapa`?
- ✅ Clic botón "🔄 Actualizar"

---

## 🎯 FLUJO COMPLETO

```
1. REGISTRARSE         → Usuario creado en BD
2. LOGIN              → Sesión iniciada
3. GEOLOCALIZACION    → Ubicación seleccionada
4. REPORTES           → Reporte creado en BD
5. MAPA               → Ver reporte en mapa ✅
```

---

## 📊 INFORMACIÓN GUARDADA

### **En tabla Usuario:**
- Nombre
- Email (único)
- Contraseña (hasheada)
- Fecha de creación

### **En tabla Reporte:**
- Título
- Descripción
- Latitud/Longitud exactas ⭐
- Estado (pendiente)
- Severidad (1-10)
- Fecha de creación
- Usuario que lo reportó

---

## 💾 DATOS EN BASE DE DATOS

Después de crear un usuario y un reporte, puedes ver en BD:

```sql
-- Ver usuarios
SELECT * FROM "Usuario";

-- Ver reportes
SELECT id, titulo, latitud, longitud, severidad, "createdAt" 
FROM "Reporte" 
ORDER BY "createdAt" DESC;
```

---

## 🚀 PRÓXIMAS MEJORAS

- [ ] Filtrar reportes por fecha, severidad, estado
- [ ] Cargar fotos con reportes
- [ ] Autenticación JWT real
- [ ] Notificaciones en tiempo real
- [ ] Dashboard de estadísticas
- [ ] Exportar reportes a PDF

---

**¡Listo para probar!** 🎉

Abre http://localhost:3000 y comienza a reportar incendios.
