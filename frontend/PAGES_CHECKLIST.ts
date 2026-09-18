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
- [ ] Variáveis de ambiente adicionadas no Vercel dashboard
  - [ ] GITHUB_CLIENT_ID
  - [ ] GITHUB_CLIENT_SECRET
  - [ ] AUTH_SECRET

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
- [ ] Formulário /entrar com rate limiting:
  - [ ] 1ª tentativa — sucesso
  - [ ] 2ª tentativa — sucesso
  - [ ] 3ª tentativa — sucesso
  - [ ] 4ª tentativa — erro (rate limit)
- [ ] Backend API conectado e funcionando:
  - [ ] /api/health retorna status ok

MONITORAMENTO:
- [ ] Verificar logs do Vercel para erros
- [ ] Testar em dispositivos móveis
- [ ] Testar em navegadores diferentes
- [ ] Validar SEO (meta tags, robots.txt)
*/

export default {}
