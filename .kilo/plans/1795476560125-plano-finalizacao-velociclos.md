# Plano de Finalização — Velociclos PCM

## Objetivo
Finalizar o projeto Velociclos PCM: garantir deploy estável, conteúdo real funcionando, design Apple Glass em todas as páginas, SEO, performance, testes e documentação.

## Estado atual (verificado)
- Backend: Express + repositórios in-memory (sem DB). Seed de cursos, artigos e páginas.
- Frontend: Next.js 15, React 19, Tailwind, Apple Glass CSS, auth mock local, sem Supabase.
- Build: ✅ passa (30 páginas). Lint/TypeScript: 0 erros.
- Testes: unit 19/19, backend 21/21, E2E 14/15 (1 footer link falha).
- Deploy: push em `main` dispara Vercel auto-deploy. Build falhou em `fa30a39` (import `Image` faltando no Header — corrigido em `622ec12`). Push vazio `041f72e` disparou redeploy.

## Decisões resolvidas
- Sem banco de dados (in-memory + mock auth). Produção segue sem gate de `/download`.
- Apple Glass como linguagem visual dominante.
- Conteúdo real via seed no backend + fallback estático no frontend.
- Vídeos redirecionam para YouTube (links externos, não embeds pesados).

## Fases de execução

### Fase 1 — Estabilizar deploy (urgente)
1. Verificar painel Vercel: confirmar que o deploy mais recente (`041f72e` ou posterior) subiu sem erros.
2. Se falhou, diagnosticar logs do Vercel (build command, node version, env vars).
3. Confirmar que `https://velociclos.vercel.app` reflete a versão com Apple Glass e seed de conteúdo.
4. Validar `/api/health` no backend de produção.

### Fase 2 — Corrigir vulnerabilidades e testes
5. Rodar `npm audit`. Se `--force` (next 16) for aceitável, aplicar; caso contrário, isolar `postcss` do `next`.
6. Corrigir E2E `footer links navigate to the cursos page`: investigar `Footer.tsx` (link com `href="/cursos"` não navega). Ajustar locator ou componente.
7. Adicionar `not-found.tsx` e `error.tsx` no App Router.

### Fase 3 — Apple Glass em todas as páginas
8. Refatorar `/artigos` (ArtigosClient): hero glass, cards glass-card, gradient text.
9. Refatorar `/cursos` (CursosClient): hero glass, cards glass-card, hover-lift.
10. Refatorar `/metodo-fimathe` (MetodoFimathePage): hero glass, seções com glass-card.
11. Refatorar `/manual` (ManualPage): hero glass, cards glass-card.
12. Refatorar `/ea` (EaPage): hero glass, cards glass-card.
13. Refatorar `/relogio` (ClockPage): hero glass, cards glass-card.
14. Aplicar glass-header no Header (já existe no scroll) e glass no Footer (já feito).
15. Garantir que todas as imagens usem `next/image` e `priority` onde necessário.

### Fase 4 — Conteúdo real e vídeos
16. Expandir seed do backend com mais artigos reais (títulos, excerpts, categorias baseados no método Fimathe).
17. Expandir seed com mais cursos/playlists (usar dados reais do canal YouTube).
18. Garantir que todos os links de vídeo apontem para YouTube (`https://youtube.com/watch?v=...` ou playlist).
19. Substituir `FALLBACK_ARTICLES` por dados do backend quando disponível; manter fallback como último recurso.
20. Adicionar imagens oficiais (Marcelo Ferreira, Fimathe, Hantec) nas seções apropriadas.

### Fase 5 — SEO e performance
21. Criar `app/sitemap.ts` dinâmico com todas as rotas públicas.
22. Criar `app/robots.ts` com regras de crawling.
23. Adicionar OG tags e Twitter cards em `metadata` de todas as páginas.
24. Adicionar meta descriptions únicas por página.
25. Otimizar LCP: `priority` em imagens hero, preconnect para YouTube.
26. Lazy loading de imagens não-críticas.
27. Bundle analysis: rodar `@next/bundle-analyzer` e reduzir bundle size.

### Fase 6 — Acessibilidade e UX
28. Adicionar ARIA labels em todos os botões e links interativos.
29. Garantir navegação por teclado em todos os componentes.
30. Verificar contraste de cores (WCAG AA).
31. Adicionar skip-to-content link.
32. Testar com screen reader (NVDA/VoiceOver).

### Fase 7 — Funcionalidades adicionais
33. Newsletter/lead capture: endpoint local (`/api/leads`) que grava em arquivo JSON.
34. Painel administrativo leve: CRUD local via API in-memory (UI simples em `/admin`).
35. Página de download do EA: instruções de instalação + link de download.
36. Página de contato/suporte com formulário.

### Fase 8 — Testes e CI/CD
37. Adicionar testes E2E para fluxos críticos (navegação, download, filtros).
38. Aumentar cobertura de testes unitários (componentes visuais, hooks).
39. Configurar GitHub Actions: lint + typecheck + testes + build em PRs.
40. Adicionar pre-commit hooks (husky + lint-staged).

### Fase 9 — Documentação e monitoramento
41. Criar `README.md` na raiz com instruções de setup, dev, build, deploy.
42. Criar guia de deploy (Vercel + Railway).
43. Adicionar Sentry ou similar para monitoramento de erros.
44. Adicionar analytics (Plausible ou Google Analytics).

## Critérios de sucesso
- Build de produção passa sem erros ou warnings.
- Todos os testes (unit + E2E) passando.
- Lighthouse score > 90 (performance, accessibility, SEO).
- Site ao vivo reflete a versão mais recente.
- Conteúdo real (artigos, cursos, vídeos) visível em todas as páginas.

## Riscos
- Vulnerabilidade `postcss` via `next` requer major bump; pode quebrar build.
- Seed de dados in-memory não persiste entre deploys no Vercel (serverless). Considerar arquivos JSON estáticos para dados críticos.
- Remoção do gate de `/download` pode não ser desejada em produção.

## Ordem de execução recomendada
1. Fase 1 (deploy) → 2. Fase 2 (vulnerabilidades/testes) → 3. Fase 3 (Apple Glass) → 4. Fase 4 (conteúdo) → 5. Fase 5 (SEO) → 6. Fase 6 (acessibilidade) → 7. Fase 7 (funcionalidades) → 8. Fase 8 (testes/CI) → 9. Fase 9 (docs/monitoring)
