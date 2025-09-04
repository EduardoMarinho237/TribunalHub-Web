import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Criar instância do axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para adicionar token JWT automaticamente
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com respostas e token expirado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou (401)
    if (error.response?.status === 401) {
      console.log('Token expirado, fazendo logout...')
      
      if (typeof window !== 'undefined') {
        // Limpar dados de autenticação
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        
        // Redirecionar para login
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Funções de API para clientes
export const clientsAPI = {
  // Listar todos os clientes
  getAll: async () => {
    const response = await apiClient.get('/api/clientes')
    return response.data
  },

  // Criar novo cliente
  create: async (clientData) => {
    const response = await apiClient.post('/api/clientes', {
      nome: clientData.nome,
      email: clientData.email,
      telefone: clientData.telefone,
      acompanhamento: clientData.acompanhamento || false,
      visivel: clientData.visivel !== undefined ? clientData.visivel : true
    })
    return response.data
  },

  // Atualizar cliente
  update: async (id, clientData) => {
    const response = await apiClient.put(`/api/clientes/${id}`, {
      nome: clientData.nome,
      email: clientData.email,
      telefone: clientData.telefone,
      acompanhamento: clientData.acompanhamento,
      visivel: clientData.visivel
    })
    return response.data
  },

  // Deletar cliente (soft delete - marca como invisível)
  delete: async (id) => {
    const response = await apiClient.put(`/api/clientes/${id}`, {
      visivel: false
    })
    return response.data
  },

  // Deletar cliente permanentemente
  hardDelete: async (id) => {
    const response = await apiClient.delete(`/api/clientes/${id}`)
    return response.data
  },
}

// // Funções de API para casos
// export const casesAPI = {
//   // Listar casos de um cliente
//   getByClientId: async (clientId) => {
//     const response = await apiClient.get(`/api/clientes/${clientId}/casos`)
//     return response.data
//   },

//   // Obter caso específico
//   getById: async (clientId, caseId) => {
//     const response = await apiClient.get(`/api/clientes/${clientId}/casos/${caseId}`)
//     return response.data
//   },

//   // Criar novo caso
//   create: async (clientId, caseData) => {
//     const response = await apiClient.post(`/api/clientes/${clientId}/casos`, caseData)
//     return response.data
//   },

//   // Atualizar caso
//   update: async (clientId, caseId, caseData) => {
//     const response = await apiClient.put(`/api/clientes/${clientId}/casos/${caseId}`, caseData)
//     return response.data
//   },

//   // Deletar caso
//   delete: async (clientId, caseId) => {
//     const response = await apiClient.delete(`/api/clientes/${clientId}/casos/${caseId}`)
//     return response.data
//   },
// }

// Funções de API para usuários
export const usersAPI = {
  // Obter perfil do usuário atual
  getProfile: async () => {
    const response = await apiClient.get('/api/usuarios/perfil')
    return response.data
  },

  // Atualizar perfil do usuário por ID
  updateById: async (userId, userData) => {
    const response = await apiClient.put(`/api/usuarios/${userId}`, userData)
    return response.data
  },

  // Atualizar perfil do usuário
  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/usuarios/perfil', userData)
    return response.data
  },

  // Obter foto do usuário
  getPhoto: async (userId) => {
    const response = await apiClient.get(`/api/usuarios/${userId}/foto`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Atualizar foto do usuário
  updatePhoto: async (userId, formData) => {
    const response = await apiClient.patch(`/api/usuarios/${userId}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Alterar senha do usuário
  changePassword: async (userId, passwordData) => {
    const response = await apiClient.patch(`/api/usuarios/${userId}/senha`, passwordData)
    return response.data
  },

  // Obter estatísticas do usuário
  getStats: async () => {
    const response = await apiClient.get('/api/usuarios/estatisticas')
    return response.data
  },
}

export { apiClient }
export default apiClient
