import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f19] via-[#1e2329] to-[#1a1f25] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)`,
        }}
      />

      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ffd700]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ffd700]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-[#2a2e39] border border-[#404857] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#ffeb3b] rounded-full mb-6 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
            <i className="fas fa-exclamation-triangle text-2xl text-[#1e2329]" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-[#dcdcdc] mb-2">
            Página não encontrada
          </h1>
          <p className="text-[#a0a0a0] text-sm mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffeb3b] text-[#1e2329] font-bold rounded-lg shadow-lg hover:from-[#ffdd33] hover:to-[#ffd700] transition-all duration-200"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
