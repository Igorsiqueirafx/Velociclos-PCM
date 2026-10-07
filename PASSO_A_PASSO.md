PASSO A PASSO PARA VOCÊ (SEM COMPLICAR)

1. ABRA O PROJETO NO COMPUTADOR
   - Vá até a pasta: C:\Users\igorl\Projects\Velociclos-PCM
   - Abra o arquivo .env no backend e veja se a chave do YouTube está lá

2. VERIFIQUE SE A CHAVE DO YOUTUBE ESTÁ NO .ENV
   - Abra: backend\.env
   - Procure por: YOUTUBE_API_KEY=
   - Se estiver vazio, cole a chave que você recebeu: AIzaSyAVbe-6kOb-KjUDnrME8s4ISoGESbCEgKc

3. VERIFIQUE AS PLAYLISTS
   - No mesmo arquivo, procure por: PLAYLIST_IDS=
   - Se estiver vazio, cole a lista que já está no arquivo .env.example

4. SALVE O ARQUIVO
   - Aperte Ctrl + S no arquivo .env

5. TESTE O PROJETO
   - Abra o terminal (cmd) na pasta do projeto
   - Digite: npm run dev
   - Abra o navegador e vá para: http://localhost:3000

6. VERIFIQUE SE TUDO FUNCIONA
   - A página inicial deve aparecer
   - O vídeo de fundo deve tocar
   - Os links do menu devem funcionar

7. SE ALGO NÃO FUNCIONAR
   - Me diga o que aparece na tela
   - Me diga se aparece algum erro no terminal
   - Eu vou te ajudar a corrigir

8. PARA PUBLICAR (DEPLOY)
   - Quando tudo estiver funcionando, me avise
   - Eu vou te ajudar a fazer o deploy na Vercel

LEMBRE-SE:
- Não precisa saber programar para seguir esses passos
- Se algo der errado, me avise imediatamente
- Eu vou te guiar passo a passo
