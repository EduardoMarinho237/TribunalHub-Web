"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function AddClientPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      // Aqui você faria a chamada à API para salvar o cliente
      // Exemplo:
      // await fetch('/api/clients', {
      //   method: 'POST',
      //   body: JSON.stringify({ name, email, phone, notes }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      
      // Após salvar, redireciona para a lista de clientes
      router.push('/')
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
    } finally {
      setIsSaving(false)
    }
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
        <div></div> {/* Espaçador */}
      </header>

      {/* Conteúdo - Sem rolagem em desktop */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {/* Formulário */}
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anotações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre o cliente"
                  className="min-h-[120px]"
                />
              </div>
            </div>

            {/* Rodapé com botão Salvar */}
            <div className="border-t pt-4 mt-6 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSaving || !name.trim() || !email.trim() || !phone.trim() } // Desabilita se nome estiver vazio
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