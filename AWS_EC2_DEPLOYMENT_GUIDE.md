# Guía: Despliegue en AWS EC2 con Docker Compose

## 📋 Requisitos Previos

### En AWS:
1. **Cuenta de AWS** activa
2. **Key pair** creado en EC2 (guardar el archivo .pem)
3. **VPC y Subnet** configuradas
4. **Security Group** con puertos abiertos:
   - Puerto 22 (SSH)
   - Puerto 3000 (Frontend)
   - Puerto 8081 (Backend)
   - Puerto 5432 (PostgreSQL - solo desde EC2)

### Localmente:
- Git instalado
- SSH client (incluido en Windows 10+)
- Permisos para subir el código a un repositorio

---

## 🚀 Pasos de Configuración

### 1. Preparar tu Repositorio

```bash
# Asegúrate que tu código esté en GitHub/GitLab
git remote -v
# Debe mostrar origin apuntando a tu repositorio
```

### 2. Crear Instancia EC2

1. Ve a **AWS Console → EC2 → Instances → Launch Instance**
2. Selecciona:
   - **AMI**: Amazon Linux 2 (gratuita en tier libre)
   - **Instance Type**: t3.small o t2.micro (tier libre)
   - **Storage**: 20GB (mínimo)
3. **Security Group**: Abre los puertos mencionados arriba
4. **Descarga el Key Pair** (.pem) y guárdalo en un lugar seguro

### 3. Conectar a la Instancia

```bash
# En Windows (PowerShell o CMD):
$keyPath = "C:\ruta\a\tu\key.pem"
$ec2IP = "tu-ip-publica"

# Cambiar permisos (solo primera vez)
icacls $keyPath /grant:r "$env:username`:F"

# Conectar:
ssh -i $keyPath ec2-user@$ec2IP
```

O usa **EC2 Instance Connect** desde la consola de AWS.

### 4. Preparar tu Código

Antes de ejecutar el script, asegúrate que:

```bash
# En tu máquina local:

# 1. El backend tenga un Dockerfile
cat backend/Dockerfile

# 2. El frontend tenga un Dockerfile
cat my-msvc-valle-del-sol/Dockerfile

# 3. Sube los cambios a GitHub
git add .
git commit -m "Preparar para despliegue en EC2"
git push origin main
```

**Ejemplo Dockerfile para backend** (si no existe):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]
```

**Ejemplo Dockerfile para frontend**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 5. Ejecutar el Despliegue en EC2

Una vez conectado a la instancia:

```bash
# Descargar el script de despliegue
curl -O https://raw.githubusercontent.com/tu-usuario/caso_muni/main/deploy-ec2.sh

# O si tienes el archivo localmente:
scp -i key.pem deploy-ec2.sh ec2-user@tu-ip:/home/ec2-user/

# Dar permisos de ejecución
chmod +x deploy-ec2.sh

# Ejecutar (esto puede tomar 5-10 minutos)
./deploy-ec2.sh
```

Si prefieres configurar manualmente:

```bash
# 1. Instalar Docker
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# 2. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clonar tu repositorio
git clone https://github.com/tu-usuario/caso_muni.git
cd caso_muni

# 4. Crear archivo .env
cat > .env << EOF
DB_USER=postgres
DB_PASSWORD=tu-password-seguro-aqui
DB_NAME=valle_de_sol
NODE_ENV=production
API_HOST=tu-ip-publica
NEXT_PUBLIC_API_URL=http://tu-ip-publica:8081
EOF

# 5. Levantar servicios
docker-compose -f docker-compose.prod.yaml up -d
```

### 6. Verificar que Todo Funciona

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yaml ps

# Ver logs del backend
docker-compose -f docker-compose.prod.yaml logs -f api_backend

# Ver logs del frontend
docker-compose -f docker-compose.prod.yaml logs -f vista_frontend

# Probar conectividad a PostgreSQL
docker-compose -f docker-compose.prod.yaml exec base_de_datos psql -U postgres -d valle_de_sol
```

---

## 📊 Obtener IP Pública

```bash
# Desde EC2:
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Desde AWS Console:
EC2 → Instances → Selecciona tu instancia → Public IPv4 address
```

---

## 🔄 Comandos Útiles

```bash
# Actualizar código y reiniciar servicios
cd ~/caso_muni
git pull origin main
docker-compose -f docker-compose.prod.yaml up -d --build

# Ver todos los logs
docker-compose -f docker-compose.prod.yaml logs -f

# Detener servicios (sin eliminar datos)
docker-compose -f docker-compose.prod.yaml down

# Eliminar todo (incluyendo datos)
docker-compose -f docker-compose.prod.yaml down -v

# Reiniciar un servicio específico
docker-compose -f docker-compose.prod.yaml restart api_backend
```

---

## 🔒 Recomendaciones de Seguridad

1. **Security Group**: 
   - ❌ NO abras puerto 5432 a 0.0.0.0 (solo desde EC2)
   - ✅ Limita puertos 3000 y 8081 si es posible

2. **Variables Sensibles**:
   - Cambia la contraseña en `.env`
   - Usa AWS Secrets Manager o Parameter Store en producción

3. **Certificado SSL**:
   - Usa Let's Encrypt con Nginx/Apache
   - O usa AWS Certificate Manager + ALB

4. **Backups de BD**:
   ```bash
   docker-compose -f docker-compose.prod.yaml exec base_de_datos pg_dump -U postgres valle_de_sol > backup.sql
   ```

---

## 💰 Costos Aproximados (AWS Free Tier)

- **EC2 t2.micro**: Gratis 12 meses
- **Transferencia de datos**: Primeros 100GB/mes gratis
- **Almacenamiento**: 30GB/mes gratis
- **Total**: Aproximadamente **$0 - $10 USD/mes** después del tier libre

---

## ❌ Solución de Problemas

### Puerto ya en uso
```bash
docker ps -a
docker-compose -f docker-compose.prod.yaml down
```

### Permisos denegados
```bash
sudo usermod -aG docker ec2-user
# Necesitas desconectarte y reconectarte
```

### Contenedores se detienen
```bash
docker-compose -f docker-compose.prod.yaml logs -f
# Revisa los errores en los logs
```

### Sin conexión a BD
```bash
# Verifica que la BD esté corriendo
docker-compose -f docker-compose.prod.yaml ps base_de_datos

# Intenta conectar
docker-compose -f docker-compose.prod.yaml exec base_de_datos psql -U postgres
```

---

## 📞 Próximos Pasos

1. ✅ Subir Dockerfiles al repositorio
2. ✅ Crear instancia EC2
3. ✅ Ejecutar script de despliegue
4. ✅ Verificar servicios
5. ✅ Configurar dominio/DNS
6. ✅ Configurar SSL/HTTPS
7. ✅ Configurar backups automáticos
