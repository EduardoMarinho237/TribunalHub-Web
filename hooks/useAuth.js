import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser, isAuthenticated, logoutUser } from "@/lib/api/auth"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session) {
      setUser(session.user)
      setLoading(false)
    } else if (status === "unauthenticated") {
      setUser(null)
      setLoading(false)
    }
  }, [session, status])

  const login = async (credentials) => {
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        return {
          success: false,
          message: "Credenciais inválidas"
        }
      }

      return {
        success: true,
        message: "Login realizado com sucesso"
      }
    } catch (error) {
      console.error("Erro no login:", error)
      return {
        success: false,
        message: "Erro interno do servidor"
      }
    }
  }

  const logout = async () => {
    try {
      // Limpar dados locais
      await logoutUser()
      
      // Fazer logout do NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: "/login" 
      })
      
      // Redirecionar para login
      router.push("/login")
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  const redirectToLogin = (callbackUrl = "/") => {
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  return {
    user,
    loading: loading || status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    logout,
    redirectToLogin,
    session
  }
}
