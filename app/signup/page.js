"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/logo"

export default function RegisterPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== passwordConfirm) {
        setError("As senhas não coincidem")
        return
    }

    try {
        const res = await fetch("http://localhost:8080/api/usuarios/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            email,
            senha: password,
            cargo: "ADVOGADO",
            contrato: { id: 1 },
            tipoUsuario: "COMUM"
        })
        })

        let data
        try {
        data = await res.json()
        } catch {
        data = await res.text() // se não for JSON, lê como texto
        }

        if (!res.ok) {
        setError(typeof data === "string" ? data : JSON.stringify(data))
        return
        }

        router.push("/login")
    } catch (err) {
        setError("Erro ao registrar usuário")
    }
    }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#ffff] to-[#9347ff]">
      <Card className="max-w-2xl w-full scale-105">
        <CardHeader>
          <Logo className="text-center" />
          <CardDescription className="text-center">Registro de Usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="passwordConfirm">Repetir Senha</Label>
                <Input
                  id="passwordConfirm"
                  placeholder="Repita sua senha"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <Button type="submit" className="w-full mt-6">Registrar</Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Faça login
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
