/**
 * Checklist de Validação: Todas as Páginas Públicas
 * Data: 2026-08-30
 * Objetivo: Garantir que todas as páginas estão acessíveis no deploy
 */

// ============================================
// CHECKLIST DE DEPLOY - VERCEL
// ============================================

/*
ANTES DO DEPLOY:
- [ ] `npm run build` — Build sem erros
- [ ] `npm run lint` — Linting passed
- [ ] TypeScript — `npx tsc --noEmit` sem erros
- [ ] Variáveis de ambiente adicionadas no Vercel
  - [ ] NEXT_PUBLIC_SUPABASE_URL (mesmo projeto do painel)
  - [ ] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (mesmo projeto do painel)
  - [ ] URL de callback do Supabase Auth inclui o domínio publicado

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
  - [ ] /sitemap
- [ ] Links de autenticação funcionam:
  - [ ] /auth/login
- [ ] Login Supabase por email e Google funciona
- [ ] /download só libera usuários autenticados cujo email está cadastrado em leads
- [ ] Backend API conectado e funcionando:
  - [ ] /api/health retorna status ok

MONITORAMENTO:
- [ ] Verificar logs do Vercel para erros
- [ ] Testar em dispositivos móveis
- [ ] Testar em navegadores diferentes
- [ ] Validar SEO (meta tags, robots.txt)
*/

export default {}
