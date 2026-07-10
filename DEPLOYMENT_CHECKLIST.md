# ✅ Checklist Pre-Despliegue EC2

Antes de desplegar en EC2, verifica que todo esté listo:

## 1. Dockerfiles ✓

- [ ] **backend/Dockerfile** existe
- [ ] **my-msvc-valle-del-sol/Dockerfile** existe

**Si NO existen**, crea los archivos:

### backend/Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/health || exit 1
CMD ["npm", "run", "start"]
```

### my-msvc-valle-del-sol/Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1
CMD ["npm", "run", "start"]
```

## 2. Scripts de Inicio ✓

- [ ] **backend/package.json** tiene `"start"` script
- [ ] **my-msvc-valle-del-sol/package.json** tiene `"start"` script

**Verifica en package.json**:
```json
{
  "scripts": {
    "start": "node server.js",  // o tu comando
    "build": "next build",       // para frontend
    "dev": "next dev"
  }
}
```

## 3. Variables de Entorno ✓

- [ ] Creado archivo **.env.example** con variables necesarias
- [ ] Backend lee variables de entorno (DB_HOST, DB_PORT, etc.)
- [ ] Frontend tiene NEXT_PUBLIC_API_URL

**Backend (node/express)**:
```typescript
// Debe usar:
process.env.DB_HOST
process.env.DB_PORT
process.env.DB_USER
process.env.DB_PASSWORD
```

**Frontend (Next.js)**:
```typescript
// Debe usar:
process.env.NEXT_PUBLIC_API_URL
```

## 4. Archivos de Configuración ✓

- [ ] **docker-compose.prod.yaml** existe
- [ ] **deploy-ec2.sh** existe
- [ ] **AWS_EC2_DEPLOYMENT_GUIDE.md** existe

## 5. Repositorio Git ✓

- [ ] Código en GitHub/GitLab
- [ ] `.git` configurado correctamente
- [ ] Branch principal es `main` o `master`

**Verifica**:
```bash
git remote -v
# Debe mostrar tu repositorio remoto
```

## 6. Credenciales ✓

- [ ] AWS account creada
- [ ] AWS credentials configuradas locally (opcional)
- [ ] SSH key pair descargada en lugar seguro

## 7. Puertos ✓

- [ ] Puerto **22** (SSH) abierto en Security Group
- [ ] Puerto **3000** (Frontend) abierto
- [ ] Puerto **8081** (Backend) abierto
- [ ] Puerto **5432** (PostgreSQL) **cerrado al público**

## 8. Pruebas Locales ✓

Antes de subir a EC2, prueba localmente:

```bash
# Prueba el docker-compose.prod.yaml localmente:
docker-compose -f docker-compose.prod.yaml up

# Verifica que todo funciona:
# - http://localhost:3000 (Frontend)
# - http://localhost:8081 (Backend)
# - localhost:5432 (PostgreSQL)

# Si hay errores, ajusta Dockerfiles y variables
docker-compose -f docker-compose.prod.yaml down
```

## 9. Documentación ✓

- [ ] Todos saben cómo acceder a EC2
- [ ] Documentado proceso de actualización
- [ ] Backup procedures documentados

## 10. Monitoreo ✓

- [ ] CloudWatch habilitado (opcional)
- [ ] Logs de Docker accesibles
- [ ] Health checks configurados

---

## Comando para Verificar TODO

```bash
# Ejecuta esto en tu repositorio local:

echo "=== Verificando Dockerfiles ==="
ls -la backend/Dockerfile my-msvc-valle-del-sol/Dockerfile

echo "=== Verificando docker-compose.prod.yaml ==="
ls -la docker-compose.prod.yaml

echo "=== Verificando variables en package.json ==="
grep -A2 '"scripts"' backend/package.json
grep -A2 '"scripts"' my-msvc-valle-del-sol/package.json

echo "=== Verificando Git ==="
git remote -v
git status

echo "=== Probando docker-compose ==="
docker-compose -f docker-compose.prod.yaml config

echo "✅ Pre-checks completados!"
```

---

## Próximos Pasos

1. ✅ Completa este checklist
2. ✅ Sube todo a GitHub
3. ✅ Crea instancia EC2
4. ✅ Ejecuta `./deploy-ec2.sh`
5. ✅ Verifica servicios
6. ✅ Configura dominio (opcional)

---

**¿Todo listo?** Continúa con `EC2_QUICK_START.md`
