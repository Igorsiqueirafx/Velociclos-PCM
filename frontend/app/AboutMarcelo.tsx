import AppleButton from '@/components/AppleButton'

export default function AboutMarcelo() {
  return (
    <section className="py-16 bg-[#121212]" aria-labelledby="about-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <img
              src="/Marcelo olhando pra cima.png"
              alt="Marcelo Ferreira - Criador do Método Fimathe"
              className="w-full max-w-md rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
          <div>
            <h2 id="about-title" className="text-2xl sm:text-3xl font-semibold text-white mb-6 tracking-tight">
              Sobre <span className="text-[#0071e3]">Marcelo Ferreira</span>
            </h2>
            <p className="text-[#8a8a8d] mb-4">
              Marcelo Ferreira é o criador do Método Fimathe, uma abordagem inovadora de análise gráfica que tem transformado a forma como traders operam no mercado financeiro.
            </p>
            <p className="text-[#8a8a8d] mb-6">
              Com anos de experiência em operações reais, desenvolveu um método baseado em dados e estatísticas, ajudando traders a alcançar consistência nos mercados de Forex e Ouro.
            </p>
            <img src="/logo-fimathe.webp" alt="Fimathe Logo" className="h-12 mb-6" loading="lazy" />
            <div className="flex flex-wrap gap-4">
              <AppleButton href="/metodo-fimathe" aria-label="Conhecer o Método Fimathe">
                Conheça o Método
              </AppleButton>
              <AppleButton href="/cursos" variant="secondary" aria-label="Ver cursos gratuitos">
                Cursos Gratuitos
              </AppleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
