import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { PlaylistGrid } from '@/components/PlaylistGrid';
import { VideoModal } from '@/components/VideoModal';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/LoadingStates';
import { usePlaylists, usePlaylistVideos } from '@/hooks/useApi';

export function HomePage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { playlists, loading, error } = usePlaylists();
  const { videos, loading: vl, error: ve } = usePlaylistVideos(selectedPlaylist ? selectedPlaylist.id : null);
  const handlePlay = (p) => setSelectedPlaylist(p);
  const handleClose = () => setSelectedPlaylist(null);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-2">Cursos Disponíveis</h2>
            <p className="text-gray-400 mb-8">Acesse todos os cursos gratuitos da Fimathe</p>
            {loading && <LoadingSpinner text="Carregando playlists..." />}
            {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
            {!loading && !error && <PlaylistGrid playlists={playlists} onPlay={handlePlay} />}
          </div>
        </section>
        <VideoModal playlist={selectedPlaylist} videos={videos} loading={vl} error={ve} isOpen={!!selectedPlaylist} onClose={handleClose} />
      </main>
      <Footer />
    </>
  );
}

