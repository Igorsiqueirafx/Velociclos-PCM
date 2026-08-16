# Plano: Separar backend do site em repositórios distintos

## Objetivo
- **`Velociclos`** (`https://github.com/Igorsiqueirafx/Velociclos.git`) → apenas backend Python
- **`Velociclos-PCM`** (`https://github.com/Igorsiqueirafx/Velociclos-PCM.git`) → apenas frontend/site

## Contexto atual
- Repositório local: `C:\Users\igorl\OneDrive\Desktop\Velociclos-PCM`
- Branch atual: `main`
- Remotos: `origin` → `Velociclos-PCM`, `backend` → `Velociclos`
- `Velociclos-PCM` contém mistura de frontend + backend (`/backend/`, `railway.json` na raiz)
- `Velociclos` está enxuto, sem backend

## Decisões tomadas
1. Backend vai para o repo `Velociclos` e será deployado no Railway
2. Frontend fica no repo `Velociclos-PCM` e continua no Vercel
3. Nenhuma migração de banco/arquitetura; apenas separação de pastas/repos
4. CORS já está configurado no backend (`Access-Control-Allow-Origin: *`), então o frontend pode ficar em domínio diferente
5. Após separação, o frontend deve passar a chamar a API do Railway se precisar consumir endpoints dinâmicos

## Passos de execução

### Passo 1: Clonar o repo `Velociclos` localmente para trabalhar com o backend
```bash
cd C:\Users\igorl\OneDrive\Desktop
git clone https://github.com/Igorsiqueirafx/Velociclos.git Velociclos-backend
cd Velociclos-backend
git checkout main
```

### Passo 2: Copiar o backend para o repo `Velociclos`
Copiar todo o conteúdo de `C:\Users\igorl\OneDrive\Desktop\Velociclos-PCM\backend\` para a raiz de `Velociclos-backend`.
Verificar se foram copiados: `server.py`, `server.js`, `config.js`, `package.json`, `requirements.txt`, `data/`, `public/`.

### Passo 3: Ajustar `railway.json` no repo `Velociclos`
Garantir que o `railway.json` dentro de `Velociclos-backend` esteja correto:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python server.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Passo 4: Atualizar `.gitignore` do repo `Velociclos`
Garantir que ignora arquivos sensíveis e build artifacts:
```gitignore
.env
node_modules/
data/*.json
__pycache__/
```

### Passo 5: Commit e push do backend no repo `Velociclos`
```bash
git add .
git commit -m "feat: adiciona backend API Python (separado do frontend)"
git push origin main
```

### Passo 6: Limpar o repo `Velociclos-PCM` (frontend)
Voltar para o `Velociclos-PCM`:
```bash
cd C:\Users\igorl\OneDrive\Desktop\Velociclos-PCM
```

Remover backend e configuração de Railway da raiz:
- Apagar pasta `backend/`
- Apagar `railway.json` da raiz

Atualizar `.gitignore` para evitar que arquivos de backend retornem:
```gitignore
.env
.vercel
backend/
node_modules/
```

### Passo 7: Commit e push do frontend no repo `Velociclos-PCM`
```bash
git add .
git commit -m "refactor: remove backend para repo separado (Velociclos)"
git push origin main
```

### Passo 8: Configurar Railway no repo `Velociclos`
1. Acessar [railway.app](https://railway.app)
2. Conectar ao repositório `Igorsiqueirafx/Velociclos`
3. Confirmar start command: `python server.py`
4. Adicionar variável de ambiente `YOUTUBE_API_KEY` se necessário
5. Fazer deploy e capturar URL pública (ex: `https://velociclos-api.railway.app`)

### Passo 9: Configurar Vercel no repo `Velociclos-PCM`
1. Garantir que o projeto Vercel continua conectado a `Igorsiqueirafx/Velociclos-PCM`
2. Confirmar que `vercel.json` serve apenas arquivos estáticos da raiz
3. Fazer deploy e validar que o site abre corretamente

### Passo 10: Atualizar URLs da API no frontend (se necessário)
Verificar no código do `Velociclos-PCM` onde há chamadas para `/api/` e atualizar para o domínio completo do Railway se o frontend não estiver no mesmo domínio.

Arquivos a verificar:
- `js.js`
- `cursos.js`
- `index.html`
- `ea.html`
- `cursos.html`
- `certificados.html`
- `manual.html`
- `metodo-fimathe.html`
- `artigos.html`
- `relogio.html`

### Passo 11: Validação
1. Testar backend no Railway: acessar `https://<backend>.railway.app/api/health`
2. Testar frontend no Vercel: acessar `https://velociclos.vercel.app`
3. Se houver consumo de API, validar que as chamadas do frontend para o Railway funcionam (CORS)
4. Verificar se não há arquivos de backend sobrando no `Velociclos-PCM`
5. Verificar se não há arquivos de frontend sobrando no `Velociclos`

## Riscos
- CORS já está com `*`, mas se no futuro for restrito, o frontend pode parar de acessar o backend
- Se o Railway tiver cold start, a primeira requisição pode ser lenta
- O `package.json` da raiz do `Velociclos-PCM` tem apenas analytics; se mais dependências forem adicionadas, o deploy pode mudar
- Se houver conteúdo estático no `backend/public/`, garantir que ele não seja necessário no frontend

## Critérios de sucesso
- `Velociclos` deploya apenas backend no Railway
- `Velociclos-PCM` deploya apenas frontend no Vercel
- Site continua funcionando após a separação
- Nenhum arquivo de backend permanece no `Velociclos-PCM`
- Nenhum arquivo de frontend principal permanece no `Velociclos`
