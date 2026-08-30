/**
 * Checklist de Validação: Todas as Páginas Públicas
 * Data: 2026-08-30
 * Objetivo: Garantir que todas as páginas estão acessíveis no deploy
 */

// ============================================
// PÁGINAS PÚBLICAS - SEM AUTENTICAÇÃO
// ============================================

// ✅ Home Page
// URL: /
// Método: GET
// Auth: Não
// Descrição: Página inicial com hero, benefits e CTA
// Status: ✅ Implementada

// ✅ Cursos
// URL: /cursos
// Método: GET  
// Auth: Não
// Descrição: Listagem de playlists YouTube com método Fimathe
// Status: ✅ Implementada

// ✅ Artigos (Blog)
// URL: /artigos
// Método: GET
// Auth: Não
// Descrição: Blog com filtros por categoria
// Status: ✅ Implementada

// ✅ Certificados
// URL: /certificados
// Método: GET
// Auth: Não
// Descrição: Galeria com certificados de conclusão
// Status: ✅ Implementada

// ✅ Método Fimathe
// URL: /metodo-fimathe
// Método: GET
// Auth: Não
// Descrição: Explicação do método de trading
// Status: ✅ Implementada

// ✅ Manual (Guia de Instalação)
// URL: /manual
// Método: GET
// Auth: Não
// Descrição: Documentação do Expert Advisor
// Status: ✅ Implementada

// ✅ Expert Advisor (EA)
// URL: /ea
// Método: GET
// Auth: Não
// Descrição: Info sobre EA com download
// Status: ✅ Implementada

// ✅ Relógio Forex (Clock)
// URL: /relogio
// Método: GET
// Auth: Não
// Descrição: Mapa interativo com horários de sessões
// Status: ✅ Implementada

// ✅ Newsletter / Entrar
// URL: /entrar
// Método: GET/POST
// Auth: Não
// Descrição: Formulário de lead capture
// Status: ✅ Implementada (com rate limiting + Brevo email)

// ✅ Lead Capture Landing Page
// URL: /lead-capture
// Método: GET/POST
// Auth: Não
// Descrição: Landing page para captura de contatos
// Status: ✅ Implementada

// ✅ Cadastro Lead
// URL: /cadastro-lead
// Método: GET/POST
// Auth: Não
// Descrição: Formulário de cadastro de leads
// Status: ✅ Implementada

// ✅ Sitemap / Índice
// URL: /sitemap
// Método: GET
// Auth: Não
// Descrição: Mapa completo do site com todas as rotas
// Status: ✅ NOVO - Implementado agora

// ============================================
// PÁGINAS DE AUTENTICAÇÃO
// ============================================

// ✅ Login
// URL: /auth/login
// Método: GET/POST
// Auth: Não (mas usuários logados são redirecionados)
// Descrição: Página de login com Supabase + Google OAuth
// Status: ✅ Implementada

// ✅ Register
// URL: /auth/register
// Método: GET/POST
// Auth: Não (mas usuários logados são redirecionados)
// Descrição: Página de registro com Google OAuth
// Status: ✅ Implementada

// ✅ Auth Callback
// URL: /auth/callback
// Método: GET
// Auth: Supabase OAuth Callback
// Descrição: Handler para redirect OAuth
// Status: ✅ Implementada

// ✅ Logout
// URL: /logout
// Método: GET
// Auth: Recomendado estar logado
// Descrição: Endpoint para fazer logout
// Status: ✅ Implementada

// ============================================
// PÁGINAS PRIVADAS - REQUEREM AUTENTICAÇÃO
// ============================================

// ✅ Meus Leads
// URL: /leads
// Método: GET
// Auth: Sim (Supabase)
// Descrição: Painel de leads capturados pelo usuário
// Status: ✅ Implementada

// ✅ Downloads Exclusivos
// URL: /download
// Método: GET
// Auth: Sim (Supabase)
// Descrição: Acesso a downloads autenticados
// Status: ✅ Implementada

// ============================================
// ADMIN - REQUEREM AUTENTICAÇÃO + ADMIN ROLE
// ============================================

// ✅ Dashboard Admin
// URL: /dashboard
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: Painel administrativo principal
// Status: ✅ Implementada

// ✅ Gestão de Cursos
// URL: /dashboard/cursos
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: CRUD de cursos
// Status: ✅ Implementada

// ✅ Gestão de Artigos
// URL: /dashboard/artigos
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: CRUD de artigos/blog
// Status: ✅ Implementada

// ✅ Gestão de Certificados
// URL: /dashboard/certificados
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: CRUD de certificados
// Status: ✅ Implementada

// ✅ Gestão de Downloads
// URL: /dashboard/downloads
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: CRUD de downloads/EA
// Status: ✅ Implementada

// ✅ Gestão de Páginas
// URL: /dashboard/pages
// Método: GET/POST
// Auth: Sim (Supabase + Admin)
// Descrição: CRUD de páginas estáticas
// Status: ✅ Implementada

// ✅ Gestão de Leads/Subscribers
// URL: /dashboard/subscribers ou /dashboard/leads
// Método: GET
// Auth: Sim (Supabase + Admin)
// Descrição: Listagem de leads capturados
// Status: ✅ Implementada

// ✅ Monitoramento
// URL: /dashboard/monitoramento
// Método: GET
// Auth: Sim (Supabase + Admin)
// Descrição: Health check e monitoramento
// Status: ✅ Implementada

// ============================================
// CHECKLIST DE DEPLOY - VERCEL
// ============================================

/*
ANTES DO DEPLOY:
- [ ] `npm run build` — Build sem erros
- [ ] `npm run lint` — Linting passed
- [ ] TypeScript — `npx tsc --noEmit` sem erros
- [ ] Variáveis de ambiente adicionadas no Vercel dashboard
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  - [ ] BREVO_API_KEY (para email)
  - [ ] ADMIN_PASSWORD (opcional)
  - [ ] ADMIN_EMAILS (para acesso dashboard)

APÓS O DEPLOY:
- [ ] Homepage carrega corretamente: https://velociclos.vercel.app/
- [ ] Header renderiza com novos links (Manual, Relógio, Sitemap)
- [ ] Footer renderiza com links de navegação
- [ ] Todas as rotas públicas acessíveis:
  - [ ] /
  - [ ] /cursos
  - [ ] /artigos
  - [ ] /certificados
  - [ ] /metodo-fimathe
  - [ ] /manual
  - [ ] /ea
  - [ ] /relogio
  - [ ] /entrar
  - [ ] /sitemap
- [ ] Links de autenticação funcionam:
  - [ ] /auth/login
  - [ ] /auth/register
- [ ] Formulário /entrar com rate limiting:
  - [ ] 1ª tentativa — sucesso
  - [ ] 2ª tentativa — sucesso
  - [ ] 3ª tentativa — sucesso
  - [ ] 4ª tentativa — erro (rate limit)
- [ ] Email de boas-vindas enviado (se Brevo configurado)
- [ ] Painel /dashboard protegido (redireciona para login)
- [ ] Supabase conectado e tabelas criadas:
  - [ ] subscribers table com dados

MONITORAMENTO:
- [ ] Verificar logs do Vercel para erros
- [ ] Testar em dispositivos móveis
- [ ] Testar em navegadores diferentes
- [ ] Validar SEO (meta tags, robots.txt)
*/

export default {}
