import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verificação simplificada
        if (credentials?.email === "advogado@exemplo.com" && 
            credentials?.password === "senha123") {
          return {
            id: "1",
            name: "Eduarda Zidanes",
            email: "DraEduarda@advocacia.com",
            role: "Advogada"
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "seu-segredo-temporario",
  debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }