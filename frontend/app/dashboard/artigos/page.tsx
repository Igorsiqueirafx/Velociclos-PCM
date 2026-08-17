'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/app/lib/supabase/client'

interface Artigo {
  id: string
  title: string
  content?: string
  slug?: string
  created_at?: string
  updated_at?: string
}

export default function ArtigosPage() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchArtigos = async () => {
      try {
        const supabase = createClient()
        const { data, error: supabaseError } = await supabase
          .from('artigos')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) {
          setError(supabaseError.message)
        } else {
          setArtigos(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchArtigos()
  }, [])

  const filteredArtigos = useMemo(() => {
    if (!searchTerm) return artigos
    return artigos.filter((art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.slug && art.slug.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [artigos, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#ffd700] text-xl">Carregando artigos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#dcdcdc] mb-1">Artigos</h1>
        <p className="text-[#a0a0a0]">Gerenciamento de artigos e conteúdo do blog</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Search */}
      <div className="card">
        <label htmlFor="search" className="block text-sm text-[#a0a0a0] mb-2">Buscar artigo</label>
        <div className="relative max-w-md">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#707070]"></i>
          <input
            id="search"
            type="text"
            placeholder="Digite o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Total de Artigos</p>
          <p className="text-3xl font-bold text-[#ffd700]">{artigos.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a0a0a0] mb-1">Resultados da Busca</p>
          <p className="text-3xl font-bold text-[#00ff7f]">{filteredArtigos.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-[#dcdcdc] mb-4">
          Lista de Artigos ({filteredArtigos.length})
        </h2>
        {filteredArtigos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Slug</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Criado em</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtigos.map((art) => (
                  <tr key={art.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc] font-medium">{art.title}</td>
                    <td className="py-3 text-[#a0a0a0] font-mono text-xs">
                      {art.slug || '-'}
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {art.created_at ? new Date(art.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-3 text-[#a0a0a0]">
                      {art.updated_at ? new Date(art.updated_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#a0a0a0] text-center py-8">
            {searchTerm ? 'Nenhum artigo encontrado com os filtros aplicados.' : 'Nenhum artigo encontrado.'}
          </p>
        )}
      </div>
    </div>
  )
}
