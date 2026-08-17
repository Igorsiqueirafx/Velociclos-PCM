# Próximos Passos: Fidelização de Leads e Proteção do /entrar

## Contexto

A tela `/entrar` foi criada para coletar emails de leads no Supabase tabela `subscribers`.
Build passou, mas há riscos de abuso e falta integração de e-mail marketing.

**Estado atual do código (uncommitted):**
- `frontend/app/entrar/page.tsx` — formulário de email
- `frontend/app/entrar/actions.ts` — Server Action → `supabase.from('subscribers').insert()`
- `frontend/app/lib/supabase/server.ts` — cliente server-side
- `frontend/app/page.tsx` — botão "Entrar" adicionado na home

**Supabase:** tabela `subscribers` (coluna `email`, unique) — **não existe migration**. Deve ser
criada manualmente via SQL Editor.

## Objetivo

1. Proteger o formulário `/entrar` contra spam/abuse
2. Integrar e-mail marketing (bem-vindo automático)
3. Criar página admin para listar leads
4. Documentar schema Supabase

## Tarefas

### 1. Criar tabela subscribers (alta prioridade)
- **Arquivo:** `.kilo/queries/subscribers.sql` (novo)
- Criar migration SQL:
  ```sql
  create table if not exists public.subscribers (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    source text default 'website',
    created_at timestamp with time zone default now()
  );
  ```
- Habilitar RLS + políticas públicas (insert/select)
- **Validação:** executar no Supabase SQL Editor, confirmar tabela criada

### 2. Adicionar proteção anti-spam ao /entrar (alta prioridade)
- **Arquivo:** `frontend/app/entrar/actions.ts`
- Adicionar rate limiting simples (máx 3 envios por 10 min por IP) usando
  `x-forwarded-for` ou fallback para `127.0.0.1`
- Implementar em memória (Map com TTL) — suficiente para Vercel Serverless

### 3. Integrar e-mail marketing (média-alta prioridade)
Opções — eleger uma:
- **Recomendado:** Brevo (Sendinblue) — tem plano gratuito, SDK JS server-side
- Alternativa: Mailchimp, MailerLite

**Implementação:**
- **Arquivo:** `backend/server.js` (ou Nova Server Action)
- Após sucesso no `registerEmail`, fazer webhook para Brevo para:
  1. Adicionar subscriber à lista
  2. Enviar e-mail de boas-vindas

### 4. Criar página de listagem no dashboard (média prioridade)
- **Arquivo:** `frontend/app/dashboard/subscribers/page.ts` (nova rota)
- Query: `supabase.from('subscribers').select('*').order('created_at', desc)`
- Tabela simples com email, data, source
- Adicionar link no sidebar

### 5. Documentar schema (média prioridade)
- **Arquivo:** `.kilo/queries/subscribers.sql` (já incluído acima)
- Atualizar `frontend/.env.example` — documentar que `NEXT_PUBLIC_BACKEND_URL`
  é usado pelo frontend para YouTube playlists

### 6. Testar no deploy (alta prioridade)
- `git add -A && git commit && git push origin main`
- Verificar `https://velociclos.vercel.app/entrar`
- Testar cadastro duplicado (erro 23505)
- Testar rate limiting (3ª tentativa deve bloquear)

## Riscos

1. **Tabela subscribers não criada** — `/entrar` falhará com erro 500 se Supabase
   não tiver a tabela. Validar antes do deploy.
2. **Rate limiting em memória (serverless)** — não persiste entre invocações.
   Suficiente para deter spam casual, não para ataque distribuído.
3. **CORS do backend** — `*` em dev, mas pode precisar de ajuste para produção.

## Abrangência

- **Frontend:** `/entrar/*`, `/dashboard/subscribers/*` (nova)
- **Backend:** opcional, se webhook Brevo for no backend
- **Supabase:** nova tabela `subscribers`, políticas RLS
- **Deploy:** Vercel (frontend), Supabase (database)

## Validação

- [ ] Tabela `subscribers` criada e queryable via Supabase
- [ ] `/entrar` aceita novo email → sucesso
- [ ] `/entrar` rejeita email duplicado → mensagem amigável
- [ ] `/entrar` bloqueia >3 tentativas em 10 min → erro
- [ ] `/dashboard/subscribers` lista emails (admin auth)
- [ ] Build + typecheck passam
- [ ] E-mail de boas-vindas enviado (se Brevo integrado)
