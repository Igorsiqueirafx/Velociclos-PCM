'use client'

export default function SystemInfo({ backendUrl }: { backendUrl: string }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Informações do Sistema</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-[#8a8a8d]">
          <i className="fas fa-code-branch text-[#0071e3]"></i>
          <span>Backend URL: {backendUrl}</span>
        </div>
        <div className="flex items-center gap-2 text-[#8a8a8d]">
          <i className="fas fa-database text-[#0071e3]"></i>
          <span>Banco: Vercel KV (Redis)</span>
        </div>
        <div className="flex items-center gap-2 text-[#8a8a8d]">
          <i className="fas fa-shield-alt text-[#0071e3]"></i>
          <span>Auth: GitHub OAuth (via Vercel Authentication)</span>
        </div>
        <div className="flex items-center gap-2 text-[#8a8a8d]">
          <i className="fas fa-clock text-[#0071e3]"></i>
          <span>Verificado em: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  )
}