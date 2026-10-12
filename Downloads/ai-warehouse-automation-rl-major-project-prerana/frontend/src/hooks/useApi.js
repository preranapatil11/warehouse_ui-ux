import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!endpoint) return

    setLoading(true)
    setError(null)

    try {
      let result
      switch (endpoint) {
        case '/health':
          result = await apiService.health()
          break
        case '/scenarios':
          result = await apiService.getScenarios()
          break
        case '/episodes':
          result = await apiService.getEpisodes()
          break
        case '/results':
          result = await apiService.getResults()
          break
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`)
      }
      setData(result)
    } catch (err) {
      setError(err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }
  }, [fetchData, options.immediate])

  return { data, loading, error, refetch: fetchData }
}

export function useScenarios() {
  return useApi('/scenarios')
}

export function useHealth() {
  return useApi('/health', { immediate: true })
}

export function useEpisodes() {
  return useApi('/episodes')
}

export function useResults() {
  return useApi('/results')
}