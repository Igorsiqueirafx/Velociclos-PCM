// frontend/lib/logging.ts
// Utilitário de logging para eventos importantes do auth flow e lead capture.

export type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  event: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

// Salva no localStorage (browser) ou console (server)
export function logEvent(
  event: string,
  level: LogLevel = 'info',
  message: string,
  meta?: Record<string, unknown>,
) {
  const entry: LogEntry = {
    event,
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  // Log para console (sempre)
  const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  logFn(`[${entry.timestamp}] [${level.toUpperCase()}] [${event}] ${message}`, meta ?? '');

  // Salva no localStorage (browser only)
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('velociclos_logs') || '[]');
      existing.push(entry);
      if (existing.length > 100) existing.shift(); // Keep last 100 entries
      localStorage.setItem('velociclos_logs', JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to persist log entry', e);
    }
  }
}

export interface AuthEventMeta {
  email?: string;
  provider?: string;
  redirectTo?: string;
  isAdminSite?: boolean;
  userAgent?: string;
  ip?: string;
  error?: string;
}

export interface LeadEventMeta {
  email?: string;
  name?: string;
  source?: string;
  success?: boolean;
  error?: string;
}
