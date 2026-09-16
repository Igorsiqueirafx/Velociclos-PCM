'use client'

import Image from 'next/image'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const particleLayerStyles = (progress: number) => ({
  backgroundImage: `
    radial-gradient(2px 2px at 15% 25%, rgba(0,113,227,0.35), transparent),
    radial-gradient(1px 1px at 70% 65%, rgba(0,113,227,0.25), transparent),
    radial-gradient(1.5px 1.5px at 85% 15%, rgba(0,113,227,0.2), transparent),
    radial-gradient(1px 1px at 35% 85%, rgba(0,113,227,0.2), transparent)
  `,
  backgroundRepeat: 'no-repeat',
  transform: `translateZ(-120px) scale(1.2) translateY(${progress * -100}px) rotateX(${progress * -6}deg)`,
  opacity: Math.min(progress * 1.8, 0.35),
  transition: 'transform 0.1s linear, opacity 0.4s ease-out',
} as React.CSSProperties)

const glowLayerStyles = (progress: number) => ({
  background: 'radial-gradient(ellipse at center, rgba(0, 113, 227, 0.12) 0%, transparent 60%)',
  filter: 'blur(80px)',
  transform: `translateZ(-60px) scale(1.1) translateY(${progress * -50}px)`,
  opacity: Math.min(progress * 1.5, 0.25),
  transition: 'transform 0.1s linear, opacity 0.3s ease-out',
} as React.CSSProperties)

const mainImageWrapperStyles = (progress: number) => ({
  transform: `translateZ(0) translateY(${progress * -15}px) rotateX(${progress * -1.5}deg)`,
  opacity: progress,
  filter: `blur(${Math.max(0, (1 - progress) * 4)}px)`,
  transition: 'transform 0.1s linear, opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease-out',
} as React.CSSProperties)

const imageCoreStyles = {
  transformStyle: 'preserve-3d',
  filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.5)) drop-shadow(0 0 60px rgba(0,113,227,0.08))',
} as React.CSSProperties

const imageStyles = {
  filter: 'grayscale(25%) contrast(1.1) saturate(0.92)',
  transform: 'translateZ(30px)',
  transformStyle: 'preserve-3d',
} as React.CSSProperties

const vignetteStyles = {
  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,15,25,0.35) 100%)',
} as React.CSSProperties

const catchLightStyles = {
  background: 'linear-gradient(to bottom, rgba(0,113,227,0.08), transparent, transparent)',
  opacity: 0,
  transition: 'opacity 0.7s ease-out',
} as React.CSSProperties

const revealMaskStyles = (progress: number) => ({
  background: 'linear-gradient(180deg, rgba(15,15,25,1) 0%, transparent 40%, transparent 100%)',
  transform: `translateZ(40px) translateY(${progress * 25}px)`,
  opacity: Math.max(0, 1 - progress * 1.2),
  transition: 'transform 0.1s linear, opacity 0.5s ease-out',
} as React.CSSProperties)

const foregroundParticlesStyles = (progress: number) => ({
  backgroundImage: `
    radial-gradient(2px 2px at 15% 25%, rgba(0,113,227,0.35), transparent),
    radial-gradient(1px 1px at 70% 65%, rgba(0,113,227,0.25), transparent),
    radial-gradient(1.5px 1.5px at 85% 15%, rgba(0,113,227,0.2), transparent),
    radial-gradient(1px 1px at 35% 85%, rgba(0,113,227,0.2), transparent)
  `,
  backgroundRepeat: 'no-repeat',
  transform: `translateZ(80px) scale(0.95) translateY(${progress * 50}px) rotateX(${progress * 2.5}deg)`,
  opacity: Math.min(progress * 1, 0.25),
  transition: 'transform 0.1s linear, opacity 0.3s ease-out',
} as React.CSSProperties)

const bioTextStyles = (progress: number) => ({
  opacity: Math.max(0, (progress - 0.25) * 2.5),
  transform: `translateY(${Math.max(0, 20 - progress * 50)}px)`,
  transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
} as React.CSSProperties)

export default function CertificateHero() {
  const { ref, progress, prefersReducedMotion } = useScrollProgress()

  if (prefersReducedMotion) {
    return (
      <section ref={ref} className="relative py-28 bg-transparent" aria-labelledby="founder-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:max-w-3xl xl:max-w-4xl">
            <Image
              src="/IMG_0975_Igor.jpg"
              alt="Igor Siqueira - Fundador do Velociclos PCM"
              fill
              className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-square object-cover rounded-[1.5rem] filter grayscale-25 contrast-110 saturate-90"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
            />
            <div className="mt-10 text-center opacity-100 transform-none transition-none">
              <p className="text-[#8a8a8d] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Fundador do <span className="text-[#0071e3] font-medium">Velohub</span> e criador do
                <span className="text-[#0071e3] font-medium">Velociclos PCM</span>. A fimathe é arte!
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative py-28 bg-transparent"
      style={{
        perspective: '1400px',
        perspectiveOrigin: 'center center',
      } as React.CSSProperties}
      aria-labelledby="founder-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl sm:max-w-3xl xl:max-w-4xl" role="region" aria-label="Destaque do fundador com efeito 3D">
          <div
            className="absolute inset-[-20%] pointer-events-none"
            aria-hidden="true"
            style={particleLayerStyles(progress)}
          />

          <div
            className="absolute inset-[-30%] rounded-full pointer-events-none"
            aria-hidden="true"
            style={glowLayerStyles(progress)}
          />

          <div
            className="relative"
            style={mainImageWrapperStyles(progress)}
          >
            <div style={imageCoreStyles}>
              <Image
                src="/IMG_0975_Igor.jpg"
                alt="Igor Siqueira - Fundador do Velociclos PCM"
                fill
                className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-square object-cover transition-all duration-1000 ease-out rounded-[1.5rem]"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                style={imageStyles}
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              aria-hidden="true"
              style={vignetteStyles}
            />

            <div
              className="absolute top-0 left-0 right-0 h-2/5 pointer-events-none rounded-t-[1.5rem]"
              aria-hidden="true"
              style={catchLightStyles}
            />

            <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-[#0f0f19]/70 via-transparent to-transparent pointer-events-none rounded-b-[1.5rem]" aria-hidden="true" />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={revealMaskStyles(progress)}
          />

          <div
            className="absolute inset-[-20%] pointer-events-none"
            aria-hidden="true"
            style={foregroundParticlesStyles(progress)}
          />
        </div>

        <div
          className="mt-10 text-center"
          style={bioTextStyles(progress)}
        >
          <p className="text-[#8a8a8d] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Fundador do <span className="text-[#0071e3] font-medium">Velohub</span> e criador do
            <span className="text-[#0071e3] font-medium">Velociclos PCM</span>. A fimathe é arte!
          </p>
        </div>
      </div>
    </section>
  )
}