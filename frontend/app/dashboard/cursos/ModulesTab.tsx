'use client'

import { useCourse } from './course-context'

export default function ModulesTab() {
  const h = useCourse()
  if (!h) return null
  const { modules, saving, selectedCourseId, showModuleForm, moduleForm, editingModuleId } = h

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#dcdcdc]">
          {selectedCourseId ? 'Módulos do Curso' : 'Selecione um curso primeiro'}
        </h2>
        {selectedCourseId && (
          <button
            onClick={() => { h.setShowModuleForm(!showModuleForm); h.setEditingModuleId(null); h.setModuleForm({ title: '', description: '', order_index: 0 }) }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0071e3] to-[#6567f1] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,113,227,0.3)] hover:from-[#005fd9] hover:to-[#0071e3] transition-all duration-200"
          >
            <i className={`fas ${showModuleForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showModuleForm ? 'Cancelar' : 'Novo Módulo'}
          </button>
        )}
      </div>

      {!selectedCourseId ? (
        <div className="card"><p className="text-[#a0a0a0]">Clique em "Módulos" em um curso para gerenciar seus módulos.</p></div>
      ) : (
        <>
          {showModuleForm && (
            <form onSubmit={h.handleSubmitModule} className="card grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Título</label>
                <input type="text" value={moduleForm.title}
                  onChange={(e) => h.setModuleForm({ ...moduleForm, title: e.target.value })} required
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0a0] mb-2">Ordem</label>
                <input type="number" value={moduleForm.order_index}
                  onChange={(e) => h.setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-[#a0a0a0] mb-2">Descrição</label>
                <textarea value={moduleForm.description}
                  onChange={(e) => h.setModuleForm({ ...moduleForm, description: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 bg-[#1e2329] border border-[#404857] rounded-lg text-[#dcdcdc] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0071e3] to-[#6567f1] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,113,227,0.3)] hover:from-[#005fd9] hover:to-[#0071e3] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {saving ? 'Salvando...' : editingModuleId ? 'Atualizar Módulo' : 'Salvar Módulo'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <div key={mod.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-[#dcdcdc]">{mod.title}</h3>
                    <p className="text-xs text-[#707070] mt-1 line-clamp-2">{mod.description}</p>
                  </div>
                  <span className="text-xs text-[#707070]">#{mod.order_index}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { h.setSelectedModuleId(mod.id); h.setTab('lessons') }}
                    className="flex-1 px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors">
                    <i className="fas fa-play mr-1"></i> Aulas
                  </button>
                  <button onClick={() => h.startEditModule(mod)} className="px-3 py-2 bg-[#343a47] text-[#dcdcdc] rounded-lg text-sm hover:bg-[#404857] transition-colors">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => h.handleDeleteModule(mod.id)} className="px-3 py-2 bg-[#ff4444]/10 text-[#ff4444] rounded-lg text-sm hover:bg-[#ff4444]/20 transition-colors">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
