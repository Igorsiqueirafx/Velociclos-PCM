import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Playlist, Video, Article, HealthCheck } from '@/types';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.playlists();
        if (!cancelled) setPlaylists(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar playlists');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, []);
  return { playlists, loading, error };
}

export function usePlaylistVideos(playlistId: string | null) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!playlistId) { setVideos([]); setLoading(false); return; }
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.playlistItems(playlistId);
        if (!cancelled) setVideos(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, [playlistId]);
  return { videos, loading, error };
}

export function useHealth() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.health();
        if (!cancelled) setHealth(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao verificar status');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, []);
  return { health, loading, error };
}

export function useVersion() {
  const [version, setVersion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.version();
        if (!cancelled) setVersion(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar versão');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, []);
  return { version, loading, error };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.metrics();
        if (!cancelled) setMetrics(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, []);
  return { metrics, loading, error };
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.articles();
        if (!cancelled) setArticles(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar artigos');
          setArticles([]);
        }
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, []);
  return { articles, loading, error };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const f = async () => {
      try { setLoading(true); setError(null);
        const data = await api.articleBySlug(slug);
        if (!cancelled) setArticle(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar artigo');
      } finally { if (!cancelled) setLoading(false); }
    };
    f();
    return () => { cancelled = true; };
  }, [slug]);
  return { article, loading, error };
}
