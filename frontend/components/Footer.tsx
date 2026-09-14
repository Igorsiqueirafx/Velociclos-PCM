export default function Footer() {
  return (
    <footer className="bg-[#2a2e39] border-t border-[#404857] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#ffd700] mb-3">Velociclos</h3>
            <p className="text-[#a0a0a0] text-sm">Automação de mercado com liberdade. Trading 24/7 com o método Fimathe.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Conteúdo</h4>
            <ul className="space-y-2">
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/cursos">Cursos</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/artigos">Artigos</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/certificados">Certificados</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/manual">Manual</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Ferramentas</h4>
            <ul className="space-y-2">
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/ea">Expert Advisor</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/relogio">Relógio Forex</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/metodo-fimathe">Método Fimathe</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Minha Conta</h4>
            <ul className="space-y-2">
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/auth/login">Login</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/auth/register">Registrar</a></li>
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/entrar">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#dcdcdc] mb-3">Navegação</h4>
            <ul className="space-y-2">
              <li><a className="text-[#a0a0a0] text-sm hover:text-[#ffd700] transition-colors" href="/site-map">Mapa do Site</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#404857] pt-6 text-center">
          <p className="text-[#a0a0a0] text-xs">© 2026 Velociclos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}