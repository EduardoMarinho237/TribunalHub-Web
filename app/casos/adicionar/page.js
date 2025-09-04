"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddCasePage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id
  
  const [title, setTitle] = useState("")
  const [area, setArea] = useState("")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [clientName, setClientName] = useState("Carregando...")

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      // Chamada à API para salvar o caso
      // await fetch('/api/cases', {
      //   method: 'POST',
      //   body: JSON.stringify({ 
      //     title, 
      //     area, 
      //     notes,
      //     clientId 
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      
      router.push(`/`)
    } catch (error) {
      console.error("Erro ao salvar caso:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold">Adicionar Caso</h1>
        <div></div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    value={clientName}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título do Caso *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do caso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área de Atuação *</Label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área de atuação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="penal">Penal</SelectItem>
                      <SelectItem value="trabalhista">Trabalhista</SelectItem>
                      <SelectItem value="tributario">Tributário</SelectItem>
                      <SelectItem value="consumidor">Consumidor</SelectItem>
                      <SelectItem value="familia">Família e Sucessões</SelectItem>
                      <SelectItem value="empresarial">Empresarial</SelectItem>
                      <SelectItem value="ambiental">Ambiental</SelectItem>
                      <SelectItem value="outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Anotações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalhes do caso, observações, etc."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSaving || !title.trim() || !area.trim()}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Adicionar Caso'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}