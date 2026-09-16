import { CertificateSkeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="space-y-8">
          <CertificateSkeleton />
          <CertificateSkeleton />
          <CertificateSkeleton />
        </div>
      </div>
    </div>
  )
}