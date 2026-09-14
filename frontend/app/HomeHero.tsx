'use client'

export default function HomeHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-cover bg-top bg-no-repeat bg-[url('/bg-capa-marcelo.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/85 to-[#1e2329]/75 z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#dcdcdc]">
              Opere o
              <span className="text-[#ffd700]">Mercado</span>
              <span className="block">24/7 com Velociclos PCM</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#f3f4f6] max-w-2xl">
              Descubra o poder do trading automatizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#ffd700]">Forex</span>
                <span className="text-sm text-[#707070] max-w-[120px]">Mercado cambial global</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#ffd700]">Ouro</span>
                <span className="text-sm text-[#707070] max-w-[120px]">Operações com XAU/USD</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="/entrar"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg transition-all duration-200 ease-in-out hover:bg-[#ffd700] hover:text-[#1e2329] hover:shadow-[0_0_30px_rgba(255,215,0,0.45)] focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                aria-label="Entrar ou cadastrar email"
              >Entrar</a>
              <a
                href="/ea"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:bg-[#ffdd33] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:-translate-y-0.5 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]"
                aria-label="Conhecer o Expert Advisor Velociclos PCM"
              >Saiba sobre o E.A.</a>
            </div>
          </div>

          <div className="relative flex justify-center" aria-hidden="true">
            <div className="relative">
              <img
                src="/background marcelos.png"
                alt=""
                className="w-80 h-80 sm:w-96 sm:h-96 rounded-full object-cover border-2 border-[#ffd700] shadow-[0_0_40px_rgba(255,215,0,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}