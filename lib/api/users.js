import { apiClient } from './client.js'

// Funções de API para usuários
export const usersAPI = {
  // Obter perfil do usuário atual
  getProfile: async () => {
    const response = await apiClient.get('/api/usuarios/perfil')
    return response.data
  },

  // Atualizar perfil do usuário
  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/usuarios/perfil', userData)
    return response.data
  },

  // Obter estatísticas do usuário
  getStats: async () => {
    const response = await apiClient.get('/api/usuarios/estatisticas')
    return response.data
  },
}
