
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:8080/api/usuarios", { method: "GET" })
      const usuarios = await res.json()

      const usuarioEncontrado = usuarios.find(u => u.email === email)
      if (!usuarioEncontrado) {
        setError("Usuário não encontrado")
        return
      }

      const bcrypt = await import("bcryptjs")
      const senhaCorreta = await bcrypt.compare(password, usuarioEncontrado.senha)
      if (!senhaCorreta) {
        setError("Senha incorreta")
        return
      }

      localStorage.setItem("usuarioLogado", JSON.stringify({
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        cargo: usuarioEncontrado.cargo,
        fotoUrl: usuarioEncontrado.fotoUrl || null
      }))

      router.push("/")
    } catch (err) {
      setError("Erro durante o login")
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Button type="submit" className="w-full mt-6">Entrar</Button>
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
