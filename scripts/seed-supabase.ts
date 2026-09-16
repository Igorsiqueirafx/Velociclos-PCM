import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const certificates = [
  {
    id: 'formula-ouro',
    title: 'Fórmula do Ouro',
    description: 'Certificado de conclusão do curso Fórmula do Ouro - Estratégias avançadas para trading de ouro',
    image_url: '/certificados/Formula do Ouro.webp',
    order_index: 1,
  },
  {
    id: 'laboratorio-fimathe',
    title: 'Laboratório Fimathe',
    description: 'Certificado do Laboratório Fimathe - Análise prática de mercado em tempo real',
    image_url: '/certificados/Laboratorio Fimathe.webp',
    order_index: 2,
  },
  {
    id: 'masterclass-fimathe',
    title: 'MasterClass Fimathe',
    description: 'Certificado de participação na MasterClass Fimathe - Método completo de trading',
    image_url: '/certificados/MasterClass Fimathe.webp',
    order_index: 3,
  },
  {
    id: 'metodo-fimathe',
    title: 'Método Fimathe',
    description: 'Certificado de conclusão do Método Fimathe - Formação completa de trader',
    image_url: '/certificados/Metodo Fimathe.webp',
    order_index: 4,
  },
  {
    id: 'scalper',
    title: 'Scalper',
    description: 'Certificado de conclusão do curso de Scalper - Operações de alta frequência',
    image_url: '/certificados/Scalper.webp',
    order_index: 5,
  },
]

const articles = [
  {
    slug: 'introducao-trading-forex',
    title: 'Introdução ao Trading Forex: Guia Completo para Iniciantes',
    excerpt: 'Aprenda os fundamentos do mercado Forex, como funciona, principais pares e como começar a operar com segurança.',
    content: `# Introdução ao Trading Forex

O mercado Forex (Foreign Exchange) é o maior mercado financeiro do mundo, com volume diário superior a $6 trilhões.

## O que é Forex?

Forex é a negociação de moedas estrangeiras. Quando você viaja para outro país e troca sua moeda local pela moeda do destino, você está participando do mercado Forex.

## Principais Pares de Moedas

- **EUR/USD** - Euro vs Dólar Americano (mais negociado)
- **GBP/USD** - Libra Esterlina vs Dólar Americano
- **USD/JPY** - Dólar Americano vs Iene Japonês
- **USD/CHF** - Dólar Americano vs Franco Suíço

## Como Começar

1. **Educação** - Estude análise técnica e fundamentalista
2. **Conta Demo** - Pratique sem risco real
3. **Gestão de Risco** - Nunca arrisque mais que 1-2% por trade
4. **Plano de Trading** - Defina entrada, saída e stop loss

## Conclusão

O Forex oferece oportunidades, mas exige disciplina, estudo contínuo e gestão de risco rigorosa.`,
    category: 'iniciantes',
    tags: ['forex', 'iniciantes', 'trading', 'mercado'],
    featured_image: '/blog/forex-basico.jpg',
    published: true,
    author_name: 'Igor Siqueira',
  },
  {
    slug: 'gestao-risco-trading',
    title: 'Gestão de Risco: O Segredo dos Traders Consistentes',
    excerpt: 'Por que a gestão de risco é mais importante que a estratégia de entrada. Aprenda a proteger seu capital.',
    content: `# Gestão de Risco no Trading

A maioria dos traders iniciantes foca 90% do tempo em "onde entrar" e 10% em "quanto arriscar". Profissionais invertem essa proporção.

## Regra de Ouro: 1-2% por Trade

Nunca arrisque mais que 1-2% do seu capital total em uma única operação.

\`\`\`
Conta: $10.000
Risco máx (1%): $100 por trade
Risco máx (2%): $200 por trade
\`\`\`

## Risk:Reward Mínimo 1:2

Só entre em trades onde o lucro potencial seja pelo menos 2x o risco.

## Stop Loss é Obrigatório

- Defina **antes** de entrar
- Nunca mova contra você
- Use estrutura de mercado (suportes/resistências)

## Tamanho da Posição

\`\`\`
Tamanho = (Capital × % Risco) / (Entrada - Stop Loss)
\`\`\`

## Psicologia

- Aceite perdas como custo do negócio
- Não faça "revenge trading"
- Mantenha um diário de trades

## Conclusão

Gestão de risco não é opcional - é o que separa traders que sobrevivem dos que quebram a conta.`,
    category: 'gestao-risco',
    tags: ['risk-management', 'psicologia', 'consistencia', 'capital'],
    featured_image: '/blog/risk-management.jpg',
    published: true,
    author_name: 'Igor Siqueira',
  },
  {
    slug: 'metodo-fimathe-explicado',
    title: 'Método Fimathe: A Metodologia Por Trás da Consistência',
    excerpt: 'Entenda os pilares do Método Fimathe e como ele transforma traders amadores em profissionais.',
    content: `# Método Fimathe: Metodologia Completa

O Método Fimathe não é apenas uma estratégia - é um sistema completo de trading.

## 4 Pilares do Método

### 1. Análise de Contexto (Top-Down)
- Mensal → Semanal → Diário → 4H → 1H
- Identifique a tendência principal
- Opera apenas na direção da tendência superior

### 2. Estrutura de Mercado
- Suportes e Resistências relevantes
- Order Blocks e Fair Value Gaps
- Liquidez e Order Flow

### 3. Gatilhos de Entrada
- Price Action em timeframes menores
- Confirmação de rejeição de nível
- Volume e momentum

### 4. Gestão de Trade
- Stop Loss em estrutura
- Take Profit parcial (50% em 1:1, resto em 1:3)
- Trailing stop após 1:2

## Diferenciais

✅ Funciona em qualquer ativo (Forex, Índices, Cripto, Ouro)
✅ Adaptável a qualquer estilo (Swing, Day Trade, Scalp)
✅ Foco em probabilidade, não em "certo/errado"

## Resultados Reais

Alunos reportam consistência após 3-6 meses de aplicação disciplinada.`,
    category: 'metodo-fimathe',
    tags: ['metodo-fimathe', 'estrategia', 'consistencia', 'price-action'],
    featured_image: '/blog/metodo-fimathe.jpg',
    published: true,
    author_name: 'Marcelo Ferreira',
  },
]

