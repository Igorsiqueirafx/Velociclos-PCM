import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PlaylistGrid } from '@/components/PlaylistGrid';
import { VideoModal } from '@/components/VideoModal';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/LoadingStates';
import { usePlaylists, usePlaylistVideos } from '@/hooks/useApi';

export function CoursesPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { playlists, loading, error } = usePlaylists();
  const { videos, loading: vl, error: ve } = usePlaylistVideos(selectedPlaylist ? selectedPlaylist.id : null);
  const handlePlay = (p) => setSelectedPlaylist(p);
  const handleClose = () => setSelectedPlaylist(null);
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-primary to-secondary min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Cursos Gratuitos</h1>
          <p className="text-gray-400 mb-8">Acesse todos os cursos gratuitos da Fimathe</p>
          {loading && <LoadingSpinner text="Carregando playlists..." />}
          {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
          {!loading && !error && <PlaylistGrid playlists={playlists} onPlay={handlePlay} />}
        </div>
        <VideoModal playlist={selectedPlaylist} videos={videos} loading={vl} error={ve} isOpen={!!selectedPlaylist} onClose={handleClose} />
      </main>
      <Footer />
    </>
  );
}

