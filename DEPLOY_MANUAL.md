# Deploy do Velociclos PCM

O frontend usa o projeto Supabase Auth compartilhado com `velociclos-admin`.
Configure os valores no projeto `velociclos` da Vercel, em
**Settings → Environment Variables**, para o ambiente **Production**:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase compartilhado.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: publishable key do mesmo projeto.
- `NEXT_PUBLIC_BACKEND_URL`: URL da API usada pelo conteúdo, por exemplo
  `https://velociclos-api.vercel.app`.
- `YOUTUBE_API_KEY`: chave opcional do YouTube Data API.

No Supabase, em **Authentication → URL Configuration**, mantenha o domínio
principal do site como Site URL e adicione
`https://velociclos-pcm.vercel.app/auth/callback` à lista de redirect URLs.
Configure também o domínio de preview se for testar login em previews.

O acesso a `/download` exige uma sessão Supabase válida e um registro em
`leads` cujo email corresponda ao email verificado do usuário. O frontend usa a
sessão autenticada e consulta apenas o identificador do lead; não configure uma
service-role/secret key nem `BACKEND_ADMIN_PASSWORD` neste projeto.

Depois de salvar as variáveis, publique um novo deployment de produção e teste:

1. Login por email/senha e Google em `/auth/login`.
2. Acesso a `/download` com uma conta cujo email está cadastrado em `leads`.
3. Acesso negado a uma conta sem registro correspondente.

As alterações locais devem passar por revisão e commit antes de publicar.
