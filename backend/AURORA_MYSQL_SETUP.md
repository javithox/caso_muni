# Aurora MySQL - Guía de Configuración

## ✅ Cambios Realizados

El proyecto ha sido actualizado para usar **Aurora MySQL** en lugar de PostgreSQL:

### 1. Dependencias Actualizadas
- **Antes**: `org.postgresql:postgresql`
- **Después**: `com.mysql:mysql-connector-j:8.3.0`

### 2. Configuración de Base de Datos
Archivos actualizados:
- `backend/pom.xml` - Dependencia MySQL
- `backend/application.properties` - URL de conexión
- `backend/src/main/resources/application.properties` - Configuración completa

### 3. Cambios en application.properties
```properties
# Aurora MySQL Configuration
spring.datasource.url=jdbc:mysql://your-aurora-cluster-endpoint:3306/valle_del_sol?useSSL=true&allowPublicKeyRetrieval=false&serverTimezone=UTC
spring.datasource.username=admin
spring.datasource.password=your-password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## 🔧 Pasos para Configurar Aurora MySQL

### Paso 1: Crear Cluster Aurora en AWS
1. Accede a [AWS RDS Console](https://console.aws.amazon.com/rds)
2. Click en "Create database"
3. Selecciona **Amazon Aurora**
4. Engine: **MySQL Compatible 8.0+**
5. Deployment: Multi-AZ (recomendado para producción)
6. Cluster identifier: `valle-del-sol`
7. Master username: `admin`
8. Master password: (crear contraseña segura)

### Paso 2: Obtener el Endpoint
Después de crear el cluster (5-10 minutos):
- Ve a **RDS Console** → **Databases**
- Selecciona tu cluster
- Copia el **Writer endpoint** (ejemplo: `valle-del-sol.c9akciq32.us-east-1.rds.amazonaws.com`)

### Paso 3: Configurar la Conexión Localmente
Actualiza `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://tu-endpoint-aqui:3306/valle_del_sol?useSSL=true&allowPublicKeyRetrieval=false&serverTimezone=UTC
spring.datasource.username=admin
spring.datasource.password=tu-contraseña-aqui
```

### Paso 4: Crear Base de Datos Inicial
Conéctate a Aurora y ejecuta:
```sql
CREATE DATABASE IF NOT EXISTS valle_del_sol;
USE valle_del_sol;
```

O usa AWS Query Editor:
1. Ve a RDS Console
2. Selecciona tu cluster
3. Click "Query editor"
4. Ejecuta el comando anterior

### Paso 5: Permitir Acceso a Aurora desde tu Aplicación

#### Opción A: Acceso Local (desarrollo)
1. En RDS Console, selecciona tu cluster
2. Modifica el **Security Group** asociado
3. Agrega una regla de entrada:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: Your IP / 0.0.0.0/0 (solo para desarrollo)

#### Opción B: Acceso desde EC2/Lambda
- Asegúrate que la instancia está en el mismo VPC o tiene acceso de red

### Paso 6: Compilar y Ejecutar
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Hibernate automáticamente creará las tablas basándose en tus entidades JPA.

## 🗄️ Parámetros Aurora MySQL Recomendados

Crear un **DB Cluster Parameter Group** con:
```
character_set_server=utf8mb4
collation_server=utf8mb4_unicode_ci
max_connections=1000
slow_query_log=1
long_query_time=2
log_bin_trust_function_creators=1
```

## 📊 Monitoreo en AWS

1. **CloudWatch Metrics**: CPU, Storage, Connections
2. **Performance Insights**: Ver queries lentas
3. **Enhanced Monitoring**: Detalles del SO

## 🔐 Seguridad

### Recomendaciones:
1. ✅ Usar SSL/TLS (ya configurado en connection string)
2. ✅ Cambiar contraseña predeterminada
3. ✅ Usar AWS Secrets Manager para credenciales
4. ✅ Habilitar backups automáticos (por defecto: 7 días)
5. ✅ Usar VPC endpoints

### Integración con Secrets Manager:
```yaml
# Para producción, usar:
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

## 💰 Costos Estimados

- **db.t3.micro** (1 vCPU, 1GB RAM): ~$0.18/hora
- **db.t3.small** (2 vCPU, 2GB RAM): ~$0.36/hora
- Storage: ~$0.10 por GB-mes (gp2)

## ✨ Beneficios de Aurora MySQL

✅ **Alta disponibilidad** (Multi-AZ automático)
✅ **Escalado automático** de almacenamiento
✅ **Backups automáticos** sin costo adicional
✅ **Failover automático** en caso de fallo
✅ **Compatible con MySQL** (migración fácil)
✅ **Performance 5x mejor** que MySQL estándar

## 🆘 Troubleshooting

### Conexión rechazada
```
Error: Communications link failure
```
**Solución**: Verificar Security Group, permitir Puerto 3306

### Bad handshake
```
Error: Public Key Retrieval is not allowed
```
**Solución**: Ya incluido en connection string con `allowPublicKeyRetrieval=false&serverTimezone=UTC`

### Autenticación fallida
```
Error: Access denied for user 'admin'@'xxx'
```
**Solución**: Verificar usuario/contraseña en application.properties

## 📝 Notas Importantes

1. **Endpoint**: Reemplaza `your-aurora-cluster-endpoint` con tu endpoint real
2. **Contraseña**: Reemplaza `your-password` con tu contraseña segura
3. **Región**: El endpoint incluye la región (us-east-1, etc.)
4. **SSL**: Recomendado siempre usar `useSSL=true`

## 🚀 Próximos Pasos

- [ ] Crear cluster Aurora en AWS
- [ ] Obtener endpoint
- [ ] Actualizar application.properties
- [ ] Probar conexión
- [ ] Ejecutar mvn clean install
- [ ] Iniciar aplicación
- [ ] Verificar tablas creadas en AWS RDS Console

---
**Última actualización**: 2026-06-16
