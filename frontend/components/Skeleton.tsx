'use client'

import { GlassCard } from '@/components/glassify/glass-card'

export function CertificateSkeleton() {
  return (
    <GlassCard glass="frosted" className="animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-[#404857]/50 to-[#2a2e39]/50 rounded-xl" />
      <div className="mt-4 space-y-3">
        <div className="h-6 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-1/2" />
      </div>
    </GlassCard>
  )
}

export function CertificateSkeletonGrid({ count = 5 }: { count?: number } = {}) {
  return (
    <section className="py-16 bg-[#1e2329]" aria-labelledby="certificates-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="certificates-heading" className="sr-only">Certificados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <CertificateSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ArticleSkeleton() {
  return (
    <GlassCard glass="frosted" className="animate-pulse overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-[#404857]/50 to-[#2a2e39]/50" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-5/6" />
        <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-1/2" />
        <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-2/3" />
      </div>
    </GlassCard>
  )
}

export function ArticleSkeletonGrid({ count = 6 }: { count?: number } = {}) {
  return (
    <section className="py-16 bg-[#1e2329]" aria-labelledby="articles-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="articles-heading" className="sr-only">Artigos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function CourseSkeleton() {
  return (
    <GlassCard glass="frosted" className="animate-pulse overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-[#404857]/50 to-[#2a2e39]/50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-[#404857]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded" />
          <div className="h-5 w-16 bg-gradient-to-r from-[#ffd700]/30 to-[#e6c200]/30 rounded-full" />
        </div>
        <div className="h-6 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-4/5" />
        <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-1/2" />
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded-full" />
          <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-20" />
        </div>
      </div>
    </GlassCard>
  )
}

export function CourseSkeletonGrid({ count = 4 }: { count?: number } = {}) {
  return (
    <section className="py-16 bg-[#1e2329]" aria-labelledby="courses-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="courses-heading" className="sr-only">Cursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function VideoSkeleton() {
  return (
    <GlassCard glass="frosted" className="animate-pulse overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-[#404857]/50 to-[#2a2e39]/50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#404857]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-3/4" />
        <div className="h-3 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-1/2" />
        <div className="flex items-center gap-2 text-xs">
          <div className="h-3 w-12 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded" />
          <div className="h-3 w-16 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded" />
        </div>
      </div>
    </GlassCard>
  )
}

export function VideoSkeletonGrid({ count = 8 }: { count?: number } = {}) {
  return (
    <section className="py-16 bg-[#1e2329]" aria-labelledby="videos-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="videos-heading" className="sr-only">Vídeos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-cover bg-center bg-no-repeat bg-[#1e2329] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f19]/90 to-[#1e2329]/80 z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 text-[#ffd700] px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-4 h-4 bg-current rounded-full" />
            <div className="w-20 h-4 bg-current rounded" />
          </div>
          <div className="h-12 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-3/4" />
          <div className="h-6 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-full" />
        </div>
      </div>
    </section>
  )
}

export function StatCardSkeleton() {
  return (
    <GlassCard glass="frosted" className="animate-pulse p-6 text-center">
      <div className="h-8 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-1/2 mx-auto mb-2" />
      <div className="h-6 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-2/3 mx-auto" />
    </GlassCard>
  )
}

export function StatCardsGridSkeleton({ count = 4 }: { count?: number } = {}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number } = {}) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number } = {}) {
  return (
    <GlassCard glass="frosted" className="animate-pulse overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#404857]">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="h-4 bg-gradient-to-r from-[#404857]/50 to-[#2a2e39]/50 rounded w-3/4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

export function FormFieldSkeleton({ label = true }: { label?: boolean } = {}) {
  return (
    <div className="animate-pulse space-y-1.5">
      {label && <div className="h-4 bg-gradient-to-r from-[#404857]/30 to-[#2a2e39]/30 rounded w-1/3" />}
      <div className="h-10 bg-gradient-to-r from-[#404857]/20 to-[#2a2e39]/20 rounded border border-[#404857]/30" />
    </div>
  )
}

export function FormSkeleton({ fields = 4 }: { fields?: number } = {}) {
  return (
    <GlassCard glass="frosted" className="animate-pulse p-6 space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
      <div className="h-10 bg-gradient-to-r from-[#404857]/20 to-[#2a2e39]/20 rounded border border-[#404857]/30 mt-4" />
    </GlassCard>
  )
}