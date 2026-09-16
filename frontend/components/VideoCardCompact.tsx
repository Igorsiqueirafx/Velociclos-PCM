'use client'

interface VideoCardCompactProps {
  _videoId: string
  title: string
  thumbnail: string
  publishedAt: string
  viewCount?: string
  onPlay: () => void
}

export default function VideoCardCompact({ _videoId: _v, title, thumbnail, publishedAt, viewCount, onPlay }: VideoCardCompactProps) {
  return (
    <div
      className="group flex gap-3 p-3 rounded-xl hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
      onClick={onPlay}
    >
      <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-[#121212]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-8 h-8 bg-[#0071e3] rounded-full flex items-center justify-center">
            <i className="fas fa-play text-white text-xs ml-0.5" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#0071e3] transition-colors">
          {title}
        </h4>
        <p className="text-xs text-[#8a8a8d] mt-1">
          {new Date(publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
        {viewCount && (
          <p className="text-xs text-[#8a8a8d]">
            {viewCount} visualizações
          </p>
        )}
      </div>
    </div>
  )
}