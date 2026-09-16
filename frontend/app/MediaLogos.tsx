'use client'

export default function MediaLogos() {
  return (
    <section className="py-16 bg-[#121212]" aria-labelledby="media-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="media-title" className="text-2xl sm:text-3xl font-semibold text-center text-white mb-4">
          Na Mídia
        </h2>
        <p className="text-[#8a8a8d] text-center mb-12 max-w-2xl mx-auto">
          O Método Fimathe e Marcelo Ferreira foram destaque em veículos de imprensa renomados.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          <a
            href="https://forbes.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matéria Forbes sobre o Método Fimathe"
            className="block focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded"
          >
            <img
              src="/logo forbes link matéria add.png"
              alt="Logo Forbes"
              className="h-10 sm:h-14 object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-in-out hover:grayscale-0 hover:opacity-100"
              loading="lazy"
            />
          </a>
          <a
            href="https://istoe.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matéria Istoé sobre o Método Fimathe"
            className="block focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded"
          >
            <img
              src="/istoe materia logo add link.png"
              alt="Logo Istoé"
              className="h-8 sm:h-12 object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-in-out hover:grayscale-0 hover:opacity-100"
              loading="lazy"
            />
          </a>
          <a
            href="https://investing.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matéria Investing sobre o Método Fimathe"
            className="block focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded"
          >
            <img
              src="/logo investing matéria add link.png"
              alt="Logo Investing.com"
              className="h-10 sm:h-14 object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-in-out hover:grayscale-0 hover:opacity-100"
              loading="lazy"
            />
          </a>
          <a
            href="https://criptofacio.com.br"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matéria Criptofácio sobre o Método Fimathe"
            className="block focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded"
          >
            <img
              src="/criptofacio add link materia.png"
              alt="Logo Criptofácio"
              className="h-8 sm:h-12 object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-in-out hover:grayscale-0 hover:opacity-100"
              loading="lazy"
            />
          </a>
          <a
            href="https://extra.globo.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Matéria Extra sobre o Método Fimathe"
            className="block focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 focus:ring-offset-[#121212] rounded"
          >
            <img
              src="/extra add link matéria.png"
              alt="Logo Extra"
              className="h-8 sm:h-12 object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 ease-in-out hover:grayscale-0 hover:opacity-100"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </section>
  )
}