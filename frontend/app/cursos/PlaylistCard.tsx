'use client'

import { YouTubePlaylist, YouTubeVideo, CATEGORY_LABELS } from '@/lib/youtube'
import VideoCard from '@/components/VideoCard'

export default function PlaylistCard({ playlist, videos, index }: { playlist: YouTubePlaylist; videos: YouTubeVideo[]; index: number }) {
  return (
    <div
      className="bg-[#1e1e1e] border border-[#3a3a3c] rounded-2xl overflow-hidden hover:border-[#0071e3]/30 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6 sm:p-8 border-b border-[#3a3a3c]/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
              {playlist.videoCount} vídeos
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{playlist.title}</h3>
              {playlist.category && CATEGORY_LABELS[playlist.category] && (
                <span className="px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] text-xs font-medium rounded-full">
                  {CATEGORY_LABELS[playlist.category]}
                </span>
              )}
            </div>
            <p className="text-[#8a8a8d] text-sm leading-relaxed line-clamp-2">
              {playlist.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              videoId={video.videoId}
              title={video.title}
              description={video.description}
              thumbnail={video.thumbnail}
              publishedAt={video.publishedAt}
              category={video.category}
            />
          ))}
        </div>
      </div>
    </div>
  )
}