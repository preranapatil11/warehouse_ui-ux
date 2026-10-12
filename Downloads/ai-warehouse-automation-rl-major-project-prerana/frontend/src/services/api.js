import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)

export const apiService = {
  async health() {
    const response = await api.get('/health')
    return response.data
  },

  async getScenarios() {
    const response = await api.get('/scenarios')
    return response.data
  },

  async getLayout(scenario) {
    const response = await api.get(`/scenarios/${scenario}/layout`)
    return response.data
  },

  async runEpisode(request) {
    const response = await api.post('/run', request)
    return response.data
  },

  async getEpisodes() {
    const response = await api.get('/episodes')
    return response.data
  },

  async getEpisode(episodeId) {
    const response = await api.get(`/episodes/${episodeId}`)
    return response.data
  },

  async getResults() {
    const response = await api.get('/results')
    return response.data
  },
}

export default apiService