import type { Section } from '@/lib/fimathe-docs-types'

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6 text-center">
      <div className="text-3xl font-bold text-[#0071e3] mb-2">{value}</div>
      <div className="text-sm text-[#8a8a8d]">{label}</div>
    </div>
  )
}

function StepBlock({ num, title, text }: { num: number; title: string; text: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
        <span className="w-6 h-6 bg-[#0071e3] rounded-full flex items-center justify-center text-sm">{num}</span>
        {title}
      </h4>
      <p className="text-[#8a8a8d]">{text}</p>
    </div>
  )
}

function EntryColumns({ longItems, shortItems }: { longItems: string[]; shortItems: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h5 className="text-[#0071e3] font-semibold mb-2">Posição Longa (Compra)</h5>
        <ul className="space-y-1 text-sm text-[#8a8a8d]">
          {longItems.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="text-[#0071e3] font-semibold mb-2">Posição Curta (Venda)</h5>
        <ul className="space-y-1 text-sm text-[#8a8a8d]">
          {shortItems.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TargetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm text-[#0071e3] font-semibold">{label}</div>
      <div className="text-[#8a8a8d]">{value}</div>
    </div>
  )
}

function RiskRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#8a8a8d]">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}

function TimeframeCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <ul className="space-y-1 text-sm text-[#8a8a8d]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-[#0071e3] mt-1">•</span>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  )
}

function PillarItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-[#0071e3] mt-1">▸</span>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  )
}

function renderHistoria(section: Section) {
  return (
    <div className="space-y-4">
      <p className="text-[#8a8a8d] leading-relaxed">{section.body}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {section.stats?.map((stat) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  )
}

function renderFundamentos(section: Section) {
  return (
    <div className="space-y-4">
      <p className="text-[#8a8a8d] leading-relaxed">{section.body}</p>
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Pilares Matemáticos</h4>
        <ul className="space-y-2 text-[#8a8a8d]">
          {section.pillars?.map((pillar) => (
            <PillarItem key={pillar} text={pillar} />
          ))}
        </ul>
      </div>
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Níveis de Fibonacci Utilizados</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {section.fibLevels?.map((level) => (
            <div key={level.pct} className="text-center">
              <div className="text-[#0071e3] font-bold text-lg">{level.pct}</div>
              <div className="text-[#8a8a8d]">{level.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function renderMecanica(section: Section) {
  return (
    <div className="space-y-6">
      <p className="text-[#8a8a8d] leading-relaxed">{section.body}</p>
      {section.steps?.map((step) => (
        <StepBlock key={step.num} num={step.num} title={step.title} text={step.text} />
      ))}
    </div>
  )
}

function renderZonaNeutra(section: Section) {
  return (
    <div className="space-y-4">
      <p className="text-[#8a8a8d] leading-relaxed">{section.body}</p>
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Características</h4>
        <ul className="space-y-2 text-[#8a8a8d]">
          {section.bullets?.map((bullet) => (
            <BulletItem key={bullet} text={bullet} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function renderRegras(section: Section) {
  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl overflow-hidden">
        <div className="p-4 bg-[#0071e3]/10 border-b border-[#3a3a3c]">
          <h4 className="text-white font-semibold">Regras de Entrada</h4>
        </div>
        <div className="p-6">
          <EntryColumns longItems={section.entries?.long || []} shortItems={section.entries?.short || []} />
        </div>
      </div>
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Stop Loss</h4>
        <div className="space-y-2 text-[#8a8a8d]">
          <p>
            <strong className="text-white">Posições Longas:</strong> {section.stopLoss?.long}
          </p>
          <p>
            <strong className="text-white">Posições Curtas:</strong> {section.stopLoss?.short}
          </p>
        </div>
      </div>
      <div className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Alvos de Lucro (Multi-Tier)</h4>
        <div className="space-y-3">
          {section.targets?.map((target) => (
            <TargetRow key={target.label} label={target.label} value={target.value} />
          ))}
        </div>
        <p className="text-sm text-[#8a8a8d] mt-4">
          <strong className="text-white">Estratégia de saída parcial:</strong> {section.exitNote}
        </p>
      </div>
    </div>
  )
}

function renderTimeframes(section: Section) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {section.timeframes?.map((tf) => (
        <TimeframeCard key={tf.title} title={tf.title} items={tf.items} />
      ))}
    </div>
  )
}

function renderRisco(section: Section) {
  return (
    <div className="space-y-6">
      {section.riskItems?.map((item) => (
        <div key={item.title} className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">{item.title}</h4>
          {item.text && <p className="text-[#8a8a8d]">{item.text}</p>}
          {item.rows && (
            <div className="space-y-2">
              {item.rows.map((row) => (
                <RiskRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function renderFerramentas(section: Section) {
  return (
    <div className="space-y-6">
      {section.tools?.map((tool) => (
        <div key={tool.title} className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">{tool.title}</h4>
          <p className="text-[#8a8a8d]" dangerouslySetInnerHTML={{ __html: tool.text }} />
        </div>
      ))}
    </div>
  )
}

function renderCriticas(section: Section) {
  return (
    <div className="space-y-6">
      {section.criticismItems?.map((item) => (
        <div key={item.title} className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">{item.title}</h4>
          <ul className="space-y-2 text-[#8a8a8d]">
            {item.bullets.map((bullet) => (
              <BulletItem key={bullet} text={bullet} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function renderConclusao(section: Section) {
  return (
    <div className="space-y-4">
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-[#8a8a8d] leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
    </div>
  )
}

export const sectionRenderers: Record<string, (section: Section) => React.ReactNode> = {
  historia: renderHistoria,
  fundamentos: renderFundamentos,
  mecanica: renderMecanica,
  'zona-neutra': renderZonaNeutra,
  regras: renderRegras,
  timeframes: renderTimeframes,
  risco: renderRisco,
  ferramentas: renderFerramentas,
  criticas: renderCriticas,
  conclusao: renderConclusao,
}
