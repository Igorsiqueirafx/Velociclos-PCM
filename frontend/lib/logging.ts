type LogLevel = 'info' | 'warn' | 'error'

function log(level: LogLevel, event: string, message: string, meta?: unknown) {
  const entry = { level, event, message, meta, timestamp: new Date().toISOString() }
  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.info(JSON.stringify(entry))
  }
}

export function logEvent(event: string, level: LogLevel, message: string, meta?: unknown) {
  log(level, event, message, meta)
}
