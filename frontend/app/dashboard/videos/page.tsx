'use client'

import { useVideoManagement } from './use-video-management'
import VideoForm from './VideoForm'
import AdminPageHeader from '@/components/AdminPageHeader'

export default function VideosPage() {
  const {
    loading, error,
    searchTerm, setSearchTerm,
    moduleFilter, setModuleFilter,
    showAddForm, setShowAddForm,
    saving, formData, setFormData,
    filteredVideos, modules, stats,
    handleAddVideo, handleDeleteVideo,
  } = useVideoManagement()

  const toggleForm = () => setShowAddForm(!showAddForm)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#0071e3] text-xl">Carregando vídeos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Vídeos" subtitle="Gerenciamento de vídeos cadastrados" showForm={showAddForm} buttonLabel="Novo Vídeo" buttonIcon="fa-plus" onToggle={toggleForm} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <VideoForm
        formData={formData}
        setFormData={setFormData}
        showAddForm={showAddForm}
        saving={saving}
        onSubmit={handleAddVideo}
      />

      <StatsGrid stats={stats} />

      <FiltersCard
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        modules={modules}
      />

      <div className="card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Vídeos ({filteredVideos.length})
        </h2>
        {filteredVideos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Módulo</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">YouTube ID</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Criado em</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc]">
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-xs text-[#707070] mt-0.5 line-clamp-1">{video.description}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#00ff7f]/10 text-[#00ff7f]">
                        {video.module || '-'}
                      </span>
                    </td>
                    <td className="py-3 text-[#a0a0a0] font-mono text-xs">
                      {video.videoId}
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#a0a0a0] hover:text-[#0071e3] transition-colors"
                          title="Ver no YouTube"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 text-[#a0a0a0] hover:text-[#ff4444] transition-colors"
                          title="Excluir"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">
            {searchTerm || moduleFilter !== 'all' ? 'Nenhum vídeo encontrado com os filtros aplicados.' : 'Nenhum vídeo encontrado.'}
          </p>
        )}
      </div>
    </div>
  )
}

function StatsGrid({ stats }: { stats: { total: number; moduleCount: number; filtered: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total de Vídeos" value={stats.total} color="text-[#0071e3]" />
      <StatCard label="Módulos" value={stats.moduleCount} color="text-[#00ff7f]" />
      <StatCard label="Filtrados" value={stats.filtered} color="text-[#dcdcdc]" />
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[#a0a0a0] mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function FiltersCard({ searchTerm, setSearchTerm, moduleFilter, setModuleFilter, modules }: {
  searchTerm: string; setSearchTerm: (v: string) => void;
  moduleFilter: string; setModuleFilter: (v: string) => void;
  modules: string[];
}) {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm text-[#a0a0a0] mb-2">Buscar vídeo</label>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#707070]"></i>
            <input
              id="search"
              type="text"
              placeholder="Título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <label htmlFor="module" className="block text-sm text-[#a0a0a0] mb-2">Filtrar por módulo</label>
          <select
            id="module"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all"
            >
            <option value="all">Todos</option>
            {modules.map((mod) => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