const courses = [
  {
    slug: 'metodo-fimathe-completo',
    title: 'Método Fimathe Completo',
    description: 'Formação completa do básico ao avançado. Análise técnica, gestão de risco, psicologia e prática real de mercado.',
    thumbnail_url: '/cursos/metodo-fimathe-thumb.jpg',
    youtube_playlist_id: 'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK',
    order_index: 1,
    published: true,
    level: 'completo',
    duration_hours: 40,
    lessons_count: 85,
  },
  {
    slug: 'laboratorio-fimathe',
    title: 'Laboratório Fimathe',
    description: 'Análise de mercado ao vivo. Operações reais comentadas em tempo real. Aprenda na prática com traders experientes.',
    thumbnail_url: '/cursos/laboratorio-thumb.jpg',
    youtube_playlist_id: 'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ',
    order_index: 2,
    published: true,
    level: 'avancado',
    duration_hours: 20,
    lessons_count: 35,
  },
  {
    slug: 'formula-ouro',
    title: 'Fórmula do Ouro',
    description: 'Especialização em trading de Ouro (XAU/USD). Características únicas, correlações e setups exclusivos.',
    thumbnail_url: '/cursos/formula-ouro-thumb.jpg',
    youtube_playlist_id: 'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh',
    order_index: 3,
    published: true,
    level: 'especializacao',
    duration_hours: 15,
    lessons_count: 28,
  },
  {
    slug: 'masterclass-fimathe',
    title: 'MasterClass Fimathe',
    description: 'Intensivo de fim de semana. Do zero à consistência. Teoria + prática concentrada para acelerar sua curva de aprendizado.',
    thumbnail_url: '/cursos/masterclass-thumb.jpg',
    youtube_playlist_id: 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD',
    order_index: 4,
    published: true,
    level: 'intensivo',
    duration_hours: 12,
    lessons_count: 20,
  },
  {
    slug: 'scalper-pro',
    title: 'Scalper Pro',
    description: 'Trading de alta frequência. Scalping em índices e forex. Velocidade, precisão e gestão de risco agressiva.',
    thumbnail_url: '/cursos/scalper-thumb.jpg',
    youtube_playlist_id: 'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9',
    order_index: 5,
    published: true,
    level: 'avancado',
    duration_hours: 18,
    lessons_count: 32,
  },
]

async function seedCertificates() {
  console.log('🌱 Seeding certificates...')
  for (const cert of certificates) {
    const { error } = await supabase
      .from('certificates')
      .upsert(cert, { onConflict: 'id' })
    if (error) console.error(`❌ Certificate ${cert.id}:`, error.message)
    else console.log(`✅ Certificate: ${cert.title}`)
  }
}

async function seedArticles() {
  console.log('🌱 Seeding articles...')
  for (const article of articles) {
    const { error } = await supabase
      .from('articles')
      .upsert(article, { onConflict: 'slug' })
    if (error) console.error(`❌ Article ${article.slug}:`, error.message)
    else console.log(`✅ Article: ${article.title}`)
  }
}

async function seedCourses() {
  console.log('🌱 Seeding courses...')
  for (const course of courses) {
    const { error } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'slug' })
    if (error) console.error(`❌ Course ${course.slug}:`, error.message)
    else console.log(`✅ Course: ${course.title}`)
  }
}

async function createAdminUser() {
  console.log('👤 Creating admin user...')
  const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0]?.trim()
  if (!adminEmail) {
    console.log('⚠️ No ADMIN_EMAILS configured, skipping admin user creation')
    return
  }

  const { data: existing } = await supabase.auth.admin.listUsers()
  const exists = existing.users.some(u => u.email === adminEmail)

  if (!exists) {
    const { error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'velociclos2024',
      email_confirm: true,
      user_metadata: { full_name: 'Admin Velociclos', role: 'admin' },
    })
    if (error) console.error('❌ Admin user:', error.message)
    else console.log(`✅ Admin user created: ${adminEmail}`)
  } else {
    console.log(`✅ Admin user already exists: ${adminEmail}`)
  }
}

async function main() {
  console.log('🚀 Starting Supabase seed...\n')

  await createAdminUser()
  await seedCertificates()
  await seedArticles()
  await seedCourses()

  console.log('\n✅ Seed completed successfully!')
  console.log('\n📋 Next steps:')
  console.log('1. Verify data in Supabase Dashboard > Table Editor')
  console.log('2. Configure Storage buckets for images')
  console.log('3. Test admin login at /auth/login')
}

main().catch(console.error)