import { Metadata } from 'next'
import { fetchPlaylists, fetchPlaylistItems, YouTubeVideo } from '@/lib/youtube'

export const metadata: Metadata = {
  title: 'Momentos Chave - Velociclos PCM | Método Fimathe',
  description: 'Trechos selecionados dos vídeos do Marcelo Ferreira para aprendizado rápido sobre Fimathe.',
}

// Categorias de momentos com termos de busca
const MOMENT_CATEGORIES = [
  {
    id: 'exaustao',
    title: '3 Sinais de Exaustão',
    description: 'Aprenda a identificar quando o preço está em região de exaustão (80-100%)',
    searchTerms: ['exaustão', '80%', '100%', 'máxima', 'correção', 'reversão'],
    icon: 'fa-chart-line',
  },
  {
    id: 'canal',
    title: 'Como Marcar Canal de Abertura',
    description: 'Passo a passo para marcar o canal de referência e zona neutra',
    searchTerms: ['canal', 'ponto-a', 'ponto-b', 'referência', 'zona neutra', 'abertura'],
    icon: 'fa-layer-group',
  },
  {
    id: 'erro',
    title: 'Erros Comuns de Iniciantes',
    description: 'Os erros que todo iniciante comete e como evitá-los',
    searchTerms: ['erro', 'cuidado', 'atenção', 'não faça', 'evite', 'armadilha', 'iniciante'],
    icon: 'fa-exclamation-triangle',
  },
  {
    id: 'rotina',
    title: 'Rotina do Trader Profissional',
    description: 'Hábitos e disciplina para operar com consistência',
    searchTerms: ['rotina', 'hábito', 'disciplina', 'gestão emocional', 'psicologia', 'comportamento'],
    icon: 'fa-clock',
  },
  {
    id: 'setup',
    title: 'Setup de Entrada Perfeito',
    description: 'Como identificar e executar entradas de alta probabilidade',
    searchTerms: ['setup', 'entrada', 'operação', 'compra', 'venda', 'take', 'stop', 'execução'],
    icon: 'fa-bullseye',
  },
]

function categorizeVideo(title: string, description: string, searchTerms: string[]): boolean {
  const text = `${title} ${description}`.toLowerCase()
  return searchTerms.some(term => text.includes(term.toLowerCase()))
}

async function getVideosByCategory(categoryId: string): Promise<YouTubeVideo[]> {
  try {
    const playlists = await fetchPlaylists()
    const allVideos: YouTubeVideo[] = []
    
    // Buscar vídeos de todas as playlists
    for (const playlist of playlists.slice(0, 4)) {
      const videos = await fetchPlaylistItems(playlist.id)
      allVideos.push(...videos)
    }
    
    // Filtrar por categoria
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25]">
      {/* Hero Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-4">
              Momentos <span className="text-[#ffd700]">Chave</span>
            </h1>
            <p className="text-lg text-[#a0a0a0]">
              Trechos selecionados dos vídeos para aprendizado rápido e direto ao ponto
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 border-b border-[#404857]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {MOMENT_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`/cursos/momentos?category=${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentCategory === cat.id
                    ? 'bg-[#ffd700] text-[#1e2329]'
                    : 'bg-[#2a2e39] text-[#a0a0a0] border border-[#404857] hover:border-[#ffd700] hover:text-[#ffd700]'
                }`}
              >
                <i className={`fas ${cat.icon} mr-2`} />
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category Info */}
      {categoryInfo && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#2a2e39] border border-[#404857] rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#ffd700]/10 rounded-lg flex items-center justify-center">
                  <i className={`fas ${categoryInfo.icon} text-2xl text-[#ffd700]`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#dcdcdc]">
                    {categoryInfo.title}
                  </h2>
                  <p className="text-[#a0a0a0]">
                    {categoryInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <a
                  key={video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#2a2e39] border border-[#404857] rounded-xl overflow-hidden hover:border-[#ffd700] transition-colors"
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <i className="fas fa-play text-4xl text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      <i className="fas fa-play mr-1" />
                      Assistir
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-[#dcdcdc] line-clamp-2 group-hover:text-[#ffd700] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#707070] mt-2">
                      {new Date(video.publishedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-[#404857] mb-4" />
              <p className="text-[#a0a0a0]">
                Nenhum vídeo encontrado para esta categoria.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
