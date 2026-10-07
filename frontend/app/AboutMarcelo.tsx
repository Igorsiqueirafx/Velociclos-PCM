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
              Marcelo Ferreira é o criador da metodologia Fimathe e educador do mercado financeiro.
            </p>
            <p className="text-[#8a8a8d] mb-6">
              Sua trajetória e os conteúdos da metodologia fazem parte deste ambiente digital oficial da Fimathe.
            </p>
            <img src="/logo-fimathe.webp" alt="Fimathe Logo" className="h-12 mb-6" loading="lazy" />
            <div className="flex flex-wrap gap-4">
              <AppleButton href="https://portalfimathe.com/marcelo-ferreira" aria-label="Conhecer a história de Marcelo Ferreira no Portal Fimathe">
                História oficial
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
