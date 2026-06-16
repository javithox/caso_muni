# Guía: Registro de Usuarios en Valle del Sol

## 🔧 Configuración Inicial

### 1. Asegurar que la base de datos está corriendo
```bash
# Si usas Docker
docker-compose up -d

# Si usas PostgreSQL local, verifica que el servicio está activo
psql -U postgres -c "SELECT version();"
```

### 2. Instalar dependencias
```bash
cd backend
npm install
```

### 3. Regenerar el cliente de Prisma (IMPORTANTE)
```bash
# Esto actualiza el cliente con los cambios del schema
npm run prisma:generate
```

### 4. Sincronizar la base de datos
```bash
# Opción A: Empujar el schema a la DB (recomendado para desarrollo)
npm run prisma:push

# Opción B: Crear una migración (más formal)
npm run prisma:migrate
```

### 5. Ejecutar el servidor
```bash
npm run dev
```

---

## 📮 Probar el Registro de Usuario

### Con Postman
1. **URL**: `POST http://localhost:8081/api/auth/register`
2. **Headers**: 
   ```
   Content-Type: application/json
   ```
3. **Body** (JSON):
   ```json
   {
     "nombre": "juanperez",
     "email": "juan@example.com",
     "password": "123456"
   }
   ```

### Con cURL
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juanperez",
    "email": "juan@example.com",
    "password": "123456"
  }'
```

### Respuesta esperada (éxito)
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "juanperez",
    "email": "juan@example.com"
  }
}
```

---

## ❌ Errores Comunes y Soluciones

### Error: `PrismaClientValidationError: Argument 'nombre' is missing`
**Causa**: El cliente de Prisma no está regenerado o el campo no viene del frontend
**Solución**:
```bash
npm run prisma:generate
npm run dev
```

### Error: `Connection refused (PostgreSQL)`
**Causa**: La base de datos no está corriendo
**Solución**:
```bash
docker-compose up -d
# o
systemctl start postgresql  # En Linux
```

### Error: `Database "valle_del_sol" does not exist`
**Causa**: La base de datos no fue creada
**Solución**:
```bash
npm run prisma:push
```

### Error: `ENOENT: no such file or directory, open '.env'`
**Causa**: Falta el archivo `.env`
**Solución**: Verifica que existe el archivo `.env` en la raíz del backend con:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/valle_del_sol"
```

---

## 🔍 Ver Datos en la Base de Datos

### Opción 1: Prisma Studio (interfaz gráfica)
```bash
npm run prisma:studio
# Se abre automáticamente en http://localhost:5555
```

### Opción 2: Línea de comandos psql
```bash
psql -U postgres -d valle_del_sol -c "SELECT * FROM \"Usuario\";"
```

### Opción 3: DBeaver o similar
Conecta a `postgresql://postgres:postgres@localhost:5432/valle_del_sol`

---

## 📋 Campos Requeridos para Registro

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| `nombre` | String | ✅ Sí | No vacío |
| `email` | String | ✅ Sí | Único, formato email |
| `password` | String | ✅ Sí | Mínimo 6 caracteres |

---

## 🧪 Script de Prueba Completa

```bash
# 1. Asegurar dependencias
npm install

# 2. Regenerar Prisma
npm run prisma:generate

# 3. Sincronizar BD
npm run prisma:push

# 4. Iniciar servidor
npm run dev

# En otra terminal, probar registro:
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "test_usuario",
    "email": "test@example.com",
    "password": "123456"
  }'
```

---

## 📝 Notas

- La contraseña se encripta con SHA-256 antes de guardarse
- El email se normaliza a minúsculas automáticamente
- No se pueden registrar dos usuarios con el mismo email
- Se agrega validación en el backend para evitar datos inválidos

---

## 🆘 Si Nada Funciona

1. **Reinicia todo desde cero**:
   ```bash
   npm run prisma:reset
   npm run prisma:generate
   npm run dev
   ```

2. **Limpia cache y reinstala**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run prisma:generate
   ```

3. **Verifica conexión a BD**:
   ```bash
   psql -U postgres -d valle_del_sol -c "SELECT 1;"
   ```
