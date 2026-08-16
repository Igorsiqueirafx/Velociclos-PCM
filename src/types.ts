export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image?: string;
  category?: string;
  tags?: string[];
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime?: number;
}

export interface MetricsInfo {
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
  requestsByEndpoint: Record<string, number>;
}

export interface VersionInfo {
  version: string;
  environment: string;
  buildDate?: string;
}
