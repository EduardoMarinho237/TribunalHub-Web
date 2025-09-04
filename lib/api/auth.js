import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Criar instância do axios com configurações base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(
  (config) => {
    // Para login, não adicionar token
    if (config.url?.includes('/api/auth/login')) {
      return config
    }
    
    // Em ambiente servidor (SSR), não tenta acessar localStorage
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

// Interceptor para lidar com respostas e erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou ou é inválido
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        // Redirecionar para login
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Função para fazer login
export const loginUser = async (credentials) => {
  try {
    console.log('Tentando login com:', credentials)
    const response = await apiClient.post('/api/auth/login', {
      email: credentials.email,
      senha: credentials.password
    })
    console.log('Resposta da API:', response.data)
    
    // Verificar diferentes formatos de resposta da API
    if (response.data && response.data.token) {
      const userData = response.data.user || response.data.usuario || {
        id: response.data.id,
        name: response.data.name || response.data.nome,
        email: response.data.email,
        role: response.data.role || response.data.cargo || 'user'
      }
      
      // Armazenar token e dados do usuário
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(userData))
      }
      
      return {
        success: true,
        user: userData,
        token: response.data.token
      }
    }
    
    // Se não tem token mas tem success: true, pode ser formato diferente
    if (response.data.success === true) {
      return {
        success: true,
        user: response.data.user || response.data.usuario,
        token: response.data.token || response.data.accessToken
      }
    }
    
    return {
      success: false,
      message: response.data.message || response.data.erro || 'Credenciais inválidas'
    }
  } catch (error) {
    console.error('Erro no login:', error)
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    
    // Verificar se é erro 401 (credenciais inválidas)
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Email ou senha incorretos'
      }
    }
    
    // Verificar se é erro 400 (bad request)
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data?.message || 'Dados inválidos'
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.erro || 'Erro de conexão com o servidor'
    }
  }
}

// Função para fazer logout
export const logoutUser = async () => {
  try {
    // Opcional: chamar endpoint de logout no backend
    await apiClient.post('/api/auth/logout')
  } catch (error) {
    console.error('Erro no logout:', error)
  } finally {
    // Sempre limpar dados locais
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }
}

// Função para verificar se usuário está autenticado
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')
  
  return !!(token && userData)
}

// Função para obter dados do usuário
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    return null
  }
}

// Função para validar token
export const validateToken = async () => {
  try {
    const response = await apiClient.get('/api/auth/validate')
    return response.data.valid
  } catch (error) {
    console.error('Erro na validação do token:', error)
    return false
  }
}

export default apiClient
