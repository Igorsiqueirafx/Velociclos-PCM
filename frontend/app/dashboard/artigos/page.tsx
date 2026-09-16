'use client'

import { useArticleManagement, type Article } from './use-article-management'
import ArticleForm from './ArticleForm'
import AdminPageHeader from '@/components/AdminPageHeader'

export default function ArtigosPage() {
  const {
    articles, loading, error,
    showForm, setShowForm,
    saving, editingId, form, setForm,
    resetForm, startEdit,
    handleSubmit, handleDelete,
  } = useArticleManagement()

  const toggleForm = () => { resetForm(); setShowForm(!showForm) }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#0071e3] text-xl">Carregando artigos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Artigos" subtitle="Gerenciamento de artigos do blog" showForm={showForm} buttonLabel="Novo Artigo" buttonIcon="fa-plus" onToggle={toggleForm} />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[#ff4444]/10 border border-[#ff4444]/30 rounded-lg text-[#ff6b6b] text-sm">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <ArticleForm
        form={form}
        setForm={setForm}
        showForm={showForm}
        saving={saving}
        editingId={editingId}
        onSubmit={handleSubmit}
      />

      <ArticlesTable articles={articles} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  )
}

function ArticlesTable({ articles, onEdit, onDelete }: {
  articles: Article[]
  onEdit: (a: Article) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[#404857]">
            <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
            <th className="pb-3 text-[#a0a0a0] font-medium">Slug</th>
            <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
            <th className="pb-3 text-[#a0a0a0] font-medium">Publicado</th>
            <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
              <td className="py-3 text-[#dcdcdc]">{article.title}</td>
              <td className="py-3 text-[#a0a0a0] font-mono text-xs">{article.slug}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${article.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                  {article.is_published ? 'Publicado' : 'Rascunho'}
                </span>
              </td>
              <td className="py-3 text-[#a0a0a0]">
                {article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : '-'}
              </td>
              <td className="py-3 text-right">
                <ActionButtons onEdit={() => onEdit(article)} onDelete={() => onDelete(article.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={onEdit} className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors">
        <i className="fas fa-edit"></i>
      </button>
      <button onClick={onDelete} className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors">
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  )
}
