export default function AboutMarcelo() {
  return (
    <section className="py-16 bg-[#2a2e39]" aria-labelledby="about-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <img
              src="/Marcelo olhando pra cima.png"
              alt="Marcelo Ferreira - Criador do Método Fimathe"
              className="w-full max-w-md rounded-xl shadow-2xl"
              loading="lazy"
            />
          </div>
          <div>
            <h2 id="about-title" className="text-2xl sm:text-3xl font-bold text-[#dcdcdc] mb-6">
              Sobre <span className="text-[#ffd700]">Marcelo Ferreira</span>
            </h2>
            <p className="text-[#a0a0a0] mb-4">
              Marcelo Ferreira é o criador do Método Fimathe, uma abordagem inovadora de análise gráfica que tem transformado a forma como traders operam no mercado financeiro.
            </p>
            <p className="text-[#a0a0a0] mb-6">
              Com anos de experiência em operações reais, desenvolveu um método baseado em dados e estatísticas, ajudando traders a alcançar consistência nos mercados de Forex e Ouro.
            </p>
            <img src="/logo-fimathe.webp" alt="Fimathe Logo" className="h-12 mb-6" loading="lazy" />
            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center justify-center px-6 py-3 bg-[#ffd700] text-[#1e2329] font-bold rounded-lg shadow-lg hover:bg-[#ffdd33] transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#2a2e39]"
                aria-label="Conhecer o Método Fimathe"
                href="/metodo-fimathe"
              >Conheça o Método</a>
              <a
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg hover:bg-[#ffd700]/10 transition-all duration-200 focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#2a2e39]"
                aria-label="Ver cursos gratuitos"
                href="/cursos"
              >Cursos Gratuitos</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}