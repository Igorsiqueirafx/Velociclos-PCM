'use client'

export default function CursosCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0071e3]/10 via-[#0071e3]/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Procurando algo <span className="text-[#0071e3]">específico</span>?
          </h2>
          <p className="text-[#8a8a8d] text-lg mb-8">
            Acesse os Momentos Chave para trechos rápidos ou o catálogo completo com todos os vídeos do canal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/cursos/momentos"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#0071e3] text-white font-semibold rounded-xl text-lg hover:bg-[#005fd9] hover:shadow-[0_0_40px_rgba(0,113,227,0.25)] transition-all duration-300"
            >
              <i className="fas fa-bolt" />
              <span>Ver Momentos Chave</span>
            </a>
            <a
              href="/cursos/videos"
              className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border border-[#3a3a3c] text-white font-semibold rounded-xl text-lg hover:border-[#0071e3] hover:text-[#0071e3] transition-all duration-300"
            >
              <i className="fas fa-play-circle" />
              <span>Ver Todos os Vídeos</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}