#!/bin/bash

# Script de despliegue en EC2
# Uso: ./deploy-ec2.sh

set -e

echo "================================"
echo "Despliegue en AWS EC2"
echo "================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
REPO_URL="${REPO_URL:-https://github.com/tu-usuario/caso_muni.git}"
APP_DIR="/home/ec2-user/caso_muni"
ENV_FILE="$APP_DIR/.env"

# 1. Actualizar sistema
echo -e "${YELLOW}[1/7] Actualizando sistema...${NC}"
sudo yum update -y

# 2. Instalar Docker
echo -e "${YELLOW}[2/7] Instalando Docker...${NC}"
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# 3. Instalar Docker Compose
echo -e "${YELLOW}[3/7] Instalando Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

# 4. Clonar repositorio
echo -e "${YELLOW}[4/7] Clonando repositorio...${NC}"
if [ ! -d "$APP_DIR" ]; then
    git clone $REPO_URL $APP_DIR
else
    cd $APP_DIR
    git pull origin main
fi

cd $APP_DIR

# 5. Crear archivo .env si no existe
echo -e "${YELLOW}[5/7] Configurando variables de entorno...${NC}"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << EOF
# Base de datos
DB_USER=postgres
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=valle_de_sol

# API
API_HOST=localhost
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8081
EOF
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}Guarda estas credenciales en un lugar seguro:${NC}"
    cat "$ENV_FILE"
else
    echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
fi

# 6. Levantar servicios
echo -e "${YELLOW}[6/7] Levantando servicios con Docker Compose...${NC}"
docker-compose -f docker-compose.prod.yaml up -d

# 7. Verificar estado
echo -e "${YELLOW}[7/7] Verificando estado de servicios...${NC}"
sleep 10

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Despliegue completado${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Servicios activos:"
docker-compose -f docker-compose.prod.yaml ps
echo ""
echo "URLs de acceso:"
echo "  - Frontend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "  - Backend:   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8081"
echo "  - PostgreSQL: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5432"
echo ""
echo "Comandos útiles:"
echo "  Ver logs:        docker-compose -f docker-compose.prod.yaml logs -f"
echo "  Detener:         docker-compose -f docker-compose.prod.yaml down"
echo "  Reiniciar:       docker-compose -f docker-compose.prod.yaml restart"
echo "  Actualizar:      git pull && docker-compose -f docker-compose.prod.yaml up -d"
