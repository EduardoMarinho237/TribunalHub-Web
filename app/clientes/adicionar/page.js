"use client"

import { useState, useEffect, forwardRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"

const MaskedInput = forwardRef(({ value, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    let value = e.target.value
    
    // Remove tudo que não é número
    value = value.replace(/\D/g, '')
    
    // Aplica a máscara
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    
    // Simula evento com o valor formatado
    onChange({
      ...e,
      target: {
        ...e.target,
        value
      }
    })
  }

  return (
    <Input
      {...props}
      ref={ref}
      value={value}
      onChange={handleChange}
      maxLength={15}
    />
  )
})
MaskedInput.displayName = "MaskedInput"

export default function AddClientPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const storedUserData = localStorage.getItem('user_data')
    const token = localStorage.getItem('auth_token')

    if (!storedUserData || !token) {
      toast.error("Você precisa estar logado para adicionar clientes")
      router.push('/login')
      return
    }

    setUserData(JSON.parse(storedUserData))
  }, [router])

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSaving(true)
    const token = localStorage.getItem('auth_token')

    try {
      const response = await fetch('http://localhost:8080/api/clientes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: name.trim(),
          email: email.trim(),
          telefone: phone.trim(),
          visivel: true,
          acompanhamento: false,
          usuario: {
            id: userData.userId
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao cadastrar cliente')
      }

      toast.success("Cliente cadastrado com sucesso!")
      router.push('/')
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      toast.error(error.message || "Erro ao salvar cliente")
    } finally {
      setIsSaving(false)
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const validatePhone = (phone) => {
    // Formato: (00) 00000-0000
    return phone.match(/^\(\d{2}\)\s\d{5}-\d{4}$/)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold">Adicionar Cliente</h1>
        <div></div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    required
                    className={!validateEmail(email) && email ? "border-red-500" : ""}
                  />
                  {!validateEmail(email) && email && (
                    <p className="text-red-500 text-sm">Email inválido</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <MaskedInput
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={!validatePhone(phone) && phone ? "border-red-500" : ""}
                  />
                  {!validatePhone(phone) && phone && (
                    <p className="text-red-500 text-sm">Formato: (00) 00000-0000</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={
                  isSaving || 
                  !name.trim() || 
                  !email.trim() || 
                  !phone.trim() ||
                  !validateEmail(email) ||
                  !validatePhone(phone)
                }
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Adicionar Cliente'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}