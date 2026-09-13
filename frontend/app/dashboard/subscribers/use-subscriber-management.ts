'use client'

import { useState, useEffect, useMemo } from 'react'
import { getSubscribers } from '@/lib/repositories/subscribers'

interface Subscriber {
  id: string
  email: string
  source: string
  created_at: string
}

export function useSubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await getSubscribers()
        setSubscribers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = sourceFilter === 'all' || sub.source === sourceFilter
      return matchesSearch && matchesSource
    })
  }, [subscribers, searchTerm, sourceFilter])

  const sources = useMemo(() => {
    const uniqueSources = Array.from(new Set(subscribers.map((s) => s.source || 'website')))
    return uniqueSources.sort()
  }, [subscribers])

  const stats = useMemo(() => {
    const totalCount = subscribers.length
    const now = new Date()
    const thisMonth = subscribers.filter((s) => {
      const date = new Date(s.created_at)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
    return { totalCount, thisMonth, sourceCount: sources.length }
  }, [subscribers, sources])

  return {
    subscribers, loading, error,
    searchTerm, setSearchTerm,
    sourceFilter, setSourceFilter,
    filteredSubscribers, sources, stats,
  }
}
