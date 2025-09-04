"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    status: "Ativo"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  // Busca os dados do cliente
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`http://localhost:8080/api/clientes/${clientId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Erro ao carregar cliente: ${response.status}`)
        }

        const clientData = await response.json()
        
        setFormData({
          name: clientData.nome || "",
          email: clientData.email || "",
          phone: clientData.telefone || "",
          notes: "", // A API não retorna notes, então deixamos vazio
          status: "Ativo" // Definimos como padrão, já que a API não retorna status
        })
      } catch (error) {
        console.error("Erro ao carregar cliente:", error)
        setError("Não foi possível carregar os dados do cliente")
        toast.error('Erro ao carregar dados do cliente')
      } finally {
        setIsLoading(false)
      }
    }

    if (clientId) {
      fetchClient()
    }
  }, [clientId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }

      // Preparar dados no formato esperado pela API
      const requestData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone
        // A API não suporta notes e status no momento
      }

      const response = await fetch(`http://localhost:8080/api/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ${response.status} ao atualizar cliente`)
      }

      toast.success('Cliente atualizado com sucesso!')
      
      // Redireciona após salvar
      router.push('/')
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      setError(error.message || "Não foi possível atualizar o cliente")
      toast.error('Erro ao atualizar cliente')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
        <h1 className="text-xl font-semibold">Editar Cliente</h1>
        <div></div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anotações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o cliente"
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Nota: As anotações são armazenadas apenas localmente no momento.
                </p>
              </div>
            </div>

            {/* Rodapé com botões */}
            <div className="border-t pt-4 mt-6 flex justify-between">
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.push('/clientes')}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit"
                disabled={isSaving || !formData.name.trim()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}