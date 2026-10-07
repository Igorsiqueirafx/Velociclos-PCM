#!/bin/bash
# Deploy script for Velociclos PCM
# Run this from the project root after committing all changes

set -e

echo "=== Velociclos PCM - Deploy Script ==="
echo "Project: velociclos (from .vercel/project.json)"
echo ""

# Check if vercel CLI is available
if command -v vercel &> /dev/null; then
    echo "✓ Vercel CLI found"
else
    echo "✗ Vercel CLI not found. Install with: npm install -g vercel"
    echo "Then run: vercel login"
    exit 1
fi

# Check if .env has YouTube API key
if grep -q "YOUTUBE_API_KEY=AIzaSyAVbe-6kOb-KjUDnrME8s4ISoGESbCEgKc" backend/.env; then
    echo "✓ YouTube API key configured"
else
    echo "✗ YouTube API key not configured in backend/.env"
fi

# Check if ADMIN_PASSWORD is set
if grep -q "ADMIN_PASSWORD=velociclos-admin-2026" backend/.env; then
    echo "✓ ADMIN_PASSWORD configured"
else
    echo "✗ ADMIN_PASSWORD not configured"
fi

echo ""
echo "=== Ready for deploy ==="
echo "To deploy to production:"
echo "  1. cd frontend"
echo "  2. vercel --prod"
echo ""
echo "To deploy to preview:"
echo "  1. cd frontend"
echo "  2. vercel"
echo ""
echo "Make sure these environment variables are set in Vercel Dashboard:"
echo "  - NEXT_PUBLIC_BACKEND_URL=https://velociclos-api.vercel.app"
echo "  - YOUTUBE_API_KEY=AIzaSyAVbe-6kOb-KjUDnrME8s4ISoGESbCEgKc"
echo "  - NEXTAUTH_URL=https://velociclos.vercel.app"
echo "  - AUTH_SECRET=<generate with: openssl rand -base64 32>"
echo "  - GITHUB_CLIENT_ID=<your github oauth client id>"
echo "  - GITHUB_CLIENT_SECRET=<your github oauth client secret>"
