# ❓ Preguntas Frecuentes - Despliegue en EC2

## ¿Cuánto cuesta?

| Servicio | Costo | Notas |
|----------|------|-------|
| EC2 t2.micro | **Gratis** | 12 meses (AWS Free Tier) |
| EC2 t2.small | $0.02/hora | ~$15/mes |
| EC2 t3.small | $0.021/hora | ~$15/mes |
| EBS 20GB | **Gratis** | 30GB/mes (Free Tier) |
| Transfer de datos | **Gratis** | Primeros 100GB/mes salientes |
| **TOTAL** | **$0-15 USD/mes** | En Free Tier |

## ¿Qué tamaño de EC2 necesito?

```
t2.micro (1 vCPU, 1GB RAM) ✅ Para desarrollo/pruebas
t2.small (1 vCPU, 2GB RAM) ✅ Para producción ligera
t3.small (2 vCPU, 2GB RAM) ✅ Para producción media
```

**Recomendación**: Comienza con `t2.micro` (gratis) y escala si es necesario.

## ¿Puedo usar RDS en lugar de PostgreSQL en Docker?

**Sí**, es recomendado para producción:

```bash
# 1. Crear RDS PostgreSQL en AWS Console
# 2. Modificar docker-compose.prod.yaml:

# Comentar el servicio base_de_datos:
# base_de_datos:
#   image: postgres:15-alpine
#   ...

# Cambiar en variables de entorno:
DB_HOST=tu-rds-endpoint.amazonaws.com  # Desde AWS Console
DB_USER=postgres
DB_PASSWORD=tu-password-rds
DB_NAME=valle_de_sol
```

**Ventajas de RDS**:
- ✅ Backups automáticos
- ✅ Multi-AZ (alta disponibilidad)
- ✅ Mantenimiento automático
- ✅ No ocupa espacio en EC2

**Desventajas**:
- ❌ Costo adicional ($~15-30 USD/mes)

## ¿Cómo conecto a PostgreSQL desde fuera?

```bash
# Desde tu máquina local:
psql -h tu-ip-publica -U postgres -d valle_de_sol

# Donde tu-ip-publica es la IP pública de EC2
```

⚠️ **IMPORTANTE**: El Security Group debe permitir puerto 5432 desde tu IP.

## ¿Cómo restauro una base de datos?

```bash
# Exportar BD (backup):
docker-compose -f docker-compose.prod.yaml exec base_de_datos \
  pg_dump -U postgres valle_de_sol > backup.sql

# Importar BD (restore):
cat backup.sql | docker-compose -f docker-compose.prod.yaml exec \
  -T base_de_datos psql -U postgres
```

## ¿Cómo agrego un dominio propio?

1. **Compra dominio** en Route53, GoDaddy, etc.

2. **Si usas Route53**:
   - AWS Console → Route53 → Create hosted zone
   - Añade record: `example.com → IP-publica-EC2`

3. **Si usas otro registrador**:
   - Configura DNS records para apuntar a IP pública

4. **Actualiza variables**:
```env
API_HOST=example.com
NEXT_PUBLIC_API_URL=http://example.com:8081
```

5. **Reinicia servicios**:
```bash
docker-compose -f docker-compose.prod.yaml up -d
```

## ¿Cómo configuro HTTPS/SSL?

### Opción 1: Let's Encrypt (Gratis)

```bash
# 1. Instalar Certbot
sudo yum install -y certbot

# 2. Generar certificado
sudo certbot certonly --standalone -d example.com

# 3. Los certificados quedan en:
# /etc/letsencrypt/live/example.com/

# 4. Copiar a docker-compose (si usas nginx)
sudo cp /etc/letsencrypt/live/example.com/* /home/ec2-user/caso_muni/certs/
```

### Opción 2: AWS ALB (Más complejo)

Usa Application Load Balancer con AWS Certificate Manager.

### Opción 3: Nginx Reverse Proxy

Instala Nginx en EC2 y configura como proxy:

```bash
# Instalar Nginx
sudo yum install -y nginx

# Crear config:
sudo tee /etc/nginx/conf.d/app.conf > /dev/null << EOF
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
    }

    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host \$host;
    }
}
EOF

# Reiniciar Nginx
sudo systemctl restart nginx
```

## ¿Mi aplicación está lenta?

```bash
# 1. Verifica recursos:
docker stats

# 2. Revisa logs:
docker-compose -f docker-compose.prod.yaml logs -f

# 3. Aumenta tamaño de EC2:
# - Detén instancia
# - Change instance type a t2.small o t3.small
# - Inicia instancia

# 4. Aumenta memoria disponible:
# Modifica docker-compose.prod.yaml:
api_backend:
  deploy:
    resources:
      limits:
        memory: 512M
```

## ¿Cómo escalo a múltiples EC2?

Usa **AWS Load Balancer + Auto Scaling**:

1. Crear imagen AMI con tu app
2. Create Launch Template
3. Create Auto Scaling Group
4. Create Application Load Balancer
5. Configurar health checks

**Esto es más avanzado**, requiere conocimientos de AWS.

## ¿Cómo monitoro mi aplicación?

```bash
# Ver logs en tiempo real:
docker-compose -f docker-compose.prod.yaml logs -f

# Con timestamps:
docker-compose -f docker-compose.prod.yaml logs -f --timestamps

# Guardar logs:
docker-compose -f docker-compose.prod.yaml logs > app-logs.txt
```

**Mejor opción**: CloudWatch + CloudLogs (AWS nativo)

## ¿Cómo actualizo mi código?

```bash
# 1. Push a GitHub
git push origin main

# 2. En EC2:
cd caso_muni
git pull origin main

# 3. Reconstruir y levantar
docker-compose -f docker-compose.prod.yaml up -d --build

# 4. Ver logs
docker-compose -f docker-compose.prod.yaml logs -f
```

## ¿Cómo borro todo?

```bash
# Parar servicios (conserva datos):
docker-compose -f docker-compose.prod.yaml down

# Eliminar todo (incluyendo BD):
docker-compose -f docker-compose.prod.yaml down -v

# Terminar instancia EC2:
# AWS Console → EC2 → Instances → Terminate
```

## ¿Puedo dejar la aplicación corriendo aunque cierre sesión SSH?

**Sí**, Docker Compose está configurado con `restart: always`.

Los servicios continuarán corriendo aunque desconectes SSH.

## ¿Qué pasa si EC2 se cae?

Con `restart: always`, Docker reiniciará los contenedores automáticamente.

Si EC2 completa falla, necesitas de Auto Scaling + Load Balancer (más costo).

## Errores Comunes

### "Port already in use"
```bash
docker-compose -f docker-compose.prod.yaml down
# Espera 10 segundos
docker-compose -f docker-compose.prod.yaml up -d
```

### "Cannot connect to database"
```bash
# Verifica que BD esté corriendo:
docker-compose -f docker-compose.prod.yaml ps base_de_datos

# Revisa logs:
docker-compose -f docker-compose.prod.yaml logs base_de_datos
```

### "Permission denied" al conectar SSH
```bash
# En Windows:
icacls C:\ruta\key.pem /grant:r "%username%":F

# En Linux/Mac:
chmod 600 /ruta/key.pem
```

### "npm install fails"
```bash
# Dentro de EC2:
docker-compose -f docker-compose.prod.yaml down -v
docker-compose -f docker-compose.prod.yaml up -d --build
```

---

¿Necesitas más ayuda? Contacta al equipo de DevOps.
