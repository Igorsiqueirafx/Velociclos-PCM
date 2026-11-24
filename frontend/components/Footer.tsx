import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="glass-header border-t border-[#3a3a3c]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/logo f.png" alt="Velociclos" width={32} height={32} className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(0,113,227,0.4)]" />
              <h3 className="text-lg font-semibold text-white tracking-tight">Velociclos</h3>
            </div>
            <p className="text-[#8a8a8d] text-sm leading-relaxed">Automação de mercado com liberdade. Trading 24/7 com o método Fimathe.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Conteúdo</h4>
            <ul className="space-y-2">
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/cursos">Cursos</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/cursos/videos">Vídeos</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/artigos">Artigos</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/certificados">Certificados</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/manual">Manual</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Ferramentas</h4>
            <ul className="space-y-2">
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/ea">Expert Advisor</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/relogio">Relógio Forex</Link></li>
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/metodo-fimathe">Método Fimathe</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navegação</h4>
            <ul className="space-y-2">
              <li><Link className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/sitemap">Mapa do Site</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#3a3a3c] pt-8 text-center">
          <p className="text-[#8a8a8d] text-xs tracking-tight">© 2026 Velociclos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
