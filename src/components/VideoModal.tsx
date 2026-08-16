import { X } from 'lucide-react';

export function VideoModal({ playlist, videos, loading, error, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-secondary rounded-xl max-w-4xl mx-auto">
          <div className="p-6 border-b border-gold/20 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{playlist?.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-6">
            {loading && <p className="text-gray-400">Carregando vídeos...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && (
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex gap-4">
                    <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover rounded" />
                    <div>
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-gray-400 text-sm">{video.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
