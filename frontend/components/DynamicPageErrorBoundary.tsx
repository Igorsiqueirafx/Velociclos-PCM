'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { GlassCard } from '@/components/glassify/glass-card'
import { GlassButton } from '@/components/glassify/glass-button'
import { logEvent } from '@/lib/logging'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  digest: string | undefined
}

export class DynamicPageErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    digest: undefined,
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const digest = (errorInfo as { digest?: string }).digest
    this.setState({ digest })

    logEvent('dynamic_page_error', 'error', 'Dynamic page error', {
      message: error.message,
      digest,
      stack: error.stack,
    })

    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, digest: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <GlassCard glass="frosted" className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#ff453a]/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#ff453a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-3">Não foi possível carregar</h1>
            <p className="text-[#8a8a8d] mb-6">
              Ocorreu um erro ao carregar esta página. Tente novamente ou volte para o início.
            </p>
            <div className="flex gap-3 justify-center">
              <GlassButton variant="solid" onClick={this.handleReset}>
                Tentar novamente
              </GlassButton>
              <a href="/" className="flex items-center justify-center px-6 py-3 text-[#8a8a8d] hover:text-white transition-colors">
                Voltar ao início
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-[#8a8a8d] cursor-pointer">Detalhes técnicos</summary>
                <pre className="mt-2 p-3 bg-[#1e1e1e] rounded text-xs text-[#8a8a8d] overflow-auto">
                  {this.state.error.message}
                  {this.state.digest && `\nDigest: ${this.state.digest}`}
                </pre>
              </details>
            )}
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}
