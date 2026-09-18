# Vercel Deployment Skill

## Project Context
- Next.js 15 on Vercel
- Automatic deployments on git push
- Environment variables in Vercel dashboard

## Deployment Workflow

### Automatic Deployments
```bash
# Push to main → auto-deploys to production
git push origin main

# Push to feature branch → preview deployment
git push origin feature/my-feature
```

### Build Configuration
```json
// package.json (root)
{
  "scripts": {
    "build": "node scripts/sync-public.js && cd frontend && npm run build"
  }
}
```

### Vercel Config
```json
// vercel.json (optional - usually not needed for Next.js)
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/.next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Environment Variables

### Required for Production
```env
# Vercel Dashboard → Settings → Environment Variables

# Admin
ADMIN_EMAILS=admin@domain.com,admin2@domain.com
ADMIN_PASSWORD=secure-password-here

# Backend
NEXT_PUBLIC_BACKEND_URL=https://api.domain.com

# Auth
AUTH_SECRET=your-auth-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://velociclos.vercel.app
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Preview vs Production
- **Preview**: All vars from dashboard (non-sensitive)
- **Production**: Add sensitive vars only to Production environment

## Build Optimization

### Output File Tracing
```js
// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true }, // If using external images
}
module.exports = nextConfig
```

### Build Performance
```bash
# Local build test
cd frontend && npm run build

# Check bundle size
npm run build 2>&1 | grep -E "First Load JS|Build error"
```

## Post-Deploy Validation

### Automated Checks
```yaml
# .github/workflows/deploy.yml
- name: Post-deploy validation
  run: |
    curl -f https://velociclos.vercel.app/ || exit 1
    curl -f https://velociclos.vercel.app/sitemap.xml || exit 1
    curl -f https://velociclos.vercel.app/api/health || exit 1
```

### Manual Checklist
- [ ] Homepage loads
- [ ] All header links work (9 links)
- [ ] Footer links work
- [ ] `/sitemap` renders
- [ ] `/sitemap.xml` valid XML
- [ ] `/entrar` form submits
- [ ] Rate limiting works (3/10min)
- [ ] `/dashboard` redirects to login
- [ ] Auth flow works (login/register)
- [ ] Admin panel accessible

## Rollback
```bash
# Vercel CLI
vercel rollback [deployment-url]

# Or in dashboard: Deployments → ... → Promote to Production
```

## Monitoring
- Vercel Analytics (enable in dashboard)
- Vercel Speed Insights
- Function logs: `vercel logs`
- Edge runtime logs for middleware