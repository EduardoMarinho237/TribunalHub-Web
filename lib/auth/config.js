import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Credenciais não fornecidas")
          return null
        }

        try {
          console.log("NextAuth: Tentando autenticar com:", credentials.email)
          
          // Fazer chamada direta para sua API
          const response = await axios.post('http://localhost:8080/api/auth/login', {
            email: credentials.email,
            senha: credentials.password
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000
          })

          console.log("NextAuth: Resposta da API:", response.data)

          // Verificar diferentes formatos de resposta da API
          if (response.data && response.data.token) {
            const userData = response.data.user || response.data.usuario || response.data
            
            console.log("NextAuth: Login bem-sucedido")
            return {
              id: userData.id?.toString() || "1",
              name: userData.name || userData.nome,
              email: userData.email,
              role: userData.role || userData.cargo || userData.tipoUsuario || "user",
              cargo: userData.cargo,
              tipoUsuario: userData.tipoUsuario,
              fotoUrl: userData.fotoUrl,
              visivel: userData.visivel,
              token: response.data.token
            }
          }
          
          // Se não tem token mas tem success: true, pode ser formato diferente
          if (response.data.success === true) {
            const userData = response.data.user || response.data.usuario
            return {
              id: userData.id?.toString() || "1",
              name: userData.name || userData.nome,
              email: userData.email,
              role: userData.role || userData.cargo || "user",
              token: response.data.token || response.data.accessToken
            }
          }
          
          console.log("NextAuth: Login falhou - sem token ou sucesso")
          return null
        } catch (error) {
          console.error("NextAuth: Erro na autenticação:", error)
          console.error("NextAuth: Status:", error.response?.status)
          console.error("NextAuth: Data:", error.response?.data)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez que o usuário faz login
      if (user) {
        token.id = user.id
        token.role = user.role
        token.cargo = user.cargo
        token.tipoUsuario = user.tipoUsuario
        token.fotoUrl = user.fotoUrl
        token.visivel = user.visivel
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      // Enviar propriedades para o cliente
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.cargo = token.cargo
        session.user.tipoUsuario = token.tipoUsuario
        session.user.fotoUrl = token.fotoUrl
        session.user.visivel = token.visivel
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "seu-segredo-temporario-muito-seguro-2024",
  debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
