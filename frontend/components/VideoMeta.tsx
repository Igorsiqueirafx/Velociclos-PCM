'use client'

interface VideoMetaProps {
  title: string
  description?: string
  publishedAt: string
  viewCount?: string
  onPlay: () => void
}

export default function VideoMeta({ title, description, publishedAt, viewCount, onPlay }: VideoMetaProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatViews = (views: string) => {
    const num = parseInt(views)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return views
  }

  return (
    <div className="p-4">
      <h3
        className="text-sm font-medium text-white line-clamp-2 hover:text-[#0071e3] transition-colors mb-2 cursor-pointer"
        onClick={onPlay}
      >
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[#8a8a8d] line-clamp-2 mb-3">
          {description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-[#8a8a8d]">
        <span>{formatDate(publishedAt)}</span>
        {viewCount && (
          <span className="flex items-center gap-1">
            <i className="fas fa-eye" />
            {formatViews(viewCount)}
          </span>
        )}
      </div>
    </div>
  )
}
