export interface Stat {
  value: string
  label: string
}

export interface FibLevel {
  pct: string
  label: string
}

export interface Step {
  num: number
  title: string
  text: string
}

export interface Target {
  label: string
  value: string
}

export interface Timeframe {
  title: string
  items: string[]
}

export interface RiskItem {
  title: string
  text?: string
  rows?: { label: string; value: string }[]
}

export interface Tool {
  title: string
  text: string
}

export interface Criticism {
  title: string
  bullets: string[]
}

export interface Section {
  id: string
  title: string
  body?: string
  stats?: Stat[]
  pillars?: string[]
  fibLevels?: FibLevel[]
  steps?: Step[]
  bullets?: string[]
  entries?: {
    long: string[]
    short: string[]
  }
  stopLoss?: {
    long: string
    short: string
  }
  targets?: Target[]
  exitNote?: string
  timeframes?: Timeframe[]
  riskItems?: RiskItem[]
  tools?: Tool[]
  criticismItems?: Criticism[]
  paragraphs?: string[]
}
