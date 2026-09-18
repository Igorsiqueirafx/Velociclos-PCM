export default function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-[#3a3a3c] py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">Velociclos</h3>
            <p className="text-[#8a8a8d] text-sm leading-relaxed">Automação de mercado com liberdade. Trading 24/7 com o método Fimathe.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Conteúdo</h4>
            <ul className="space-y-2">
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/cursos">Cursos</a></li>
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/artigos">Artigos</a></li>
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/certificados">Certificados</a></li>
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/manual">Manual</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Ferramentas</h4>
            <ul className="space-y-2">
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/ea">Expert Advisor</a></li>
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/relogio">Relógio Forex</a></li>
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/metodo-fimathe">Método Fimathe</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navegação</h4>
            <ul className="space-y-2">
              <li><a className="text-[#8a8a8d] text-sm hover:text-white transition-colors duration-200" href="/site-map">Mapa do Site</a></li>
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