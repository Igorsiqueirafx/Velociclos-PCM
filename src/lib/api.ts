const API_BASE_URL = 'https://setpkdjcgmlfwubacjlg.functions.supabase.co/youtube-api';

async function request(path) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(API_BASE_URL + path, { signal: controller.signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'API error');
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Tempo esgotado');
    throw error;
  } finally { clearTimeout(timeoutId); }
}

export const api = {
  health: () => request('/api/health'),
  version: () => request('/api/version'),
  metrics: () => request('/api/metrics'),
  playlists: () => request('/api/youtube/playlists'),
  playlistItems: (id) => request('/api/youtube/playlist/' + id),
  articles: () => request('/api/articles'),
  articleBySlug: (slug) => request('/api/articles/' + slug),
  videos: () => request('/api/videos'),
  courses: () => request('/api/courses'),
};
