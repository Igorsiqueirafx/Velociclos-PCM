DEPLOY MANUAL - VELOCICLOS PCM

O projeto já está vinculado ao Vercel (frontend/.vercel/project.json: projectName=velociclos).

PASSO 1: Instalar o CLI (se ainda não tiver)
  npm install -g vercel

PASSO 2: Fazer login
  vercel login

PASSO 3: Configurar variáveis de ambiente no Vercel Dashboard
  Acesse: https://vercel.com/dashboard
  Vá em: velociclos → Settings → Environment Variables
  Adicione:
    - NEXT_PUBLIC_BACKEND_URL=https://velociclos-api.vercel.app
    - YOUTUBE_API_KEY=AIzaSyAVbe-6kOb-KjUDnrME8s4ISoGESbCEgKc
    - NEXTAUTH_URL=https://velociclos.vercel.app
    - AUTH_SECRET=<gerar com: openssl rand -base64 32>
    - GITHUB_CLIENT_ID=<seu client id>
    - GITHUB_CLIENT_SECRET=<seu client secret>

PASSO 4: Fazer deploy
  cd frontend
  vercel --prod

PASSO 5: Verificar
  Acesse: https://velociclos.vercel.app
  Verifique se a página inicial carrega, o vídeo toca, os links funcionam e o sitemap está acessível.

NOTA: Se o deploy falhar, verifique se o arquivo .env.local no frontend contém NEXTAUTH_URL e se o backend está configurado com ADMIN_PASSWORD.
