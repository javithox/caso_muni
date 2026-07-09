# 🚀 Quick Start - EC2 + Docker Compose

## Paso 1: Verificar Dockerfiles

Asegúrate que existan estos archivos:

```bash
backend/Dockerfile
my-msvc-valle-del-sol/Dockerfile
```

Si no existen, crea uno como ejemplo:

**backend/Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD ["npm", "run", "start"]
```

**my-msvc-valle-del-sol/Dockerfile**:
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

## Paso 2: Sube tu código a GitHub

```bash
git add .
git commit -m "Preparar para despliegue en EC2"
git push origin main
```

## Paso 3: Crear Instancia EC2 en AWS

1. AWS Console → EC2 → Launch Instance
2. Amazon Linux 2 AMI
3. Instance: t2.micro (gratis 12 meses)
4. Storage: 20GB
5. Security Group: Puertos 22, 3000, 8081, 5432
6. Crear y descargar Key Pair (.pem)

## Paso 4: Conectar a EC2

```bash
# Windows PowerShell:
ssh -i "tu-key.pem" ec2-user@tu-ip-publica

# Linux/Mac:
ssh -i tu-key.pem ec2-user@tu-ip-publica
```

## Paso 5: Ejecutar despliegue

```bash
# Opción A: Usar el script (recomendado)
curl https://raw.githubusercontent.com/tu-usuario/caso_muni/main/deploy-ec2.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh

# Opción B: Instalar manualmente
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo usermod -aG docker ec2-user

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

git clone https://github.com/tu-usuario/caso_muni.git
cd caso_muni

# Crear .env
cat > .env << EOF
DB_USER=postgres
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=valle_de_sol
API_HOST=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
NEXT_PUBLIC_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8081
EOF

# Levantar servicios
docker-compose -f docker-compose.prod.yaml up -d
```

## Paso 6: Verificar

```bash
# Ver IP pública
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Ver servicios
docker-compose -f docker-compose.prod.yaml ps

# Ver logs
docker-compose -f docker-compose.prod.yaml logs -f
```

## URLs de Acceso

- **Frontend**: http://tu-ip-publica:3000
- **Backend**: http://tu-ip-publica:8081
- **PostgreSQL**: tu-ip-publica:5432

---

## Mantenimiento

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yaml logs -f

# Actualizar código
git pull origin main
docker-compose -f docker-compose.prod.yaml up -d --build

# Detener servicios
docker-compose -f docker-compose.prod.yaml down

# Reiniciar todo
docker-compose -f docker-compose.prod.yaml restart
```

---

¿Necesitas más detalles? Lee `AWS_EC2_DEPLOYMENT_GUIDE.md`
