'use client'

import { useCourse } from './course-context'

export default function LessonsTab() {
  const h = useCourse()
  if (!h) return null
  const { lessons, saving, selectedModuleId, showLessonForm, lessonForm, editingLessonId } = h

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#dcdcdc]">
          {selectedModuleId ? 'Aulas do Módulo' : 'Selecione um módulo primeiro'}
        </h2>
        {selectedModuleId && (
          <button
            onClick={() => { h.setShowLessonForm(!showLessonForm); h.setEditingLessonId(null); h.setLessonForm({ title: '', description: '', video_id: '', video_url: '', duration: '', order_index: 0, is_published: false }) }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
          >
            <i className={`fas ${showLessonForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showLessonForm ? 'Cancelar' : 'Nova Aula'}
          </button>
        )}
      </div>

      {!selectedModuleId ? (
        <div className="card"><p className="text-[#a0a0a0]">Clique em "Aulas" em um módulo para gerenciar suas aulas.</p></div>
      ) : (
        <>
          {showLessonForm && (
            <form onSubmit={h.handleSubmitLesson} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
                <input type="text" value={lessonForm.title}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, title: e.target.value })} required
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">YouTube Video ID</label>
                <input type="text" value={lessonForm.video_id}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, video_id: e.target.value })}
                  placeholder="Ex: dQw4w9WgXcQ"
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">URL do Vídeo (YouTube)</label>
                <input type="text" value={lessonForm.video_url}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Duração (segundos)</label>
                <input type="number" value={lessonForm.duration}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, duration: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
                <input type="number" value={lessonForm.order_index}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
                <textarea value={lessonForm.description}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, description: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all" />
              </div>
              <div className="flex items-center gap-2">
                <input id="lesson-published" type="checkbox" checked={lessonForm.is_published}
                  onChange={(e) => h.setLessonForm({ ...lessonForm, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#ffd700] focus:ring-[#ffd700]" />
                <label htmlFor="lesson-published" className="text-sm text-[#dcdcdc]">Publicado</label>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:from-[#ffdd33] hover:to-[#ffd700] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {saving ? 'Salvando...' : editingLessonId ? 'Atualizar Aula' : 'Salvar Aula'}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#404857]">
                  <th className="pb-3 text-[#a0a0a0] font-medium">Título</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">YouTube ID</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">URL do Vídeo</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium">Status</th>
                  <th className="pb-3 text-[#a0a0a0] font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-[#404857]/30 last:border-0 hover:bg-[#343a47]/30 transition-colors">
                    <td className="py-3 text-[#dcdcdc]">{lesson.title}</td>
                    <td className="py-3 text-[#a0a0a0] font-mono text-xs">{lesson.video_id || '-'}</td>
                    <td className="py-3 text-[#a0a0a0] font-mono text-xs truncate max-w-[200px]">{lesson.video_url || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${lesson.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                        {lesson.is_published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => h.startEditLesson(lesson)} className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors mr-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => h.handleDeleteLesson(lesson.id)} className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
