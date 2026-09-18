# Plano de Execução: Velociclos PCM - Produção

## Objetivo
Colocar o site Velociclos PCM em produção operacional no domínio `https://velociclos.vercel.app`, com backend funcional, frontend atualizado e todas as rotas públicas operando.

---

## Fase 1 - Diagnóstico e Correção Crítica (0-24h)

### 1.1 Validar deploy do Frontend
- **Ação**: Confirmar que o commit `da0d7a7` (`eslint.ignoreDuringBuilds: true`) teve deploy bem-sucedido no projeto **Frontend**.
- **Validação**: Acessar `https://velociclos.vercel.app/cursos` e verificar se a página reflete as alterações de backend.
- **Status**: Em andamento.
- **Responsável**: DevOps / Frontend.

### 1.2 Corrigir variáveis de ambiente do Frontend
- **Ação**: No Vercel Dashboard do projeto **Frontend**, atualizar:
  - `NEXTAUTH_URL`: `https://velociclos.vercel.app`
  - `AUTH_SECRET`: gerar com `openssl rand -base64 32` e configurar.
  - `GITHUB_CLIENT_ID`: adicionar credencial real.
  - `GITHUB_CLIENT_SECRET`: adicionar credencial real.
- **Validação**: `vercel env ls` e teste de login em `/auth/login`.
- **Status**: Pendente.
- **Responsável**: Backend + Frontend.

### 1.3 Corrigir variáveis do Backend
- **Ação**: Confirmar no projeto `velociclos-api`:
  - `CORS_ORIGIN`: `https://velociclos.vercel.app`
  - `FRONTEND_URL`: `https://velociclos.vercel.app`
- **Validação**: Teste de CORS no browser e `curl` do frontend para backend.
- **Status**: Pendente.
- **Responsável**: Backend.

---

## Fase 2 - Conteúdo e Dados (24-48h)

### 2.1 Popular backend com cursos reais
- **Ação**: Cadastrar cursos, módulos e aulas via admin do dashboard ou seed manual em produção.
- **Validação**: `GET https://velociclos-api.vercel.app/api/courses` retorna dados não-vazios.
- **Status**: Pendente.
- **Responsável**: Conteúdo / Produto.

### 2.2 Verificar seed de desenvolvimento
- **Ação**: Confirmar que o seed em `backend/server.js` só roda em `USE_IN_MEMORY=true` (dev).
- **Validação**: Em produção, seed não deve interferir nos dados reais.
- **Status**: Em análise.
- **Responsável**: Backend.

---

## Fase 3 - Páginas Faltantes (48-72h)

### 3.1 Implementar `/entrar`
- **Ação**: Criar página `frontend/app/entrar/page.tsx` e `actions.ts` com:
  - Formulário de e-mail/nome.
  - Rate limiting (3 tentativas/10min).
  - Fallback gracioso sem dependência de e-mail.
- **Validação**: Submissão retorna 200 e salva lead em `/api/leads`.
- **Status**: Concluído.
- **Responsável**: Frontend.

### 3.2 Remover referência a `/auth/register`
- **Ação**: Remover link e referência de checklist/docs. Google OAuth fica postergado.
- **Validação**: Navegação e docs não apontam mais para `/auth/register`.
- **Status**: Concluído.
- **Responsável**: Frontend.

---

## Fase 4 - Integrações (72-96h)

### 4.1 Confirmar domínio de produção
- **Ação**: Manter `https://velociclos.vercel.app` como domínio oficial. Garantir `CORS_ORIGIN`, `FRONTEND_URL` e `NEXTAUTH_URL` alinhados.
- **Validação**: Site acessível e CORS ok.
- **Status**: Pendente.
- **Responsável**: DevOps.

---

## Fase 5 - Validação e Fechamento (96-120h)

### 5.1 Testes end-to-end
- Rotas públicas: `/`, `/cursos`, `/artigos`, `/certificados`, `/manual`, `/ea`, `/relogio`, `/sitemap`.
- Auth: `/auth/login` redireciona para GitHub, callback funciona.
- Admin: `/dashboard` acessível apenas para admins.
- API: `/api/health`, `/api/courses`, `/api/articles` respondem.

### 5.2 Métricas de sucesso
- Frontend build: 0 erros.
- Backend health: `{"status":"ok"}`.
- `/cursos`: lista cursos do backend.
- `/entrar`: salva lead com sucesso.
- Todas as rotas do header/footer retornam 200.

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| ESLint bloqueando build novamente | Baixa | Alto | Mantido `ignoreDuringBuilds: true`. |
| Dados de produção vazios | Alta | Alto | Popular manualmente via admin antes de abrir ao público. |
| Auth OAuth quebrado por variável faltando | Alta | Alto | Checklist rigoroso de env vars antes de deploy. |
| CORS bloqueando frontend | Baixa | Alto | Testar com `curl` antes de abrir ao público. |

---

## Decisões

1. **Google OAuth**: Referência removida do checklist e docs. Implementação fica postergada.
2. **Seed de cursos**: Automático em produção. O backend cria dados iniciais se a base estiver vazia.
3. **Domínio customizado**: Não haverá domínio próprio por enquanto. Produção usa `https://velociclos.vercel.app`.
