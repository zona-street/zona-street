# 🚀 Guia Rápido - Zona Street API

## Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **Database**: Neon PostgreSQL Serverless
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Language**: TypeScript

## Setup Completo em 3 Minutos

### 1. Instalar dependências

```powershell
cd api
npm install
```

### 2. Criar banco no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie uma conta (gratuita)
3. Crie um novo projeto: **"zona-street"**
4. Copie a **Connection String** (formato: `postgres://user:pass@host/db?sslmode=require`)

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env` na pasta `api/`:

```env
DATABASE_URL=postgres://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/zonastreet?sslmode=require
NODE_ENV=development
PORT=3333
API_VERSION=v1
```

### 4. Gerar e aplicar migrations

```powershell
npm run db:generate
npm run db:migrate
```

### 5. Popular banco com produtos

```powershell
npm run seed
```

### 6. Iniciar servidor

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

## Migrações de Banco de Dados

Para atualizar o schema do banco:

1. Faça as mudanças no arquivo `src/db/schema.ts`.
2. Gere a migração: `npm run db:generate`.
3. Aplique a migração: `npm run db:migrate`.

Teste sempre em desenvolvimento antes de aplicar em produção.

## Comandos Úteis

```powershell
# Desenvolvimento com hot-reload
npm run dev

# Gerar nova migration após alterar schema
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Push schema direto (cuidado em produção!)
npm run db:push

# Abrir Drizzle Studio (UI para o banco)
npm run db:studio

# Popular/repovoar banco
npm run seed

# Build para produção
npm run build

# Rodar produção
npm start
```

## Estrutura do Projeto

```
api/
├── src/
│   ├── controllers/     # Handlers HTTP (Fastify)
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso ao banco (Drizzle)
│   ├── models/          # Schemas Zod e interfaces
│   ├── routes/          # Definição de rotas
│   ├── db/
│   │   ├── schema.ts    # Schema Drizzle
│   │   ├── index.ts     # Conexão Neon
│   │   └── migrate.ts   # Script de migrations
│   ├── utils/           # Utilitários (seed, etc)
│   ├── app.ts           # Setup Fastify
│   └── server.ts        # Entry point
├── drizzle/             # Arquivos de migration
├── .env                 # Variáveis de ambiente (não commitar!)
└── package.json
```

## Troubleshooting

### ❌ Erro de conexão com Neon

```powershell
# Verificar se DATABASE_URL está correta
echo $env:DATABASE_URL

# Testar conexão
npm run dev
# Deve aparecer: ✅ Conexão com Neon PostgreSQL estabelecida!
```

### ❌ SSL/TLS errors

Certifique-se que sua `DATABASE_URL` termina com `?sslmode=require`

### ❌ Migration errors

```powershell
# Regenerar migrations
npm run db:generate

# Aplicar novamente
npm run db:migrate
```

### ❌ Tabela products não existe

```powershell
# Aplicar migrations primeiro
npm run db:migrate

# Depois popular
npm run seed
```

## Deploy em Produção

A API está pronta para deploy em plataformas serverless:

- **Vercel**: `vercel deploy`
- **Railway**: Conecte o repo GitHub
- **Render**: Conecte o repo GitHub

**Importante**: Configure a variável `DATABASE_URL` nas variáveis de ambiente da plataforma.

---

## Próximas Features

- Implementar exclusão de pedidos (orders) para permitir exclusão completa de produtos associados, melhorando a gestão de dados no admin.

📚 **Documentação completa**: `docs/DATABASE_SETUP.md`
