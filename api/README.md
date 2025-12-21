# 🚀 Guia Rápido - PostgreSQL Setup

## Setup Completo em 5 Minutos

### 1. Instalar dependências

```powershell
cd api
npm install
```

### 2. Criar arquivo .env

```powershell
cp .env.example .env
```

### 3. Iniciar PostgreSQL

```powershell
docker-compose up -d
```

### 4. Aguardar inicialização (10 segundos)

```powershell
Start-Sleep -Seconds 10
```

### 5. Gerar e aplicar migrations

```powershell
npm run db:generate
npm run db:migrate
```

### 6. Popular banco com produtos

```powershell
npm run seed
```

### 7. Iniciar servidor

```powershell
npm run dev
```

✅ **API rodando em**: `http://localhost:3333`

## Testar Endpoints

```powershell
# Listar produtos
curl http://localhost:3333/api/v1/products

# Produto específico
curl http://localhost:3333/api/v1/products/moletom-oversized-numero-4

# Produtos em destaque
curl http://localhost:3333/api/v1/products/featured
```

## Comandos Úteis

```powershell
# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Acessar banco via CLI
docker exec -it zona-street-db psql -U zonastreet -d zonastreet

# Resetar tudo
docker-compose down -v
docker-compose up -d
npm run db:migrate
npm run seed
```

## Troubleshooting

❌ **Erro de conexão?**

```powershell
# Verificar se PostgreSQL está rodando
docker ps

# Se não estiver, iniciar
docker-compose up -d
```

❌ **Porta 5432 em uso?**

```yaml
# Alterar porta no docker-compose.yml
ports:
  - "5433:5432"

# Atualizar DATABASE_URL no .env
DATABASE_URL=postgresql://zonastreet:zonastreet_dev_2024@localhost:5433/zonastreet
```

---

📚 **Documentação completa**: `docs/DATABASE_SETUP.md`
