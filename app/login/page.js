"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAuth } from "@/hooks/useAuth"
import Logo from "@/components/common/logo"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { login } = useAuth()

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha: password
        })
      })

      const responseData = await response.json()
      console.log('Resposta completa da API:', responseData)
      
      if (response.ok && responseData.token) {
        // Verificar se os dados básicos estão presentes (mais flexível)
        const userId = responseData.id || responseData.userId
        const nome = responseData.nome || responseData.name
        const email = responseData.email
        const cargo = responseData.cargo || responseData.role
        
        if (!userId || !nome || !email) {
          console.error('Dados faltando:', { userId, nome, email, cargo })
          throw new Error("Dados essenciais do usuário não encontrados na resposta da API")
        }

        // Armazenar token e dados do usuário
        localStorage.setItem('auth_token', responseData.token)
        
        // Buscar URL da foto do usuário
        let fotoUrl = null
        try {
          const fotoResponse = await fetch(`http://localhost:8080/api/usuarios/${userId}/foto`, {
            headers: {
              'Authorization': `Bearer ${responseData.token}`
            }
          })
          if (fotoResponse.ok) {
            const fotoData = await fotoResponse.json()
            fotoUrl = fotoData.url || fotoData.fotoUrl
          }
        } catch (fotoError) {
          console.log('Erro ao buscar foto do usuário:', fotoError)
          // Continua sem a foto
        }
        
        // Criar objeto com todos os dados do usuário
        const userData = {
          userId: userId,
          email: email,
          nome: nome,
          cargo: cargo,
          fotoUrl: fotoUrl
        }
        
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        // Atualizar o estado de autenticação (se você estiver usando um contexto de autenticação)
        if (login) {
          login(userData)
        }
        
        toast.success("Login realizado com sucesso!")
        router.push(callbackUrl)
      } else {
        toast.error(responseData.message || responseData.erro || "Credenciais inválidas")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      toast.error(error.message || "Erro de conexão com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0c0071] to-[#9347ff]">
      <Card className="max-w-2xl w-full scale-105">
        <CardHeader>
          <Logo className="text-center" />
          <CardDescription className="text-center">Gerenciamento Jurídico</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Seu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  placeholder="Sua senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Ainda não possui uma conta?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">&copy; 2025 TribunalHub. Todos os direitos reservados.</p>
        </CardFooter>
      </Card>
    </div>
  )
}