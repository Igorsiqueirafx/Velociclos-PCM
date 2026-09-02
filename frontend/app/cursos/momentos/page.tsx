import { Metadata } from 'next'
import { fetchPlaylists, fetchPlaylistItems, YouTubeVideo } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Momentos Chave - Velociclos PCM',
  description: 'Trechos selecionados dos vídeos para aprendizado rápido sobre o Método Fimathe.',
}

const MOMENT_CATEGORIES = [
  {
    id: 'exaustao',
    title: 'Sinais de Exaustão',
    description: 'Aprenda a identificar quando o preço está em região de exaustão (80-100%)',
    searchTerms: ['exaustão', '80%', '100%', 'máxima', 'correção', 'reversão'],
    icon: 'fa-chart-line',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'canal',
    title: 'Canal de Abertura',
    description: 'Passo a passo para marcar o canal de referência e zona neutra',
    searchTerms: ['canal', 'ponto-a', 'ponto-b', 'referência', 'zona neutra', 'abertura'],
    icon: 'fa-layer-group',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'erro',
    title: 'Erros Comuns',
    description: 'Os erros que todo iniciante comete e como evitá-los',
    searchTerms: ['erro', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha', 'iniciante'],
    icon: 'fa-exclamation-triangle',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'rotina',
    title: 'Rotina do Trader',
    description: 'Hábitos e disciplina para operar com consistência',
    searchTerms: ['rotina', 'hábito', 'disciplina', 'gestão emocional', 'psicologia', 'comportamento'],
    icon: 'fa-clock',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'setup',
    title: 'Setup de Entrada',
    description: 'Como identificar e executar entradas de alta probabilidade',
    searchTerms: ['setup', 'entrada', 'operação', 'compra', 'venda', 'take profit', 'stop loss', 'execução'],
    icon: 'fa-bullseye',
    color: 'from-purple-500 to-pink-500',
  },
]

function categorizeVideo(title: string, description: string, searchTerms: string[]): boolean {
  const text = `${title} ${description}`.toLowerCase()
  return searchTerms.some(term => text.includes(term.toLowerCase()))
}

async function getVideosByCategory(categoryId: string): Promise<YouTubeVideo[]> {
  try {
    const playlists = await fetchPlaylists()
    
    const videoArrays = await Promise.all(
      playlists.slice(0, 4).map(playlist => fetchPlaylistItems(playlist.id))
    )
    const allVideos = videoArrays.flat()
    
    const category = MOMENT_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return []
    
    return allVideos.filter(video => 
      categorizeVideo(video.title, video.description, category.searchTerms)
    ).slice(0, 12)
  } catch (error) {
    console.error('Failed to load videos:', error)
    return []
  }
}

export default async function MomentosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: currentCategory = 'exaustao' } = await searchParams
  const videos = await getVideosByCategory(currentCategory)
  const categoryInfo = MOMENT_CATEGORIES.find(c => c.id === currentCategory)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0f0f19] to-[#1a1f25]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ffd700] rounded-full filter blur-[150px] opacity-5" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-full mb-6">
              <i className="fas fa-bolt text-[#ffd700]" />
              <span className="text-[#ffd700] text-sm font-medium">Aprendizado Rápido</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Momentos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4e]">Chave</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto">
              Encontre rapidamente os trechos mais importantes de cada vídeo.
              Aprenda os conceitos essenciais sem precisar assistir aulas inteiras.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 sticky top-16 z-40 bg-[#0f0f19]/95 backdrop-blur-md border-b border-[#404857]/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {MOMENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/cursos/momentos?category=${cat.id}`}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  currentCategory === cat.id
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] shadow-lg shadow-[#ffd700]/20'
                    : 'bg-[#2a2e39] text-[#a0a0a0] border border-[#404857] hover:border-[#ffd700]/50 hover:text-white'
                }`}
              >
                <i className={`fas ${cat.icon}`} />
                <span>{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Info */}
      {categoryInfo && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`bg-gradient-to-r ${categoryInfo.color} p-[1px] rounded-2xl`}>
              <div className="bg-[#1a1f25] rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${categoryInfo.icon} text-2xl text-white`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{categoryInfo.title}</h2>
                    <p className="text-[#a0a0a0]">{categoryInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-[#a0a0a0]">
                  <span className="text-[#ffd700] font-bold">{videos.length}</span> vídeos encontrados
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.videoId}
                    videoId={video.videoId}
                    title={video.title}
                    description={video.description}
                    thumbnail={video.thumbnail}
                    publishedAt={video.publishedAt}
                    category={video.category}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2a2e39] flex items-center justify-center">
                <i className="fas fa-search text-3xl text-[#404857]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum vídeo encontrado</h3>
              <p className="text-[#a0a0a0] mb-6">Tente selecionar outra categoria acima.</p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffd700] text-[#1a1f25] font-bold rounded-xl hover:bg-[#ffed4e] transition-colors"
              >
                <i className="fas fa-arrow-left" />
                <span>Ver todos os cursos</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
