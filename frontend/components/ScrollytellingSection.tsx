'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Phase = 'price-action' | 'static-lines' | 'execution'

export default function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<HTMLDivElement>(null)
  const candlesRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)
  const executionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const phase = phaseRef.current
      const candles = candlesRef.current
      const lines = linesRef.current
      const execution = executionRef.current

      if (!container || !phase || !candles || !lines || !execution) return

      const phases = phase.querySelectorAll('[data-phase]')
      const phaseElements = {
        'price-action': phase.querySelector('[data-phase="price-action"]'),
        'static-lines': phase.querySelector('[data-phase="static-lines"]'),
        'execution': phase.querySelector('[data-phase="execution"]'),
      }

      const candleElements = candles.querySelectorAll('.candle')
      const lineElements = lines.querySelectorAll('.reference-line')
      const executionElements = execution.querySelectorAll('.execution-panel')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=4000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // Fase 1: Price Action Puro
      tl.set(phaseElements['price-action'], { opacity: 1, y: 0 })
        .set(phaseElements['static-lines'], { opacity: 0, y: 20 })
        .set(phaseElements['execution'], { opacity: 0, y: 20 })
        .to(candleElements, {
          opacity: 1,
          scaleY: 1,
          duration: 1.5,
          stagger: 0.15,
          ease: 'power3.inOut',
        })

      // Fase 2: Linhas Estáticas
      tl.to(phaseElements['price-action'], {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.inOut',
        })
        .to(phaseElements['static-lines'], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.inOut',
        })
        .fromTo(lineElements, 
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out' },
        )
        .to(candleElements, {
          x: 'random(-20, 20)',
          duration: 2,
          ease: 'none',
        }, '<')

      // Fase 3: Execução
      tl.to(phaseElements['static-lines'], {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.inOut',
        })
        .to(phaseElements['execution'], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.inOut',
        })
        .to(executionElements, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        })
        .to('.execution-glow', {
          opacity: 0.6,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.3')

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh] bg-bg-base"
      aria-label="Demonstração do método Fimathe em 3 fases"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Terminal background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-surface to-bg-base" />

        {/* Phase indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-accent tracking-wider uppercase">
              Fase
            </span>
            <span ref={phaseRef} className="font-mono text-sm text-text-primary">
              <span data-phase="price-action" className="inline-block">01</span>
              <span data-phase="static-lines" className="inline-block opacity-0">02</span>
              <span data-phase="execution" className="inline-block opacity-0">03</span>
            </span>
          </div>
        </div>

        {/* Content phases */}
        <div className="relative h-full w-full flex items-center justify-center">
          {/* Phase 1: Price Action */}
          <div
            data-phase="price-action"
            className="absolute inset-0 flex items-center justify-center opacity-100"
          >
            <div className="text-center max-w-4xl mx-auto px-4">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                Price Action Puro
              </h2>
              <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                Sem filtros, sem ruídos. Apenas preço e fechamento de velas, como no terminal institucional do MetaTrader 5.
              </p>
              <div
                ref={candlesRef}
                className="flex items-end justify-center gap-1 h-32 mb-4"
              >
                {[65, 45, 78, 52, 88, 41, 73, 59, 85, 48, 92, 55, 68, 77, 43].map((height, i) => (
                  <div
                    key={i}
                    className="candle w-2 bg-text-accent opacity-0"
                    style={{
                      height: `${height}%`,
                      transform: 'scaleY(0)',
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>
              <p className="font-mono text-xs text-text-muted tracking-wide">
                ONLY PRICE · NO FILTERS · PURE CANDLESTICKS
              </p>
            </div>
          </div>

          {/* Phase 2: Static Lines */}
          <div
            data-phase="static-lines"
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            <div className="text-center max-w-4xl mx-auto px-4">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                Linhas de Referência
              </h2>
              <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                O canal Fimathe PCM é traçado. As linhas ficam 100% fixas enquanto o preço se move.
              </p>
              <div
                ref={linesRef}
                className="relative h-32 w-full max-w-2xl mx-auto mb-4"
              >
                <div className="reference-line absolute left-0 right-0 h-px bg-accent opacity-60" style={{ top: '20%' }} />
                <div className="reference-line absolute left-0 right-0 h-px bg-accent opacity-60" style={{ top: '50%' }} />
                <div className="reference-line absolute left-0 right-0 h-px bg-accent opacity-60" style={{ top: '80%' }} />
                <div className="absolute left-0 right-0 h-px bg-text-muted opacity-40" style={{ top: '50%' }} />
              </div>
              <p className="font-mono text-xs text-text-muted tracking-wide">
                STATIC REFERENCE · NO REPAINT · DISCIPLINED EDGE
              </p>
            </div>
          </div>

          {/* Phase 3: Execution */}
          <div
            data-phase="execution"
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            <div className="text-center max-w-4xl mx-auto px-4">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                Execução por Fechamento
              </h2>
              <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                A vela fecha rompendo a zona de referência. Ordem executada com precisão.
              </p>
              <div
                ref={executionRef}
                className="relative h-32 w-full max-w-2xl mx-auto mb-4"
              >
                <div className="execution-glow absolute inset-0 bg-accent-muted opacity-0 blur-xl" />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="px-6 py-3 bg-accent text-bg-base font-mono text-sm font-bold rounded">
                    ORDEM EXECUTADA
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs text-text-muted tracking-wide">
                CLOSE-BASED TRIGGER · NO REPAINT · TRANSPARENT LOGIC
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}