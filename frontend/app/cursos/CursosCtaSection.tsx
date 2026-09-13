'use client'

export default function CursosCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#ffd700]/10 via-[#ffd700]/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Procurando algo <span className="text-[#ffd700]">específico</span>?
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-8">
            Acesse os Momentos Chave e encontre rapidamente os trechos mais importantes de cada vídeo.
          </p>
          <a
            href="/cursos/momentos"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#1a1f25] font-bold rounded-xl text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300"
          >
            <i className="fas fa-bolt" />
            <span>Ver Momentos Chave</span>
          </a>
        </div>
      </div>
    </section>
  )
}
