'use client'

import { useCourse } from './course-context'

export default function CoursesTab() {
  const h = useCourse()
  if (!h) return null
  const { courses, saving, showCourseForm, courseForm, editingCourseId } = h

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#dcdcdc]">Cursos ({courses.length})</h2>
        <button
          onClick={() => { h.setShowCourseForm(!showCourseForm); h.setEditingCourseId(null); h.setCourseForm({ title: '', slug: '', description: '', thumbnail: '', category: '', is_published: false, order_index: 0 }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0071e3] to-[#6567f1] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,113,227,0.3)] hover:from-[#005fd9] hover:to-[#0071e3] transition-all duration-200"
        >
          <i className={`fas ${showCourseForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showCourseForm ? 'Cancelar' : 'Novo Curso'}
        </button>
      </div>

      {showCourseForm && (
        <form onSubmit={h.handleSubmitCourse} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
            <input type="text" value={courseForm.title}
              onChange={(e) => h.setCourseForm({ ...courseForm, title: e.target.value })} required
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Slug</label>
            <input type="text" value={courseForm.slug}
              onChange={(e) => h.setCourseForm({ ...courseForm, slug: e.target.value })}
              placeholder="Ex: metodo-fimathe"
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Thumbnail URL</label>
            <input type="text" value={courseForm.thumbnail}
              onChange={(e) => h.setCourseForm({ ...courseForm, thumbnail: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm text-[#a0a0a0] mb-2">Categoria</label>
            <input type="text" value={courseForm.category}
              onChange={(e) => h.setCourseForm({ ...courseForm, category: e.target.value })}
              placeholder="Ex: Forex, Método Fimathe"
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
            <textarea value={courseForm.description}
              onChange={(e) => h.setCourseForm({ ...courseForm, description: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={courseForm.is_published}
              onChange={(e) => h.setCourseForm({ ...courseForm, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-[#404857] bg-[#1e2329] text-[#0071e3] focus:ring-[#0071e3]" />
            <label htmlFor="published" className="text-sm text-[#dcdcdc]">Publicado</label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0071e3] to-[#6567f1] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,113,227,0.3)] hover:from-[#005fd9] hover:to-[#0071e3] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Salvando...' : editingCourseId ? 'Atualizar Curso' : 'Salvar Curso'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-[#dcdcdc]">{course.title}</h3>
                <p className="text-xs text-[#707070] mt-1 line-clamp-2">{course.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${course.is_published ? 'bg-[#00ff7f]/10 text-[#00ff7f]' : 'bg-[#ff4444]/10 text-[#ff4444]'}`}>
                {course.is_published ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { h.setSelectedCourseId(course.id); h.setTab('modules'); h.setEditingCourseId(null); h.setShowCourseForm(false) }}
                className="flex-1 px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors"
              >
                <i className="fas fa-layer-group mr-1"></i> Módulos
              </button>
              <button onClick={() => h.startEditCourse(course)} className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => h.handleDeleteCourse(course.id)} className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
