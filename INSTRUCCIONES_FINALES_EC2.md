# 🚀 Instrucciones Finales - Despliegue en EC2

## Distribución de Recursos (t2.small = 2GB RAM)

```
┌─ postgres:15-alpine ──────────────────┐
│  Limit: 512M  │ Reserve: 256M         │
└───────────────────────────────────────┘

┌─ Backend (Express/Node) ──────────────┐
│  Limit: 512M  │ Reserve: 256M         │
│  NODE_OPTIONS: --max-old-space-size=256M
└───────────────────────────────────────┘

┌─ Frontend (Next.js) ──────────────────┐
│  Limit: 256M  │ Reserve: 128M         │
└───────────────────────────────────────┘

Sistema Operativo: ~244M
─────────────────────────────────────────
TOTAL: ~1.5GB ✅ (con margen)
```

---

## 📝 Cambios Realizados al docker-compose.yaml

### ✅ PostgreSQL
- `max_connections: 50` - Evita agotamiento de conexiones
- Healthcheck más rápido: 5s (antes 10s)
- `deploy.resources.limits: 512M`
- `deploy.resources.reservations: 256M`

### ✅ Backend
- `NODE_OPTIONS: --max-old-space-size=256` - Limita memoria Node.js
- Healthcheck cada 15s (antes 30s)
- `deploy.resources.limits: 512M`
- `deploy.resources.reservations: 256M`

### ✅ Frontend
- Healthcheck cada 15s (antes 30s)
- `deploy.resources.limits: 256M`
- `deploy.resources.reservations: 128M`

---

## 🎯 Pasos Para EC2

### 1. Conectar a EC2
```bash
ssh -i tu-key.pem ec2-user@tu-ip-publica
```

### 2. Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/caso_muni.git
cd caso_muni
```

### 3. Crear Archivo .env
```bash
cat > .env << EOF
DB_USER=postgres
DB_PASSWORD=tu-password-seguro
DB_NAME=valle_de_sol
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://tu-ip-ec2:8081
EOF
```

### 4. Levantar Servicios
```bash
docker-compose up -d
```

### 5. Verificar Estado
```bash
# Ver contenedores
docker-compose ps

# Ver consumo de recursos
docker stats

# Ver logs
docker-compose logs -f
```

---

## 📊 URLs de Acceso

Reemplaza `tu-ip-publica` con la IP real de tu EC2:

- **Frontend**: http://tu-ip-publica:3000
- **Backend**: http://tu-ip-publica:8081
- **PostgreSQL**: tu-ip-publica:5432

---

## 🔄 Comandos Útiles para EC2

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api_backend

# Detener servicios (sin eliminar datos)
docker-compose down

# Eliminar todo (incluyendo datos)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Reconstruir e iniciar
docker-compose up -d --build

# Ver consumo de recursos
docker stats

# Ejecutar comando en un contenedor
docker-compose exec api_backend npm run test
```

---

## ⚠️ Requisitos Previos en EC2

### Sistema Actualizado
```bash
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

### Docker Compose Instalado
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 🔒 Recomendaciones de Seguridad

1. **Contraseña BD**: Usa una contraseña segura
   ```bash
   openssl rand -base64 32
   ```

2. **Security Group AWS**:
   - Puerto 22 (SSH): Tu IP
   - Puerto 3000 (Frontend): 0.0.0.0
   - Puerto 8081 (Backend): 0.0.0.0
   - Puerto 5432 (PostgreSQL): Solo desde EC2 (o tu IP)

3. **Archivo .env**: No lo subas a GitHub
   ```bash
   echo ".env" >> .gitignore
   git add .gitignore
   git commit -m "Ignorar .env"
   git push
   ```

---

## 📈 Monitoreo

### Ver Recursos
```bash
docker stats

# Esperado:
# CONTAINER        MEM USAGE / LIMIT   CPU %
# database_postgres 120M / 512M        2.3%
# mi_backend       150M / 512M        5.1%
# mi_frontend      80M / 256M         1.2%
```

### Si Alguno Toca su Límite
- **PostgreSQL > 512M**: Demasiadas conexiones
- **Backend > 512M**: Memory leak en código
- **Frontend > 256M**: Caché de Next.js lleno

### Solución
```bash
# Ver logs para diagnosticar
docker-compose logs api_backend

# Reiniciar
docker-compose restart api_backend

# Si es persistente, reducir límites en docker-compose.yaml
```

---

## 🔄 Actualizar Código

```bash
# Pull de cambios
git pull origin main

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

---

## 💾 Backup de Base de Datos

```bash
# Hacer backup
docker-compose exec base_de_datos pg_dump -U postgres valle_de_sol > backup.sql

# Restaurar desde backup
cat backup.sql | docker-compose exec -T base_de_datos psql -U postgres
```

---

## 🆘 Troubleshooting

### Contenedores No Inician
```bash
docker-compose logs
# Busca mensajes de error

# Limpiar y reintentar
docker-compose down
docker-compose up -d
```

### No Hay Conexión a BD
```bash
# Verificar que BD esté corriendo
docker-compose ps base_de_datos

# Ver logs de BD
docker-compose logs base_de_datos

# Intentar conectar
docker-compose exec base_de_datos psql -U postgres
```

### Memoria Llena
```bash
# Ver consumo
docker stats

# Si un servicio está saturado:
docker-compose logs [nombre-servicio]

# Reiniciar ese servicio
docker-compose restart [nombre-servicio]
```

### Puerto Ya en Uso
```bash
# Ver qué ocupa los puertos
netstat -tulpn | grep LISTEN

# O simplemente detener y reiniciar
docker-compose down
docker-compose up -d
```

---

## 📋 Checklist Final

Antes de poner en producción:

- [ ] Dockerfile backend existe
- [ ] Dockerfile frontend existe
- [ ] docker-compose.yaml está optimizado
- [ ] .env creado con contraseña segura
- [ ] .env añadido a .gitignore
- [ ] Código está en GitHub
- [ ] Instancia EC2 creada (t2.small recomendado)
- [ ] Security Group configurado
- [ ] SSH key guardado en lugar seguro
- [ ] Docker e Docker Compose instalados en EC2
- [ ] Servicios se levantan sin errores
- [ ] URLs accesibles
- [ ] Logs sin errores

---

## 🎯 Próximos Pasos (Opcional)

1. **Dominio Propio**: Configurar Route53 o DNS
2. **SSL/HTTPS**: Let's Encrypt (gratis) o AWS Certificate Manager
3. **Backups Automáticos**: Cron job diario
4. **Monitoreo**: CloudWatch o Datadog
5. **Auto Scaling**: Para múltiples instancias
6. **Load Balancer**: Para distribuir tráfico

---

## 📞 Resumen Rápido

```bash
# TODO en 5 pasos:
1. ssh -i key.pem ec2-user@ip
2. git clone repo && cd caso_muni
3. cat > .env << EOF ...
4. docker-compose up -d
5. docker-compose ps && docker stats
```

---

**¡Listo para producción!** 🚀
