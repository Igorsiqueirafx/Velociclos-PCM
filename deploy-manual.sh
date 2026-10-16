#!/bin/bash
# Execute este arquivo manualmente no terminal (fora do sandbox)
# Para fazer o deploy do Velociclos PCM

cd "$(dirname "$0")/frontend"

echo "=== DEPLOY VELOCICLOS PCM ==="
echo "Projeto Vercel: velociclos"
echo ""

# Verifica se vercel está instalado
if ! command -v vercel &> /dev/null; then
    echo "Instalando vercel CLI..."
    npm install -g vercel
fi

# Faz login (se necessário)
echo "Verificando login no Vercel..."
vercel whoami || vercel login

# Deploy para produção
echo "Iniciando deploy..."
vercel --prod --yes

echo "Deploy concluído! Verifique: https://velociclos.vercel.app"
