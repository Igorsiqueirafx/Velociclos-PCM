@echo off
REM Execute este arquivo manualmente no terminal (fora do sandbox)
REM Para fazer o deploy do Velociclos PCM

cd /d "%~dp0frontend"

echo === DEPLOY VELOCICLOS PCM ===
echo Projeto Vercel: velociclos
echo.

REM Verifica se vercel está instalado
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando vercel CLI...
    npm install -g vercel
)

echo Iniciando deploy...
vercel --prod --yes

echo Deploy concluído! Verifique: https://velociclos.vercel.app
pause
