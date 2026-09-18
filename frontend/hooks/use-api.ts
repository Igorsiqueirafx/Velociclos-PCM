'use client'

import { useState, useCallback } from 'react'

type ApiState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

type UseApiOptions = {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

export function useApi<T>(
  executor: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await executor()
      setState({ data, loading: false, error: null })
      options.onSuccess?.(data)
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState((prev) => ({ ...prev, loading: false, error: err }))
      options.onError?.(err)
      throw err
    }
  }, [executor, options])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
