export type YouTubePlaylist = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  category?: string;
};

export type YouTubeVideo = {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
  category?: string;
  tags?: string[];
};

export type VideoMoment = {
  id: string;
  videoId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  category: 'exhaustion' | 'channel' | 'mistake' | 'routine' | 'setup';
  thumbnail: string;
};

export interface YouTubeApiSearchItem {
  id: {
    kind: string;
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string }>;
  };
}

export interface YouTubeApiPlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string }>;
    resourceId?: {
      videoId: string;
    };
  };
  contentDetails?: {
    videoId: string;
  };
}

export interface YouTubeApiPlaylist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: Record<string, { url: string }>;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface YouTubeApiVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string }>;
    tags?: string[];
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
}
