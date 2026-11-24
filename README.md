# Velociclos PCM

Automação de Mercado - Expert Advisor, Método Fimathe e cursos gratuitos para traders.

## Estrutura do Projeto

```
Velociclos-PCM-1/
├── backend/           # API Express + repositórios in-memory
├── frontend/          # Next.js 15, React 19, Tailwind, Apple Glass CSS
├── public/            # Assets estáticos
├── scripts/           # Scripts de utilitário
├── .github/workflows/ # CI/CD (GitHub Actions)
├── .kilo/             # Configuração do Kilo e planos
├── package.json       # Root (scripts de deploy)
└── README.md
```

## Começando

### Pré-requisitos

- Node.js 20+
- npm

### Backend

```bash
cd backend
cp .env.example .env   # configurar variáveis de ambiente
npm install
npm run dev            # http://localhost:3001
```

Acesse `http://localhost:3001/api/health` para verificar o status.

### Frontend

```bash
cd frontend
cp .env.example .env.local   # configurar NEXT_PUBLIC_BACKEND_URL
npm install
npm run dev                  # http://localhost:3000
```

### Variáveis de Ambiente

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_BACKEND_URL` - URL da API backend (padrão: `https://velociclos-api.vercel.app`)

**Backend** (`.env`):
- `PORT` - Porta do servidor (padrão: 3001)
- `CORS_ORIGIN` - Origens permitidas para CORS
- `USE_IN_MEMORY` - Definir como `false` para usar Supabase (padrão: `true`)

## Scripts Disponíveis

### Frontend (`frontend/package.json`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção (Next.js) |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run lint:fix` | Executa ESLint com auto-correção |
| `npm run lint:types` | Executa ESLint com tipagem estrita |
| `npm test` | Executa testes unitários (Vitest) |
| `npm run test:coverage` | Testes com cobertura |
| `npm run test:e2e` | Testes E2E (Playwright) |

### Backend (`backend/package.json`)

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor |
| `npm run dev` | Início em desenvolvimento |
| `npm test` | Testes de repositório |

## Páginas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/cursos` | Cursos e aulas do Método Fimathe |
| `/cursos/videos` | Catálogo de vídeos |
| `/cursos/momentos` | Momentos chave |
| `/artigos` | Artigos sobre trading e Forex |
| `/certificados` | Certificados e credenciais |
| `/metodo-fimathe` | O Método Fimathe |
| `/manual` | Manual do Usuário (EA) |
| `/ea` | Expert Advisor - download |
| `/relogio` | Relógio das sessões Forex |
| `/sitemap` | Mapa do site |

## Design System

O frontend utiliza a linguagem visual **Apple Glass** com:

- `.glass`, `.glass-card`, `.glass-subtle`, `.glass-header` - glassmorphism
- `.gradient-text`, `.gradient-hero`, `.gradient-card` - gradientes
- `.hover-lift`, `.hover-glow` - efeitos de hover
- `.card`, `.card-elevated` - cards elevados
- `.btn-primary`, `.btn-secondary` - botões Apple-style
- `.section-lg`, `.section-md`, `.section-sm` - espaçamento de seções

Todos os estilos estão em `frontend/app/globals.css`.

## Testes

### Testes Unitários (Vitest)

```bash
cd frontend
npm test
```

### Testes E2E (Playwright)

```bash
cd frontend
npm run test:e2e
```

Os testes E2E requerem um servidor rodando em `http://localhost:3000`.

## Build de Produção

```bash
cd frontend
npm run build
```

O build gera a saída em `.next/` e é implantado automaticamente no Vercel via push na branch `main`.

## CI/CD

O GitHub Actions executa em todo push/PR na branch `main`:

1. **lint-and-typecheck** - ESLint + TypeScript typecheck
2. **tests** - Testes unitários (frontend + backend)
3. **build** - Build de produção do frontend

O backend é implantado na Railway via workflow separado (`deploy-backend.yml`).

## Segurança

- Arquivos `.env`, `.env.local` estão no `.gitignore` e nunca devem ser commitados
- Dependência `@supabase/*` removida do frontend e backend
- API usa CORS com origens configuráveis

## Licença

Privado - Velociclos PCM