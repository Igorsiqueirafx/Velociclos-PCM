import Image from 'next/image'

const officialLinkClass =
  'inline-flex items-center gap-2 text-sm font-semibold text-[#64a9ff] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#121212]'

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={officialLinkClass}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

export default function OfficialFimatheSection() {
  return (
    <section className="bg-[#121212] py-16 sm:py-20" aria-labelledby="official-fimathe-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#64a9ff]">
            Ambiente oficial Fimathe®
          </p>
          <h2
            id="official-fimathe-title"
            className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            O novo ambiente digital da Fimathe
          </h2>
          <p className="mt-4 text-pretty leading-7 text-[#b0b0b0]">
            Metodologia, formação, comunidade e parcerias: conteúdo oficial da
            Fimathe, reunido pela equipe Velociclos para quem acompanha o trabalho
            de Marcelo Ferreira e do Grupo Fimathe.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-[#3a3a3c] bg-[#1e1e1e] p-6">
            <h3 className="text-xl font-semibold text-white">Método e formação</h3>
            <p className="mt-3 text-sm leading-6 text-[#b0b0b0]">
              Criada por Marcelo Ferreira, a metodologia Fimathe é ensinada em
              séries que passam por fundamentos, setups, PCM, gestão, Price Action,
              risco e psicologia.
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <ExternalLink href="https://portalfimathe.com/marcelo-ferreira">
                Conheça a história de Marcelo
              </ExternalLink>
              <ExternalLink href="https://portalfimathe.com/series">
                Ver séries e setups oficiais
              </ExternalLink>
            </div>
          </article>

          <article className="rounded-2xl border border-[#3a3a3c] bg-[#1e1e1e] p-6">
            <div className="mb-5 flex h-12 items-center">
              <Image
                src="/official/fimathe-hub-logo.png"
                alt="Fimathe Hub"
                width={487}
                height={87}
                className="h-9 w-auto object-contain"
                unoptimized
              />
            </div>
            <h3 className="text-xl font-semibold text-white">Conteúdo e comunidade</h3>
            <p className="mt-3 text-sm leading-6 text-[#b0b0b0]">
              A Fimathe reúne séries educacionais, artigos sobre trading e conteúdos
              da Fimathe Hub. A programação de transmissões pode mudar; acompanhe os
              canais da marca para novidades.
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <ExternalLink href="https://portalfimathe.com/">
                Acessar o Portal Fimathe
              </ExternalLink>
              <ExternalLink href="https://www.youtube.com/@MARCELOFERREIRAFIMATHE">
                Canal oficial de Marcelo
              </ExternalLink>
            </div>
          </article>

          <article className="rounded-2xl border border-[#3a3a3c] bg-[#1e1e1e] p-6">
            <h3 className="text-xl font-semibold text-white">Fimathe Prop</h3>
            <p className="mt-3 text-sm leading-6 text-[#b0b0b0]">
              A página oficial apresenta desafios e regras próprias para avaliação
              de traders. Planos, limites, taxas e condições estão sujeitos a
              alteração e devem ser confirmados diretamente com a Fimathe Prop.
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <ExternalLink href="https://portalfimathe.com/fimathe-prop">
                Consultar planos e regras atuais
              </ExternalLink>
              <ExternalLink href="https://portalfimathe.com/artigos">
                Ler artigos oficiais
              </ExternalLink>
            </div>
          </article>
        </div>

        <aside
          className="mt-6 grid gap-6 rounded-2xl border border-[#3a3a3c] bg-[#1e1e1e] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
          aria-labelledby="hantec-partnership-title"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#64a9ff]">
              Parceria institucional em destaque no Portal Fimathe
            </p>
            <h3
              id="hantec-partnership-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Fimathe e Hantec Markets
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#b0b0b0]">
              A Fimathe apresenta a Hantec Markets como parceira institucional. O
              aviso legal atualmente publicado pela própria Hantec informa que seus
              serviços não são destinados nem oferecidos a residentes do Brasil e
              que empresas do grupo não são autorizadas pela CVM ou pelo Banco
              Central a ofertar ou intermediar valores mobiliários publicamente no
              país.
            </p>
            <p className="mt-3 max-w-3xl text-xs leading-5 text-[#8a8a8d]">
              Por isso, apresentamos a parceria como informação institucional — não
              como convite para abrir conta no Brasil. A Hantec descreve sua oferta
              internacional como negociação de CFDs e alerta para risco significativo
              de perda; consulte as restrições e divulgações oficiais vigentes.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <ExternalLink href="https://hmarkets.com/pt/company/about-us/">
                Sobre a Hantec Markets
              </ExternalLink>
              <ExternalLink href="https://hmarkets.com/pt/terms/hantec-policies/">
                Restrições e políticas da Hantec
              </ExternalLink>
              <ExternalLink href="https://portalfimathe.com/">
                Ver a parceria no Portal Fimathe
              </ExternalLink>
            </div>
          </div>
          <Image
            src="/official/hantec-markets-logo.png"
            alt="Hantec Markets"
            width={1280}
            height={720}
            className="h-16 w-56 rounded-lg object-cover object-center"
            unoptimized
          />
        </aside>

        <p className="mt-5 text-center text-xs leading-5 text-[#8a8a8d]">
          Ambiente oficial Fimathe® desenvolvido pela equipe Velociclos. As
          informações e condições de parceiros, incluindo a Hantec Markets, seguem
          sujeitas aos avisos legais e às regras vigentes de cada empresa.
        </p>
      </div>
    </section>
  )
}
