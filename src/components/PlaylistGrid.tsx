import { Play } from 'lucide-react';

export function PlaylistGrid({ playlists, onPlay }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="bg-secondary/30 rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all cursor-pointer" onClick={() => onPlay(playlist)}>
          <div className="aspect-video relative">
            <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="text-white w-12 h-12" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-bold mb-2">{playlist.title}</h3>
            <p className="text-gray-400 text-sm">{playlist.videoCount} vídeos</p>
          </div>
        </div>
      ))}
    </div>
  );
}
